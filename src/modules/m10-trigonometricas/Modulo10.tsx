import { Card, Section } from "@/components/site/ModulePage";
import { Example } from "@/components/math/Example";
import { Quiz } from "@/components/math/Quiz";
import { Tex, TexBlock } from "@/components/math/Tex";
import { IntegralLab, n, type LabCase } from "@/modules/labs/IntegralLab";

const TWO_PI = 2 * Math.PI;

const CASES: LabCase[] = [
  {
    id: "sin2",
    label: "∫ sin²x dx",
    f: (x) => Math.sin(x) ** 2,
    F: (x) => x / 2 - Math.sin(2 * x) / 4,
    tex: () => "\\sin^2 x",
    texF: () => "\\dfrac{x}{2} - \\dfrac{\\sin 2x}{4}",
    texStep: () => "\\sin^2x = \\tfrac{1-\\cos 2x}{2}",
    domain: () => [0, TWO_PI],
    suggested: () => [0, Math.PI],
  },
  {
    id: "cos2",
    label: "∫ cos²x dx",
    f: (x) => Math.cos(x) ** 2,
    F: (x) => x / 2 + Math.sin(2 * x) / 4,
    tex: () => "\\cos^2 x",
    texF: () => "\\dfrac{x}{2} + \\dfrac{\\sin 2x}{4}",
    texStep: () => "\\cos^2x = \\tfrac{1+\\cos 2x}{2}",
    domain: () => [0, TWO_PI],
    suggested: () => [0, Math.PI],
  },
  {
    id: "sin3",
    label: "∫ sin³x dx (potencia impar)",
    f: (x) => Math.sin(x) ** 3,
    F: (x) => -Math.cos(x) + Math.cos(x) ** 3 / 3,
    tex: () => "\\sin^3 x",
    texF: () => "-\\cos x + \\dfrac{\\cos^3 x}{3}",
    texStep: () => "\\sin^3x = (1-\\cos^2x)\\sin x,\\; u=\\cos x",
    domain: () => [0, TWO_PI],
    suggested: () => [0, Math.PI],
  },
  {
    id: "s2c2",
    label: "∫ sin²x cos²x dx",
    f: (x) => (Math.sin(x) * Math.cos(x)) ** 2,
    F: (x) => x / 8 - Math.sin(4 * x) / 32,
    tex: () => "\\sin^2x\\cos^2x",
    texF: () => "\\dfrac{x}{8} - \\dfrac{\\sin 4x}{32}",
    texStep: () => "\\sin^2x\\cos^2x = \\tfrac14\\sin^2 2x = \\tfrac{1-\\cos4x}{8}",
    domain: () => [0, TWO_PI],
    suggested: () => [0, Math.PI / 2],
  },
  {
    id: "sc3",
    label: "∫ sin x cos³x dx",
    f: (x) => Math.sin(x) * Math.cos(x) ** 3,
    F: (x) => -(Math.cos(x) ** 4) / 4,
    tex: () => "\\sin x\\cos^3 x",
    texF: () => "-\\dfrac{\\cos^4 x}{4}",
    texStep: () => "u = \\cos x,\\; du = -\\sin x\\,dx",
    domain: () => [0, TWO_PI],
    suggested: () => [0, Math.PI / 2],
  },
  {
    id: "prod",
    label: "∫ sin(mx)·cos(nx) dx",
    params: [
      { name: "m", label: "m", min: 1, max: 4, step: 1, value: 3 },
      { name: "n", label: "n", min: 1, max: 4, step: 1, value: 1 },
    ],
    f: (x, [m, k]) => Math.sin(m! * x) * Math.cos(k! * x),
    F: (x, [m, k]) => {
      const s = m! + k!;
      const d = m! - k!;
      const t1 = -Math.cos(s * x) / (2 * s);
      const t2 = d === 0 ? 0 : -Math.cos(d * x) / (2 * d);
      return t1 + t2;
    },
    tex: ([m, k]) => `\\sin(${n(m!)}x)\\cos(${n(k!)}x)`,
    texF: ([m, k]) => {
      const s = m! + k!;
      const d = m! - k!;
      const t1 = `-\\dfrac{\\cos ${n(s)}x}{${n(2 * s)}}`;
      if (d === 0) return t1;
      return d > 0
        ? `${t1} - \\dfrac{\\cos ${n(d)}x}{${n(2 * d)}}`
        : `${t1} + \\dfrac{\\cos ${n(-d)}x}{${n(-2 * d)}}`;
    },
    texStep: () => "\\sin A\\cos B = \\tfrac12[\\sin(A+B) + \\sin(A-B)]",
    domain: () => [0, TWO_PI],
    suggested: () => [0, Math.PI],
    note: "Con m ≠ n, la integral sobre [0, 2π] es 0: es la ortogonalidad que usan las series de Fourier.",
  },
  {
    id: "tan2",
    label: "∫ tan²x dx",
    f: (x) => Math.tan(x) ** 2,
    F: (x) => Math.tan(x) - x,
    tex: () => "\\tan^2 x",
    texF: () => "\\tan x - x",
    texStep: () => "\\tan^2x = \\sec^2x - 1",
    domain: () => [-1.3, 1.3],
    suggested: () => [0, Math.PI / 4],
  },
];

export function Modulo10() {
  return (
    <>
      <Section title="Identidades que simplifican" eyebrow="Teoría">
        <p>
          Las integrales trigonométricas se resuelven transformando el integrando con identidades
          hasta llegar a una forma directa o a una sustitución simple.
        </p>
        <TexBlock boxed>
          {
            "\\sin^2x + \\cos^2x = 1,\\quad \\sin^2x = \\frac{1-\\cos2x}{2},\\quad \\cos^2x = \\frac{1+\\cos2x}{2},\\quad 1+\\tan^2x = \\sec^2x"
          }
        </TexBlock>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <h3 className="font-semibold">
              <Tex>{"\\int \\sin^m x\\cos^n x\\,dx"}</Tex>
            </h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
              <li>
                <strong>Alguna potencia impar:</strong> separa un factor (<Tex>{"\\sin x"}</Tex> o{" "}
                <Tex>{"\\cos x"}</Tex>), convierte el resto con <Tex>{"\\sin^2+\\cos^2=1"}</Tex> y
                sustituye.
              </li>
              <li>
                <strong>Ambas pares:</strong> usa las fórmulas del ángulo doble para bajar el grado.
              </li>
            </ul>
          </Card>
          <Card>
            <h3 className="font-semibold">
              <Tex>{"\\int \\tan^m x\\sec^n x\\,dx"}</Tex>
            </h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
              <li>
                <Tex>{"n"}</Tex> par: guarda <Tex>{"\\sec^2x"}</Tex> y usa <Tex>{"u=\\tan x"}</Tex>.
              </li>
              <li>
                <Tex>{"m"}</Tex> impar: guarda <Tex>{"\\sec x\\tan x"}</Tex> y usa{" "}
                <Tex>{"u=\\sec x"}</Tex>.
              </li>
            </ul>
          </Card>
        </div>
        <Card>
          <h3 className="font-semibold">Productos de senos y cosenos con distinto ángulo</h3>
          <TexBlock>
            {
              "\\sin A\\cos B = \\tfrac12[\\sin(A-B)+\\sin(A+B)],\\quad \\sin A\\sin B = \\tfrac12[\\cos(A-B)-\\cos(A+B)],\\quad \\cos A\\cos B = \\tfrac12[\\cos(A-B)+\\cos(A+B)]"
            }
          </TexBlock>
        </Card>
      </Section>

      <Section title="Potencias y productos trigonométricos" eyebrow="Laboratorio">
        <IntegralLab cases={CASES} />
      </Section>

      <Section title="Ejemplos resueltos" eyebrow="Práctica">
        <Example
          title="Ejemplo 1 — ∫ sin⁵x cos²x dx"
          statement="El seno tiene potencia impar: separa un sin x."
          steps={[
            {
              label: "Separar",
              tex: "\\int (\\sin^2x)^2\\cos^2x\\,\\sin x\\,dx = \\int (1-\\cos^2x)^2\\cos^2x\\,\\sin x\\,dx",
            },
            {
              label: "Sustituir u = cos x, du = −sin x dx",
              tex: "-\\int (1-u^2)^2u^2\\,du = -\\int (u^2 - 2u^4 + u^6)\\,du",
            },
            { label: "Integrar", tex: "-\\frac{u^3}{3} + \\frac{2u^5}{5} - \\frac{u^7}{7}" },
          ]}
          result={
            "\\int\\sin^5x\\cos^2x\\,dx = -\\frac{\\cos^3x}{3} + \\frac{2\\cos^5x}{5} - \\frac{\\cos^7x}{7} + C"
          }
        />
        <Example
          title="Ejemplo 2 — ∫₀^π cos²x dx"
          statement="Potencia par: ángulo doble."
          steps={[
            { label: "Identidad", tex: "\\int_0^\\pi \\frac{1+\\cos2x}{2}\\,dx" },
            { label: "Integrar", tex: "\\left[\\frac{x}{2} + \\frac{\\sin2x}{4}\\right]_0^\\pi" },
            { label: "Evaluar", tex: "\\frac{\\pi}{2} + 0 - 0" },
          ]}
          result={"\\int_0^\\pi\\cos^2x\\,dx = \\frac{\\pi}{2} \\approx 1.5708"}
        />
        <Example
          title="Ejemplo 3 — ∫ tan³x sec⁴x dx"
          statement="Potencia de la secante par: guarda sec²x."
          steps={[
            {
              label: "Separar",
              tex: "\\int \\tan^3x\\,\\sec^2x\\,\\sec^2x\\,dx = \\int \\tan^3x(1+\\tan^2x)\\sec^2x\\,dx",
            },
            {
              label: "u = tan x, du = sec²x dx",
              tex: "\\int (u^3 + u^5)\\,du = \\frac{u^4}{4} + \\frac{u^6}{6}",
            },
          ]}
          result={"\\int\\tan^3x\\sec^4x\\,dx = \\frac{\\tan^4x}{4} + \\frac{\\tan^6x}{6} + C"}
        />
      </Section>

      <Section title="Ponte a prueba" eyebrow="Autoevaluación">
        <Quiz
          questions={[
            {
              prompt: "¿Qué identidad usarías primero?",
              tex: "\\int \\sin^2(3x)\\,dx",
              options: [
                "\\sin^2u = \\tfrac{1-\\cos2u}{2}",
                "\\sin^2u = 1 + \\cos^2 u",
                "u = \\sin 3x",
                "\\sin 2u = 2\\sin u\\cos u",
              ],
              answer: 0,
              explain: "Potencia par: se baja el grado con el ángulo doble.",
            },
            {
              prompt: "Calcula:",
              tex: "\\int \\sin x\\cos x\\,dx",
              options: [
                "\\frac{\\sin^2x}{2} + C",
                "\\sin x\\cos x + C",
                "-\\cos 2x + C",
                "\\frac{\\cos^2x}{2} + C",
              ],
              answer: 0,
              explain:
                "u = sin x, du = cos x dx. (También es válido −cos²x/2 + C o −cos2x/4 + C: difieren en una constante.)",
            },
            {
              prompt: "¿Cuánto vale?",
              tex: "\\int_0^{2\\pi} \\sin(3x)\\cos(x)\\,dx",
              options: ["\\pi", "0", "2\\pi", "\\tfrac12"],
              answer: 1,
              explain: "sin3x·cos x = ½[sin4x + sin2x]; ambas integran 0 en un período completo.",
            },
            {
              prompt: "Calcula:",
              tex: "\\int \\tan^2x\\,dx",
              options: [
                "\\frac{\\tan^3x}{3} + C",
                "\\sec^2x + C",
                "\\tan x - x + C",
                "\\ln|\\sec x| + C",
              ],
              answer: 2,
              explain: "tan²x = sec²x − 1.",
            },
          ]}
        />
      </Section>
    </>
  );
}
