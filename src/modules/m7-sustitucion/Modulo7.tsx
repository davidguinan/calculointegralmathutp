import { Card, Section } from "@/components/site/ModulePage";
import { Example } from "@/components/math/Example";
import { Quiz } from "@/components/math/Quiz";
import { Tex, TexBlock } from "@/components/math/Tex";
import { IntegralLab, n, type LabCase } from "@/modules/labs/IntegralLab";
import { SubstitutionLab } from "@/modules/labs/SubstitutionLab";

const POWER_CASES: LabCase[] = [
  {
    id: "x2p1",
    label: "∫ 2x (x² + 1)ⁿ dx",
    params: [{ name: "n", label: "Exponente n", min: 0, max: 5, step: 0.5, value: 2 }],
    f: (x, [k]) => 2 * x * Math.pow(x * x + 1, k!),
    F: (x, [k]) => Math.pow(x * x + 1, k! + 1) / (k! + 1),
    tex: ([k]) => `2x\\,(x^2+1)^{${n(k!)}}`,
    texF: ([k]) => `\\dfrac{(x^2+1)^{${n(k! + 1)}}}{${n(k! + 1)}}`,
    texStep: () => "u = x^2+1,\\; du = 2x\\,dx \\Rightarrow \\int u^{n}\\,du",
    domain: () => [-1.5, 1.5],
    suggested: () => [0, 1],
  },
  {
    id: "lin",
    label: "∫ (3x + 1)ⁿ dx",
    params: [{ name: "n", label: "Exponente n", min: 0, max: 4, step: 0.5, value: 2 }],
    f: (x, [k]) => Math.pow(3 * x + 1, k!),
    F: (x, [k]) => Math.pow(3 * x + 1, k! + 1) / (3 * (k! + 1)),
    tex: ([k]) => `(3x+1)^{${n(k!)}}`,
    texF: ([k]) => `\\dfrac{(3x+1)^{${n(k! + 1)}}}{${n(3 * (k! + 1))}}`,
    texStep: () => "u = 3x+1,\\; dx = \\tfrac{1}{3}du",
    domain: () => [0, 1.5],
    suggested: () => [0, 1],
  },
  {
    id: "sqrt",
    label: "∫ x / √(x² + 9) dx",
    f: (x) => x / Math.sqrt(x * x + 9),
    F: (x) => Math.sqrt(x * x + 9),
    tex: () => "\\dfrac{x}{\\sqrt{x^2+9}}",
    texF: () => "\\sqrt{x^2+9}",
    texStep: () => "u = x^2+9,\\; \\tfrac12 du = x\\,dx \\Rightarrow \\tfrac12\\int u^{-1/2}du",
    domain: () => [-4, 4],
    suggested: () => [0, 4],
  },
  {
    id: "sincos",
    label: "∫ sin⁴x · cos x dx",
    f: (x) => Math.pow(Math.sin(x), 4) * Math.cos(x),
    F: (x) => Math.pow(Math.sin(x), 5) / 5,
    tex: () => "\\sin^4 x\\,\\cos x",
    texF: () => "\\dfrac{\\sin^5 x}{5}",
    texStep: () => "u = \\sin x,\\; du = \\cos x\\,dx",
    domain: () => [0, Math.PI],
    suggested: () => [0, Math.PI / 2],
  },
];

export function Modulo7() {
  return (
    <>
      <Section title="La regla de la cadena al revés" eyebrow="Teoría">
        <p>
          Si derivamos una composición obtenemos{" "}
          <Tex>{"\\frac{d}{dx}F(g(x)) = f(g(x))\\,g'(x)"}</Tex>. Leída al revés, esta igualdad es el{" "}
          <strong>método de sustitución</strong>: cuando el integrando contiene una función{" "}
          <Tex>{"g(x)"}</Tex> y también (salvo una constante) su derivada, hacemos{" "}
          <Tex>{"u = g(x)"}</Tex>.
        </p>
        <TexBlock boxed>
          {"\\int f(g(x))\\,g'(x)\\,dx = \\int f(u)\\,du, \\qquad u = g(x),\\; du = g'(x)\\,dx"}
        </TexBlock>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <h3 className="font-semibold">Regla de la potencia generalizada</h3>
            <TexBlock>{"\\int u^{n}\\,du = \\frac{u^{n+1}}{n+1} + C,\\quad n\\neq -1"}</TexBlock>
            <p className="text-sm text-muted-foreground">
              Es la regla de la potencia aplicada a <Tex>{"u = g(x)"}</Tex>, siempre que aparezca el
              factor <Tex>{"du = g'(x)\\,dx"}</Tex>.
            </p>
          </Card>
          <Card>
            <h3 className="font-semibold">Integrales definidas</h3>
            <TexBlock>{"\\int_a^b f(g(x))\\,g'(x)\\,dx = \\int_{g(a)}^{g(b)} f(u)\\,du"}</TexBlock>
            <p className="text-sm text-muted-foreground">
              Al cambiar de variable <strong>cambian los límites</strong>: así no hace falta volver
              a <Tex>{"x"}</Tex>.
            </p>
          </Card>
        </div>
        <Card>
          <h3 className="font-semibold">Estrategia en 4 pasos</h3>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm">
            <li>
              Busca una función “interna” <Tex>{"g(x)"}</Tex> cuya derivada aparezca como factor.
            </li>
            <li>
              Escribe <Tex>{"u = g(x)"}</Tex> y calcula <Tex>{"du"}</Tex>; ajusta constantes (
              <Tex>{"x\\,dx = \\tfrac12 du"}</Tex>, etc.).
            </li>
            <li>
              Reescribe toda la integral en <Tex>{"u"}</Tex>: no debe quedar ninguna{" "}
              <Tex>{"x"}</Tex>.
            </li>
            <li>Integra y regresa a la variable original (o usa los límites nuevos).</li>
          </ol>
        </Card>
      </Section>

      <Section title="Misma área, dos variables" eyebrow="Laboratorio 1">
        <p>
          Mueve los límites y compara: el área bajo <Tex>{"f(g(x))g'(x)"}</Tex> en{" "}
          <Tex>{"[a,b]"}</Tex> es exactamente el área bajo <Tex>{"f(u)"}</Tex> en{" "}
          <Tex>{"[g(a), g(b)]"}</Tex>.
        </p>
        <SubstitutionLab />
      </Section>

      <Section title="Potencia generalizada en acción" eyebrow="Laboratorio 2">
        <IntegralLab cases={POWER_CASES} />
      </Section>

      <Section title="Ejemplos resueltos" eyebrow="Práctica">
        <Example
          title="Ejemplo 1 — ∫ x²(x³ − 5)⁷ dx"
          statement="La derivada de x³ − 5 es 3x²: falta solo una constante."
          steps={[
            {
              label: "Elegir u",
              tex: "u = x^3 - 5,\\qquad du = 3x^2dx \\Rightarrow x^2dx = \\tfrac13du",
            },
            {
              label: "Sustituir",
              tex: "\\int u^{7}\\cdot\\tfrac13\\,du = \\tfrac13\\int u^7\\,du",
            },
            { label: "Integrar", tex: "\\tfrac13\\cdot\\frac{u^8}{8} = \\frac{u^8}{24}" },
            { label: "Regresar a x", tex: "\\frac{(x^3-5)^8}{24} + C" },
          ]}
          result={"\\int x^2(x^3-5)^7dx = \\frac{(x^3-5)^8}{24} + C"}
        />
        <Example
          title="Ejemplo 2 — ∫ (2x + 1)/√(x² + x + 3) dx"
          statement="El numerador es exactamente la derivada del radicando."
          steps={[
            { label: "Elegir u", tex: "u = x^2 + x + 3,\\qquad du = (2x+1)\\,dx" },
            { label: "Sustituir", tex: "\\int u^{-1/2}\\,du" },
            { label: "Potencia generalizada", tex: "\\frac{u^{1/2}}{1/2} = 2\\sqrt{u}" },
          ]}
          result={"\\int \\frac{2x+1}{\\sqrt{x^2+x+3}}\\,dx = 2\\sqrt{x^2+x+3} + C"}
        />
        <Example
          title="Ejemplo 3 — ∫₀¹ x(1 + x²)³ dx"
          statement="Integral definida cambiando los límites."
          steps={[
            { label: "Cambio de variable", tex: "u = 1 + x^2,\\quad du = 2x\\,dx" },
            {
              label: "Nuevos límites",
              tex: "x = 0 \\Rightarrow u = 1,\\qquad x = 1 \\Rightarrow u = 2",
            },
            {
              label: "Reescribir",
              tex: "\\tfrac12\\int_1^2 u^3\\,du = \\tfrac12\\left[\\frac{u^4}{4}\\right]_1^2",
            },
            {
              label: "Evaluar",
              tex: "\\tfrac12\\left(\\frac{16}{4} - \\frac14\\right) = \\frac{15}{8}",
            },
          ]}
          result={"\\int_0^1 x(1+x^2)^3dx = \\frac{15}{8} = 1.875"}
        />
      </Section>

      <Section title="Ponte a prueba" eyebrow="Autoevaluación">
        <Quiz
          questions={[
            {
              prompt: "¿Cuál es la mejor sustitución?",
              tex: "\\int \\cos(5x)\\,dx",
              options: ["u = \\cos x", "u = 5x", "u = \\sin(5x)", "u = 5"],
              answer: 1,
              explain: "Con u = 5x, du = 5 dx y la integral queda (1/5)∫cos u du = sin(5x)/5 + C.",
            },
            {
              prompt: "Calcula:",
              tex: "\\int 4x(2x^2+1)^3\\,dx",
              options: [
                "\\frac{(2x^2+1)^4}{4} + C",
                "(2x^2+1)^4 + C",
                "\\frac{(2x^2+1)^4}{16} + C",
                "4(2x^2+1)^4 + C",
              ],
              answer: 0,
              explain: "u = 2x² + 1, du = 4x dx ⇒ ∫u³du = u⁴/4.",
            },
            {
              prompt: "Si u = x² + 1 en ∫₀² x·f(x²+1) dx, los nuevos límites son:",
              options: ["0 \\text{ y } 2", "1 \\text{ y } 5", "1 \\text{ y } 3", "0 \\text{ y } 4"],
              answer: 1,
              explain: "u(0) = 1 y u(2) = 2² + 1 = 5.",
            },
            {
              prompt: "¿Por qué no sirve la regla de la potencia generalizada aquí?",
              tex: "\\int (x^2+1)^{-1}\\cdot 2x\\,dx",
              options: [
                "\\text{Falta el factor } du",
                "\\text{Porque } n = -1",
                "\\text{Porque hay un } x^2",
                "\\text{Sí sirve}",
              ],
              answer: 1,
              explain:
                "Con n = −1 la fórmula dividiría por cero; la respuesta es ln(x²+1) + C (Módulo 9).",
            },
          ]}
        />
      </Section>
    </>
  );
}
