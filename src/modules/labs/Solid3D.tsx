import { useEffect, useMemo, useRef, useState } from "react";
import type { Axis, Region } from "./solids";

type V3 = [number, number, number];
type Face = { pts: V3[]; color: [number, number, number]; kind: "surf" | "cap" | "elem" };

const SURF: [number, number, number] = [59, 130, 246];
const CAP: [number, number, number] = [245, 158, 11];
const ELEM: [number, number, number] = [234, 88, 12];

function rotate(axis: Axis, x: number, y: number, t: number): V3 {
  if (axis.kind === "h") {
    const d = y - axis.c;
    return [x, axis.c + d * Math.cos(t), d * Math.sin(t)];
  }
  const d = x - axis.c;
  return [axis.c + d * Math.cos(t), y, d * Math.sin(t)];
}

/** Barre una poligonal cerrada (perfil) alrededor del eje entre los ángulos 0 y theta. */
function sweep(
  profile: [number, number][],
  axis: Axis,
  theta: number,
  steps: number,
  color: Face["color"],
  kind: Face["kind"],
): Face[] {
  const faces: Face[] = [];
  const m = Math.max(2, Math.ceil((steps * theta) / (2 * Math.PI)));
  for (let i = 0; i < profile.length - 1; i++) {
    const [x0, y0] = profile[i]!;
    const [x1, y1] = profile[i + 1]!;
    if (Math.hypot(x1 - x0, y1 - y0) < 1e-9) continue;
    for (let j = 0; j < m; j++) {
      const t0 = (theta * j) / m;
      const t1 = (theta * (j + 1)) / m;
      faces.push({
        pts: [
          rotate(axis, x0, y0, t0),
          rotate(axis, x1, y1, t0),
          rotate(axis, x1, y1, t1),
          rotate(axis, x0, y0, t1),
        ],
        color,
        kind,
      });
    }
  }
  return faces;
}

function regionProfile(r: Region, n: number): [number, number][] {
  const pts: [number, number][] = [];
  const subdiv = (x0: number, y0: number, x1: number, y1: number, k: number) => {
    for (let i = 1; i <= k; i++) pts.push([x0 + ((x1 - x0) * i) / k, y0 + ((y1 - y0) * i) / k]);
  };
  for (let i = 0; i <= n; i++) {
    const x = r.a + ((r.b - r.a) * i) / n;
    pts.push([x, r.f(x)]);
  }
  subdiv(r.b, r.f(r.b), r.b, r.g(r.b), 6);
  for (let i = n - 1; i >= 0; i--) {
    const x = r.a + ((r.b - r.a) * i) / n;
    pts.push([x, r.g(x)]);
  }
  subdiv(r.a, r.g(r.a), r.a, r.f(r.a), 6);
  return pts;
}

export function Solid3D({
  region,
  axis,
  theta,
  showElement,
  xStar,
}: {
  region: Region;
  axis: Axis;
  theta: number;
  showElement: boolean;
  xStar: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [size, setSize] = useState({ w: 640, h: 420 });
  const [view, setView] = useState({ yaw: -0.65, pitch: 0.38 });
  const drag = useRef<{ x: number; y: number; yaw: number; pitch: number } | null>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const w = el.clientWidth;
      setSize({ w, h: Math.max(300, Math.min(480, Math.round(w * 0.66))) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Caja de encuadre fija (sólido completo) para que la vista no salte al animar.
  const frame = useMemo(() => {
    const xs = Array.from({ length: 81 }, (_, i) => region.a + ((region.b - region.a) * i) / 80);
    const ys = xs.flatMap((x) => [region.f(x), region.g(x)]);
    let box: { x: [number, number]; y: [number, number]; z: number };
    if (axis.kind === "h") {
      const R = Math.max(...ys.map((y) => Math.abs(y - axis.c)));
      box = { x: [region.a, region.b], y: [axis.c - R, axis.c + R], z: R };
    } else {
      const R = Math.max(Math.abs(region.a - axis.c), Math.abs(region.b - axis.c));
      box = { x: [axis.c - R, axis.c + R], y: [Math.min(...ys, 0), Math.max(...ys)], z: R };
    }
    const center: V3 = [(box.x[0] + box.x[1]) / 2, (box.y[0] + box.y[1]) / 2, 0];
    const extent = Math.max(box.x[1] - box.x[0], box.y[1] - box.y[0], 2 * box.z, 1);
    return { center, extent };
  }, [region, axis]);

  const faces = useMemo(() => {
    const profile = regionProfile(region, 48);
    const list = sweep(profile, axis, theta, 56, SURF, "surf");
    // Tapas: la región plana en el ángulo 0 y en el ángulo theta.
    if (theta < 2 * Math.PI - 1e-3) {
      const n = 40;
      const m = 10;
      for (const t of theta > 1e-3 ? [0, theta] : [0]) {
        for (let i = 0; i < n; i++) {
          const x0 = region.a + ((region.b - region.a) * i) / n;
          const x1 = region.a + ((region.b - region.a) * (i + 1)) / n;
          const y = (x: number, j: number) => region.g(x) + ((region.f(x) - region.g(x)) * j) / m;
          for (let j = 0; j < m; j++) {
            list.push({
              pts: [
                rotate(axis, x0, y(x0, j), t),
                rotate(axis, x1, y(x1, j), t),
                rotate(axis, x1, y(x1, j + 1), t),
                rotate(axis, x0, y(x0, j + 1), t),
              ],
              color: CAP,
              kind: "cap",
            });
          }
        }
      }
    }
    return list;
  }, [region, axis, theta]);

  const element = useMemo(() => {
    if (!showElement) return [];
    const d = Math.max((region.b - region.a) / 60, 0.02);
    const x0 = Math.max(region.a, xStar - d);
    const x1 = Math.min(region.b, xStar + d);
    const rect: [number, number][] = [
      [x0, region.g(xStar)],
      [x1, region.g(xStar)],
      [x1, region.f(xStar)],
      [x0, region.f(xStar)],
      [x0, region.g(xStar)],
    ];
    return sweep(rect, axis, 2 * Math.PI, 48, ELEM, "elem");
  }, [showElement, region, axis, xStar]);

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

    const { yaw, pitch } = view;
    const cy = Math.cos(yaw);
    const sy = Math.sin(yaw);
    const cp = Math.cos(pitch);
    const sp = Math.sin(pitch);
    const scale = (Math.min(size.w, size.h) * 0.78) / frame.extent;
    const dist = frame.extent * 3.2;

    const toCam = (p: V3): V3 => {
      const x = p[0] - frame.center[0];
      const y = p[1] - frame.center[1];
      const z = p[2] - frame.center[2];
      const x1 = cy * x + sy * z;
      const z1 = -sy * x + cy * z;
      const y2 = cp * y - sp * z1;
      const z2 = sp * y + cp * z1;
      return [x1, y2, z2];
    };
    const proj = (c: V3): [number, number] => {
      const k = dist / (dist - c[2]);
      return [size.w / 2 + c[0] * scale * k, size.h / 2 - c[1] * scale * k];
    };
    const line = (a: V3, b: V3, style: string, width = 1, dash: number[] = []) => {
      const pa = proj(toCam(a));
      const pb = proj(toCam(b));
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
    const label = (p: V3, text: string) => {
      const q = proj(toCam(p));
      ctx.fillStyle = `${ink}0.75)`;
      ctx.font = "italic 13px Inter, sans-serif";
      ctx.fillText(text, q[0] + 4, q[1] - 4);
    };

    // Ejes coordenados
    const E = frame.extent * 0.62;
    const [cx0, cy0] = frame.center;
    line([cx0 - E, 0, 0], [cx0 + E, 0, 0], `${ink}0.35)`, 1);
    line([0, cy0 - E, 0], [0, cy0 + E, 0], `${ink}0.35)`, 1);
    line([0, 0, -E * 0.6], [0, 0, E * 0.6], `${ink}0.2)`, 1);
    if (!(axis.kind === "h" && axis.c === 0)) label([cx0 + E, 0, 0], "x");
    if (!(axis.kind === "v" && axis.c === 0)) label([0, cy0 + E, 0], "y");
    label([0, 0, E * 0.6], "z");

    const light: V3 = [-0.35, 0.55, 0.76];
    const draw = (list: Face[], alpha: (f: Face) => number) => {
      const cam = list.map((f) => {
        const pts = f.pts.map(toCam);
        const depth = pts.reduce((s, p) => s + p[2], 0) / pts.length;
        return { f, pts, depth };
      });
      cam.sort((p, q) => p.depth - q.depth);
      for (const { f, pts } of cam) {
        const u: V3 = [pts[1]![0] - pts[0]![0], pts[1]![1] - pts[0]![1], pts[1]![2] - pts[0]![2]];
        const v: V3 = [pts[3]![0] - pts[0]![0], pts[3]![1] - pts[0]![1], pts[3]![2] - pts[0]![2]];
        let nx = u[1] * v[2] - u[2] * v[1];
        let ny = u[2] * v[0] - u[0] * v[2];
        let nz = u[0] * v[1] - u[1] * v[0];
        const len = Math.hypot(nx, ny, nz) || 1;
        nx /= len;
        ny /= len;
        nz /= len;
        const lambert = Math.abs(nx * light[0] + ny * light[1] + nz * light[2]);
        const k = 0.38 + 0.62 * lambert;
        const [r, g, b] = f.color;
        const a = alpha(f);
        const fill = `rgba(${Math.round(r * k)},${Math.round(g * k)},${Math.round(b * k)},${a})`;
        ctx.beginPath();
        pts.forEach((p, i) => {
          const s = proj(p);
          if (i === 0) ctx.moveTo(s[0], s[1]);
          else ctx.lineTo(s[0], s[1]);
        });
        ctx.closePath();
        ctx.fillStyle = fill;
        ctx.fill();
        if (a >= 0.99) {
          ctx.strokeStyle = fill;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    };

    const ghost = element.length > 0;
    draw(faces, (f) => (ghost ? (f.kind === "cap" ? 0.35 : 0.16) : 1));
    if (ghost) draw(element, () => 1);

    // Curvas frontera de la región original (en el plano z = 0)
    const n = 80;
    for (const fn of [region.f, region.g]) {
      ctx.beginPath();
      for (let i = 0; i <= n; i++) {
        const x = region.a + ((region.b - region.a) * i) / n;
        const s = proj(toCam([x, fn(x), 0]));
        if (i === 0) ctx.moveTo(s[0], s[1]);
        else ctx.lineTo(s[0], s[1]);
      }
      ctx.strokeStyle = "rgba(180,83,9,0.95)";
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Eje de giro
    if (axis.kind === "h") {
      line([cx0 - E, axis.c, 0], [cx0 + E, axis.c, 0], "rgba(220,38,38,0.95)", 2, [7, 5]);
      label([cx0 + E, axis.c, 0], axis.c === 0 ? "eje de giro (y = 0)" : `eje y = ${axis.c}`);
    } else {
      line([axis.c, cy0 - E, 0], [axis.c, cy0 + E, 0], "rgba(220,38,38,0.95)", 2, [7, 5]);
      label([axis.c, cy0 + E, 0], axis.c === 0 ? "eje de giro (x = 0)" : `eje x = ${axis.c}`);
    }
  }, [faces, element, view, size, frame, axis, region]);

  return (
    <div ref={wrapRef} className="w-full">
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: size.h, touchAction: "none" }}
        className="cursor-grab rounded-xl border border-border bg-card active:cursor-grabbing"
        role="img"
        aria-label="Sólido de revolución en 3D. Arrastra para girar la vista."
        onPointerDown={(e) => {
          (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
          drag.current = { x: e.clientX, y: e.clientY, ...view };
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d) return;
          setView({
            yaw: d.yaw + (e.clientX - d.x) * 0.01,
            pitch: Math.max(-1.45, Math.min(1.45, d.pitch + (e.clientY - d.y) * 0.01)),
          });
        }}
        onPointerUp={() => (drag.current = null)}
        onPointerCancel={() => (drag.current = null)}
      />
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>Arrastra la figura para girar la vista 3D.</span>
        <span className="flex flex-wrap gap-3">
          <span className="inline-flex items-center gap-1">
            <i className="inline-block size-2.5 rounded-sm bg-[rgb(245,158,11)]" /> región
          </span>
          <span className="inline-flex items-center gap-1">
            <i className="inline-block size-2.5 rounded-sm bg-[rgb(59,130,246)]" /> sólido
          </span>
          <span className="inline-flex items-center gap-1">
            <i className="inline-block size-2.5 rounded-sm bg-[rgb(234,88,12)]" /> elemento
          </span>
          <span className="inline-flex items-center gap-1">
            <i className="inline-block h-0.5 w-3 bg-[rgb(220,38,38)]" /> eje de giro
          </span>
        </span>
      </div>
    </div>
  );
}
