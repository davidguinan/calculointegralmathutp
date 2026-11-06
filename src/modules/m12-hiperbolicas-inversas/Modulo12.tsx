import { Card, Section } from "@/components/site/ModulePage";
import { Example } from "@/components/math/Example";
import { Quiz } from "@/components/math/Quiz";
import { Tex, TexBlock } from "@/components/math/Tex";
import { IntegralLab, n, type LabCase } from "@/modules/labs/IntegralLab";

const A = { name: "a", label: "Constante a", min: 0.5, max: 3, step: 0.25, value: 1 };

const CASES: LabCase[] = [
  {
    id: "asinh",
    label: "∫ 1/√(x² + a²) dx → arcsenh",
    params: [A],
    f: (x, [a]) => 1 / Math.sqrt(x * x + a! * a!),
    F: (x, [a]) => Math.asinh(x / a!),
    tex: ([a]) => `\\dfrac{1}{\\sqrt{x^2 + ${n(a! * a!)}}}`,
    texF: ([a]) => `\\operatorname{arcsenh}\\dfrac{x}{${n(a!)}}`,
    texStep: ([a]) =>
      `\\operatorname{arcsenh}\\tfrac{x}{a} = \\ln\\!\\left(x+\\sqrt{x^2+${n(a! * a!)}}\\right) - \\ln ${n(a!)}`,
    domain: () => [-6, 6],
    suggested: () => [0, 2],
  },
  {
    id: "acosh",
    label: "∫ 1/√(x² − a²) dx → arccosh",
    params: [A],
    f: (x, [a]) => 1 / Math.sqrt(x * x - a! * a!),
    F: (x, [a]) => Math.acosh(x / a!),
    tex: ([a]) => `\\dfrac{1}{\\sqrt{x^2 - ${n(a! * a!)}}}`,
    texF: ([a]) => `\\operatorname{arccosh}\\dfrac{x}{${n(a!)}}`,
    texStep: () =>
      "\\operatorname{arccosh}\\tfrac{x}{a} = \\ln\\!\\left(x+\\sqrt{x^2-a^2}\\right) - \\ln a,\\; x>a",
    domain: ([a]) => [1.02 * a!, a! + 6],
    suggested: ([a]) => [1.5 * a!, 3 * a!],
  },
  {
    id: "atanh",
    label: "∫ 1/(a² − x²) dx → arctanh",
    params: [A],
    f: (x, [a]) => 1 / (a! * a! - x * x),
    F: (x, [a]) => Math.atanh(x / a!) / a!,
    tex: ([a]) => `\\dfrac{1}{${n(a! * a!)} - x^2}`,
    texF: ([a]) => `\\dfrac{1}{${n(a!)}}\\operatorname{arctanh}\\dfrac{x}{${n(a!)}}`,
    texStep: () =>
      "\\tfrac1a\\operatorname{arctanh}\\tfrac{x}{a} = \\tfrac{1}{2a}\\ln\\left|\\tfrac{a+x}{a-x}\\right|,\\; |x|<a",
    domain: ([a]) => [-0.95 * a!, 0.95 * a!],
    suggested: ([a]) => [0, 0.6 * a!],
  },
  {
    id: "asech",
    label: "∫ 1/(x√(a² − x²)) dx → arcsech",
    params: [A],
    f: (x, [a]) => 1 / (x * Math.sqrt(a! * a! - x * x)),
    F: (x, [a]) => {
      const z = x / a!;
      return -Math.log((1 + Math.sqrt(1 - z * z)) / z) / a!;
    },
    tex: ([a]) => `\\dfrac{1}{x\\sqrt{${n(a! * a!)} - x^2}}`,
    texF: ([a]) => `-\\dfrac{1}{${n(a!)}}\\operatorname{arcsech}\\dfrac{x}{${n(a!)}}`,
    texStep: () => "\\operatorname{arcsech} z = \\ln\\dfrac{1+\\sqrt{1-z^2}}{z},\\; 0<z<1",
    domain: ([a]) => [0.08 * a!, 0.95 * a!],
    suggested: ([a]) => [0.3 * a!, 0.8 * a!],
  },
  {
    id: "acsch",
    label: "∫ 1/(x√(a² + x²)) dx → arccsch",
    params: [A],
    f: (x, [a]) => 1 / (x * Math.sqrt(a! * a! + x * x)),
    F: (x, [a]) => -Math.asinh(a! / x) / a!,
    tex: ([a]) => `\\dfrac{1}{x\\sqrt{${n(a! * a!)} + x^2}}`,
    texF: ([a]) => `-\\dfrac{1}{${n(a!)}}\\operatorname{arccsch}\\dfrac{x}{${n(a!)}}`,
    texStep: () => "\\operatorname{arccsch} z = \\operatorname{arcsenh}\\tfrac1z,\\; x>0",
    domain: ([a]) => [0.15 * a!, 6],
    suggested: ([a]) => [0.5 * a!, 2 * a!],
  },
];

export function Modulo12() {
  return (
    <>
      <Section title="Funciones hiperbólicas y sus inversas" eyebrow="Teoría">
        <p>
          Las funciones hiperbólicas se definen con exponenciales y cumplen{" "}
          <Tex>{"\\cosh^2x - \\sinh^2x = 1"}</Tex> (análoga a la identidad pitagórica):
        </p>
        <TexBlock boxed>
          {
            "\\sinh x = \\frac{e^{x}-e^{-x}}{2},\\qquad \\cosh x = \\frac{e^{x}+e^{-x}}{2},\\qquad \\tanh x = \\frac{\\sinh x}{\\cosh x}"
          }
        </TexBlock>
        <p>
          Sus inversas pueden escribirse como logaritmos, por eso estas integrales también tienen
          una “versión logarítmica”:
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <h3 className="font-semibold">Arcoseno hiperbólico</h3>
            <TexBlock>
              {"\\int\\frac{du}{\\sqrt{u^2+a^2}} = \\operatorname{arcsenh}\\frac{u}{a} + C"}
            </TexBlock>
            <TexBlock>{"= \\ln\\left(u+\\sqrt{u^2+a^2}\\right) + C'"}</TexBlock>
          </Card>
          <Card>
            <h3 className="font-semibold">Arcocoseno hiperbólico</h3>
            <TexBlock>
              {"\\int\\frac{du}{\\sqrt{u^2-a^2}} = \\operatorname{arccosh}\\frac{u}{a} + C"}
            </TexBlock>
            <TexBlock>{"= \\ln\\left(u+\\sqrt{u^2-a^2}\\right) + C'"}</TexBlock>
          </Card>
          <Card>
            <h3 className="font-semibold">Arcotangente hiperbólica</h3>
            <TexBlock>
              {"\\int\\frac{du}{a^2-u^2} = \\frac1a\\operatorname{arctanh}\\frac{u}{a} + C"}
            </TexBlock>
            <TexBlock>{"= \\frac{1}{2a}\\ln\\left|\\frac{a+u}{a-u}\\right| + C"}</TexBlock>
          </Card>
        </div>
        <Card>
          <h3 className="font-semibold">Compara con el Módulo 11</h3>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full min-w-[480px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="py-2">Forma</th>
                  <th className="py-2">Trigonométrica inversa</th>
                  <th className="py-2">Hiperbólica inversa</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="py-2">Raíz</td>
                  <td>
                    <Tex>{"\\sqrt{a^2-u^2} \\to \\arcsin"}</Tex>
                  </td>
                  <td>
                    <Tex>
                      {
                        "\\sqrt{u^2\\pm a^2} \\to \\operatorname{arcsenh},\\,\\operatorname{arccosh}"
                      }
                    </Tex>
                  </td>
                </tr>
                <tr>
                  <td className="py-2">Sin raíz</td>
                  <td>
                    <Tex>{"a^2+u^2 \\to \\arctan"}</Tex>
                  </td>
                  <td>
                    <Tex>{"a^2-u^2 \\to \\operatorname{arctanh}"}</Tex>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </Section>

      <Section title="Explora las hiperbólicas inversas" eyebrow="Laboratorio">
        <IntegralLab cases={CASES} />
      </Section>

      <Section title="Ejemplos resueltos" eyebrow="Práctica">
        <Example
          title="Ejemplo 1 — ∫ dx/√(4x² + 9)"
          statement="Suma de cuadrados bajo raíz: arcoseno hiperbólico."
          steps={[
            { label: "Identificar", tex: "u = 2x,\\; du = 2dx,\\qquad a = 3" },
            {
              label: "Sustituir",
              tex: "\\tfrac12\\int\\frac{du}{\\sqrt{u^2+9}} = \\tfrac12\\operatorname{arcsenh}\\frac{u}{3}",
            },
            {
              label: "Forma logarítmica",
              tex: "\\tfrac12\\ln\\left(2x + \\sqrt{4x^2+9}\\right) + C'",
            },
          ]}
          result={
            "\\int\\frac{dx}{\\sqrt{4x^2+9}} = \\frac12\\operatorname{arcsenh}\\frac{2x}{3} + C"
          }
        />
        <Example
          title="Ejemplo 2 — ∫₀^{1/2} dx/(1 − x²)"
          statement="Diferencia a² − u² sin raíz: arcotangente hiperbólica."
          steps={[
            {
              label: "Antiderivada",
              tex: "\\operatorname{arctanh}x = \\tfrac12\\ln\\frac{1+x}{1-x}",
            },
            { label: "Evaluar", tex: "\\tfrac12\\ln\\frac{3/2}{1/2} - 0 = \\tfrac12\\ln 3" },
          ]}
          result={"\\int_0^{1/2}\\frac{dx}{1-x^2} = \\frac{\\ln 3}{2} \\approx 0.5493"}
        />
        <Example
          title="Ejemplo 3 — ∫₂⁴ dx/√(x² − 4)"
          statement="Diferencia u² − a² bajo raíz: arcocoseno hiperbólico."
          steps={[
            {
              label: "Antiderivada",
              tex: "\\operatorname{arccosh}\\frac{x}{2} = \\ln\\left(x + \\sqrt{x^2-4}\\right) - \\ln 2",
            },
            {
              label: "Evaluar",
              tex: "\\ln\\left(4+\\sqrt{12}\\right) - \\ln 2 = \\ln\\left(2+\\sqrt3\\right)",
            },
          ]}
          result={"\\int_2^4\\frac{dx}{\\sqrt{x^2-4}} = \\ln(2+\\sqrt3) \\approx 1.3170"}
        />
      </Section>

      <Section title="Ponte a prueba" eyebrow="Autoevaluación">
        <Quiz
          questions={[
            {
              prompt: "Calcula:",
              tex: "\\int\\frac{dx}{\\sqrt{x^2+16}}",
              options: [
                "\\operatorname{arcsenh}\\frac{x}{4} + C",
                "\\frac14\\arctan\\frac{x}{4} + C",
                "\\arcsin\\frac{x}{4} + C",
                "\\operatorname{arccosh}\\frac{x}{4} + C",
              ],
              answer: 0,
              explain: "Suma de cuadrados dentro de la raíz ⇒ arcsenh.",
            },
            {
              prompt: "¿A qué es igual arcsenh x?",
              options: [
                "\\ln(x + \\sqrt{x^2-1})",
                "\\ln(x + \\sqrt{x^2+1})",
                "\\tfrac12\\ln\\frac{1+x}{1-x}",
                "e^{x} - e^{-x}",
              ],
              answer: 1,
              explain: "Despejando x = sinh y se obtiene y = ln(x + √(x² + 1)).",
            },
            {
              prompt: "Calcula:",
              tex: "\\int\\frac{dx}{9-x^2},\\; |x|<3",
              options: [
                "\\frac13\\operatorname{arctanh}\\frac{x}{3} + C",
                "\\frac13\\arctan\\frac{x}{3} + C",
                "\\arcsin\\frac{x}{3} + C",
                "\\ln|9-x^2| + C",
              ],
              answer: 0,
              explain: "a² − u² sin raíz: (1/a) arctanh(u/a), equivalente a (1/6) ln|(3+x)/(3−x)|.",
            },
            {
              prompt: "¿Cuál es la identidad fundamental hiperbólica?",
              options: [
                "\\sinh^2x + \\cosh^2x = 1",
                "\\cosh^2x - \\sinh^2x = 1",
                "\\sinh^2x - \\cosh^2x = 1",
                "\\tanh^2x + 1 = \\cosh^2 x",
              ],
              answer: 1,
              explain: "Se comprueba directamente con las definiciones exponenciales.",
            },
          ]}
        />
      </Section>
    </>
  );
}
