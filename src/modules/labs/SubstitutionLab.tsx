import { useMemo, useState } from "react";
import { Plot, type Scales } from "@/components/math/Plot";
import { SliderField, Stat } from "@/components/math/Controls";
import { Tex, TexBlock } from "@/components/math/Tex";
import { exactish } from "@/lib/numeric";

type SubCase = {
  id: string;
  label: string;
  /** integrando original en x: f(g(x))·g'(x) */
  h: (x: number) => number;
  g: (x: number) => number;
  /** integrando en u */
  f: (u: number) => number;
  F: (u: number) => number;
  texH: string;
  texG: string;
  texDu: string;
  texF: string;
  texRes: string;
  range: [number, number];
  init: [number, number];
};

const CASES: SubCase[] = [
  {
    id: "cosx2",
    label: "∫ 2x·cos(x²) dx",
    h: (x) => 2 * x * Math.cos(x * x),
    g: (x) => x * x,
    f: (u) => Math.cos(u),
    F: (u) => Math.sin(u),
    texH: "2x\\cos(x^2)",
    texG: "u = x^2",
    texDu: "du = 2x\\,dx",
    texF: "\\cos u",
    texRes: "\\sin(x^2) + C",
    range: [0, 2.2],
    init: [0, 1.5],
  },
  {
    id: "pow",
    label: "∫ 3x²(x³ + 1)² dx",
    h: (x) => 3 * x * x * Math.pow(x * x * x + 1, 2),
    g: (x) => x * x * x + 1,
    f: (u) => u * u,
    F: (u) => (u * u * u) / 3,
    texH: "3x^2(x^3+1)^2",
    texG: "u = x^3 + 1",
    texDu: "du = 3x^2\\,dx",
    texF: "u^2",
    texRes: "\\dfrac{(x^3+1)^3}{3} + C",
    range: [-1, 1.3],
    init: [0, 1],
  },
  {
    id: "esin",
    label: "∫ e^{sin x}·cos x dx",
    h: (x) => Math.exp(Math.sin(x)) * Math.cos(x),
    g: (x) => Math.sin(x),
    f: (u) => Math.exp(u),
    F: (u) => Math.exp(u),
    texH: "e^{\\sin x}\\cos x",
    texG: "u = \\sin x",
    texDu: "du = \\cos x\\,dx",
    texF: "e^{u}",
    texRes: "e^{\\sin x} + C",
    range: [0, 3.1],
    init: [0, 1.5],
  },
  {
    id: "ln",
    label: "∫ x/(x² + 1) dx",
    h: (x) => x / (x * x + 1),
    g: (x) => x * x + 1,
    f: (u) => 1 / (2 * u),
    F: (u) => Math.log(u) / 2,
    texH: "\\dfrac{x}{x^2+1}",
    texG: "u = x^2 + 1",
    texDu: "\\tfrac{1}{2}du = x\\,dx",
    texF: "\\dfrac{1}{2u}",
    texRes: "\\tfrac{1}{2}\\ln(x^2+1) + C",
    range: [0, 4],
    init: [0, 2],
  },
  {
    id: "sqrt",
    label: "∫ x·√(x² + 4) dx",
    h: (x) => x * Math.sqrt(x * x + 4),
    g: (x) => x * x + 4,
    f: (u) => 0.5 * Math.sqrt(u),
    F: (u) => Math.pow(u, 1.5) / 3,
    texH: "x\\sqrt{x^2+4}",
    texG: "u = x^2 + 4",
    texDu: "\\tfrac{1}{2}du = x\\,dx",
    texF: "\\tfrac{1}{2}\\sqrt{u}",
    texRes: "\\tfrac{1}{3}(x^2+4)^{3/2} + C",
    range: [0, 3],
    init: [0, 2],
  },
];

function shade(f: (x: number) => number, a: number, b: number) {
  return (s: Scales) => {
    const lo = Math.min(a, b);
    const hi = Math.max(a, b);
    const pts: string[] = [`${s.sx(lo).toFixed(2)},${s.sy(0).toFixed(2)}`];
    for (let k = 0; k <= 120; k++) {
      const x = lo + ((hi - lo) * k) / 120;
      pts.push(`${s.sx(x).toFixed(2)},${s.sy(f(x)).toFixed(2)}`);
    }
    pts.push(`${s.sx(hi).toFixed(2)},${s.sy(0).toFixed(2)}`);
    return (
      <g>
        <polygon points={pts.join(" ")} className="fill-accent/40" />
        {[lo, hi].map((x, i) => (
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
  };
}

export function SubstitutionLab() {
  const [id, setId] = useState(CASES[0]!.id);
  const c = CASES.find((k) => k.id === id)!;
  const [a, setA] = useState(c.init[0]);
  const [b, setB] = useState(c.init[1]);

  const onCase = (nid: string) => {
    const nc = CASES.find((k) => k.id === nid)!;
    setId(nid);
    setA(nc.init[0]);
    setB(nc.init[1]);
  };

  const ua = c.g(a);
  const ub = c.g(b);
  const { Ix, Iu } = useMemo(
    () => ({ Ix: exactish(c.h, a, b), Iu: exactish(c.f, ua, ub) }),
    [c, a, b, ua, ub],
  );

  const uLo = Math.min(ua, ub);
  const uHi = Math.max(ua, ub);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-[1fr_1fr_1fr]">
        <label className="block text-sm">
          <span className="font-medium">Integral</span>
          <select
            value={id}
            onChange={(e) => onCase(e.target.value)}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {CASES.map((k) => (
              <option key={k.id} value={k.id}>
                {k.label}
              </option>
            ))}
          </select>
        </label>
        <SliderField
          label="a (en x)"
          min={c.range[0]}
          max={b - 0.05}
          step={0.05}
          value={a}
          onChange={setA}
          display={a.toFixed(2)}
        />
        <SliderField
          label="b (en x)"
          min={a + 0.05}
          max={c.range[1]}
          step={0.05}
          value={b}
          onChange={setB}
          display={b.toFixed(2)}
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div>
          <p className="mb-2 text-sm font-semibold">
            En la variable original:{" "}
            <Tex>{`\\int_{${a.toFixed(2)}}^{${b.toFixed(2)}} ${c.texH}\\,dx`}</Tex>
          </p>
          <Plot f={c.h} domain={[a, b]} caption="Área bajo f(g(x))·g′(x) entre a y b.">
            {shade(c.h, a, b)}
          </Plot>
        </div>
        <div>
          <p className="mb-2 text-sm font-semibold">
            Tras sustituir:{" "}
            <Tex>{`\\int_{${ua.toFixed(2)}}^{${ub.toFixed(2)}} ${c.texF}\\,du`}</Tex>
          </p>
          <Plot
            f={c.f}
            domain={[uLo, uHi === uLo ? uLo + 1 : uHi]}
            caption="Área bajo f(u) entre g(a) y g(b). ¡Cambian los límites!"
          >
            {shade(c.f, ua, ub)}
          </Plot>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Integral en x" value={Ix.toFixed(6)} />
        <Stat label="Integral en u" value={Iu.toFixed(6)} tone="accent" />
        <Stat label="F(g(b)) − F(g(a))" value={(c.F(ub) - c.F(ua)).toFixed(6)} tone="success" />
      </div>

      <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm">
        <p>
          Cambio de variable: <Tex>{c.texG}</Tex>, <Tex>{c.texDu}</Tex>. Límites nuevos:{" "}
          <Tex>{`u(a) = ${ua.toFixed(3)},\\; u(b) = ${ub.toFixed(3)}`}</Tex>.
        </p>
        <TexBlock>{`\\int ${c.texH}\\,dx = ${c.texRes}`}</TexBlock>
        {ua > ub && (
          <p className="text-muted-foreground">
            Aquí <Tex>{"g(a) > g(b)"}</Tex>: la integral en <Tex>{"u"}</Tex> va “hacia atrás”, por
            eso su signo es el opuesto al área sombreada.
          </p>
        )}
      </div>
    </div>
  );
}
