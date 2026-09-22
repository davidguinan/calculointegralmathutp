import { useMemo, useState } from "react";
import { Plot } from "@/components/math/Plot";
import { FunctionSelect, SliderField, Stat } from "@/components/math/Controls";
import { getFunction } from "@/lib/functions";
import { exactish, riemann } from "@/lib/numeric";

type Mode = "left" | "right" | "mid";

export function RectanglesLab({
  fixedMode,
  defaultFn = "x2",
}: {
  fixedMode?: Mode;
  defaultFn?: string;
}) {
  const [fnId, setFnId] = useState(defaultFn);
  const fn = getFunction(fnId);
  const [a, setA] = useState(fn.suggested[0]);
  const [b, setB] = useState(fn.suggested[1]);
  const [n, setN] = useState(8);
  const [mode, setMode] = useState<Mode>(fixedMode ?? "left");

  const { value, bars, h } = useMemo(() => riemann(fn.f, a, b, n, mode), [fn, a, b, n, mode]);
  const exact = useMemo(() => exactish(fn.f, a, b), [fn, a, b]);
  const err = Math.abs(exact - value);

  const onFn = (id: string) => {
    const nf = getFunction(id);
    setFnId(id);
    setA(nf.suggested[0]);
    setB(nf.suggested[1]);
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_260px]">
      <Plot
        f={fn.f}
        domain={[a, b]}
        caption={`n = ${n} subintervalos, ancho Δx = ${h.toFixed(4)}`}
      >
        {(s) => (
          <g>
            {bars.map((bar, i) => {
              const y0 = s.sy(0);
              const y1 = s.sy(bar.y);
              return (
                <rect
                  key={i}
                  x={s.sx(bar.x0)}
                  y={Math.min(y0, y1)}
                  width={Math.max(s.sx(bar.x1) - s.sx(bar.x0), 0)}
                  height={Math.abs(y1 - y0)}
                  className="fill-accent/35 stroke-accent"
                  strokeWidth={1}
                />
              );
            })}
            {mode === "mid" &&
              bars.map((bar, i) => (
                <line
                  key={`m${i}`}
                  x1={s.sx(bar.sample)}
                  x2={s.sx(bar.sample)}
                  y1={s.sy(0)}
                  y2={s.sy(bar.y)}
                  className="stroke-primary/60"
                  strokeDasharray="3 3"
                />
              ))}
          </g>
        )}
      </Plot>

      <div className="space-y-4">
        <FunctionSelect value={fnId} onChange={onFn} />
        {!fixedMode && (
          <div className="grid grid-cols-3 gap-1 rounded-lg bg-secondary p-1 text-xs font-medium">
            {(
              [
                ["left", "Izquierda"],
                ["mid", "Medio"],
                ["right", "Derecha"],
              ] as const
            ).map(([m, label]) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`rounded-md px-2 py-1.5 transition-colors ${
                  mode === m ? "bg-primary text-primary-foreground" : "hover:bg-background/70"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
        <SliderField
          label="a"
          min={-5}
          max={b - 0.5}
          step={0.1}
          value={a}
          onChange={setA}
          display={a.toFixed(2)}
        />
        <SliderField
          label="b"
          min={a + 0.5}
          max={a + 10}
          step={0.1}
          value={b}
          onChange={setB}
          display={b.toFixed(2)}
        />
        <SliderField label="n (subintervalos)" min={1} max={200} value={n} onChange={setN} />
        <Stat label="Aproximación" value={value.toFixed(6)} tone="accent" />
        <Stat label="Valor exacto" value={exact.toFixed(6)} />
        <Stat label="Error absoluto" value={err.toExponential(3)} tone="success" />
      </div>
    </div>
  );
}
