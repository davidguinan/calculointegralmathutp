import { useMemo, useState } from "react";
import { Plot } from "@/components/math/Plot";
import { FunctionSelect, SliderField, Stat } from "@/components/math/Controls";
import { getFunction } from "@/lib/functions";
import { exactish } from "@/lib/numeric";

export function AreaLab() {
  const [fnId, setFnId] = useState("cubic");
  const fn = getFunction(fnId);
  const [a, setA] = useState(0);
  const [b, setB] = useState(2);

  const area = useMemo(() => exactish(fn.f, a, b), [fn, a, b]);
  const byTFC = fn.F(b) - fn.F(a);

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_260px]">
      <Plot
        f={fn.f}
        domain={[Math.min(a, b) - 0.5, Math.max(a, b) + 0.5]}
        caption="El área sombreada corresponde a la integral definida entre a y b."
      >
        {(s) => {
          const pts: string[] = [`${s.sx(a)},${s.sy(0)}`];
          for (let k = 0; k <= 120; k++) {
            const x = a + ((b - a) * k) / 120;
            pts.push(`${s.sx(x)},${s.sy(fn.f(x))}`);
          }
          pts.push(`${s.sx(b)},${s.sy(0)}`);
          return (
            <g>
              <polygon points={pts.join(" ")} className="fill-accent/40" />
              {[a, b].map((x, i) => (
                <line
                  key={i}
                  x1={s.sx(x)}
                  x2={s.sx(x)}
                  y1={s.sy(s.y0)}
                  y2={s.sy(s.y1)}
                  className="stroke-primary/70"
                  strokeDasharray="4 4"
                />
              ))}
            </g>
          );
        }}
      </Plot>
      <div className="space-y-4">
        <FunctionSelect value={fnId} onChange={(id) => setFnId(id)} />
        <SliderField
          label="Límite inferior a"
          min={-4}
          max={b - 0.2}
          step={0.1}
          value={a}
          onChange={setA}
          display={a.toFixed(2)}
        />
        <SliderField
          label="Límite superior b"
          min={a + 0.2}
          max={a + 8}
          step={0.1}
          value={b}
          onChange={setB}
          display={b.toFixed(2)}
        />
        <Stat label="Integral definida" value={area.toFixed(6)} tone="accent" />
        <Stat label="F(b) − F(a)" value={byTFC.toFixed(6)} tone="success" />
      </div>
    </div>
  );
}
