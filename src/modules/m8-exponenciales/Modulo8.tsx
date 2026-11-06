import { Card, Section } from "@/components/site/ModulePage";
import { Example } from "@/components/math/Example";
import { Quiz } from "@/components/math/Quiz";
import { Tex, TexBlock } from "@/components/math/Tex";
import { IntegralLab, n, type LabCase } from "@/modules/labs/IntegralLab";

const near0 = (v: number) => Math.abs(v) < 1e-9;

const CASES: LabCase[] = [
  {
    id: "ekx",
    label: "∫ e^{kx} dx",
    params: [{ name: "k", label: "Coeficiente k", min: -2, max: 2, step: 0.25, value: 1 }],
    f: (x, [k]) => Math.exp(k! * x),
    F: (x, [k]) => (near0(k!) ? x : Math.exp(k! * x) / k!),
    tex: ([k]) => `e^{${n(k!)}x}`,
    texF: ([k]) => (near0(k!) ? "x" : `\\dfrac{e^{${n(k!)}x}}{${n(k!)}}`),
    texStep: () => "u = kx,\\; dx = \\tfrac{1}{k}du",
    domain: () => [-2, 2],
    suggested: () => [0, 1],
    note: "Si k < 0 la función decrece pero sigue siendo positiva: el área nunca es negativa.",
  },
  {
    id: "ax",
    label: "∫ aˣ dx (base arbitraria)",
    params: [{ name: "a", label: "Base a", min: 0.25, max: 5, step: 0.25, value: 2 }],
    f: (x, [a]) => Math.pow(a!, x),
    F: (x, [a]) => (near0(a! - 1) ? x : Math.pow(a!, x) / Math.log(a!)),
    tex: ([a]) => `${n(a!)}^{x}`,
    texF: ([a]) => (near0(a! - 1) ? "x" : `\\dfrac{${n(a!)}^{x}}{\\ln ${n(a!)}}`),
    texStep: () => "a^{x} = e^{x\\ln a}",
    domain: () => [-2, 2],
    suggested: () => [0, 1],
  },
  {
    id: "xex2",
    label: "∫ x·e^{x²} dx",
    f: (x) => x * Math.exp(x * x),
    F: (x) => Math.exp(x * x) / 2,
    tex: () => "x\\,e^{x^2}",
    texF: () => "\\tfrac12 e^{x^2}",
    texStep: () => "u = x^2,\\; du = 2x\\,dx",
    domain: () => [-1.5, 1.5],
    suggested: () => [0, 1],
  },
  {
    id: "esqrt",
    label: "∫ e^{√x}/√x dx",
    f: (x) => Math.exp(Math.sqrt(x)) / Math.sqrt(x),
    F: (x) => 2 * Math.exp(Math.sqrt(x)),
    tex: () => "\\dfrac{e^{\\sqrt{x}}}{\\sqrt{x}}",
    texF: () => "2e^{\\sqrt{x}}",
    texStep: () => "u = \\sqrt{x},\\; du = \\tfrac{dx}{2\\sqrt{x}}",
    domain: () => [0.1, 4],
    suggested: () => [1, 4],
  },
  {
    id: "gauss",
    label: "∫ e^{-x²/2} (sin primitiva elemental)",
    f: (x) => Math.exp((-x * x) / 2),
    // Antiderivada numérica: √(π/2)·erf(x/√2) vía aproximación de alta precisión
    F: (x) => Math.sqrt(Math.PI / 2) * erf(x / Math.SQRT2),
    tex: () => "e^{-x^2/2}",
    texF: () =>
      "\\sqrt{\\tfrac{\\pi}{2}}\\,\\operatorname{erf}\\!\\left(\\tfrac{x}{\\sqrt2}\\right)",
    domain: () => [-4, 4],
    suggested: () => [-1, 1],
    note: "La campana de Gauss no tiene antiderivada expresable con funciones elementales; se define erf(x) para ella. Por eso los métodos numéricos de los módulos 1–4 son tan importantes.",
  },
];

/** erf con la serie de Taylor (|x| pequeño) y fracción continua (|x| grande) */
function erf(x: number): number {
  const s = Math.sign(x);
  const z = Math.abs(x);
  if (z < 3) {
    let term = z;
    let sum = z;
    for (let k = 1; k < 60; k++) {
      term *= (-z * z) / k;
      sum += term / (2 * k + 1);
    }
    return (s * 2 * sum) / Math.sqrt(Math.PI);
  }
  // erfc por fracción continua
  let f = 0;
  for (let k = 60; k >= 1; k--) f = k / 2 / (z + f);
  const erfc = Math.exp(-z * z) / Math.sqrt(Math.PI) / (z + f);
  return s * (1 - erfc);
}

export function Modulo8() {
  return (
    <>
      <Section title="La función que es su propia derivada" eyebrow="Teoría">
        <p>
          Como <Tex>{"\\frac{d}{dx}e^{x} = e^{x}"}</Tex>, la exponencial natural también es su
          propia antiderivada. Combinada con la sustitución <Tex>{"u = g(x)"}</Tex> obtenemos:
        </p>
        <TexBlock boxed>
          {
            "\\int e^{u}\\,du = e^{u} + C, \\qquad \\int a^{u}\\,du = \\frac{a^{u}}{\\ln a} + C \\;\\;(a>0,\\ a\\neq1)"
          }
        </TexBlock>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <h3 className="font-semibold">Coeficiente lineal</h3>
            <TexBlock>{"\\int e^{kx}dx = \\frac{e^{kx}}{k} + C"}</TexBlock>
          </Card>
          <Card>
            <h3 className="font-semibold">Base arbitraria</h3>
            <p className="text-sm text-muted-foreground">
              Se reduce a base <Tex>{"e"}</Tex>:
            </p>
            <TexBlock>{"a^{x} = e^{x\\ln a}"}</TexBlock>
          </Card>
          <Card>
            <h3 className="font-semibold">Exponente compuesto</h3>
            <TexBlock>{"\\int e^{g(x)}g'(x)\\,dx = e^{g(x)} + C"}</TexBlock>
          </Card>
        </div>
        <p>
          <strong>Ojo:</strong> la derivada del exponente debe aparecer como factor.{" "}
          <Tex>{"\\int e^{x^2}dx"}</Tex> <em>no</em> tiene primitiva elemental, mientras que{" "}
          <Tex>{"\\int x\\,e^{x^2}dx = \\tfrac12e^{x^2} + C"}</Tex> es inmediata.
        </p>
      </Section>

      <Section title="Explora las exponenciales" eyebrow="Laboratorio">
        <IntegralLab cases={CASES} />
      </Section>

      <Section title="Ejemplos resueltos" eyebrow="Práctica">
        <Example
          title="Ejemplo 1 — ∫ (e^{3x} + 5^{x}) dx"
          statement="Separa y aplica cada fórmula."
          steps={[
            { label: "Primer término", tex: "\\int e^{3x}dx = \\frac{e^{3x}}{3}" },
            { label: "Segundo término", tex: "\\int 5^{x}dx = \\frac{5^{x}}{\\ln 5}" },
          ]}
          result={"\\int (e^{3x} + 5^{x})\\,dx = \\frac{e^{3x}}{3} + \\frac{5^{x}}{\\ln 5} + C"}
        />
        <Example
          title="Ejemplo 2 — ∫ x² e^{x³} dx"
          statement="El exponente es x³ y su derivada 3x² aparece salvo una constante."
          steps={[
            { label: "Sustitución", tex: "u = x^3,\\qquad x^2dx = \\tfrac13du" },
            { label: "Integrar", tex: "\\tfrac13\\int e^{u}du = \\tfrac13e^{u}" },
          ]}
          result={"\\int x^2e^{x^3}dx = \\frac{e^{x^3}}{3} + C"}
        />
        <Example
          title="Ejemplo 3 — ∫₀^{ln 2} eˣ(1 + eˣ)² dx"
          statement="Sustitución con cambio de límites."
          steps={[
            { label: "Cambio", tex: "u = 1 + e^{x},\\quad du = e^{x}dx" },
            { label: "Límites", tex: "x=0\\Rightarrow u=2,\\qquad x=\\ln 2 \\Rightarrow u=3" },
            {
              label: "Integrar",
              tex: "\\int_2^3 u^2du = \\left[\\frac{u^3}{3}\\right]_2^3 = \\frac{27-8}{3}",
            },
          ]}
          result={"\\int_0^{\\ln 2} e^{x}(1+e^{x})^2dx = \\frac{19}{3} \\approx 6.3333"}
        />
      </Section>

      <Section title="Ponte a prueba" eyebrow="Autoevaluación">
        <Quiz
          questions={[
            {
              prompt: "Calcula:",
              tex: "\\int e^{-2x}\\,dx",
              options: [
                "-2e^{-2x} + C",
                "-\\tfrac12 e^{-2x} + C",
                "\\tfrac12e^{-2x} + C",
                "e^{-2x} + C",
              ],
              answer: 1,
              explain: "∫e^{kx}dx = e^{kx}/k con k = −2.",
            },
            {
              prompt: "Calcula:",
              tex: "\\int 3^{x}\\,dx",
              options: [
                "3^{x}\\ln 3 + C",
                "\\frac{3^{x+1}}{x+1} + C",
                "\\frac{3^{x}}{\\ln 3} + C",
                "x\\,3^{x-1} + C",
              ],
              answer: 2,
              explain: "Para base a: ∫aˣdx = aˣ/ln a. ¡No es una potencia de x!",
            },
            {
              prompt: "¿Cuál de estas integrales es inmediata por sustitución?",
              options: [
                "\\int e^{x^2}dx",
                "\\int \\cos x\\, e^{\\sin x}dx",
                "\\int e^{x}\\,x^{3}\\,dx",
                "\\int \\frac{e^{x}}{x}dx",
              ],
              answer: 1,
              explain: "Con u = sin x, du = cos x dx: resultado e^{sin x} + C.",
            },
            {
              prompt: "Calcula:",
              tex: "\\int_0^1 e^{x}\\,dx",
              options: ["e", "e - 1", "1", "e + 1"],
              answer: 1,
              explain: "e¹ − e⁰ = e − 1 ≈ 1.7183.",
            },
          ]}
        />
      </Section>
    </>
  );
}
