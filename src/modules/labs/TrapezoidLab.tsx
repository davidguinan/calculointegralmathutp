import { useMemo, useState } from "react";
import { Plot } from "@/components/math/Plot";
import { FunctionSelect, SliderField, Stat } from "@/components/math/Controls";
import { getFunction } from "@/lib/functions";
import { exactish, trapezoid } from "@/lib/numeric";

export function TrapezoidLab() {
  const [fnId, setFnId] = useState("sin");
  const fn = getFunction(fnId);
  const [a, setA] = useState(fn.suggested[0]);
  const [b, setB] = useState(fn.suggested[1]);
  const [n, setN] = useState(6);

  const { value, nodes, h } = useMemo(() => trapezoid(fn.f, a, b, n), [fn, a, b, n]);
  const exact = useMemo(() => exactish(fn.f, a, b), [fn, a, b]);

  const onFn = (id: string) => {
    const nf = getFunction(id);
    setFnId(id);
    setA(nf.suggested[0]);
    setB(nf.suggested[1]);
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_260px]">
      <Plot f={fn.f} domain={[a, b]} caption={`n = ${n} trapecios, h = ${h.toFixed(4)}`}>
        {(s) => (
          <g>
            {nodes.slice(0, -1).map((p, i) => {
              const q = nodes[i + 1]!;
              const pts = [
                [s.sx(p.x), s.sy(0)],
                [s.sx(p.x), s.sy(p.y)],
                [s.sx(q.x), s.sy(q.y)],
                [s.sx(q.x), s.sy(0)],
              ]
                .map(([x, y]) => `${x},${y}`)
                .join(" ");
              return (
                <polygon
                  key={i}
                  points={pts}
                  className="fill-accent/35 stroke-accent"
                  strokeWidth={1}
                />
              );
            })}
            {nodes.map((p, i) => (
              <circle key={i} cx={s.sx(p.x)} cy={s.sy(p.y)} r={3} className="fill-primary" />
            ))}
          </g>
        )}
      </Plot>
      <div className="space-y-4">
        <FunctionSelect value={fnId} onChange={onFn} />
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
        <SliderField label="n (trapecios)" min={1} max={100} value={n} onChange={setN} />
        <Stat label="Regla del trapecio" value={value.toFixed(6)} tone="accent" />
        <Stat label="Valor exacto" value={exact.toFixed(6)} />
        <Stat label="Error absoluto" value={Math.abs(exact - value).toExponential(3)} tone="success" />
      </div>
    </div>
  );
}
