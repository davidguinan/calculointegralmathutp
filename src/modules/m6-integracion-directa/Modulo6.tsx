import { Section } from "@/components/site/ModulePage";
import { Example } from "@/components/math/Example";
import { Tex, TexBlock } from "@/components/math/Tex";
import { AntiderivativeLab } from "@/modules/labs/AntiderivativeLab";

const FORMULAS: [string, string][] = [
  ["\\int k\\,dx", "kx + C"],
  ["\\int x^{n}\\,dx\\;(n\\neq-1)", "\\dfrac{x^{n+1}}{n+1} + C"],
  ["\\int \\dfrac{1}{x}\\,dx", "\\ln|x| + C"],
  ["\\int e^{x}\\,dx", "e^{x} + C"],
  ["\\int a^{x}\\,dx", "\\dfrac{a^{x}}{\\ln a} + C"],
  ["\\int \\sin x\\,dx", "-\\cos x + C"],
  ["\\int \\cos x\\,dx", "\\sin x + C"],
  ["\\int \\sec^{2} x\\,dx", "\\tan x + C"],
  ["\\int \\csc^{2} x\\,dx", "-\\cot x + C"],
  ["\\int \\sec x\\tan x\\,dx", "\\sec x + C"],
  ["\\int \\dfrac{dx}{\\sqrt{1-x^{2}}}", "\\arcsin x + C"],
  ["\\int \\dfrac{dx}{1+x^{2}}", "\\arctan x + C"],
];

export function Modulo6() {
  return (
    <>
      <Section title="Integración directa" eyebrow="Teoría">
        <p>
          Integrar directamente es reconocer que el integrando ya coincide (o coincide tras un
          arreglo algebraico) con una fórmula elemental. Se apoya en dos propiedades:
        </p>
        <TexBlock boxed>
          {"\\int k\\,f(x)\\,dx = k\\!\\int f(x)\\,dx, \\qquad \\int [f(x)\\pm g(x)]\\,dx = \\int f(x)\\,dx \\pm \\int g(x)\\,dx"}
        </TexBlock>
        <div className="grid gap-3 sm:grid-cols-2">
          {FORMULAS.map(([lhs, rhs]) => (
            <div
              key={lhs}
              className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3"
            >
              <Tex>{lhs}</Tex>
              <span className="text-muted-foreground">=</span>
              <Tex>{rhs}</Tex>
            </div>
          ))}
        </div>
        <p>
          Recuerda siempre la constante <Tex>{"C"}</Tex>: la antiderivada no es única, es una
          familia de curvas paralelas.
        </p>
      </Section>

      <Section title="f(x) y su antiderivada F(x)" eyebrow="Laboratorio">
        <AntiderivativeLab />
      </Section>

      <Section title="Ejemplos resueltos" eyebrow="Práctica">
        <Example
          title="Ejemplo 1 — ∫ (3x⁴ − 2x + 5) dx"
          statement="Integra término a término con la regla de la potencia."
          steps={[
            {
              label: "Separar la integral",
              tex: "3\\!\\int x^4dx - 2\\!\\int x\\,dx + 5\\!\\int dx",
            },
            {
              label: "Aplicar la regla de la potencia",
              tex: "3\\cdot\\frac{x^5}{5} - 2\\cdot\\frac{x^2}{2} + 5x",
            },
            { label: "Simplificar y agregar C", tex: "\\frac{3x^5}{5} - x^2 + 5x + C" },
          ]}
          result="\\int (3x^4-2x+5)\\,dx = \\frac{3x^5}{5} - x^2 + 5x + C"
        />
        <Example
          title="Ejemplo 2 — ∫ (√x + 1/x²) dx"
          statement="Reescribe los radicales y cocientes como potencias."
          steps={[
            { label: "Reescribir", tex: "\\int \\left(x^{1/2} + x^{-2}\\right)dx" },
            {
              label: "Regla de la potencia",
              tex: "\\frac{x^{3/2}}{3/2} + \\frac{x^{-1}}{-1}",
            },
            { label: "Simplificar", tex: "\\frac{2}{3}x^{3/2} - \\frac{1}{x} + C" },
          ]}
          result="\\int \\left(\\sqrt{x} + \\tfrac{1}{x^2}\\right)dx = \\frac{2}{3}x^{3/2} - \\frac{1}{x} + C"
        />
        <Example
          title="Ejemplo 3 — ∫₀^{π/4} (sec²x + 2cos x) dx"
          statement="Integral definida directa con funciones trigonométricas."
          steps={[
            { label: "Antiderivar cada término", tex: "\\tan x + 2\\sin x" },
            {
              label: "Evaluar en π/4",
              tex: "\\tan\\frac{\\pi}{4} + 2\\sin\\frac{\\pi}{4} = 1 + \\sqrt{2}",
            },
            { label: "Evaluar en 0", tex: "\\tan 0 + 2\\sin 0 = 0" },
            { label: "Restar", tex: "(1+\\sqrt{2}) - 0" },
          ]}
          result="\\int_0^{\\pi/4}(\\sec^2x + 2\\cos x)\\,dx = 1 + \\sqrt{2} \\approx 2.4142"
        />
      </Section>
    </>
  );
}
