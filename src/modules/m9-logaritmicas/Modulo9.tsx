import { Card, Section } from "@/components/site/ModulePage";
import { Example } from "@/components/math/Example";
import { Quiz } from "@/components/math/Quiz";
import { Tex, TexBlock } from "@/components/math/Tex";
import { IntegralLab, n, sg, type LabCase } from "@/modules/labs/IntegralLab";

const CASES: LabCase[] = [
  {
    id: "kxc",
    label: "∫ k/(x + c) dx",
    params: [
      { name: "k", label: "Numerador k", min: -3, max: 3, step: 0.5, value: 1 },
      { name: "c", label: "Desplazamiento c", min: -2, max: 2, step: 0.5, value: 0 },
    ],
    f: (x, [k, c]) => k! / (x + c!),
    F: (x, [k, c]) => k! * Math.log(Math.abs(x + c!)),
    tex: ([k, c]) => (c === 0 ? `\\dfrac{${n(k!)}}{x}` : `\\dfrac{${n(k!)}}{x ${sg(c!)}}`),
    texF: ([k, c]) => `${n(k!)}\\ln\\left|x ${c === 0 ? "" : sg(c!)}\\right|`,
    domain: ([, c]) => [-c! + 0.2, -c! + 6],
    suggested: ([, c]) => [-c! + 1, -c! + 4],
    note: "El dominio se muestra a la derecha de la asíntota x = −c, donde la función es continua.",
  },
  {
    id: "fpf",
    label: "∫ (2x + 3)/(x² + 3x + 5) dx",
    f: (x) => (2 * x + 3) / (x * x + 3 * x + 5),
    F: (x) => Math.log(x * x + 3 * x + 5),
    tex: () => "\\dfrac{2x+3}{x^2+3x+5}",
    texF: () => "\\ln(x^2+3x+5)",
    texStep: () => "\\text{numerador} = \\tfrac{d}{dx}(\\text{denominador})",
    domain: () => [-5, 4],
    suggested: () => [0, 2],
  },
  {
    id: "tan",
    label: "∫ tan x dx",
    f: (x) => Math.tan(x),
    F: (x) => -Math.log(Math.abs(Math.cos(x))),
    tex: () => "\\tan x",
    texF: () => "-\\ln|\\cos x|",
    texStep: () => "\\tan x = \\dfrac{\\sin x}{\\cos x},\\; u = \\cos x",
    domain: () => [-1.4, 1.4],
    suggested: () => [0, Math.PI / 4],
  },
  {
    id: "cot",
    label: "∫ cot x dx",
    f: (x) => Math.cos(x) / Math.sin(x),
    F: (x) => Math.log(Math.abs(Math.sin(x))),
    tex: () => "\\cot x",
    texF: () => "\\ln|\\sin x|",
    texStep: () => "u = \\sin x,\\; du = \\cos x\\,dx",
    domain: () => [0.2, 2.9],
    suggested: () => [Math.PI / 6, Math.PI / 2],
  },
  {
    id: "sec",
    label: "∫ sec x dx",
    f: (x) => 1 / Math.cos(x),
    F: (x) => Math.log(Math.abs(1 / Math.cos(x) + Math.tan(x))),
    tex: () => "\\sec x",
    texF: () => "\\ln|\\sec x + \\tan x|",
    texStep: () => "\\text{multiplicar por } \\dfrac{\\sec x+\\tan x}{\\sec x+\\tan x}",
    domain: () => [-1.3, 1.3],
    suggested: () => [0, Math.PI / 4],
  },
  {
    id: "xlnx",
    label: "∫ 1/(x ln x) dx",
    f: (x) => 1 / (x * Math.log(x)),
    F: (x) => Math.log(Math.abs(Math.log(x))),
    tex: () => "\\dfrac{1}{x\\ln x}",
    texF: () => "\\ln|\\ln x|",
    texStep: () => "u = \\ln x,\\; du = \\tfrac{dx}{x}",
    domain: () => [1.15, 8],
    suggested: () => [Math.E, 6],
  },
];

export function Modulo9() {
  return (
    <>
      <Section title="El caso n = −1" eyebrow="Teoría">
        <p>
          La regla de la potencia falla para <Tex>{"n=-1"}</Tex> porque dividiría por cero. Ese
          hueco lo llena el logaritmo natural, ya que <Tex>{"\\frac{d}{dx}\\ln|x| = \\frac1x"}</Tex>{" "}
          para todo <Tex>{"x\\neq0"}</Tex>.
        </p>
        <TexBlock boxed>
          {
            "\\int \\frac{du}{u} = \\ln|u| + C \\qquad\\Longrightarrow\\qquad \\int \\frac{g'(x)}{g(x)}\\,dx = \\ln|g(x)| + C"
          }
        </TexBlock>
        <p>
          Regla práctica:{" "}
          <strong>si el numerador es (un múltiplo de) la derivada del denominador</strong>, el
          resultado es un logaritmo. El valor absoluto es indispensable porque <Tex>{"\\ln"}</Tex>{" "}
          solo está definido para positivos.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            ["\\int \\tan x\\,dx", "-\\ln|\\cos x| + C = \\ln|\\sec x| + C"],
            ["\\int \\cot x\\,dx", "\\ln|\\sin x| + C"],
            ["\\int \\sec x\\,dx", "\\ln|\\sec x + \\tan x| + C"],
            ["\\int \\csc x\\,dx", "\\ln|\\csc x - \\cot x| + C"],
          ].map(([l, r]) => (
            <div
              key={l}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-card px-4 py-3"
            >
              <Tex>{l!}</Tex>
              <Tex>{`= ${r}`}</Tex>
            </div>
          ))}
        </div>
        <Card>
          <h3 className="font-semibold">Cuando el grado del numerador es mayor o igual</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Primero se hace la división de polinomios y luego se integra cada parte:
          </p>
          <TexBlock>{"\\frac{x^2+1}{x-1} = x + 1 + \\frac{2}{x-1}"}</TexBlock>
        </Card>
      </Section>

      <Section title="Integrales que dan logaritmos" eyebrow="Laboratorio">
        <IntegralLab cases={CASES} />
      </Section>

      <Section title="Ejemplos resueltos" eyebrow="Práctica">
        <Example
          title="Ejemplo 1 — ∫ x²/(x³ + 4) dx"
          statement="La derivada del denominador es 3x²."
          steps={[
            { label: "Sustitución", tex: "u = x^3+4,\\quad x^2dx = \\tfrac13du" },
            { label: "Integrar", tex: "\\tfrac13\\int\\frac{du}{u} = \\tfrac13\\ln|u|" },
          ]}
          result={"\\int\\frac{x^2}{x^3+4}dx = \\frac13\\ln|x^3+4| + C"}
        />
        <Example
          title="Ejemplo 2 — ∫ (x² + 1)/(x − 1) dx"
          statement="Grado del numerador ≥ grado del denominador: dividir primero."
          steps={[
            { label: "División", tex: "\\frac{x^2+1}{x-1} = x + 1 + \\frac{2}{x-1}" },
            { label: "Integrar término a término", tex: "\\frac{x^2}{2} + x + 2\\ln|x-1|" },
          ]}
          result={"\\int\\frac{x^2+1}{x-1}dx = \\frac{x^2}{2} + x + 2\\ln|x-1| + C"}
        />
        <Example
          title="Ejemplo 3 — ∫₁^e (ln x)/x dx"
          statement="Aquí ln x no está en el denominador: es potencia generalizada."
          steps={[
            {
              label: "Sustitución",
              tex: "u = \\ln x,\\quad du = \\tfrac{dx}{x};\\quad x=1\\Rightarrow u=0,\\; x=e\\Rightarrow u=1",
            },
            { label: "Integrar", tex: "\\int_0^1 u\\,du = \\left[\\tfrac{u^2}{2}\\right]_0^1" },
          ]}
          result={"\\int_1^e\\frac{\\ln x}{x}dx = \\frac12"}
        />
      </Section>

      <Section title="Ponte a prueba" eyebrow="Autoevaluación">
        <Quiz
          questions={[
            {
              prompt: "Calcula:",
              tex: "\\int \\frac{5}{x}\\,dx",
              options: [
                "5\\ln|x| + C",
                "\\ln|5x| + C",
                "-\\frac{5}{x^2} + C",
                "\\frac{5x^0}{0} + C",
              ],
              answer: 0,
              explain: "La constante sale de la integral: 5∫dx/x = 5 ln|x| + C.",
            },
            {
              prompt: "Calcula:",
              tex: "\\int \\frac{2x}{x^2+7}\\,dx",
              options: [
                "2\\ln|x^2+7| + C",
                "\\ln(x^2+7) + C",
                "\\frac{1}{x^2+7} + C",
                "\\arctan\\frac{x}{7} + C",
              ],
              answer: 1,
              explain: "El numerador 2x es exactamente la derivada del denominador.",
            },
            {
              prompt: "Calcula:",
              tex: "\\int \\frac{dx}{3x+2}",
              options: [
                "\\ln|3x+2| + C",
                "3\\ln|3x+2| + C",
                "\\tfrac13\\ln|3x+2| + C",
                "\\frac{-3}{(3x+2)^2} + C",
              ],
              answer: 2,
              explain: "u = 3x + 2, du = 3dx ⇒ (1/3)∫du/u.",
            },
            {
              prompt: "¿Cuánto vale?",
              tex: "\\int_1^{e^2}\\frac{dx}{x}",
              options: ["1", "2", "e^2", "e^2 - 1"],
              answer: 1,
              explain: "ln(e²) − ln 1 = 2 − 0 = 2.",
            },
          ]}
        />
      </Section>
    </>
  );
}
