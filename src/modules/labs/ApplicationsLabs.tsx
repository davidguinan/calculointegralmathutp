import { useEffect, useMemo, useRef, useState } from "react";
import { Plot } from "@/components/math/Plot";
import { FunctionSelect, SliderField, Stat } from "@/components/math/Controls";
import { TexBlock } from "@/components/math/Tex";
import { getFunction } from "@/lib/functions";
import { exactish, type Fn } from "@/lib/numeric";

const select = "mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm";

/* ------------------------------------------------------------------ */
/* Área entre curvas                                                   */
/* ------------------------------------------------------------------ */

type Pair = {
  id: string;
  label: string;
  f: Fn;
  g: Fn;
  a: number;
  b: number;
  setup: string;
  exact: string;
};

const PAIRS: Pair[] = [
  {
    id: "abs",
    label: "Ejemplo de clase: y = |2x − 1| en [0, 2]",
    f: (x) => Math.abs(2 * x - 1),
    g: () => 0,
    a: 0,
    b: 2,
    setup:
      "\\int_0^2 |2x-1|\\,dx = \\int_0^{1/2} -(2x-1)\\,dx + \\int_{1/2}^{2} (2x-1)\\,dx = \\tfrac14 + \\tfrac94",
    exact: "\\tfrac{5}{2}",
  },
  {
    id: "x2-2x",
    label: "y = 2x y y = x²",
    f: (x) => 2 * x,
    g: (x) => x * x,
    a: 0,
    b: 2,
    setup: "A = \\int_0^2 \\big(2x - x^2\\big)\\,dx",
    exact: "\\tfrac{4}{3}",
  },
  {
    id: "sqrt-x2",
    label: "y = √x y y = x²",
    f: (x) => Math.sqrt(Math.max(x, 0)),
    g: (x) => x * x,
    a: 0,
    b: 1,
    setup: "A = \\int_0^1 \\big(\\sqrt{x} - x^2\\big)\\,dx",
    exact: "\\tfrac{1}{3}",
  },
  {
    id: "parab-line",
    label: "y = 4 − x² y y = x + 2",
    f: (x) => 4 - x * x,
    g: (x) => x + 2,
    a: -2,
    b: 1,
    setup: "A = \\int_{-2}^{1} \\big[(4 - x^2) - (x + 2)\\big]\\,dx",
    exact: "\\tfrac{9}{2}",
  },
  {
    id: "cubic",
    label: "y = x³ y y = x (se cruzan)",
    f: (x) => x * x * x,
    g: (x) => x,
    a: -1,
    b: 1,
    setup: "A = \\int_{-1}^{0} (x^3 - x)\\,dx + \\int_{0}^{1} (x - x^3)\\,dx",
    exact: "\\tfrac{1}{2}",
  },
  {
    id: "sincos",
    label: "y = sen x y y = cos x",
    f: Math.sin,
    g: Math.cos,
    a: Math.PI / 4,
    b: (5 * Math.PI) / 4,
    setup: "A = \\int_{\\pi/4}^{5\\pi/4} (\\sin x - \\cos x)\\,dx",
    exact: "2\\sqrt{2}",
  },
];

export type PairPreset = { id: string; nonce: number };

export function BetweenCurvesLab({ preset }: { preset?: PairPreset | null }) {
  const [id, setId] = useState(PAIRS[0]!.id);
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!preset) return;
    setId(preset.id);
    rootRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [preset]);
  const p = PAIRS.find((q) => q.id === id)!;
  const [xs, setXs] = useState(0.5);
  const xStar = Math.min(p.b, Math.max(p.a, p.a + (p.b - p.a) * xs));

  const area = useMemo(() => exactish((x) => Math.abs(p.f(x) - p.g(x)), p.a, p.b), [p]);
  const extra = useMemo(
    () => Array.from({ length: 41 }, (_, i) => p.g(p.a + ((p.b - p.a) * i) / 40)),
    [p],
  );
  const top = Math.max(p.f(xStar), p.g(xStar));
  const bot = Math.min(p.f(xStar), p.g(xStar));

  return (
    <div ref={rootRef} className="scroll-mt-24 space-y-4">
      <div className="grid gap-5 lg:grid-cols-[1fr_260px]">
        <Plot
          f={p.f}
          domain={[p.a, p.b]}
          extraPoints={extra}
          caption="La curva azul es f y la naranja es g. El rectángulo rojo es el elemento de área [f(x) − g(x)]·dx."
        >
          {(s) => {
            const n = 160;
            const up: string[] = [];
            const down: string[] = [];
            for (let i = 0; i <= n; i++) {
              const x = p.a + ((p.b - p.a) * i) / n;
              up.push(`${s.sx(x).toFixed(2)},${s.sy(Math.max(p.f(x), p.g(x))).toFixed(2)}`);
              down.unshift(`${s.sx(x).toFixed(2)},${s.sy(Math.min(p.f(x), p.g(x))).toFixed(2)}`);
            }
            const gPts: string[] = [];
            for (let i = 0; i <= 200; i++) {
              const x = s.x0 + ((s.x1 - s.x0) * i) / 200;
              const y = p.g(x);
              if (Number.isFinite(y)) gPts.push(`${s.sx(x).toFixed(2)},${s.sy(y).toFixed(2)}`);
            }
            const w = (p.b - p.a) / 40;
            return (
              <g>
                <polygon points={[...up, ...down].join(" ")} className="fill-accent/40" />
                <polyline
                  points={gPts.join(" ")}
                  fill="none"
                  stroke="rgb(234,88,12)"
                  strokeWidth={2.5}
                />
                <rect
                  x={s.sx(xStar - w / 2)}
                  y={s.sy(top)}
                  width={s.sx(xStar + w / 2) - s.sx(xStar - w / 2)}
                  height={Math.max(1, s.sy(bot) - s.sy(top))}
                  fill="rgb(220,38,38)"
                  opacity={0.75}
                />
              </g>
            );
          }}
        </Plot>
        <div className="space-y-4">
          <label className="block text-sm">
            <span className="font-medium">Par de curvas</span>
            <select value={id} onChange={(e) => setId(e.target.value)} className={select}>
              {PAIRS.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.label}
                </option>
              ))}
            </select>
          </label>
          <SliderField
            label="Rectángulo en x"
            min={0}
            max={1}
            step={0.01}
            value={xs}
            onChange={setXs}
            display={xStar.toFixed(2)}
          />
          <Stat label="Altura f − g en x" value={(top - bot).toFixed(4)} />
          <Stat label="Área (numérica)" value={area.toFixed(6)} tone="accent" />
        </div>
      </div>
      <TexBlock boxed>{`${p.setup} = ${p.exact}`}</TexBlock>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Valor promedio                                                      */
/* ------------------------------------------------------------------ */

export function AverageValueLab() {
  const [fnId, setFnId] = useState("sin");
  const fn = getFunction(fnId);
  const [a, setA] = useState(0);
  const [b, setB] = useState(Math.PI);

  const avg = useMemo(() => exactish(fn.f, a, b) / (b - a), [fn, a, b]);
  const cs = useMemo(() => {
    const out: number[] = [];
    const n = 600;
    let prev = fn.f(a) - avg;
    for (let i = 1; i <= n; i++) {
      const x = a + ((b - a) * i) / n;
      const cur = fn.f(x) - avg;
      if (Number.isFinite(prev) && Number.isFinite(cur) && prev * cur <= 0) {
        out.push(x - ((b - a) / n) * (cur / (cur - prev || 1)));
      }
      prev = cur;
    }
    return out.slice(0, 3);
  }, [fn, a, b, avg]);

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_260px]">
      <Plot
        f={fn.f}
        domain={[a, b]}
        extraPoints={[avg]}
        caption="El rectángulo de altura f_prom tiene la misma área que la región bajo la curva."
      >
        {(s) => (
          <g>
            <rect
              x={s.sx(a)}
              y={Math.min(s.sy(avg), s.sy(0))}
              width={s.sx(b) - s.sx(a)}
              height={Math.abs(s.sy(0) - s.sy(avg))}
              className="fill-accent/35"
            />
            <line
              x1={s.sx(a)}
              x2={s.sx(b)}
              y1={s.sy(avg)}
              y2={s.sy(avg)}
              stroke="rgb(220,38,38)"
              strokeWidth={2}
              strokeDasharray="6 4"
            />
            {cs.map((c, i) => (
              <circle
                key={i}
                cx={+s.sx(c).toFixed(2)}
                cy={+s.sy(avg).toFixed(2)}
                r={5}
                fill="rgb(220,38,38)"
              />
            ))}
          </g>
        )}
      </Plot>
      <div className="space-y-4">
        <FunctionSelect
          value={fnId}
          onChange={(id) => {
            setFnId(id);
            const sug = getFunction(id).suggested;
            setA(sug[0]);
            setB(sug[1]);
          }}
        />
        <SliderField
          label="a"
          min={-4}
          max={b - 0.2}
          step={0.1}
          value={a}
          onChange={setA}
          display={a.toFixed(2)}
        />
        <SliderField
          label="b"
          min={a + 0.2}
          max={a + 8}
          step={0.1}
          value={b}
          onChange={setB}
          display={b.toFixed(2)}
        />
        <Stat label="f promedio" value={avg.toFixed(5)} tone="accent" />
        <Stat
          label="c con f(c) = f prom"
          value={cs.length ? cs.map((c) => c.toFixed(3)).join(", ") : "—"}
          tone="success"
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Longitud de arco                                                    */
/* ------------------------------------------------------------------ */

type ArcCase = { id: string; label: string; f: Fn; a: number; b: number; exact: string };

const ARCS: ArcCase[] = [
  {
    id: "x32",
    label: "y = x^(3/2), 0 ≤ x ≤ 4",
    f: (x) => Math.pow(Math.max(x, 0), 1.5),
    a: 0,
    b: 4,
    exact:
      "L = \\int_0^4 \\sqrt{1 + \\tfrac94 x}\\,dx = \\tfrac{8}{27}\\big(10\\sqrt{10} - 1\\big)",
  },
  {
    id: "cosh",
    label: "y = cosh x, 0 ≤ x ≤ 1 (catenaria)",
    f: Math.cosh,
    a: 0,
    b: 1,
    exact: "L = \\int_0^1 \\sqrt{1 + \\sinh^2 x}\\,dx = \\int_0^1 \\cosh x\\,dx = \\sinh 1",
  },
  {
    id: "x2",
    label: "y = x², 0 ≤ x ≤ 1",
    f: (x) => x * x,
    a: 0,
    b: 1,
    exact:
      "L = \\int_0^1 \\sqrt{1 + 4x^2}\\,dx = \\tfrac{\\sqrt5}{2} + \\tfrac14\\ln\\!\\big(2+\\sqrt5\\big)",
  },
  {
    id: "sin",
    label: "y = sen x, 0 ≤ x ≤ π",
    f: Math.sin,
    a: 0,
    b: Math.PI,
    exact: "L = \\int_0^{\\pi} \\sqrt{1 + \\cos^2 x}\\,dx \\;(\\text{sin primitiva elemental})",
  },
];

export function ArcLengthLab() {
  const [id, setId] = useState(ARCS[0]!.id);
  const c = ARCS.find((q) => q.id === id)!;
  const [n, setN] = useState(4);

  const L = useMemo(() => {
    const h = 1e-5;
    const d = (x: number) => (c.f(Math.min(x + h, c.b)) - c.f(Math.max(x - h, c.a))) / (2 * h);
    return exactish((x) => Math.sqrt(1 + d(x) ** 2), c.a + 1e-7, c.b - 1e-7);
  }, [c]);

  const nodes = useMemo(
    () =>
      Array.from({ length: n + 1 }, (_, i) => {
        const x = c.a + ((c.b - c.a) * i) / n;
        return [x, c.f(x)] as const;
      }),
    [c, n],
  );
  const poly = nodes.reduce(
    (s, p, i) => (i === 0 ? 0 : s + Math.hypot(p[0] - nodes[i - 1]![0], p[1] - nodes[i - 1]![1])),
    0,
  );

  return (
    <div className="space-y-4">
      <div className="grid gap-5 lg:grid-cols-[1fr_260px]">
        <Plot
          f={c.f}
          domain={[c.a, c.b]}
          caption="La poligonal roja aproxima la curva; al aumentar n su longitud tiende a L."
        >
          {(s) => (
            <g>
              <polyline
                points={nodes
                  .map(([x, y]) => `${s.sx(x).toFixed(2)},${s.sy(y).toFixed(2)}`)
                  .join(" ")}
                fill="none"
                stroke="rgb(220,38,38)"
                strokeWidth={2}
              />
              {nodes.map(([x, y], i) => (
                <circle
                  key={i}
                  cx={+s.sx(x).toFixed(2)}
                  cy={+s.sy(y).toFixed(2)}
                  r={3.5}
                  fill="rgb(220,38,38)"
                />
              ))}
            </g>
          )}
        </Plot>
        <div className="space-y-4">
          <label className="block text-sm">
            <span className="font-medium">Curva</span>
            <select value={id} onChange={(e) => setId(e.target.value)} className={select}>
              {ARCS.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.label}
                </option>
              ))}
            </select>
          </label>
          <SliderField label="Segmentos n" min={1} max={40} value={n} onChange={setN} />
          <Stat label="Longitud de la poligonal" value={poly.toFixed(6)} />
          <Stat label="Longitud de arco L" value={L.toFixed(6)} tone="accent" />
          <Stat label="Diferencia" value={(L - poly).toExponential(2)} tone="success" />
        </div>
      </div>
      <TexBlock boxed>{c.exact}</TexBlock>
    </div>
  );
}
