import { Card, Section } from "@/components/site/ModulePage";
import { Example } from "@/components/math/Example";
import { Quiz } from "@/components/math/Quiz";
import { Tex, TexBlock } from "@/components/math/Tex";
import { IntegralLab, n, type LabCase } from "@/modules/labs/IntegralLab";
import { PartsLab } from "@/modules/labs/PartsLab";

const CASES: LabCase[] = [
  {
    id: "xex",
    label: "∫ x eˣ dx",
    f: (x) => x * Math.exp(x),
    F: (x) => Math.exp(x) * (x - 1),
    tex: () => "x\\,e^{x}",
    texF: () => "e^{x}(x-1)",
    texStep: () => "u = x,\\; dv = e^{x}dx",
    domain: () => [-3, 2],
    suggested: () => [0, 1],
  },
  {
    id: "xcos",
    label: "∫ x cos(kx) dx",
    params: [{ name: "k", label: "Frecuencia k", min: 0.5, max: 4, step: 0.5, value: 1 }],
    f: (x, [k]) => x * Math.cos(k! * x),
    F: (x, [k]) => (x * Math.sin(k! * x)) / k! + Math.cos(k! * x) / (k! * k!),
    tex: ([k]) => `x\\cos(${n(k!)}x)`,
    texF: ([k]) =>
      k === 1
        ? "x\\sin x + \\cos x"
        : `\\dfrac{x\\sin(${n(k!)}x)}{${n(k!)}} + \\dfrac{\\cos(${n(k!)}x)}{${n(k! * k!)}}`,
    texStep: () => "u = x,\\; dv = \\cos(kx)\\,dx",
    domain: () => [0, 2 * Math.PI],
    suggested: () => [0, Math.PI],
  },
  {
    id: "lnx",
    label: "∫ ln x dx",
    f: (x) => Math.log(x),
    F: (x) => x * Math.log(x) - x,
    tex: () => "\\ln x",
    texF: () => "x\\ln x - x",
    texStep: () => "u = \\ln x,\\; dv = dx",
    domain: () => [0.1, 5],
    suggested: () => [1, Math.E],
  },
  {
    id: "xlnx",
    label: "∫ xⁿ ln x dx",
    params: [{ name: "n", label: "Potencia n", min: 0, max: 4, step: 1, value: 1 }],
    f: (x, [k]) => Math.pow(x, k!) * Math.log(x),
    F: (x, [k]) =>
      (Math.pow(x, k! + 1) / (k! + 1)) * Math.log(x) - Math.pow(x, k! + 1) / ((k! + 1) * (k! + 1)),
    tex: ([k]) => (k === 0 ? "\\ln x" : k === 1 ? "x\\ln x" : `x^{${n(k!)}}\\ln x`),
    texF: ([k]) =>
      `\\dfrac{x^{${n(k! + 1)}}}{${n(k! + 1)}}\\ln x - \\dfrac{x^{${n(k! + 1)}}}{${n((k! + 1) ** 2)}}`,
    texStep: () => "u = \\ln x,\\; dv = x^{n}dx",
    domain: () => [0.1, 3],
    suggested: () => [1, 2],
  },
  {
    id: "x2ex",
    label: "∫ x² eˣ dx (dos veces)",
    f: (x) => x * x * Math.exp(x),
    F: (x) => Math.exp(x) * (x * x - 2 * x + 2),
    tex: () => "x^2e^{x}",
    texF: () => "e^{x}(x^2-2x+2)",
    texStep: () => "\\text{partes dos veces o método tabular}",
    domain: () => [-4, 2],
    suggested: () => [0, 1],
  },
  {
    id: "atan",
    label: "∫ arctan x dx",
    f: (x) => Math.atan(x),
    F: (x) => x * Math.atan(x) - 0.5 * Math.log(1 + x * x),
    tex: () => "\\arctan x",
    texF: () => "x\\arctan x - \\tfrac12\\ln(1+x^2)",
    texStep: () => "u = \\arctan x,\\; dv = dx",
    domain: () => [-4, 4],
    suggested: () => [0, 1],
  },
  {
    id: "exsin",
    label: "∫ eˣ sin x dx (cíclica)",
    f: (x) => Math.exp(x) * Math.sin(x),
    F: (x) => (Math.exp(x) * (Math.sin(x) - Math.cos(x))) / 2,
    tex: () => "e^{x}\\sin x",
    texF: () => "\\tfrac{e^{x}}{2}(\\sin x - \\cos x)",
    texStep: () => "\\text{partes dos veces y despejar } I",
    domain: () => [-2, Math.PI],
    suggested: () => [0, Math.PI],
  },
];

export function Modulo14() {
  return (
    <>
      <Section title="La regla del producto al revés" eyebrow="Teoría">
        <p>
          De la regla del producto <Tex>{"(uv)' = u'v + uv'"}</Tex>, integrando ambos lados y
          despejando, se obtiene la fórmula de integración por partes:
        </p>
        <TexBlock boxed>
          {
            "\\int u\\,dv = uv - \\int v\\,du \\qquad\\qquad \\int_a^b u\\,dv = \\Big[uv\\Big]_a^b - \\int_a^b v\\,du"
          }
        </TexBlock>
        <p>
          La idea es cambiar una integral difícil por otra más sencilla. Todo depende de elegir bien{" "}
          <Tex>{"u"}</Tex> (lo que se deriva) y <Tex>{"dv"}</Tex> (lo que se integra).
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <h3 className="font-semibold">Regla LIATE para elegir u</h3>
            <ol className="mt-2 space-y-1 text-sm">
              <li>
                <strong>L</strong> — Logarítmicas: <Tex>{"\\ln x"}</Tex>
              </li>
              <li>
                <strong>I</strong> — Inversas trigonométricas:{" "}
                <Tex>{"\\arctan x,\\ \\arcsin x"}</Tex>
              </li>
              <li>
                <strong>A</strong> — Algebraicas: <Tex>{"x^2,\\ 3x+1"}</Tex>
              </li>
              <li>
                <strong>T</strong> — Trigonométricas: <Tex>{"\\sin x,\\ \\cos x"}</Tex>
              </li>
              <li>
                <strong>E</strong> — Exponenciales: <Tex>{"e^{x},\\ 2^{x}"}</Tex>
              </li>
            </ol>
            <p className="mt-2 text-xs text-muted-foreground">
              Toma como <Tex>{"u"}</Tex> la función que aparece primero en la lista.
            </p>
          </Card>
          <Card>
            <h3 className="font-semibold">Método tabular</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Si <Tex>{"u"}</Tex> es un polinomio, deriva hasta llegar a 0 e integra{" "}
              <Tex>{"dv"}</Tex> las mismas veces; multiplica en diagonal alternando signos.
            </p>
            <div className="mt-2 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="py-1">Signo</th>
                    <th>Derivar u</th>
                    <th>Integrar dv</th>
                  </tr>
                </thead>
                <tbody className="font-mono">
                  <tr>
                    <td className="py-1">+</td>
                    <td>
                      <Tex>{"x^2"}</Tex>
                    </td>
                    <td>
                      <Tex>{"e^{x}"}</Tex>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1">−</td>
                    <td>
                      <Tex>{"2x"}</Tex>
                    </td>
                    <td>
                      <Tex>{"e^{x}"}</Tex>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1">+</td>
                    <td>
                      <Tex>{"2"}</Tex>
                    </td>
                    <td>
                      <Tex>{"e^{x}"}</Tex>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1"></td>
                    <td>
                      <Tex>{"0"}</Tex>
                    </td>
                    <td>
                      <Tex>{"e^{x}"}</Tex>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <TexBlock>{"\\int x^2e^{x}dx = x^2e^{x} - 2xe^{x} + 2e^{x} + C"}</TexBlock>
          </Card>
        </div>
      </Section>

      <Section title="¿Qué eliges como u?" eyebrow="Laboratorio 1">
        <PartsLab />
      </Section>

      <Section title="Comprueba gráficamente" eyebrow="Laboratorio 2">
        <IntegralLab cases={CASES} />
      </Section>

      <Section title="Ejemplos resueltos" eyebrow="Práctica">
        <Example
          title="Ejemplo 1 — ∫ x sin(2x) dx"
          statement="Algebraica antes que trigonométrica: u = x."
          steps={[
            {
              label: "Elegir",
              tex: "u = x,\\; du = dx;\\qquad dv = \\sin 2x\\,dx,\\; v = -\\tfrac12\\cos 2x",
            },
            {
              label: "Aplicar la fórmula",
              tex: "-\\tfrac{x}{2}\\cos 2x + \\tfrac12\\int\\cos 2x\\,dx",
            },
            { label: "Integrar", tex: "-\\tfrac{x}{2}\\cos 2x + \\tfrac14\\sin 2x" },
          ]}
          result={"\\int x\\sin 2x\\,dx = -\\frac{x}{2}\\cos 2x + \\frac14\\sin 2x + C"}
        />
        <Example
          title="Ejemplo 2 — ∫₁^e x ln x dx"
          statement="Logarítmica primero: u = ln x."
          steps={[
            {
              label: "Elegir",
              tex: "u = \\ln x,\\; du = \\tfrac{dx}{x};\\qquad dv = x\\,dx,\\; v = \\tfrac{x^2}{2}",
            },
            {
              label: "Aplicar la fórmula",
              tex: "\\left[\\tfrac{x^2}{2}\\ln x\\right]_1^e - \\int_1^e \\tfrac{x}{2}\\,dx",
            },
            {
              label: "Evaluar",
              tex: "\\tfrac{e^2}{2} - \\left[\\tfrac{x^2}{4}\\right]_1^e = \\tfrac{e^2}{2} - \\tfrac{e^2-1}{4}",
            },
          ]}
          result={"\\int_1^e x\\ln x\\,dx = \\frac{e^2+1}{4} \\approx 2.0973"}
        />
        <Example
          title="Ejemplo 3 — ∫ eˣ cos x dx (cíclica)"
          statement="Aplicando partes dos veces reaparece la integral original."
          steps={[
            {
              label: "Primera vez (u = cos x, dv = eˣdx)",
              tex: "I = e^{x}\\cos x + \\int e^{x}\\sin x\\,dx",
            },
            {
              label: "Segunda vez (u = sin x, dv = eˣdx)",
              tex: "I = e^{x}\\cos x + e^{x}\\sin x - \\int e^{x}\\cos x\\,dx",
            },
            { label: "Despejar I", tex: "2I = e^{x}(\\cos x + \\sin x)" },
          ]}
          result={"\\int e^{x}\\cos x\\,dx = \\frac{e^{x}}{2}(\\sin x + \\cos x) + C"}
        />
      </Section>

      <Section title="Ponte a prueba" eyebrow="Autoevaluación">
        <Quiz
          questions={[
            {
              prompt: "Según LIATE, ¿qué conviene tomar como u?",
              tex: "\\int x^3\\ln x\\,dx",
              options: ["u = x^3", "u = \\ln x", "u = x^3\\ln x", "u = 1"],
              answer: 1,
              explain: "L (logarítmica) va antes que A (algebraica).",
            },
            {
              prompt: "Calcula:",
              tex: "\\int x\\,e^{2x}\\,dx",
              options: [
                "\\frac{x e^{2x}}{2} - \\frac{e^{2x}}{4} + C",
                "x e^{2x} - e^{2x} + C",
                "\\frac{x^2e^{2x}}{2} + C",
                "2xe^{2x} - 2e^{2x} + C",
              ],
              answer: 0,
              explain: "u = x, v = e^{2x}/2 ⇒ xe^{2x}/2 − ∫e^{2x}/2 dx.",
            },
            {
              prompt: "¿De qué regla de derivación proviene la integración por partes?",
              options: [
                "\\text{Cadena}",
                "\\text{Producto}",
                "\\text{Cociente}",
                "\\text{Potencia}",
              ],
              answer: 1,
              explain: "Se integra (uv)′ = u′v + uv′ y se despeja ∫u dv.",
            },
            {
              prompt: "¿Cuánto vale?",
              tex: "\\int_0^{\\pi} x\\sin x\\,dx",
              options: ["0", "1", "\\pi", "2\\pi"],
              answer: 2,
              explain: "[−x cos x + sin x] de 0 a π = (π + 0) − (0 + 0) = π.",
            },
          ]}
        />
      </Section>
    </>
  );
}
