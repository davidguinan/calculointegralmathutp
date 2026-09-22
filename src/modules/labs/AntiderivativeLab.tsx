import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { FunctionSelect, SliderField } from "@/components/math/Controls";
import { Tex } from "@/components/math/Tex";
import { getFunction } from "@/lib/functions";

export function AntiderivativeLab() {
  const [fnId, setFnId] = useState("x2");
  const fn = getFunction(fnId);
  const [C, setC] = useState(0);
  const [a, setA] = useState(fn.suggested[0]);
  const [b, setB] = useState(fn.suggested[1]);

  const data = useMemo(
    () =>
      Array.from({ length: 121 }, (_, i) => {
        const x = a + ((b - a) * i) / 120;
        return { x: Number(x.toFixed(3)), f: fn.f(x), F: fn.F(x) + C };
      }).filter((d) => Number.isFinite(d.f) && Number.isFinite(d.F)),
    [fn, a, b, C],
  );

  const onFn = (id: string) => {
    const nf = getFunction(id);
    setFnId(id);
    setA(nf.suggested[0]);
    setB(nf.suggested[1]);
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_260px]">
      <div className="rounded-xl border border-border bg-card p-3">
        <div className="h-[360px] w-full">
          <ResponsiveContainer>
            <LineChart data={data} margin={{ top: 10, right: 12, bottom: 4, left: -12 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="x" stroke="var(--muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  color: "var(--popover-foreground)",
                }}
                formatter={(v: number) => v.toFixed(4)}
              />
              <Legend />
              <ReferenceLine y={0} stroke="var(--muted-foreground)" />
              <Line
                type="monotone"
                dataKey="f"
                name="f(x)"
                stroke="var(--chart-1)"
                dot={false}
                strokeWidth={2.5}
              />
              <Line
                type="monotone"
                dataKey="F"
                name="F(x) + C"
                stroke="var(--chart-2)"
                dot={false}
                strokeWidth={2.5}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="space-y-4">
        <FunctionSelect value={fnId} onChange={onFn} />
        <div className="rounded-lg bg-secondary px-4 py-3 text-sm">
          <Tex>{fn.latex}</Tex>
          <div className="mt-2">
            <Tex>{fn.latexF}</Tex>
          </div>
        </div>
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
          label="Constante C"
          min={-5}
          max={5}
          step={0.5}
          value={C}
          onChange={setC}
          display={C.toFixed(1)}
        />
        <p className="text-sm text-muted-foreground">
          Observa que donde <Tex>{"f(x) > 0"}</Tex>, la antiderivada <Tex>{"F(x)"}</Tex> crece; la
          constante <Tex>{"C"}</Tex> solo la desplaza verticalmente.
        </p>
      </div>
    </div>
  );
}
