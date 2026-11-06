import { Card, Section } from "@/components/site/ModulePage";
import { Example } from "@/components/math/Example";
import { Quiz } from "@/components/math/Quiz";
import { Tex, TexBlock } from "@/components/math/Tex";
import { IntegralLab, n, type LabCase } from "@/modules/labs/IntegralLab";

const A = { name: "a", label: "Constante a", min: 0.5, max: 3, step: 0.25, value: 1 };

const CASES: LabCase[] = [
  {
    id: "asin",
    label: "∫ 1/√(a² − x²) dx → arcsen",
    params: [A],
    f: (x, [a]) => 1 / Math.sqrt(a! * a! - x * x),
    F: (x, [a]) => Math.asin(x / a!),
    tex: ([a]) => `\\dfrac{1}{\\sqrt{${n(a! * a!)} - x^2}}`,
    texF: ([a]) => `\\arcsin\\dfrac{x}{${n(a!)}}`,
    texStep: () => "x = a\\sin\\theta \\;\\Rightarrow\\; \\sqrt{a^2-x^2} = a\\cos\\theta",
    domain: ([a]) => [-0.97 * a!, 0.97 * a!],
    suggested: ([a]) => [0, 0.5 * a!],
    note: "El integrando solo existe para |x| < a: la gráfica se corta antes de las asíntotas verticales.",
  },
  {
    id: "atan",
    label: "∫ 1/(a² + x²) dx → arctan",
    params: [A],
    f: (x, [a]) => 1 / (a! * a! + x * x),
    F: (x, [a]) => Math.atan(x / a!) / a!,
    tex: ([a]) => `\\dfrac{1}{${n(a! * a!)} + x^2}`,
    texF: ([a]) => `\\dfrac{1}{${n(a!)}}\\arctan\\dfrac{x}{${n(a!)}}`,
    texStep: () => "x = a\\tan\\theta \\;\\Rightarrow\\; a^2+x^2 = a^2\\sec^2\\theta",
    domain: () => [-6, 6],
    suggested: ([a]) => [0, a!],
    note: "Aunque el dominio sea infinito, el área total es finita: ∫ de −∞ a ∞ vale π/a.",
  },
  {
    id: "asec",
    label: "∫ 1/(x√(x² − a²)) dx → arcsec",
    params: [A],
    f: (x, [a]) => 1 / (x * Math.sqrt(x * x - a! * a!)),
    F: (x, [a]) => Math.acos(a! / x) / a!,
    tex: ([a]) => `\\dfrac{1}{x\\sqrt{x^2 - ${n(a! * a!)}}}`,
    texF: ([a]) => `\\dfrac{1}{${n(a!)}}\\operatorname{arcsec}\\dfrac{x}{${n(a!)}}`,
    texStep: () => "\\operatorname{arcsec} z = \\arccos\\tfrac{1}{z}",
    domain: ([a]) => [1.03 * a!, a! + 6],
    suggested: ([a]) => [1.5 * a!, 2 * a!],
  },
  {
    id: "atanlin",
    label: "∫ 1/(1 + 4x²) dx",
    f: (x) => 1 / (1 + 4 * x * x),
    F: (x) => Math.atan(2 * x) / 2,
    tex: () => "\\dfrac{1}{1+4x^2}",
    texF: () => "\\tfrac12\\arctan(2x)",
    texStep: () => "u = 2x,\\; du = 2\\,dx",
    domain: () => [-3, 3],
    suggested: () => [0, 0.5],
  },
  {
    id: "asinexp",
    label: "∫ eˣ/√(1 − e^{2x}) dx",
    f: (x) => Math.exp(x) / Math.sqrt(1 - Math.exp(2 * x)),
    F: (x) => Math.asin(Math.exp(x)),
    tex: () => "\\dfrac{e^{x}}{\\sqrt{1-e^{2x}}}",
    texF: () => "\\arcsin(e^{x})",
    texStep: () => "u = e^{x},\\; du = e^{x}dx",
    domain: () => [-3, -0.05],
    suggested: () => [-2, -0.7],
  },
];

export function Modulo11() {
  return (
    <>
      <Section title="Integrales que producen ángulos" eyebrow="Teoría">
        <p>
          Las derivadas de las funciones trigonométricas inversas son algebraicas. Al leerlas al
          revés obtenemos tres fórmulas fundamentales, válidas para <Tex>{"a>0"}</Tex>:
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <h3 className="font-semibold">Arcoseno</h3>
            <TexBlock>{"\\int\\frac{du}{\\sqrt{a^2-u^2}} = \\arcsin\\frac{u}{a} + C"}</TexBlock>
            <p className="text-xs text-muted-foreground">
              Dominio: <Tex>{"|u|<a"}</Tex>
            </p>
          </Card>
          <Card>
            <h3 className="font-semibold">Arcotangente</h3>
            <TexBlock>{"\\int\\frac{du}{a^2+u^2} = \\frac1a\\arctan\\frac{u}{a} + C"}</TexBlock>
            <p className="text-xs text-muted-foreground">Dominio: todos los reales</p>
          </Card>
          <Card>
            <h3 className="font-semibold">Arcosecante</h3>
            <TexBlock>
              {
                "\\int\\frac{du}{u\\sqrt{u^2-a^2}} = \\tfrac1a\\operatorname{arcsec}\\tfrac{|u|}{a} + C"
              }
            </TexBlock>
            <p className="text-xs text-muted-foreground">
              Dominio: <Tex>{"|u|>a"}</Tex>
            </p>
          </Card>
        </div>
        <p>
          <strong>Cómo reconocerlas:</strong> busca una suma o diferencia de cuadrados en el
          denominador, <Tex>{"a^2 \\pm u^2"}</Tex>, sin que el numerador sea la derivada del
          denominador (si lo fuera, el resultado sería un logaritmo o una potencia). Si el
          coeficiente de <Tex>{"x^2"}</Tex> no es 1, se escribe <Tex>{"4x^2 = (2x)^2"}</Tex> y se
          toma <Tex>{"u=2x"}</Tex>.
        </p>
      </Section>

      <Section title="Explora el papel de a" eyebrow="Laboratorio">
        <IntegralLab cases={CASES} />
      </Section>

      <Section title="Ejemplos resueltos" eyebrow="Práctica">
        <Example
          title="Ejemplo 1 — ∫ dx/√(9 − 4x²)"
          statement="Diferencia de cuadrados con raíz: arcoseno."
          steps={[
            {
              label: "Identificar",
              tex: "a^2 = 9 \\Rightarrow a = 3,\\qquad u^2 = 4x^2 \\Rightarrow u = 2x,\\; dx = \\tfrac12du",
            },
            {
              label: "Sustituir",
              tex: "\\tfrac12\\int\\frac{du}{\\sqrt{9-u^2}} = \\tfrac12\\arcsin\\frac{u}{3}",
            },
          ]}
          result={"\\int\\frac{dx}{\\sqrt{9-4x^2}} = \\frac12\\arcsin\\frac{2x}{3} + C"}
        />
        <Example
          title="Ejemplo 2 — ∫₀^{√3} dx/(3 + x²)"
          statement="Suma de cuadrados: arcotangente con a = √3."
          steps={[
            { label: "Antiderivada", tex: "\\frac{1}{\\sqrt3}\\arctan\\frac{x}{\\sqrt3}" },
            {
              label: "Evaluar",
              tex: "\\frac{1}{\\sqrt3}\\left(\\arctan 1 - \\arctan 0\\right) = \\frac{1}{\\sqrt3}\\cdot\\frac{\\pi}{4}",
            },
          ]}
          result={"\\int_0^{\\sqrt3}\\frac{dx}{3+x^2} = \\frac{\\pi}{4\\sqrt3} \\approx 0.4534"}
        />
        <Example
          title="Ejemplo 3 — ∫ x/(1 + x⁴) dx"
          statement="Oculto: x⁴ = (x²)² y x dx es casi d(x²)."
          steps={[
            { label: "Sustitución", tex: "u = x^2,\\quad du = 2x\\,dx" },
            { label: "Reescribir", tex: "\\tfrac12\\int\\frac{du}{1+u^2} = \\tfrac12\\arctan u" },
          ]}
          result={"\\int\\frac{x}{1+x^4}dx = \\frac12\\arctan(x^2) + C"}
        />
      </Section>

      <Section title="Ponte a prueba" eyebrow="Autoevaluación">
        <Quiz
          questions={[
            {
              prompt: "Calcula:",
              tex: "\\int\\frac{dx}{16+x^2}",
              options: [
                "\\arctan\\frac{x}{4} + C",
                "\\frac14\\arctan\\frac{x}{4} + C",
                "\\frac{1}{16}\\arctan x + C",
                "\\ln(16+x^2) + C",
              ],
              answer: 1,
              explain: "a = 4 ⇒ (1/a) arctan(x/a).",
            },
            {
              prompt: "Calcula:",
              tex: "\\int\\frac{dx}{\\sqrt{25-x^2}}",
              options: [
                "\\arcsin\\frac{x}{5} + C",
                "\\frac15\\arcsin\\frac{x}{5} + C",
                "\\arccos 5x + C",
                "\\sqrt{25-x^2} + C",
              ],
              answer: 0,
              explain: "En el arcoseno no aparece el factor 1/a.",
            },
            {
              prompt: "¿Qué tipo de resultado da?",
              tex: "\\int\\frac{2x}{1+x^2}dx",
              options: [
                "\\text{arcotangente}",
                "\\text{logaritmo}",
                "\\text{arcoseno}",
                "\\text{potencia}",
              ],
              answer: 1,
              explain:
                "El numerador es la derivada del denominador: ln(1 + x²) + C. ¡Cuidado con la apariencia!",
            },
            {
              prompt: "¿Cuánto vale?",
              tex: "\\int_0^{1}\\frac{dx}{1+x^2}",
              options: ["1", "\\frac{\\pi}{2}", "\\frac{\\pi}{4}", "\\ln 2"],
              answer: 2,
              explain: "arctan 1 − arctan 0 = π/4 ≈ 0.7854.",
            },
          ]}
        />
      </Section>
    </>
  );
}
