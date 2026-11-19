import { useEffect, useMemo, useRef, useState } from "react";

type V3 = [number, number, number];
type F2 = (x: number, y: number) => number;

export type SurfaceOptions = {
  f: F2;
  x: [number, number];
  y: [number, number];
  /** Puntos por lado de la malla */
  res: number;
  wire: boolean;
  /** Prismas de la suma de Riemann doble (0 = ocultos) */
  prisms: number;
  /** Punto marcado (x0, y0) */
  point: [number, number] | null;
  /** Corte transversal x = x0 */
  slice: number | null;
  /** Incluir z = 0 en la escala vertical */
  withZero: boolean;
};

type Face = {
  pts: V3[];
  rgb: [number, number, number];
  alpha: number;
  stroke?: string | undefined;
};

/** Paleta tipo "viridis → naranja" para colorear por altura. */
const STOPS: [number, [number, number, number]][] = [
  [0, [37, 52, 148]],
  [0.25, [44, 127, 184]],
  [0.5, [65, 182, 196]],
  [0.75, [161, 218, 120]],
  [1, [253, 174, 50]],
];
function heat(t: number): [number, number, number] {
  const u = Math.min(1, Math.max(0, t));
  for (let i = 1; i < STOPS.length; i++) {
    const [t1, c1] = STOPS[i]!;
    const [t0, c0] = STOPS[i - 1]!;
    if (u <= t1) {
      const k = (u - t0) / (t1 - t0);
      return [
        c0[0] + (c1[0] - c0[0]) * k,
        c0[1] + (c1[1] - c0[1]) * k,
        c0[2] + (c1[2] - c0[2]) * k,
      ];
    }
  }
  return STOPS[STOPS.length - 1]![1];
}

const tick = (v: number) => {
  if (Math.abs(v) >= 1000 || (Math.abs(v) < 0.01 && v !== 0)) return v.toExponential(1);
  return String(+v.toFixed(2));
};

export function zRangeOf(
  f: F2,
  x: [number, number],
  y: [number, number],
  withZero: boolean,
): [number, number] | null {
  const vals: number[] = [];
  const n = 60;
  for (let i = 0; i <= n; i++)
    for (let j = 0; j <= n; j++) {
      const v = f(x[0] + ((x[1] - x[0]) * i) / n, y[0] + ((y[1] - y[0]) * j) / n);
      if (Number.isFinite(v)) vals.push(v);
    }
  if (vals.length === 0) return null;
  vals.sort((a, b) => a - b);
  // Recorte robusto: ignora picos extremos (asíntotas) usando percentiles.
  const q = (p: number) => vals[Math.min(vals.length - 1, Math.floor(p * (vals.length - 1)))]!;
  let lo = q(0.01);
  let hi = q(0.99);
  const span = hi - lo;
  if (vals[0]! >= lo - span * 0.5) lo = vals[0]!;
  if (vals[vals.length - 1]! <= hi + span * 0.5) hi = vals[vals.length - 1]!;
  if (withZero) {
    lo = Math.min(lo, 0);
    hi = Math.max(hi, 0);
  }
  if (hi - lo < 1e-9) {
    lo -= 1;
    hi += 1;
  }
  return [lo, hi];
}

export function Surface3D({ opts }: { opts: SurfaceOptions }) {
  const { f, x, y, res, wire, prisms, point, slice, withZero } = opts;
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [size, setSize] = useState({ w: 640, h: 480 });
  const [view, setView] = useState({ yaw: -0.85, pitch: 0.5, zoom: 1 });
  const drag = useRef<{ x: number; y: number; yaw: number; pitch: number } | null>(null);
  const pinch = useRef<Map<number, { x: number; y: number }>>(new Map());
  const pinchStart = useRef<{ d: number; zoom: number } | null>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const w = el.clientWidth;
      setSize({ w, h: Math.max(320, Math.min(560, Math.round(w * 0.72))) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Zoom con la rueda del ratón (listener no pasivo para evitar el scroll de la página)
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setView((v) => ({
        ...v,
        zoom: Math.min(4, Math.max(0.4, v.zoom * Math.exp(-e.deltaY * 0.0015))),
      }));
    };
    cv.addEventListener("wheel", onWheel, { passive: false });
    return () => cv.removeEventListener("wheel", onWheel);
  }, []);

  const zr = useMemo(() => zRangeOf(f, x, y, withZero || prisms > 0), [f, x, y, withZero, prisms]);

  /** Coordenadas del mundo normalizadas: x, y ∈ [−1, 1], z ∈ [−0.8, 0.8]. */
  const norm = useMemo(() => {
    const [z0, z1] = zr ?? [-1, 1];
    const H = 0.8;
    return {
      X: (v: number) => ((v - x[0]) / (x[1] - x[0])) * 2 - 1,
      Y: (v: number) => ((v - y[0]) / (y[1] - y[0])) * 2 - 1,
      Z: (v: number) => ((v - z0) / (z1 - z0)) * 2 * H - H,
      z0,
      z1,
      H,
    };
  }, [x, y, zr]);

  const faces = useMemo(() => {
    const list: Face[] = [];
    if (!zr) return list;
    const [z0, z1] = zr;
    const m = res;
    const grid: number[][] = [];
    for (let i = 0; i <= m; i++) {
      const row: number[] = [];
      const xv = x[0] + ((x[1] - x[0]) * i) / m;
      for (let j = 0; j <= m; j++) row.push(f(xv, y[0] + ((y[1] - y[0]) * j) / m));
      grid.push(row);
    }
    const ghost = prisms > 0;
    const pad = (z1 - z0) * 0.02;
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < m; j++) {
        const zs = [grid[i]![j]!, grid[i + 1]![j]!, grid[i + 1]![j + 1]!, grid[i]![j + 1]!];
        if (zs.some((v) => !Number.isFinite(v) || v < z0 - pad || v > z1 + pad)) continue;
        const xs = [i, i + 1, i + 1, i].map((k) => x[0] + ((x[1] - x[0]) * k) / m);
        const ys = [j, j, j + 1, j + 1].map((k) => y[0] + ((y[1] - y[0]) * k) / m);
        const avg = (zs[0]! + zs[1]! + zs[2]! + zs[3]!) / 4;
        list.push({
          pts: zs.map((z, k) => [norm.X(xs[k]!), norm.Y(ys[k]!), norm.Z(z)] as V3),
          rgb: heat((avg - z0) / (z1 - z0)),
          alpha: ghost ? 0.35 : 1,
          stroke: wire ? "rgba(15,23,42,0.28)" : undefined,
        });
      }
    }
    if (ghost) {
      const n = prisms;
      const hx = (x[1] - x[0]) / n;
      const hy = (y[1] - y[0]) / n;
      const Z0 = norm.Z(Math.min(Math.max(0, z0), z1));
      for (let i = 0; i < n; i++)
        for (let j = 0; j < n; j++) {
          const h = f(x[0] + (i + 0.5) * hx, y[0] + (j + 0.5) * hy);
          if (!Number.isFinite(h)) continue;
          const Zt = norm.Z(Math.min(Math.max(h, z0), z1));
          const a0 = norm.X(x[0] + i * hx);
          const a1 = norm.X(x[0] + (i + 1) * hx);
          const b0 = norm.Y(y[0] + j * hy);
          const b1 = norm.Y(y[0] + (j + 1) * hy);
          const rgb: [number, number, number] = h >= 0 ? [234, 88, 12] : [124, 58, 237];
          const stroke = "rgba(67,20,7,0.55)";
          const q = (pts: V3[]) => list.push({ pts, rgb, alpha: 0.92, stroke });
          q([
            [a0, b0, Zt],
            [a1, b0, Zt],
            [a1, b1, Zt],
            [a0, b1, Zt],
          ]);
          q([
            [a0, b0, Z0],
            [a1, b0, Z0],
            [a1, b0, Zt],
            [a0, b0, Zt],
          ]);
          q([
            [a0, b1, Z0],
            [a1, b1, Z0],
            [a1, b1, Zt],
            [a0, b1, Zt],
          ]);
          q([
            [a0, b0, Z0],
            [a0, b1, Z0],
            [a0, b1, Zt],
            [a0, b0, Zt],
          ]);
          q([
            [a1, b0, Z0],
            [a1, b1, Z0],
            [a1, b1, Zt],
            [a1, b0, Zt],
          ]);
        }
    }
    return list;
  }, [f, x, y, res, wire, prisms, zr, norm]);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const dpr = window.devicePixelRatio || 1;
    cv.width = Math.round(size.w * dpr);
    cv.height = Math.round(size.h * dpr);
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size.w, size.h);

    const dark = document.documentElement.classList.contains("dark");
    const ink = dark ? "rgba(226,232,240," : "rgba(30,41,59,";

    if (!zr) {
      ctx.fillStyle = `${ink}0.7)`;
      ctx.font = "15px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("La función no está definida en esta región.", size.w / 2, size.h / 2);
      return;
    }

    const { yaw, pitch, zoom } = view;
    // Base de la cámara: e (hacia el observador), r (derecha), u (arriba)
    const e: V3 = [
      Math.cos(pitch) * Math.cos(yaw),
      Math.cos(pitch) * Math.sin(yaw),
      Math.sin(pitch),
    ];
    const r: V3 = [-Math.sin(yaw), Math.cos(yaw), 0];
    const u: V3 = [
      -Math.sin(pitch) * Math.cos(yaw),
      -Math.sin(pitch) * Math.sin(yaw),
      Math.cos(pitch),
    ];
    const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    const D = 6;
    const cam = (p: V3): V3 => [dot(p, r), dot(p, u), dot(p, e)];
    // Encuadre automático: la caja (con margen para etiquetas) cabe centrada en el lienzo.
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    for (const a of [-1.3, 1.3])
      for (const b of [-1.3, 1.3])
        for (const c of [-norm.H, norm.H + 0.25]) {
          const q = cam([a, b, c]);
          const k = D / (D - q[2]);
          minX = Math.min(minX, q[0] * k);
          maxX = Math.max(maxX, q[0] * k);
          minY = Math.min(minY, q[1] * k);
          maxY = Math.max(maxY, q[1] * k);
        }
    const scale = Math.min(size.w / (maxX - minX), size.h / (maxY - minY)) * 0.92 * zoom;
    const offX = size.w / 2 - ((minX + maxX) / 2) * scale;
    const offY = size.h / 2 + ((minY + maxY) / 2) * scale;
    const proj = (c: V3): [number, number] => {
      const k = D / (D - c[2]);
      return [offX + c[0] * scale * k, offY - c[1] * scale * k];
    };
    const P = (p: V3) => proj(cam(p));
    const line = (a: V3, b: V3, style: string, width = 1, dash: number[] = []) => {
      const pa = P(a);
      const pb = P(b);
      ctx.save();
      ctx.strokeStyle = style;
      ctx.lineWidth = width;
      ctx.setLineDash(dash);
      ctx.beginPath();
      ctx.moveTo(pa[0], pa[1]);
      ctx.lineTo(pb[0], pb[1]);
      ctx.stroke();
      ctx.restore();
    };
    const text = (p: V3, s: string, opts: { bold?: boolean; color?: string } = {}) => {
      const q = P(p);
      ctx.fillStyle = opts.color ?? `${ink}0.8)`;
      ctx.font = `${opts.bold ? "italic 600 14px" : "11px"} Inter, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(s, q[0], q[1]);
    };

    const H = norm.H;
    const fl = -H;
    // Caja: piso y aristas traseras (las que quedan lejos del observador)
    const corners: [number, number][] = [
      [-1, -1],
      [1, -1],
      [1, 1],
      [-1, 1],
    ];
    ctx.beginPath();
    corners.forEach(([a, b], i) => {
      const s = P([a, b, fl]);
      if (i === 0) ctx.moveTo(s[0], s[1]);
      else ctx.lineTo(s[0], s[1]);
    });
    ctx.closePath();
    ctx.fillStyle = dark ? "rgba(148,163,184,0.08)" : "rgba(100,116,139,0.07)";
    ctx.fill();
    // Rejilla del piso
    for (let k = 0; k <= 4; k++) {
      const t = -1 + k / 2;
      line([t, -1, fl], [t, 1, fl], `${ink}0.12)`);
      line([-1, t, fl], [1, t, fl], `${ink}0.12)`);
    }
    // Aristas verticales traseras
    for (const [a, b] of corners) {
      if (dot([a, b, 0], e) < 0) line([a, b, fl], [a, b, H], `${ink}0.18)`);
    }
    // Plano z = 0 (si cae dentro de la escala)
    if (norm.z0 < 0 && norm.z1 > 0) {
      const z = norm.Z(0);
      ctx.beginPath();
      corners.forEach(([a, b], i) => {
        const s = P([a, b, z]);
        if (i === 0) ctx.moveTo(s[0], s[1]);
        else ctx.lineTo(s[0], s[1]);
      });
      ctx.closePath();
      ctx.strokeStyle = `${ink}0.35)`;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Superficie y prismas (algoritmo del pintor)
    const light: V3 = [0.35, -0.45, 0.82];
    const ordered = faces
      .map((fc) => {
        const c = fc.pts.map(cam);
        return { fc, c, depth: c.reduce((s, p) => s + p[2], 0) / c.length };
      })
      .sort((a, b) => a.depth - b.depth);
    for (const { fc, c } of ordered) {
      const [p0, p1, , p3] = fc.pts;
      const a: V3 = [p1![0] - p0![0], p1![1] - p0![1], p1![2] - p0![2]];
      const b: V3 = [p3![0] - p0![0], p3![1] - p0![1], p3![2] - p0![2]];
      const nx = a[1] * b[2] - a[2] * b[1];
      const ny = a[2] * b[0] - a[0] * b[2];
      const nz = a[0] * b[1] - a[1] * b[0];
      const len = Math.hypot(nx, ny, nz) || 1;
      const lam = Math.abs((nx * light[0] + ny * light[1] + nz * light[2]) / len);
      const k = 0.45 + 0.55 * lam;
      const [R, G, B] = fc.rgb;
      const fill = `rgba(${Math.round(R * k)},${Math.round(G * k)},${Math.round(B * k)},${fc.alpha})`;
      ctx.beginPath();
      c.forEach((p, i) => {
        const s = proj(p);
        if (i === 0) ctx.moveTo(s[0], s[1]);
        else ctx.lineTo(s[0], s[1]);
      });
      ctx.closePath();
      ctx.fillStyle = fill;
      ctx.fill();
      ctx.lineWidth = fc.stroke ? 0.6 : 0.5;
      ctx.strokeStyle = fc.stroke ?? (fc.alpha >= 0.99 ? fill : "transparent");
      ctx.stroke();
    }

    // Corte transversal x = x0: región bajo la curva z = f(x0, y)
    if (slice !== null) {
      const X0 = norm.X(slice);
      const n = 80;
      const Zb = norm.Z(Math.min(Math.max(0, norm.z0), norm.z1));
      const pts: V3[] = [];
      for (let j = 0; j <= n; j++) {
        const yv = y[0] + ((y[1] - y[0]) * j) / n;
        const v = f(slice, yv);
        const zc = Number.isFinite(v) ? Math.min(Math.max(v, norm.z0), norm.z1) : 0;
        pts.push([X0, norm.Y(yv), norm.Z(zc)]);
      }
      ctx.beginPath();
      const s0 = P([X0, -1, Zb]);
      ctx.moveTo(s0[0], s0[1]);
      for (const p of pts) {
        const s = P(p);
        ctx.lineTo(s[0], s[1]);
      }
      const s1 = P([X0, 1, Zb]);
      ctx.lineTo(s1[0], s1[1]);
      ctx.closePath();
      ctx.fillStyle = "rgba(220,38,38,0.28)";
      ctx.fill();
      ctx.beginPath();
      pts.forEach((p, i) => {
        const s = P(p);
        if (i === 0) ctx.moveTo(s[0], s[1]);
        else ctx.lineTo(s[0], s[1]);
      });
      ctx.strokeStyle = "rgba(220,38,38,0.95)";
      ctx.lineWidth = 2.5;
      ctx.stroke();
    }

    // Punto evaluado
    if (point) {
      const v = f(point[0], point[1]);
      if (Number.isFinite(v) && v >= norm.z0 && v <= norm.z1) {
        const X = norm.X(point[0]);
        const Y = norm.Y(point[1]);
        line([X, Y, fl], [X, Y, norm.Z(v)], "rgba(190,24,93,0.9)", 1.5, [4, 3]);
        const s = P([X, Y, norm.Z(v)]);
        ctx.beginPath();
        ctx.arc(s[0], s[1], 5.5, 0, Math.PI * 2);
        ctx.fillStyle = "rgb(219,39,119)";
        ctx.fill();
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.stroke();
        const g = P([X, Y, fl]);
        ctx.beginPath();
        ctx.arc(g[0], g[1], 3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(190,24,93,0.8)";
        ctx.fill();
      }
    }

    // Aristas frontales y etiquetas de los ejes
    for (const [a, b] of corners) {
      if (dot([a, b, 0], e) >= 0) line([a, b, fl], [a, b, H], `${ink}0.22)`);
    }
    // Eje x sobre el borde del piso más cercano al observador
    const yEdge = dot([0, 1, 0], e) > 0 ? 1 : -1;
    const xEdge = dot([1, 0, 0], e) > 0 ? 1 : -1;
    line([-1, yEdge, fl], [1, yEdge, fl], `${ink}0.55)`, 1.5);
    line([xEdge, -1, fl], [xEdge, 1, fl], `${ink}0.55)`, 1.5);
    const zx = -xEdge;
    const zy = yEdge;
    line([zx, zy, fl], [zx, zy, H], `${ink}0.55)`, 1.5);
    const off = 0.16;
    text([-1, yEdge * (1 + off), fl], tick(x[0]));
    text([1, yEdge * (1 + off), fl], tick(x[1]));
    text([0, yEdge * (1 + off * 2.2), fl], "x", { bold: true });
    text([xEdge * (1 + off), -1, fl], tick(y[0]));
    text([xEdge * (1 + off), 1, fl], tick(y[1]));
    text([xEdge * (1 + off * 2.2), 0, fl], "y", { bold: true });
    // Marcas del eje z: desplazadas hacia afuera en pantalla para no chocar con las de x, y
    const zBase = P([zx, zy, fl]);
    const outside = zBase[0] < size.w / 2 ? -1 : 1;
    const zt = (zv: number, s: string, bold = false) => {
      const q = P([zx, zy, zv]);
      ctx.fillStyle = `${ink}0.8)`;
      ctx.font = `${bold ? "italic 600 14px" : "11px"} Inter, sans-serif`;
      ctx.textAlign = outside < 0 ? "right" : "left";
      ctx.textBaseline = "middle";
      ctx.fillText(s, q[0] + outside * 8, q[1] - (zv === fl ? 10 : 0));
    };
    const zspan = norm.z1 - norm.z0;
    const clean = (v: number) => (Math.abs(v) < zspan * 1e-4 ? 0 : v);
    zt(fl, tick(clean(norm.z0)));
    zt(H, tick(clean(norm.z1)));
    if (norm.z0 < 0 && norm.z1 > 0) zt(norm.Z(0), "0");
    zt(H + 0.22, "z", true);
  }, [faces, view, size, zr, norm, slice, point, f, x, y]);

  const reset = () => setView({ yaw: -0.85, pitch: 0.5, zoom: 1 });
  const btn =
    "rounded-md border border-border bg-card px-2.5 py-1 text-xs font-medium transition-colors hover:bg-secondary";

  return (
    <div ref={wrapRef} className="w-full">
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: size.h, touchAction: "none" }}
        className="cursor-grab rounded-xl border border-border bg-card active:cursor-grabbing"
        role="img"
        aria-label="Gráfica 3D de la superficie z = f(x, y). Arrastra para girar y usa la rueda para acercar."
        onPointerDown={(ev) => {
          (ev.target as HTMLCanvasElement).setPointerCapture(ev.pointerId);
          pinch.current.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
          if (pinch.current.size === 2) {
            const [a, b] = [...pinch.current.values()];
            pinchStart.current = { d: Math.hypot(a!.x - b!.x, a!.y - b!.y), zoom: view.zoom };
            drag.current = null;
          } else {
            drag.current = { x: ev.clientX, y: ev.clientY, yaw: view.yaw, pitch: view.pitch };
          }
        }}
        onPointerMove={(ev) => {
          if (pinch.current.has(ev.pointerId))
            pinch.current.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
          if (pinch.current.size === 2 && pinchStart.current) {
            const [a, b] = [...pinch.current.values()];
            const d = Math.hypot(a!.x - b!.x, a!.y - b!.y);
            const z = pinchStart.current.zoom * (d / (pinchStart.current.d || 1));
            setView((v) => ({ ...v, zoom: Math.min(4, Math.max(0.4, z)) }));
            return;
          }
          const d = drag.current;
          if (!d) return;
          setView((v) => ({
            ...v,
            yaw: d.yaw - (ev.clientX - d.x) * 0.01,
            pitch: Math.max(-1.5, Math.min(1.5, d.pitch + (ev.clientY - d.y) * 0.01)),
          }));
        }}
        onPointerUp={(ev) => {
          pinch.current.delete(ev.pointerId);
          if (pinch.current.size < 2) pinchStart.current = null;
          drag.current = null;
        }}
        onPointerCancel={(ev) => {
          pinch.current.delete(ev.pointerId);
          pinchStart.current = null;
          drag.current = null;
        }}
      />
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>Arrastra para girar · rueda o pellizco para acercar.</span>
        <span className="flex flex-wrap gap-1.5">
          <button
            className={btn}
            onClick={() => setView((v) => ({ ...v, zoom: Math.min(4, v.zoom * 1.2) }))}
          >
            Acercar +
          </button>
          <button
            className={btn}
            onClick={() => setView((v) => ({ ...v, zoom: Math.max(0.4, v.zoom / 1.2) }))}
          >
            Alejar −
          </button>
          <button className={btn} onClick={() => setView((v) => ({ ...v, pitch: 1.5 }))}>
            Vista superior
          </button>
          <button className={btn} onClick={reset}>
            Restablecer
          </button>
        </span>
      </div>
    </div>
  );
}
