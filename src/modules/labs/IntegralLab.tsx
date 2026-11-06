import { useMemo, useState } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { SliderField, Stat } from "@/components/math/Controls";
import { Tex, TexBlock } from "@/components/math/Tex";
import { exactish } from "@/lib/numeric";

export type LabParam = {
  name: string;
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
};

/** Caso de laboratorio: integrando f, antiderivada F y parámetros opcionales. */
export type LabCase = {
  id: string;
  label: string;
  params?: LabParam[];
  f: (x: number, p: number[]) => number;
  F: (x: number, p: number[]) => number;
  tex: (p: number[]) => string;
  texF: (p: number[]) => string;
  /** Paso intermedio opcional (sustitución, completar cuadrado, etc.) */
  texStep?: (p: number[]) => string;
  domain: (p: number[]) => [number, number];
  suggested: (p: number[]) => [number, number];
  note?: string;
};

/** Número compacto para LaTeX: enteros sin decimales, si no 2 decimales. */
export const n = (v: number) => {
  if (Math.abs(v - Math.round(v)) < 1e-9) return String(Math.round(v));
  return v.toFixed(2).replace(/0+$/, "");
};
/** Término con signo: "+ 3", "- 2" */
export const sg = (v: number) => (v < 0 ? `- ${n(-v)}` : `+ ${n(v)}`);

const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);
const SAFE = 1e3;

export function IntegralLab({ cases, initial }: { cases: LabCase[]; initial?: string }) {
  const [caseId, setCaseId] = useState(initial ?? cases[0]!.id);
  const c = cases.find((k) => k.id === caseId) ?? cases[0]!;
  const [pVals, setPVals] = useState<number[]>(() => (c.params ?? []).map((p) => p.value));
  const [lim, setLim] = useState<[number, number]>(() => c.suggested(pVals));
  const [C, setC] = useState(0);

  const p = pVals;
  const [d0, d1] = c.domain(p);
  const a = clamp(lim[0], d0, d1 - 0.1);
  const b = clamp(lim[1], a + 0.1, d1);

  const onCase = (id: string) => {
    const nc = cases.find((k) => k.id === id)!;
    const np = (nc.params ?? []).map((q) => q.value);
    setCaseId(id);
    setPVals(np);
    setLim(nc.suggested(np));
    setC(0);
  };

  const setParam = (i: number, v: number) => {
    const np = [...pVals];
    np[i] = v;
    setPVals(np);
    setLim(c.suggested(np));
  };

  const { data, numeric, tfc, derivOk } = useMemo(() => {
    const fx = (x: number) => c.f(x, p);
    const Fx = (x: number) => c.F(x, p);
    const N = 240;
    const rows = Array.from({ length: N + 1 }, (_, i) => {
      const x = d0 + ((d1 - d0) * i) / N;
      const fv = fx(x);
      const Fv = Fx(x) + C;
      const ok = (v: number) => (Number.isFinite(v) && Math.abs(v) < SAFE ? v : null);
      const inside = x >= a - 1e-9 && x <= b + 1e-9;
      return {
        x: Number(x.toFixed(3)),
        f: ok(fv),
        F: ok(Fv),
        area: inside ? ok(fv) : null,
      };
    });
    // Comprobación numérica de F'(x) = f(x)
    let maxErr = 0;
    const h = 1e-4;
    for (let i = 1; i < 40; i++) {
      const x = a + ((b - a) * i) / 40;
      const d = (Fx(x + h) - Fx(x - h)) / (2 * h);
      const fv = fx(x);
      if (Number.isFinite(d) && Number.isFinite(fv)) {
        maxErr = Math.max(maxErr, Math.abs(d - fv) / Math.max(1, Math.abs(fv)));
      }
    }
    return {
      data: rows,
      numeric: exactish(fx, a, b),
      tfc: Fx(b) - Fx(a),
      derivOk: maxErr < 1e-4,
    };
  }, [c, p, d0, d1, a, b, C]);

  const params = c.params ?? [];

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
      <div className="space-y-4">
        <div className="rounded-xl border border-border bg-card p-3">
          <div className="h-[360px] w-full">
            <ResponsiveContainer>
              <ComposedChart data={data} margin={{ top: 10, right: 12, bottom: 4, left: -12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="x"
                  type="number"
                  domain={[d0, d1]}
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  tickFormatter={(v: number) => v.toFixed(1)}
                />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 10,
                    color: "var(--popover-foreground)",
                  }}
                  labelFormatter={(v: number) => `x = ${v}`}
                  formatter={(v: number) => (typeof v === "number" ? v.toFixed(4) : v)}
                />
                <Legend />
                <ReferenceLine y={0} stroke="var(--muted-foreground)" />
                <Area
                  dataKey="area"
                  name="Área [a, b]"
                  stroke="none"
                  fill="var(--chart-2)"
                  fillOpacity={0.3}
                  connectNulls={false}
                  isAnimationActive={false}
                />
                <Line
                  dataKey="f"
                  name="f(x)"
                  stroke="var(--chart-1)"
                  dot={false}
                  strokeWidth={2.5}
                  connectNulls={false}
                  isAnimationActive={false}
                />
                <Line
                  dataKey="F"
                  name="F(x) + C"
                  stroke="var(--chart-3)"
                  dot={false}
                  strokeWidth={2.5}
                  strokeDasharray="6 4"
                  connectNulls={false}
                  isAnimationActive={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-muted/40 px-4 py-2">
          <TexBlock>{`\\int ${c.tex(p)}\\,dx = ${c.texF(p)} + C`}</TexBlock>
          {c.texStep && (
            <p className="text-sm text-muted-foreground">
              Paso clave: <Tex>{c.texStep(p)}</Tex>
            </p>
          )}
        </div>
        {c.note && <p className="text-sm text-muted-foreground">{c.note}</p>}
      </div>

      <div className="space-y-4">
        <label className="block text-sm">
          <span className="font-medium">Integral</span>
          <select
            value={caseId}
            onChange={(e) => onCase(e.target.value)}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {cases.map((k) => (
              <option key={k.id} value={k.id}>
                {k.label}
              </option>
            ))}
          </select>
        </label>
        {params.map((q, i) => (
          <SliderField
            key={`${c.id}-${q.name}`}
            label={q.label}
            min={q.min}
            max={q.max}
            step={q.step}
            value={p[i] ?? q.value}
            onChange={(v) => setParam(i, v)}
            display={n(p[i] ?? q.value)}
          />
        ))}
        <SliderField
          label="Límite inferior a"
          min={d0}
          max={d1 - 0.1}
          step={0.05}
          value={a}
          onChange={(v) => setLim([v, b])}
          display={a.toFixed(2)}
        />
        <SliderField
          label="Límite superior b"
          min={d0 + 0.1}
          max={d1}
          step={0.05}
          value={b}
          onChange={(v) => setLim([a, v])}
          display={b.toFixed(2)}
        />
        <SliderField
          label="Constante C (solo desplaza F)"
          min={-5}
          max={5}
          step={0.5}
          value={C}
          onChange={setC}
          display={C.toFixed(1)}
        />
        <Stat label="F(b) − F(a)" value={tfc.toFixed(6)} tone="success" />
        <Stat label="Simpson numérico" value={numeric.toFixed(6)} tone="accent" />
        <p
          className={`rounded-md px-3 py-2 text-xs font-medium ${
            derivOk ? "bg-success/15 text-foreground" : "bg-destructive/15 text-foreground"
          }`}
        >
          {derivOk
            ? "✓ Verificado: F′(x) = f(x) en todo [a, b]"
            : "⚠ Revisa: la derivada de F no coincide con f en este intervalo"}
        </p>
      </div>
    </div>
  );
}
