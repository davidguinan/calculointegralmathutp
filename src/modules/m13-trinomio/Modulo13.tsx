import { Card, Section } from "@/components/site/ModulePage";
import { Example } from "@/components/math/Example";
import { Quiz } from "@/components/math/Quiz";
import { Tex, TexBlock } from "@/components/math/Tex";
import { IntegralLab, n, sg, type LabCase } from "@/modules/labs/IntegralLab";

/** Polinomio ax² + bx + c en LaTeX */
function poly(a: number, b: number, c: number) {
  const lead = a === 1 ? "x^2" : a === -1 ? "-x^2" : `${n(a)}x^2`;
  const mid = b === 0 ? "" : ` ${b < 0 ? "-" : "+"} ${Math.abs(b) === 1 ? "" : n(Math.abs(b))}x`;
  const end = c === 0 ? "" : ` ${sg(c)}`;
  return `${lead}${mid}${end}`;
}

const disc = (a: number, b: number, c: number) => 4 * a * c - b * b;
const EPS = 1e-9;

/** Dominio donde ax² + bx + c > 0 (a > 0) y no hay singularidades */
function safeDomain(a: number, b: number, c: number): [number, number] {
  const h = -b / (2 * a);
  const D = disc(a, b, c);
  if (D > EPS) return [h - 4, h + 4];
  const r2 = h + Math.sqrt(Math.max(-D, 0)) / (2 * a);
  return [r2 + 0.15, r2 + 5];
}

function squareStep(a: number, b: number, c: number) {
  const h = b / (2 * a);
  const k = disc(a, b, c) / (4 * a * a);
  const inner = `\\left(x ${h === 0 ? "" : sg(h)}\\right)^2 ${Math.abs(k) < EPS ? "" : sg(k)}`;
  return `${poly(a, b, c)} = ${a === 1 ? "" : n(a)}\\left[${inner}\\right]`;
}

const ABC = [
  { name: "a", label: "a (coef. de x²)", min: 0.5, max: 3, step: 0.5, value: 1 },
  { name: "b", label: "b (coef. de x)", min: -6, max: 6, step: 1, value: 2 },
  { name: "c", label: "c (término independiente)", min: -6, max: 8, step: 1, value: 5 },
];

const CASES: LabCase[] = [
  {
    id: "recip",
    label: "∫ dx / (ax² + bx + c)",
    params: ABC,
    f: (x, [a, b, c]) => 1 / (a! * x * x + b! * x + c!),
    F: (x, [a, b, c]) => {
      const D = disc(a!, b!, c!);
      const t = 2 * a! * x + b!;
      if (D > EPS) return (2 / Math.sqrt(D)) * Math.atan(t / Math.sqrt(D));
      if (D < -EPS) {
        const s = Math.sqrt(-D);
        return Math.log(Math.abs((t - s) / (t + s))) / s;
      }
      return -2 / t;
    },
    tex: ([a, b, c]) => `\\dfrac{1}{${poly(a!, b!, c!)}}`,
    texF: ([a, b, c]) => {
      const D = disc(a!, b!, c!);
      const t = `${n(2 * a!)}x ${b === 0 ? "" : sg(b!)}`;
      if (D > EPS) {
        return `\\dfrac{2}{\\sqrt{${n(D)}}}\\arctan\\dfrac{${t}}{\\sqrt{${n(D)}}}`;
      }
      if (D < -EPS) {
        return `\\dfrac{1}{\\sqrt{${n(-D)}}}\\ln\\left|\\dfrac{${t} - \\sqrt{${n(-D)}}}{${t} + \\sqrt{${n(-D)}}}\\right|`;
      }
      return `-\\dfrac{2}{${t}}`;
    },
    texStep: ([a, b, c]) => {
      const D = disc(a!, b!, c!);
      const kind =
        D > EPS
          ? "\\Delta' = 4ac-b^2 > 0 \\Rightarrow \\arctan"
          : D < -EPS
            ? "\\Delta' = 4ac - b^2 < 0 \\Rightarrow \\ln"
            : "\\Delta' = 0 \\Rightarrow \\text{potencia}";
      return `${squareStep(a!, b!, c!)},\\quad ${kind}`;
    },
    domain: ([a, b, c]) => safeDomain(a!, b!, c!),
    suggested: ([a, b, c]) => {
      const [d0, d1] = safeDomain(a!, b!, c!);
      return [d0 + (d1 - d0) * 0.3, d0 + (d1 - d0) * 0.7];
    },
    note: "Cambia b y c: según el signo de 4ac − b² el resultado es un arcotangente (sin raíces reales), un logaritmo (dos raíces) o una potencia (raíz doble). Si hay raíces, el gráfico se muestra a la derecha de la mayor.",
  },
  {
    id: "sqrt",
    label: "∫ dx / √(ax² + bx + c)",
    params: ABC,
    f: (x, [a, b, c]) => 1 / Math.sqrt(a! * x * x + b! * x + c!),
    F: (x, [a, b, c]) => {
      const Q = a! * x * x + b! * x + c!;
      return Math.log(Math.abs(2 * a! * x + b! + 2 * Math.sqrt(a!) * Math.sqrt(Q))) / Math.sqrt(a!);
    },
    tex: ([a, b, c]) => `\\dfrac{1}{\\sqrt{${poly(a!, b!, c!)}}}`,
    texF: ([a, b, c]) =>
      `\\dfrac{1}{\\sqrt{${n(a!)}}}\\ln\\left|${n(2 * a!)}x ${b === 0 ? "" : sg(b!)} + 2\\sqrt{${n(a!)}}\\sqrt{${poly(a!, b!, c!)}}\\right|`,
    texStep: ([a, b, c]) =>
      `${squareStep(a!, b!, c!)}\\;\\Rightarrow\\; \\operatorname{arcsenh}\\text{ o }\\operatorname{arccosh}`,
    domain: ([a, b, c]) => safeDomain(a!, b!, c!),
    suggested: ([a, b, c]) => {
      const [d0, d1] = safeDomain(a!, b!, c!);
      return [d0 + (d1 - d0) * 0.3, d0 + (d1 - d0) * 0.7];
    },
  },
  {
    id: "asin",
    label: "∫ dx / √(c + bx − x²)",
    params: [
      { name: "b", label: "b (coef. de x)", min: -4, max: 4, step: 1, value: 2 },
      { name: "c", label: "c (término independiente)", min: 1, max: 8, step: 1, value: 3 },
    ],
    f: (x, [b, c]) => 1 / Math.sqrt(c! + b! * x - x * x),
    F: (x, [b, c]) => {
      const h = b! / 2;
      const r = Math.sqrt(c! + h * h);
      return Math.asin((x - h) / r);
    },
    tex: ([b, c]) =>
      `\\dfrac{1}{\\sqrt{${n(c!)} ${b === 0 ? "" : `${b! < 0 ? "-" : "+"} ${Math.abs(b!) === 1 ? "" : n(Math.abs(b!))}x`} - x^2}}`,
    texF: ([b, c]) => {
      const h = b! / 2;
      const r2 = c! + h * h;
      return `\\arcsin\\dfrac{x ${h === 0 ? "" : sg(-h)}}{\\sqrt{${n(r2)}}}`;
    },
    texStep: ([b, c]) => {
      const h = b! / 2;
      const r2 = c! + h * h;
      return `c + bx - x^2 = ${n(r2)} - \\left(x ${h === 0 ? "" : sg(-h)}\\right)^2`;
    },
    domain: ([b, c]) => {
      const h = b! / 2;
      const r = Math.sqrt(c! + h * h);
      return [h - 0.96 * r, h + 0.96 * r];
    },
    suggested: ([b, c]) => {
      const h = b! / 2;
      const r = Math.sqrt(c! + h * h);
      return [h - 0.5 * r, h + 0.5 * r];
    },
  },
];

export function Modulo13() {
  return (
    <>
      <Section title="Completar el cuadrado" eyebrow="Teoría">
        <p>
          Cuando en el integrando aparece un trinomio <Tex>{"ax^2+bx+c"}</Tex> que no se factoriza
          fácilmente, se <strong>completa el cuadrado</strong> para convertirlo en una suma o
          diferencia de cuadrados, y así usar las fórmulas de los módulos 9, 11 y 12.
        </p>
        <TexBlock boxed>
          {"ax^2+bx+c = a\\left[\\left(x+\\frac{b}{2a}\\right)^2 + \\frac{4ac-b^2}{4a^2}\\right]"}
        </TexBlock>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <h3 className="font-semibold">
              <Tex>{"4ac-b^2>0"}</Tex>
            </h3>
            <p className="text-sm text-muted-foreground">Sin raíces reales: suma de cuadrados.</p>
            <TexBlock>{"\\int\\frac{dx}{(x-h)^2+k^2} = \\tfrac1k\\arctan\\tfrac{x-h}{k}"}</TexBlock>
          </Card>
          <Card>
            <h3 className="font-semibold">
              <Tex>{"4ac-b^2<0"}</Tex>
            </h3>
            <p className="text-sm text-muted-foreground">
              Dos raíces reales: diferencia de cuadrados.
            </p>
            <TexBlock>
              {
                "\\int\\frac{dx}{(x-h)^2-k^2} = \\tfrac{1}{2k}\\ln\\left|\\tfrac{x-h-k}{x-h+k}\\right|"
              }
            </TexBlock>
          </Card>
          <Card>
            <h3 className="font-semibold">
              <Tex>{"4ac-b^2=0"}</Tex>
            </h3>
            <p className="text-sm text-muted-foreground">Raíz doble: cuadrado perfecto.</p>
            <TexBlock>{"\\int\\frac{dx}{(x-h)^2} = -\\frac{1}{x-h}"}</TexBlock>
          </Card>
        </div>
        <Card>
          <h3 className="font-semibold">Numerador lineal</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Si el numerador es <Tex>{"px+q"}</Tex>, primero se fabrica la derivada del denominador y
            se separa en una parte logarítmica y otra de arcotangente:
          </p>
          <TexBlock>
            {
              "\\int\\frac{px+q}{ax^2+bx+c}dx = \\frac{p}{2a}\\int\\frac{2ax+b}{ax^2+bx+c}dx + \\left(q-\\frac{pb}{2a}\\right)\\int\\frac{dx}{ax^2+bx+c}"
            }
          </TexBlock>
        </Card>
      </Section>

      <Section title="Mueve a, b y c" eyebrow="Laboratorio">
        <IntegralLab cases={CASES} />
      </Section>

      <Section title="Ejemplos resueltos" eyebrow="Práctica">
        <Example
          title="Ejemplo 1 — ∫ dx/(x² + 4x + 13)"
          statement="4ac − b² = 52 − 16 = 36 > 0: arcotangente."
          steps={[
            { label: "Completar el cuadrado", tex: "x^2+4x+13 = (x+2)^2 + 9" },
            {
              label: "Sustituir u = x + 2",
              tex: "\\int\\frac{du}{u^2+3^2} = \\frac13\\arctan\\frac{u}{3}",
            },
          ]}
          result={"\\int\\frac{dx}{x^2+4x+13} = \\frac13\\arctan\\frac{x+2}{3} + C"}
        />
        <Example
          title="Ejemplo 2 — ∫ dx/(x² − 6x + 5)"
          statement="4ac − b² = 20 − 36 = −16 < 0: logaritmo."
          steps={[
            { label: "Completar el cuadrado", tex: "x^2-6x+5 = (x-3)^2 - 4" },
            {
              label: "Fórmula con k = 2",
              tex: "\\frac{1}{2\\cdot2}\\ln\\left|\\frac{x-3-2}{x-3+2}\\right|",
            },
          ]}
          result={"\\int\\frac{dx}{x^2-6x+5} = \\frac14\\ln\\left|\\frac{x-5}{x-1}\\right| + C"}
        />
        <Example
          title="Ejemplo 3 — ∫ (3x + 1)/(x² + 2x + 5) dx"
          statement="Numerador lineal: separar en logaritmo + arcotangente."
          steps={[
            { label: "Fabricar la derivada 2x + 2", tex: "3x+1 = \\tfrac32(2x+2) - 2" },
            {
              label: "Separar",
              tex: "\\tfrac32\\int\\frac{2x+2}{x^2+2x+5}dx - 2\\int\\frac{dx}{(x+1)^2+4}",
            },
            {
              label: "Integrar cada parte",
              tex: "\\tfrac32\\ln(x^2+2x+5) - 2\\cdot\\tfrac12\\arctan\\frac{x+1}{2}",
            },
          ]}
          result={
            "\\int\\frac{3x+1}{x^2+2x+5}dx = \\frac32\\ln(x^2+2x+5) - \\arctan\\frac{x+1}{2} + C"
          }
        />
        <Example
          title="Ejemplo 4 — ∫ dx/√(3 + 2x − x²)"
          statement="Coeficiente de x² negativo bajo la raíz: arcoseno."
          steps={[
            { label: "Completar el cuadrado", tex: "3+2x-x^2 = 4 - (x-1)^2" },
            {
              label: "Fórmula del arcoseno con a = 2",
              tex: "\\int\\frac{du}{\\sqrt{4-u^2}} = \\arcsin\\frac{u}{2},\\; u = x-1",
            },
          ]}
          result={"\\int\\frac{dx}{\\sqrt{3+2x-x^2}} = \\arcsin\\frac{x-1}{2} + C"}
        />
      </Section>

      <Section title="Ponte a prueba" eyebrow="Autoevaluación">
        <Quiz
          questions={[
            {
              prompt: "Completa el cuadrado:",
              tex: "x^2 - 8x + 20",
              options: ["(x-4)^2 + 4", "(x-8)^2 + 20", "(x+4)^2 + 4", "(x-4)^2 - 4"],
              answer: 0,
              explain: "(x − 4)² = x² − 8x + 16, y 20 − 16 = 4.",
            },
            {
              prompt: "¿Qué tipo de resultado da?",
              tex: "\\int\\frac{dx}{x^2+2x+10}",
              options: [
                "\\text{logaritmo}",
                "\\text{arcotangente}",
                "\\text{arcoseno}",
                "\\text{potencia}",
              ],
              answer: 1,
              explain: "4ac − b² = 40 − 4 = 36 > 0 ⇒ (x + 1)² + 9 ⇒ (1/3) arctan((x+1)/3).",
            },
            {
              prompt: "Calcula:",
              tex: "\\int\\frac{dx}{x^2+2x+1}",
              options: [
                "\\arctan(x+1) + C",
                "\\ln|x+1| + C",
                "-\\frac{1}{x+1} + C",
                "\\frac{(x+1)^3}{3} + C",
              ],
              answer: 2,
              explain: "Es un cuadrado perfecto: ∫(x + 1)⁻²dx = −(x + 1)⁻¹ + C.",
            },
            {
              prompt: "En ∫(2x + 5)/(x² + 4x + 8) dx, ¿cómo se reescribe el numerador?",
              options: ["(2x+4) + 1", "2(x+5)", "(2x+4) + 5", "2x + 4 - 1"],
              answer: 0,
              explain:
                "La derivada del denominador es 2x + 4; sobra 1, que va a la parte de arcotangente.",
            },
          ]}
        />
      </Section>
    </>
  );
}
