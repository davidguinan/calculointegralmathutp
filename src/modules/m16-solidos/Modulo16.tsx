import { Card, Section } from "@/components/site/ModulePage";
import { Example } from "@/components/math/Example";
import { Quiz, type QuizQuestion } from "@/components/math/Quiz";
import { Tex, TexBlock } from "@/components/math/Tex";
import { useState } from "react";
import { Exercise } from "@/components/math/Exercise";
import { SolidsLab, type SolidPreset } from "@/modules/labs/SolidsLab";

type Ex = {
  title: string;
  statement: string;
  preset: Omit<SolidPreset, "nonce">;
  steps: { label: string; tex: string }[];
  answerTex: string;
  answer: number;
};

const EXERCISES: Ex[] = [
  {
    title: "Arandelas — ejemplo de clase",
    statement:
      "Halla el volumen al girar la región limitada por y = x² y y² = 8x alrededor del eje x.",
    preset: { regionId: "clase", mode: "x" },
    steps: [
      { label: "Cortes", tex: "x^2 = \\sqrt{8x} \\Rightarrow x = 0,\; x = 2" },
      { label: "Radios", tex: "R(x) = \\sqrt{8x},\\qquad r(x) = x^2" },
      {
        label: "Integral",
        tex: "V = \\pi\\int_0^2 (8x - x^4)\\,dx = \\pi\\left[4x^2 - \\frac{x^5}{5}\\right]_0^2",
      },
    ],
    answerTex: "V = \\frac{48\\pi}{5}",
    answer: (48 * Math.PI) / 5,
  },
  {
    title: "Capas — la misma región alrededor del eje y",
    statement:
      "Ahora gira la región entre y = x² y y² = 8x alrededor del eje y usando capas cilíndricas.",
    preset: { regionId: "clase", mode: "y" },
    steps: [
      { label: "Radio y altura", tex: "p(x) = x,\\qquad h(x) = \\sqrt{8x} - x^2" },
      {
        label: "Integral",
        tex: "V = 2\\pi\\int_0^2 x\\big(2\\sqrt2\\,x^{1/2} - x^2\\big)\\,dx = 2\\pi\\left[\\frac{4\\sqrt2}{5}x^{5/2} - \\frac{x^4}{4}\\right]_0^2",
      },
      { label: "Evaluar", tex: "V = 2\\pi\\left(\\frac{32}{5} - 4\\right)" },
    ],
    answerTex: "V = \\frac{24\\pi}{5}",
    answer: (24 * Math.PI) / 5,
  },
  {
    title: "Discos — y = √x",
    statement: "Calcula el volumen al girar y = √x, 0 ≤ x ≤ 4, alrededor del eje x.",
    preset: { regionId: "sqrt", mode: "x" },
    steps: [
      { label: "Radio", tex: "R(x) = \\sqrt{x}" },
      {
        label: "Integral",
        tex: "V = \\pi\\int_0^4 x\\,dx = \\pi\\left[\\frac{x^2}{2}\\right]_0^4",
      },
    ],
    answerTex: "V = 8\\pi",
    answer: 8 * Math.PI,
  },
  {
    title: "Eje desplazado — alrededor de y = −1",
    statement: "La región bajo y = x², 0 ≤ x ≤ 1, gira alrededor de la recta y = −1.",
    preset: { regionId: "x2u", mode: "yk", c: -1 },
    steps: [
      { label: "Radios medidos desde y = −1", tex: "R(x) = x^2 + 1,\\qquad r(x) = 1" },
      {
        label: "Integral",
        tex: "V = \\pi\\int_0^1 \\big[(x^2+1)^2 - 1\\big]\\,dx = \\pi\\int_0^1 (x^4 + 2x^2)\\,dx",
      },
    ],
    answerTex: "V = \\frac{13\\pi}{15}",
    answer: (13 * Math.PI) / 15,
  },
  {
    title: "Capas con eje x = −1",
    statement: "Gira la región bajo y = √x, 0 ≤ x ≤ 4, alrededor de la recta vertical x = −1.",
    preset: { regionId: "sqrt", mode: "xh", c: -1 },
    steps: [
      { label: "Radio y altura", tex: "p(x) = x + 1,\\qquad h(x) = \\sqrt{x}" },
      {
        label: "Integral",
        tex: "V = 2\\pi\\int_0^4 \\big(x^{3/2} + x^{1/2}\\big)\\,dx = 2\\pi\\left[\\frac25x^{5/2} + \\frac23x^{3/2}\\right]_0^4",
      },
      { label: "Evaluar", tex: "V = 2\\pi\\left(\\frac{64}{5} + \\frac{16}{3}\\right)" },
    ],
    answerTex: "V = \\frac{544\\pi}{15}",
    answer: (544 * Math.PI) / 15,
  },
  {
    title: "Capas + integración por partes",
    statement: "Gira la región bajo y = sen x, 0 ≤ x ≤ π, alrededor del eje y.",
    preset: { regionId: "sin", mode: "y" },
    steps: [
      { label: "Plantear", tex: "V = 2\\pi\\int_0^{\\pi} x\\sin x\\,dx" },
      {
        label: "Por partes (u = x, dv = sen x dx)",
        tex: "\\int x\\sin x\\,dx = -x\\cos x + \\sin x",
      },
      {
        label: "Evaluar",
        tex: "V = 2\\pi\\big[-x\\cos x + \\sin x\\big]_0^{\\pi} = 2\\pi\\cdot\\pi",
      },
    ],
    answerTex: "V = 2\\pi^2",
    answer: 2 * Math.PI * Math.PI,
  },
  {
    title: "Volumen de un cono",
    statement: "Gira y = x/2, 0 ≤ x ≤ 4, alrededor del eje x. Compara con la fórmula ⅓πr²h.",
    preset: { regionId: "cone", mode: "x" },
    steps: [
      {
        label: "Integral",
        tex: "V = \\pi\\int_0^4 \\frac{x^2}{4}\\,dx = \\frac{\\pi}{4}\\left[\\frac{x^3}{3}\\right]_0^4",
      },
      { label: "Comprobar", tex: "\\tfrac13\\pi r^2h = \\tfrac13\\pi(2)^2(4)" },
    ],
    answerTex: "V = \\frac{16\\pi}{3}",
    answer: (16 * Math.PI) / 3,
  },
  {
    title: "El toro (dona)",
    statement: "Gira el círculo de radio 1 centrado en (0, 2) alrededor del eje x.",
    preset: { regionId: "torus", mode: "x" },
    steps: [
      { label: "Radios", tex: "R = 2 + \\sqrt{1-x^2},\\qquad r = 2 - \\sqrt{1-x^2}" },
      { label: "Simplificar", tex: "R^2 - r^2 = 8\\sqrt{1-x^2}" },
      {
        label: "Integral (área de medio círculo)",
        tex: "V = 8\\pi\\int_{-1}^{1}\\sqrt{1-x^2}\\,dx = 8\\pi\\cdot\\frac{\\pi}{2}",
      },
    ],
    answerTex: "V = 4\\pi^2",
    answer: 4 * Math.PI * Math.PI,
  },
];

const QUIZ: QuizQuestion[] = [
  {
    prompt: "Se gira y = √x, 0 ≤ x ≤ 1, alrededor del eje x. ¿Cuál es el volumen?",
    options: ["\\dfrac{\\pi}{2}", "\\pi", "\\dfrac{2\\pi}{3}", "2\\pi"],
    answer: 0,
    explain: "Por discos: V = π∫₀¹ (√x)² dx = π∫₀¹ x dx = π/2.",
  },
  {
    prompt:
      "La región entre y = x y y = x² (0 ≤ x ≤ 1) gira alrededor del eje x. ¿Qué método es el natural?",
    options: [
      "\\text{Arandelas}",
      "\\text{Discos}",
      "\\text{Capas}",
      "\\text{Secciones cuadradas}",
    ],
    answer: 0,
    explain:
      "Hay un hueco: el radio exterior es R = x y el interior r = x², así que cada corte es una arandela.",
  },
  {
    prompt: "En el método de capas alrededor del eje y, el radio de la capa en la posición x es…",
    options: ["x", "f(x)", "f(x)^2", "2\\pi"],
    answer: 0,
    explain: "La capa está a distancia x del eje y; su altura es f(x) − g(x).",
  },
  {
    prompt: "¿Cuál integral da el volumen de una esfera de radio r?",
    options: [
      "\\pi\\int_{-r}^{r}(r^2-x^2)\\,dx",
      "\\pi\\int_{0}^{r}(r^2-x^2)\\,dx",
      "2\\pi\\int_{-r}^{r}\\sqrt{r^2-x^2}\\,dx",
      "\\int_{-r}^{r}(r^2-x^2)\\,dx",
    ],
    answer: 0,
    explain: "Discos de radio √(r² − x²) entre −r y r; el resultado es 4πr³/3.",
  },
  {
    prompt:
      "Si la región 0 ≤ y ≤ x², 0 ≤ x ≤ 1, gira alrededor de la recta y = −1, el radio interior es…",
    options: ["1", "x^2", "x^2+1", "0"],
    answer: 0,
    explain:
      "La frontera más cercana al eje es y = 0, que está a distancia 0 − (−1) = 1. El exterior es x² + 1.",
  },
  {
    prompt: "Por capas, ¿cuál es el volumen al girar y = x², 0 ≤ x ≤ 2, alrededor del eje y?",
    options: ["8\\pi", "4\\pi", "\\dfrac{32\\pi}{5}", "16\\pi"],
    answer: 0,
    explain: "V = 2π∫₀² x·x² dx = 2π·[x⁴/4]₀² = 2π·4 = 8π.",
  },
];

export function Modulo16() {
  const [preset, setPreset] = useState<SolidPreset | null>(null);
  return (
    <>
      <Section title="¿Qué es un sólido de revolución?" eyebrow="Teoría">
        <p>
          Cuando una región plana gira 360° alrededor de una recta (el <strong>eje de giro</strong>)
          genera un sólido: un cono, una esfera, un toro, un jarrón… Para calcular su volumen se
          corta el sólido en piezas delgadas cuyo volumen conocemos, se suman y se toma el límite.
          Esa suma es una integral:
        </p>
        <TexBlock boxed>
          {"V = \\lim_{n\\to\\infty}\\sum_{i=1}^{n} \\Delta V_i = \\int_a^b A(x)\\,dx"}
        </TexBlock>
        <p>
          Aquí <Tex>{"A(x)"}</Tex> es el área de la sección transversal. Según cómo cortemos el
          sólido salen tres métodos.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <h3 className="font-semibold">1. Discos</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              La región toca el eje de giro. Cada corte perpendicular al eje es un disco de radio{" "}
              <Tex>{"R(x)"}</Tex>.
            </p>
            <TexBlock>{"V = \\pi\\int_a^b R(x)^2\\,dx"}</TexBlock>
          </Card>
          <Card>
            <h3 className="font-semibold">2. Arandelas</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Hay un hueco entre la región y el eje. Cada corte es un disco con un agujero: radio
              exterior <Tex>{"R(x)"}</Tex> e interior <Tex>{"r(x)"}</Tex>.
            </p>
            <TexBlock>{"V = \\pi\\int_a^b \\big[R(x)^2 - r(x)^2\\big]\\,dx"}</TexBlock>
          </Card>
          <Card>
            <h3 className="font-semibold">3. Capas cilíndricas</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Se cortan rectángulos <strong>paralelos</strong> al eje. Al girar, cada uno forma un
              cilindro hueco de radio <Tex>{"p(x)"}</Tex> y altura <Tex>{"h(x)"}</Tex>.
            </p>
            <ul className="mt-1 space-y-0.5 text-xs text-muted-foreground">
              <li>
                <Tex>{"p(x)"}</Tex>: distancia de <Tex>{"x"}</Tex> al eje de revolución.
              </li>
              <li>
                <Tex>{"h(x)"}</Tex>: distancia entre la curva de abajo y <Tex>{"f(x)"}</Tex>.
              </li>
            </ul>
            <TexBlock>{"V = 2\\pi\\int_a^b p(x)\\,h(x)\\,dx"}</TexBlock>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <h3 className="font-semibold">¿Cómo elegir el método?</h3>
            <ul className="mt-2 space-y-1.5 text-sm">
              <li>
                Rectángulo <strong>perpendicular</strong> al eje → discos o arandelas.
              </li>
              <li>
                Rectángulo <strong>paralelo</strong> al eje → capas.
              </li>
              <li>
                Si con un método hay que despejar <Tex>{"x"}</Tex> en términos de <Tex>{"y"}</Tex>{" "}
                (o partir la integral), prueba el otro.
              </li>
              <li>
                Si el eje es <Tex>{"y = k"}</Tex> o <Tex>{"x = h"}</Tex>, los radios se miden como
                distancias a esa recta: <Tex>{"R = |f(x) - k|"}</Tex>, <Tex>{"p = |x - h|"}</Tex>.
              </li>
            </ul>
          </Card>
          <Card>
            <h3 className="font-semibold">Giro alrededor del eje y (en función de y)</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Si la región se describe como <Tex>{"x = g(y)"}</Tex>, <Tex>{"c \\le y \\le d"}</Tex>,
              los discos son horizontales:
            </p>
            <TexBlock>{"V = \\pi\\int_c^d g(y)^2\\,dy"}</TexBlock>
            <p className="text-sm text-muted-foreground">
              Ese resultado debe coincidir con el de capas usando <Tex>{"x"}</Tex>: es una buena
              forma de comprobar el ejercicio.
            </p>
          </Card>
        </div>
      </Section>

      <Section title="Sólidos de revolución en 3D" eyebrow="Laboratorio">
        <p>
          Elige una región y el eje de giro. Mueve el ángulo o pulsa <strong>Animar el giro</strong>{" "}
          para ver cómo la región naranja barre el sólido. Activa el elemento representativo para
          ver el disco, la arandela o la capa que se suma en la integral. Debajo aparece la integral
          planteada y su valor.
        </p>
        <SolidsLab preset={preset} />
      </Section>

      <Section title="Ejemplos resueltos" eyebrow="Práctica">
        <Example
          title="Ejemplo de clase — Región limitada por y = x² y y² = 8x, alrededor del eje x"
          statement="Determine el volumen del sólido obtenido al hacer girar la región. (Es la región que el laboratorio muestra al abrir.)"
          steps={[
            {
              label: "Despejar y",
              tex: "y^2 = 8x \\Rightarrow y = \\sqrt{8x} \\;(\\text{rama de arriba})",
            },
            {
              label: "Puntos de corte",
              tex: "x^2 = \\sqrt{8x} \\Rightarrow x^4 = 8x \\Rightarrow x(x^3 - 8) = 0 \\Rightarrow x = 0,\\; x = 2",
            },
            { label: "Radios (arandelas)", tex: "R(x) = \\sqrt{8x}, \\qquad r(x) = x^2" },
            {
              label: "Plantear",
              tex: "V = \\pi\\int_0^2 \\Big[(\\sqrt{8x})^2 - (x^2)^2\\Big]\\,dx = \\pi\\int_0^2 \\big(8x - x^4\\big)\\,dx",
            },
            {
              label: "Integrar",
              tex: "V = \\pi\\left[4x^2 - \\frac{x^5}{5}\\right]_0^2 = \\pi\\left(16 - \\frac{32}{5}\\right)",
            },
          ]}
          result={"V = \\frac{48\\pi}{5} \\approx 30.1593 \\text{ u}^3"}
        />
        <Example
          title="Ejemplo 1 — Discos: y = √x, 0 ≤ x ≤ 4, alrededor del eje x"
          statement="La región toca el eje, así que cada corte es un disco de radio R(x) = √x."
          steps={[
            { label: "Radio del disco", tex: "R(x) = \\sqrt{x}" },
            {
              label: "Plantear",
              tex: "V = \\pi\\int_0^4 (\\sqrt{x})^2\\,dx = \\pi\\int_0^4 x\\,dx",
            },
            { label: "Integrar", tex: "V = \\pi\\left[\\frac{x^2}{2}\\right]_0^4 = \\pi\\cdot 8" },
          ]}
          result={"V = 8\\pi \\approx 25.1327 \\text{ u}^3"}
        />
        <Example
          title="Ejemplo 2 — Arandelas: entre y = x y y = x², alrededor del eje x"
          statement="Entre 0 y 1 la recta está por encima de la parábola; la región no toca el eje en su interior."
          steps={[
            { label: "Puntos de corte", tex: "x = x^2 \\Rightarrow x = 0,\\; x = 1" },
            {
              label: "Radios",
              tex: "R(x) = x \\;(\\text{exterior}), \\qquad r(x) = x^2 \\;(\\text{interior})",
            },
            { label: "Plantear", tex: "V = \\pi\\int_0^1 \\big(x^2 - x^4\\big)\\,dx" },
            {
              label: "Integrar",
              tex: "V = \\pi\\left[\\frac{x^3}{3} - \\frac{x^5}{5}\\right]_0^1 = \\pi\\left(\\frac13 - \\frac15\\right)",
            },
          ]}
          result={"V = \\frac{2\\pi}{15} \\approx 0.4189 \\text{ u}^3"}
        />
        <Example
          title="Ejemplo 3 — Capas: la misma región alrededor del eje y"
          statement="Ahora los rectángulos verticales son paralelos al eje y, por eso usamos capas."
          steps={[
            { label: "Radio y altura de la capa", tex: "p(x) = x, \\qquad h(x) = x - x^2" },
            {
              label: "Plantear",
              tex: "V = 2\\pi\\int_0^1 x\\,(x - x^2)\\,dx = 2\\pi\\int_0^1 (x^2 - x^3)\\,dx",
            },
            {
              label: "Integrar",
              tex: "V = 2\\pi\\left[\\frac{x^3}{3} - \\frac{x^4}{4}\\right]_0^1 = 2\\pi\\cdot\\frac{1}{12}",
            },
          ]}
          result={"V = \\frac{\\pi}{6} \\approx 0.5236 \\text{ u}^3"}
        />
        <Example
          title="Ejemplo 4 — Arandelas con eje desplazado: y = x², 0 ≤ x ≤ 1, alrededor de y = −1"
          statement="Los radios se miden desde la recta y = −1."
          steps={[
            { label: "Radio exterior", tex: "R(x) = x^2 - (-1) = x^2 + 1" },
            { label: "Radio interior", tex: "r(x) = 0 - (-1) = 1" },
            {
              label: "Plantear",
              tex: "V = \\pi\\int_0^1 \\big[(x^2+1)^2 - 1\\big]\\,dx = \\pi\\int_0^1 (x^4 + 2x^2)\\,dx",
            },
            {
              label: "Integrar",
              tex: "V = \\pi\\left[\\frac{x^5}{5} + \\frac{2x^3}{3}\\right]_0^1 = \\pi\\left(\\frac15 + \\frac23\\right)",
            },
          ]}
          result={"V = \\frac{13\\pi}{15} \\approx 2.7227 \\text{ u}^3"}
        />
        <Example
          title="Ejemplo 5 — Volumen de la esfera"
          statement="Al girar el semicírculo y = √(r² − x²) alrededor del eje x se obtiene una esfera de radio r."
          steps={[
            { label: "Discos", tex: "V = \\pi\\int_{-r}^{r} \\big(r^2 - x^2\\big)\\,dx" },
            {
              label: "Integrar",
              tex: "V = \\pi\\left[r^2x - \\frac{x^3}{3}\\right]_{-r}^{r} = \\pi\\left(\\frac{2r^3}{3} + \\frac{2r^3}{3}\\right)",
            },
          ]}
          result={"V = \\frac{4}{3}\\pi r^3"}
        />
      </Section>

      <Section title="Ejercicios interactivos" eyebrow="Practica tú">
        <p>
          Resuelve cada ejercicio y escribe tu respuesta (por ejemplo <code>48pi/5</code>). Si te
          atascas, pide los pasos uno a uno. Con <strong>Ver en 3D</strong> el sólido se carga y se
          anima en el laboratorio de arriba.
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
              showLabel="Ver en 3D"
              onShow={() => setPreset({ ...e.preset, nonce: Date.now() })}
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
