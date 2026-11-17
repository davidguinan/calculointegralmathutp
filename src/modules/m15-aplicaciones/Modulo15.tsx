import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Card, Section } from "@/components/site/ModulePage";
import { Example } from "@/components/math/Example";
import { Quiz, type QuizQuestion } from "@/components/math/Quiz";
import { Tex, TexBlock } from "@/components/math/Tex";
import { useState } from "react";
import { Exercise } from "@/components/math/Exercise";
import {
  ArcLengthLab,
  AverageValueLab,
  BetweenCurvesLab,
  type PairPreset,
} from "@/modules/labs/ApplicationsLabs";

type Ex = {
  title: string;
  statement: string;
  pair?: string;
  steps: { label: string; tex: string }[];
  answerTex: string;
  answer: number;
};

const EXERCISES: Ex[] = [
  {
    title: "Valor absoluto (ejemplo de clase)",
    statement: "Evalúa ∫₀² |2x − 1| dx.",
    pair: "abs",
    steps: [
      { label: "Partir en x = 1/2", tex: "\\int_0^{1/2}(1-2x)\\,dx + \\int_{1/2}^{2}(2x-1)\\,dx" },
      { label: "Cada área", tex: "A_1 = \\tfrac14,\\qquad A_2 = \\tfrac94" },
    ],
    answerTex: "\\frac52",
    answer: 2.5,
  },
  {
    title: "Recta y parábola",
    statement: "Halla el área entre y = 2x y y = x².",
    pair: "x2-2x",
    steps: [
      { label: "Cortes", tex: "x^2 = 2x \\Rightarrow x = 0,\; x = 2" },
      {
        label: "Integral",
        tex: "A = \\int_0^2 (2x - x^2)\\,dx = \\left[x^2 - \\frac{x^3}{3}\\right]_0^2",
      },
    ],
    answerTex: "A = \\frac43",
    answer: 4 / 3,
  },
  {
    title: "Raíz y parábola",
    statement: "Halla el área entre y = √x y y = x².",
    pair: "sqrt-x2",
    steps: [
      { label: "Cortes", tex: "\\sqrt{x} = x^2 \\Rightarrow x = 0,\; x = 1" },
      {
        label: "Integral",
        tex: "A = \\int_0^1 (x^{1/2} - x^2)\\,dx = \\left[\\frac23x^{3/2} - \\frac{x^3}{3}\\right]_0^1",
      },
    ],
    answerTex: "A = \\frac13",
    answer: 1 / 3,
  },
  {
    title: "Parábola y recta",
    statement: "Halla el área encerrada por y = 4 − x² y y = x + 2.",
    pair: "parab-line",
    steps: [
      { label: "Cortes", tex: "x^2 + x - 2 = 0 \\Rightarrow x = -2,\; x = 1" },
      { label: "Integral", tex: "A = \\int_{-2}^{1}(2 - x - x^2)\\,dx" },
    ],
    answerTex: "A = \\frac92",
    answer: 4.5,
  },
  {
    title: "Curvas que se cruzan",
    statement: "Halla el área total entre y = x³ y y = x.",
    pair: "cubic",
    steps: [
      { label: "Cortes", tex: "x^3 = x \\Rightarrow x = -1,\; 0,\; 1" },
      {
        label: "Partir la integral",
        tex: "A = \\int_{-1}^{0}(x^3 - x)\\,dx + \\int_{0}^{1}(x - x^3)\\,dx = \\tfrac14 + \\tfrac14",
      },
    ],
    answerTex: "A = \\frac12",
    answer: 0.5,
  },
  {
    title: "Seno y coseno",
    statement: "Halla el área entre y = sen x y y = cos x entre π/4 y 5π/4.",
    pair: "sincos",
    steps: [
      { label: "Integral", tex: "A = \\big[-\\cos x - \\sin x\\big]_{\\pi/4}^{5\\pi/4}" },
      {
        label: "Evaluar",
        tex: "A = \\left(\\tfrac{\\sqrt2}{2} + \\tfrac{\\sqrt2}{2}\\right) - \\left(-\\tfrac{\\sqrt2}{2} - \\tfrac{\\sqrt2}{2}\\right)",
      },
    ],
    answerTex: "A = 2\\sqrt2",
    answer: 2 * Math.SQRT2,
  },
  {
    title: "TFC con límite variable",
    statement: "Si F(x) = ∫₁^{x³} √(1 + t²) dt, calcula F′(1).",
    steps: [
      { label: "Regla de la cadena", tex: "F'(x) = \\sqrt{1 + (x^3)^2}\\cdot 3x^2" },
      { label: "Evaluar en x = 1", tex: "F'(1) = \\sqrt{2}\\cdot 3" },
    ],
    answerTex: "F'(1) = 3\\sqrt2",
    answer: 3 * Math.SQRT2,
  },
  {
    title: "Valor promedio",
    statement: "Calcula el valor promedio de f(x) = x² en [0, 3].",
    steps: [
      { label: "Fórmula", tex: "f_{\\text{prom}} = \\frac{1}{3 - 0}\\int_0^3 x^2\\,dx" },
      {
        label: "Integrar",
        tex: "\\frac13\\cdot\\left[\\frac{x^3}{3}\\right]_0^3 = \\frac13\\cdot 9",
      },
    ],
    answerTex: "f_{\\text{prom}} = 3",
    answer: 3,
  },
];

const QUIZ: QuizQuestion[] = [
  {
    prompt: "Área entre y = x² y y = x en [0, 1]:",
    options: ["\\dfrac16", "\\dfrac13", "\\dfrac12", "1"],
    answer: 0,
    explain: "A = ∫₀¹ (x − x²) dx = 1/2 − 1/3 = 1/6.",
  },
  {
    prompt: "Si las curvas se cruzan dentro de [a, b], para el área se debe…",
    options: [
      "\\text{partir la integral en los cortes}",
      "\\text{integrar } f-g \\text{ directo}",
      "\\text{multiplicar por } 2",
      "\\text{usar solo el mayor valor}",
    ],
    answer: 0,
    explain:
      "En cada tramo se resta (curva de arriba) − (curva de abajo); equivale a integrar |f − g|.",
  },
  {
    prompt: "Valor promedio de f(x) = x² en [0, 3]:",
    options: ["3", "9", "\\dfrac32", "27"],
    answer: 0,
    explain: "f_prom = (1/3)∫₀³ x² dx = (1/3)·9 = 3.",
  },
  {
    prompt: "La fórmula de longitud de arco de y = f(x) en [a, b] es…",
    options: [
      "\\int_a^b \\sqrt{1 + [f'(x)]^2}\\,dx",
      "\\int_a^b \\sqrt{1 + f(x)^2}\\,dx",
      "\\int_a^b \\big(1 + f'(x)\\big)\\,dx",
      "\\pi\\int_a^b f(x)^2\\,dx",
    ],
    answer: 0,
    explain: "Por Pitágoras, ds = √(dx² + dy²) = √(1 + (dy/dx)²) dx.",
  },
  {
    prompt:
      "Un resorte con k = 50 N/m se estira 0.2 m desde su posición natural. ¿Trabajo realizado?",
    options: ["1\\text{ J}", "10\\text{ J}", "2\\text{ J}", "0.5\\text{ J}"],
    answer: 0,
    explain: "W = ∫₀^0.2 50x dx = 25·(0.2)² = 1 J.",
  },
  {
    prompt: "Área entre x = y² y x = y + 2 (integrando respecto a y):",
    options: ["\\dfrac92", "\\dfrac{9}{4}", "\\dfrac{27}{6}\\cdot 2", "3"],
    answer: 0,
    explain: "Cortes en y = −1 y y = 2: A = ∫₋₁² (y + 2 − y²) dy = 9/2.",
  },
];

export function Modulo15() {
  const [pair, setPair] = useState<PairPreset | null>(null);
  return (
    <>
      <Section title="La integral como suma de elementos" eyebrow="Teoría">
        <p>
          Todas las aplicaciones siguen la misma receta: se divide la cantidad buscada en piezas
          pequeñas, se aproxima cada pieza por algo fácil de calcular (un rectángulo, un disco, un
          segmento), se suman las piezas y se toma el límite. Esa suma límite es una integral
          definida.
        </p>
        <TexBlock boxed>
          {
            "\\text{Cantidad} = \\lim_{n\\to\\infty}\\sum_{i=1}^{n} (\\text{elemento})_i = \\int_a^b (\\text{elemento por unidad})\\,dx"
          }
        </TexBlock>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <h3 className="font-semibold">Área entre curvas</h3>
            <TexBlock>{"A = \\int_a^b \\big[f(x) - g(x)\\big]\\,dx"}</TexBlock>
          </Card>
          <Card>
            <h3 className="font-semibold">Valor promedio</h3>
            <TexBlock>{"f_{\\text{prom}} = \\frac{1}{b-a}\\int_a^b f(x)\\,dx"}</TexBlock>
          </Card>
          <Card>
            <h3 className="font-semibold">Longitud de arco</h3>
            <TexBlock>{"L = \\int_a^b \\sqrt{1 + [f'(x)]^2}\\,dx"}</TexBlock>
          </Card>
          <Card>
            <h3 className="font-semibold">Volumen de sólidos</h3>
            <TexBlock>{"V = \\pi\\int_a^b R(x)^2\\,dx"}</TexBlock>
            <Link
              to="/modulo/$slug"
              params={{ slug: "solidos-de-revolucion" }}
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              Ver gráficas 3D en el Módulo 16 <ArrowRight className="size-4" />
            </Link>
          </Card>
          <Card>
            <h3 className="font-semibold">Superficie de revolución</h3>
            <TexBlock>{"S = 2\\pi\\int_a^b f(x)\\sqrt{1 + [f'(x)]^2}\\,dx"}</TexBlock>
          </Card>
          <Card>
            <h3 className="font-semibold">Trabajo</h3>
            <TexBlock>{"W = \\int_a^b F(x)\\,dx"}</TexBlock>
          </Card>
        </div>
      </Section>

      <Section title="Repaso: Teorema Fundamental y límites variables" eyebrow="Base">
        <p>
          Si <Tex>{"f"}</Tex> es continua en <Tex>{"a \\le x \\le b"}</Tex> y <Tex>{"F"}</Tex> es
          una antiderivada de <Tex>{"f"}</Tex>:
        </p>
        <TexBlock boxed>
          {
            "\\int_a^b f(x)\\,dx = F(b) - F(a) = F(x)\\Big|_a^b \\qquad\\qquad \\frac{d}{dx}\\int_a^x f(t)\\,dt = f(x)"
          }
        </TexBlock>
        <p>
          Cuando el límite superior es una función <Tex>{"u(x)"}</Tex>, se aplica la regla de la
          cadena:
        </p>
        <TexBlock boxed>
          {"\\frac{d}{dx}\\int_a^{u(x)} f(t)\\,dt = f\\big(u(x)\\big)\\cdot u'(x)"}
        </TexBlock>
        <div className="grid gap-4 md:grid-cols-2">
          <Example
            title="Ejemplo de clase — F(x) = ∫₁ˣ (t² − 2t + 3) dt"
            statement="Determine F′(x)."
            steps={[
              {
                label: "Integrar",
                tex: "F(x) = \\left[\\frac{t^3}{3} - t^2 + 3t\\right]_1^x = \\frac{x^3}{3} - x^2 + 3x - \\frac{7}{3}",
              },
              { label: "Derivar", tex: "F'(x) = x^2 - 2x + 3" },
              {
                label: "Comprobar con el TFC",
                body: "Basta reemplazar t por x en el integrando: el resultado es el mismo.",
              },
            ]}
            result={"F'(x) = x^2 - 2x + 3"}
          />
          <Example
            title="Ejemplo de clase — F(x) = ∫₁^{x²} cos t dt"
            statement="Determine F′(x). El límite superior es u = x²."
            steps={[
              {
                label: "Integrar",
                tex: "F(x) = \\big[\\sin t\\big]_1^{x^2} = \\sin(x^2) - \\sin 1",
              },
              {
                label: "Derivar (regla de la cadena)",
                tex: "F'(x) = \\cos(x^2)\\cdot\\frac{d}{dx}(x^2) = \\cos(x^2)\\cdot 2x",
              },
            ]}
            result={"F'(x) = 2x\\cos(x^2)"}
          />
        </div>
      </Section>

      <Section title="Área entre curvas" eyebrow="Aplicación 1">
        <p>
          Si <Tex>{"f(x) \\ge g(x)"}</Tex> en <Tex>{"[a,b]"}</Tex>, el elemento de área es un
          rectángulo de altura <Tex>{"f(x) - g(x)"}</Tex> y ancho <Tex>{"dx"}</Tex>. Pasos:
        </p>
        <ol className="list-decimal space-y-1 pl-6">
          <li>Graficar y hallar los puntos de corte igualando las curvas.</li>
          <li>Identificar qué curva está arriba en cada tramo (probar un punto).</li>
          <li>
            Plantear <Tex>{"\\int (\\text{arriba} - \\text{abajo})\\,dx"}</Tex>, partiendo la
            integral donde las curvas se crucen.
          </li>
        </ol>
        <p>
          Si es más fácil describir la región con rectángulos horizontales, se integra respecto a{" "}
          <Tex>{"y"}</Tex>:
        </p>
        <TexBlock boxed>
          {"A = \\int_c^d \\big[x_{\\text{der}}(y) - x_{\\text{izq}}(y)\\big]\\,dy"}
        </TexBlock>
        <BetweenCurvesLab preset={pair} />
      </Section>

      <Section title="Valor promedio de una función" eyebrow="Aplicación 2">
        <p>
          El valor promedio es la altura del rectángulo con base <Tex>{"[a,b]"}</Tex> que tiene la
          misma área que la región bajo <Tex>{"f"}</Tex>. El{" "}
          <strong>teorema del valor medio para integrales</strong> garantiza que, si{" "}
          <Tex>{"f"}</Tex> es continua, existe al menos un <Tex>{"c \\in [a,b]"}</Tex> con{" "}
          <Tex>{"f(c) = f_{\\text{prom}}"}</Tex> (puntos rojos).
        </p>
        <TexBlock boxed>
          {
            "f_{\\text{prom}} = \\frac{1}{b-a}\\int_a^b f(x)\\,dx, \\qquad \\int_a^b f(x)\\,dx = f(c)\\,(b-a)"
          }
        </TexBlock>
        <AverageValueLab />
      </Section>

      <Section title="Longitud de arco" eyebrow="Aplicación 3">
        <p>
          Se aproxima la curva con segmentos. Cada segmento mide{" "}
          <Tex>
            {"\\sqrt{\\Delta x^2 + \\Delta y^2} = \\sqrt{1 + (\\Delta y/\\Delta x)^2}\\,\\Delta x"}
          </Tex>
          ; al hacer el límite, <Tex>{"\\Delta y/\\Delta x \\to f'(x)"}</Tex>:
        </p>
        <TexBlock boxed>
          {
            "L = \\int_a^b \\sqrt{1 + \\left(\\frac{dy}{dx}\\right)^2}\\,dx \\qquad \\text{o} \\qquad L = \\int_c^d \\sqrt{1 + \\left(\\frac{dx}{dy}\\right)^2}\\,dy"
          }
        </TexBlock>
        <ArcLengthLab />
      </Section>

      <Section title="Trabajo realizado por una fuerza variable" eyebrow="Aplicación 4">
        <p>
          Si la fuerza fuera constante, <Tex>{"W = F\\cdot d"}</Tex>. Cuando cambia con la posición,
          se suman pequeños trabajos <Tex>{"F(x)\\,dx"}</Tex>:
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <h3 className="font-semibold">Resortes (ley de Hooke)</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              La fuerza para estirar un resorte <Tex>{"x"}</Tex> metros desde su longitud natural es{" "}
              <Tex>{"F(x) = kx"}</Tex>.
            </p>
            <TexBlock>{"W = \\int_a^b kx\\,dx = \\frac{k}{2}\\big(b^2 - a^2\\big)"}</TexBlock>
          </Card>
          <Card>
            <h3 className="font-semibold">Bombeo de líquidos</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Una capa delgada a profundidad <Tex>{"y"}</Tex> pesa{" "}
              <Tex>{"\\rho g\\,A(y)\\,dy"}</Tex> y debe subirse una distancia <Tex>{"d(y)"}</Tex>:
            </p>
            <TexBlock>{"W = \\int_c^d \\rho g\\,A(y)\\,d(y)\\,dy"}</TexBlock>
          </Card>
        </div>
      </Section>

      <Section title="Ejemplos resueltos" eyebrow="Práctica">
        <Example
          title="Ejemplo de clase — Evalúa ∫₀² |2x − 1| dx"
          statement="El valor absoluto cambia de signo en x = 1/2, así que la integral se parte en dos áreas."
          steps={[
            {
              label: "Definir el valor absoluto por tramos",
              tex: "|2x-1| = \\begin{cases} 2x-1, & x \\ge \\tfrac12 \\\\ -(2x-1), & x < \\tfrac12 \\end{cases}",
            },
            {
              label: "Área A₁ en [0, 1/2]",
              tex: "A_1 = \\int_0^{1/2} (1-2x)\\,dx = \\Big[x - x^2\\Big]_0^{1/2} = \\frac12 - \\frac14 = \\frac14",
            },
            {
              label: "Área A₂ en [1/2, 2]",
              tex: "A_2 = \\int_{1/2}^{2} (2x-1)\\,dx = \\Big[x^2 - x\\Big]_{1/2}^{2} = 2 - \\left(-\\frac14\\right) = \\frac94",
            },
            { label: "Sumar", tex: "A = A_1 + A_2 = \\frac14 + \\frac94" },
          ]}
          result={"\\int_0^2 |2x-1|\\,dx = \\frac{5}{2}"}
        />
        <Example
          title="Ejemplo 1 — Área entre y = 4 − x² y y = x + 2"
          statement="Determina el área de la región encerrada por la parábola y la recta."
          steps={[
            {
              label: "Puntos de corte",
              tex: "4 - x^2 = x + 2 \\Rightarrow x^2 + x - 2 = 0 \\Rightarrow x = -2,\\; x = 1",
            },
            {
              label: "Curva superior",
              tex: "x = 0:\\; 4 > 2 \\;\\Rightarrow\\; \\text{la parábola está arriba}",
            },
            { label: "Plantear", tex: "A = \\int_{-2}^{1} \\big(2 - x - x^2\\big)\\,dx" },
            {
              label: "Integrar",
              tex: "A = \\left[2x - \\frac{x^2}{2} - \\frac{x^3}{3}\\right]_{-2}^{1} = \\frac76 - \\left(-\\frac{10}{3}\\right)",
            },
          ]}
          result={"A = \\frac{9}{2} = 4.5 \\text{ u}^2"}
        />
        <Example
          title="Ejemplo 2 — Área respecto a y: x = y² y x = y + 2"
          statement="Con rectángulos horizontales la región queda descrita con una sola integral."
          steps={[
            {
              label: "Cortes",
              tex: "y^2 = y + 2 \\Rightarrow (y-2)(y+1) = 0 \\Rightarrow y = -1,\\; y = 2",
            },
            {
              label: "Derecha e izquierda",
              tex: "x_{\\text{der}} = y + 2, \\qquad x_{\\text{izq}} = y^2",
            },
            { label: "Plantear", tex: "A = \\int_{-1}^{2} \\big(y + 2 - y^2\\big)\\,dy" },
            {
              label: "Integrar",
              tex: "A = \\left[\\frac{y^2}{2} + 2y - \\frac{y^3}{3}\\right]_{-1}^{2} = \\frac{10}{3} - \\left(-\\frac76\\right)",
            },
          ]}
          result={"A = \\frac{9}{2} \\text{ u}^2"}
        />
        <Example
          title="Ejemplo 3 — Valor promedio de sen x en [0, π]"
          statement="Calcula el valor promedio y el punto c del teorema del valor medio."
          steps={[
            {
              label: "Integral",
              tex: "\\int_0^{\\pi} \\sin x\\,dx = \\big[-\\cos x\\big]_0^{\\pi} = 2",
            },
            {
              label: "Promedio",
              tex: "f_{\\text{prom}} = \\frac{1}{\\pi}\\cdot 2 = \\frac{2}{\\pi}",
            },
            {
              label: "Punto c",
              tex: "\\sin c = \\frac{2}{\\pi} \\Rightarrow c = \\arcsin\\frac{2}{\\pi} \\approx 0.690 \\;\\text{o}\\; c \\approx 2.451",
            },
          ]}
          result={"f_{\\text{prom}} = \\frac{2}{\\pi} \\approx 0.6366"}
        />
        <Example
          title="Ejemplo 4 — Longitud de arco de y = x^{3/2}, 0 ≤ x ≤ 4"
          statement="Calcula la longitud exacta de la curva."
          steps={[
            {
              label: "Derivada",
              tex: "y' = \\frac32 x^{1/2} \\Rightarrow 1 + (y')^2 = 1 + \\frac94 x",
            },
            { label: "Plantear", tex: "L = \\int_0^4 \\sqrt{1 + \\tfrac94 x}\\,dx" },
            {
              label: "Sustitución u = 1 + 9x/4",
              tex: "L = \\frac49\\int_1^{10} u^{1/2}\\,du = \\frac{8}{27}\\Big[u^{3/2}\\Big]_1^{10}",
            },
          ]}
          result={"L = \\frac{8}{27}\\big(10\\sqrt{10} - 1\\big) \\approx 9.0734"}
        />
        <Example
          title="Ejemplo 5 — Trabajo para estirar un resorte"
          statement="Se necesita 10 N para mantener un resorte estirado 0.5 m. ¿Qué trabajo se hace al estirarlo de 0.5 m a 1 m?"
          steps={[
            {
              label: "Constante del resorte",
              tex: "10 = k(0.5) \\Rightarrow k = 20\\ \\text{N/m}",
            },
            { label: "Plantear", tex: "W = \\int_{0.5}^{1} 20x\\,dx" },
            { label: "Integrar", tex: "W = 10x^2\\Big|_{0.5}^{1} = 10 - 2.5" },
          ]}
          result={"W = 7.5 \\text{ J}"}
        />
      </Section>

      <Section title="Ejercicios interactivos" eyebrow="Practica tú">
        <p>
          Escribe tu respuesta (por ejemplo <code>9/2</code> o <code>2sqrt(2)</code>) y pulsa
          Comprobar. Si te atascas, pide los pasos uno a uno. <strong>Ver en la gráfica</strong>{" "}
          carga la región en el laboratorio de área entre curvas.
        </p>
        <div className="grid gap-4 lg:grid-cols-2">
          {EXERCISES.map((e, i) => (
            <Exercise
              key={i}
              n={i + 1}
              title={e.title}
              statement={e.statement}
              steps={e.steps}
              answerTex={e.answerTex}
              answer={e.answer}
              onShow={e.pair ? () => setPair({ id: e.pair!, nonce: Date.now() }) : undefined}
            />
          ))}
        </div>
      </Section>

      <Section title="Autoevaluación" eyebrow="Quiz">
        <Quiz questions={QUIZ} />
      </Section>
    </>
  );
}
