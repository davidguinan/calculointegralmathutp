import { useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { Plot } from "@/components/math/Plot";
import { SliderField, Stat } from "@/components/math/Controls";
import { TexBlock } from "@/components/math/Tex";
import { Solid3D } from "./Solid3D";
import { REGIONS, solidVolume, volumeTex, type Axis } from "./solids";

export type AxisMode = "x" | "yk" | "y" | "xh";

/** Configuración que un ejercicio puede cargar en el laboratorio. */
export type SolidPreset = { regionId: string; mode: AxisMode; c?: number; nonce: number };

const METHOD_LABEL = {
  discos: "Discos",
  arandelas: "Arandelas",
  capas: "Capas cilíndricas",
} as const;

export function SolidsLab({ preset }: { preset?: SolidPreset | null }) {
  const [regionId, setRegionId] = useState("clase");
  const region = REGIONS.find((r) => r.id === regionId)!;
  const [mode, setMode] = useState<AxisMode>("x");
  const [k, setK] = useState(-1);
  const [h, setH] = useState(-1);
  const [deg, setDeg] = useState(360);
  const [playing, setPlaying] = useState(false);
  const [showElement, setShowElement] = useState(false);
  const [xStar, setXStar] = useState((region.a + region.b) / 2);

  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!preset) return;
    setRegionId(preset.regionId);
    setMode(preset.mode);
    if (preset.mode === "yk") setK(preset.c ?? 0);
    if (preset.mode === "xh") setH(preset.c ?? 0);
    setShowElement(false);
    setDeg(0);
    setPlaying(true);
    rootRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [preset]);

  const straddles = region.a < 0 && region.b > 0;

  // Al cambiar de región, ajustar valores que dejen de ser válidos.
  useEffect(() => {
    setXStar((region.a + region.b) / 2);
    if (straddles && mode === "y") setMode("x");
  }, [regionId]); // eslint-disable-line react-hooks/exhaustive-deps

  // La recta vertical no puede cortar la región: se ajusta al borde más cercano.
  const hValid =
    h > region.a && h < region.b ? (h - region.a < region.b - h ? region.a : region.b) : h;

  const axis: Axis = useMemo(() => {
    if (mode === "x") return { kind: "h", c: 0 };
    if (mode === "yk") return { kind: "h", c: k };
    if (mode === "y") return { kind: "v", c: 0 };
    return { kind: "v", c: hValid };
  }, [mode, k, hValid]);

  const vol = useMemo(() => solidVolume(region, axis), [region, axis]);
  const tex = useMemo(() => volumeTex(region, axis), [region, axis]);
  const exact =
    mode === "x" || (mode === "yk" && k === 0)
      ? region.exactX
      : mode === "y" || (mode === "xh" && hValid === 0)
        ? region.exactY
        : undefined;

  // Animación del giro
  const raf = useRef<number>(0);
  useEffect(() => {
    if (!playing) return;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setDeg((d) => {
        const nd = d + dt * 120;
        if (nd >= 360) {
          setPlaying(false);
          return 360;
        }
        return nd;
      });
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [playing]);

  const theta = (deg * Math.PI) / 180;
  const plotDomain: [number, number] =
    axis.kind === "v"
      ? [Math.min(region.a, axis.c), Math.max(region.b, axis.c)]
      : [region.a, region.b];
  const extra = useMemo(() => {
    const xs = Array.from({ length: 41 }, (_, i) => region.a + ((region.b - region.a) * i) / 40);
    return xs.map(region.g).concat(axis.kind === "h" ? [axis.c] : []);
  }, [region, axis]);

  return (
    <div ref={rootRef} className="scroll-mt-24 space-y-5">
      <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
        <Solid3D
          region={region}
          axis={axis}
          theta={theta}
          showElement={showElement}
          xStar={xStar}
        />
        <div className="space-y-4">
          <label className="block text-sm">
            <span className="font-medium">Región</span>
            <select
              value={regionId}
              onChange={(e) => setRegionId(e.target.value)}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {REGIONS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="font-medium">Eje de giro</span>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as AxisMode)}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="x">Eje x (y = 0)</option>
              <option value="yk">Recta horizontal y = k</option>
              <option value="y" disabled={straddles}>
                Eje y (x = 0){straddles ? " — corta la región" : ""}
              </option>
              <option value="xh">Recta vertical x = h</option>
            </select>
          </label>
          {mode === "yk" && (
            <SliderField label="k" min={-3} max={4} step={0.5} value={k} onChange={setK} />
          )}
          {mode === "xh" && (
            <SliderField
              label="h"
              min={Math.floor(region.a) - 3}
              max={Math.ceil(region.b) + 2}
              step={0.5}
              value={h}
              onChange={setH}
              display={hValid !== h ? `${hValid.toFixed(2)} (ajustado)` : String(h)}
            />
          )}
          <div>
            <SliderField
              label="Ángulo de giro"
              min={0}
              max={360}
              step={5}
              value={Math.round(deg)}
              onChange={(v) => {
                setPlaying(false);
                setDeg(v);
              }}
              display={`${Math.round(deg)}°`}
            />
            <button
              onClick={() => {
                if (!playing && deg >= 360) setDeg(0);
                setPlaying((p) => !p);
              }}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
              {playing ? "Pausar" : "Animar el giro"}
            </button>
          </div>
          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              checked={showElement}
              onChange={(e) => setShowElement(e.target.checked)}
              className="size-4 accent-[var(--primary)]"
            />
            Ver {axis.kind === "h" ? "disco / arandela" : "capa cilíndrica"} representativo
          </label>
          {showElement && (
            <SliderField
              label="Posición x*"
              min={region.a}
              max={region.b}
              step={(region.b - region.a) / 100}
              value={xStar}
              onChange={setXStar}
              display={xStar.toFixed(2)}
            />
          )}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Método" value={METHOD_LABEL[vol.method]} />
        <Stat label="Volumen (giro completo)" value={vol.value.toFixed(5)} tone="accent" />
        <Stat
          label={`Volumen barrido a ${Math.round(deg)}°`}
          value={((vol.value * deg) / 360).toFixed(5)}
          tone="success"
        />
      </div>
      <TexBlock boxed>{exact ? `${tex} = ${exact}` : tex}</TexBlock>

      <div>
        <p className="mb-2 text-sm font-semibold">
          Vista plana: región, eje y rectángulo representativo
        </p>
        <Plot f={region.f} domain={plotDomain} extraPoints={extra}>
          {(s) => {
            const n = 100;
            const top: string[] = [];
            const bot: string[] = [];
            for (let i = 0; i <= n; i++) {
              const x = region.a + ((region.b - region.a) * i) / n;
              top.push(`${s.sx(x).toFixed(2)},${s.sy(region.f(x)).toFixed(2)}`);
              bot.unshift(`${s.sx(x).toFixed(2)},${s.sy(region.g(x)).toFixed(2)}`);
            }
            const dx = (region.b - region.a) / 30;
            return (
              <g>
                <polygon points={[...top, ...bot].join(" ")} className="fill-accent/40" />
                <polyline
                  points={bot.join(" ")}
                  fill="none"
                  className="stroke-accent-foreground"
                  strokeWidth={2}
                />
                {showElement && (
                  <rect
                    x={s.sx(xStar - dx / 2)}
                    y={s.sy(region.f(xStar))}
                    width={Math.max(2, s.sx(xStar + dx / 2) - s.sx(xStar - dx / 2))}
                    height={Math.max(1, s.sy(region.g(xStar)) - s.sy(region.f(xStar)))}
                    fill="rgb(234,88,12)"
                    opacity={0.85}
                  />
                )}
                {axis.kind === "h" ? (
                  <line
                    x1={s.sx(s.x0)}
                    x2={s.sx(s.x1)}
                    y1={s.sy(axis.c)}
                    y2={s.sy(axis.c)}
                    stroke="rgb(220,38,38)"
                    strokeWidth={2}
                    strokeDasharray="7 5"
                  />
                ) : (
                  <line
                    x1={s.sx(axis.c)}
                    x2={s.sx(axis.c)}
                    y1={s.sy(s.y0)}
                    y2={s.sy(s.y1)}
                    stroke="rgb(220,38,38)"
                    strokeWidth={2}
                    strokeDasharray="7 5"
                  />
                )}
              </g>
            );
          }}
        </Plot>
      </div>
    </div>
  );
}
