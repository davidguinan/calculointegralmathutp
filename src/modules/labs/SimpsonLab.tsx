import { useMemo, useState } from "react";
import { Plot } from "@/components/math/Plot";
import { FunctionSelect, SliderField, Stat } from "@/components/math/Controls";
import { getFunction } from "@/lib/functions";
import { exactish, parabolaThrough, simpson } from "@/lib/numeric";

export function SimpsonLab() {
  const [fnId, setFnId] = useState("cubic");
  const fn = getFunction(fnId);
  const [a, setA] = useState(fn.suggested[0]);
  const [b, setB] = useState(fn.suggested[1]);
  const [nHalf, setNHalf] = useState(3); // n = 2 * nHalf (siempre par)
  const n = nHalf * 2;

  const { value, h } = useMemo(() => simpson(fn.f, a, b, n), [fn, a, b, n]);
  const exact = useMemo(() => exactish(fn.f, a, b), [fn, a, b]);

  const arcs = useMemo(() => {
    const out: { x0: number; x2: number; p: (x: number) => number }[] = [];
    for (let i = 0; i < n; i += 2) {
      const x0 = a + i * h;
      const x1 = x0 + h;
      const x2 = x0 + 2 * h;
      out.push({
        x0,
        x2,
        p: parabolaThrough([x0, fn.f(x0)], [x1, fn.f(x1)], [x2, fn.f(x2)]),
      });
    }
    return out;
  }, [fn, a, h, n]);


  const onFn = (id: string) => {
    const nf = getFunction(id);
    setFnId(id);
    setA(nf.suggested[0]);
    setB(nf.suggested[1]);
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_260px]">
      <Plot f={fn.f} domain={[a, b]} caption={`n = ${n} (par), h = ${h.toFixed(4)}`}>
        {(s) => (
          <g>
            {arcs.map((arc, i) => {
              const pts: string[] = [];
              const fill: string[] = [`${s.sx(arc.x0)},${s.sy(0)}`];
              for (let k = 0; k <= 30; k++) {
                const x = arc.x0 + ((arc.x2 - arc.x0) * k) / 30;
                const px = `${s.sx(x)},${s.sy(arc.p(x))}`;
                pts.push(px);
                fill.push(px);
              }
              fill.push(`${s.sx(arc.x2)},${s.sy(0)}`);
              return (
                <g key={i}>
                  <polygon points={fill.join(" ")} className="fill-accent/30" />
                  <polyline
                    points={pts.join(" ")}
                    className="stroke-accent"
                    fill="none"
                    strokeWidth={2}
                  />
                  <line
                    x1={s.sx(arc.x0)}
                    x2={s.sx(arc.x0)}
                    y1={s.sy(0)}
                    y2={s.sy(fn.f(arc.x0))}
                    className="stroke-border"
                  />
                </g>
              );
            })}
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
        <SliderField
          label="n (par)"
          min={1}
          max={40}
          value={nHalf}
          onChange={setNHalf}
          display={String(n)}
        />
        <Stat label="Regla de Simpson" value={value.toFixed(8)} tone="accent" />
        <Stat label="Valor exacto" value={exact.toFixed(8)} />
        <Stat label="Error absoluto" value={Math.abs(exact - value).toExponential(3)} tone="success" />
      </div>
    </div>
  );
}
