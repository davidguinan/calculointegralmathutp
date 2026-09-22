import { Card, Section } from "@/components/site/ModulePage";
import { Example } from "@/components/math/Example";
import { Tex, TexBlock } from "@/components/math/Tex";
import { RectanglesLab } from "@/modules/labs/RectanglesLab";

export function Modulo1() {
  return (
    <>
      <Section title="¿Qué es una suma de Riemann?" eyebrow="Teoría">
        <p>
          Para aproximar el área bajo la curva de <Tex>{"f"}</Tex> en <Tex>{"[a,b]"}</Tex>{" "}
          dividimos el intervalo en <Tex>{"n"}</Tex> subintervalos de ancho
        </p>
        <TexBlock boxed>{"\\Delta x = \\frac{b-a}{n}, \\qquad x_i = a + i\\,\\Delta x"}</TexBlock>
        <p>
          En cada subintervalo <Tex>{"[x_{i-1}, x_i]"}</Tex> elegimos un punto muestra{" "}
          <Tex>{"x_i^{*}"}</Tex> y construimos un rectángulo de altura <Tex>{"f(x_i^{*})"}</Tex>.
          La suma de sus áreas es la suma de Riemann:
        </p>
        <TexBlock boxed>{"S_n = \\sum_{i=1}^{n} f(x_i^{*})\\,\\Delta x"}</TexBlock>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <h3 className="font-semibold">Suma izquierda</h3>
            <TexBlock>{"L_n = \\sum_{i=0}^{n-1} f(x_i)\\,\\Delta x"}</TexBlock>
            <p className="text-sm text-muted-foreground">
              Subestima el área si <Tex>{"f"}</Tex> es creciente.
            </p>
          </Card>
          <Card>
            <h3 className="font-semibold">Suma derecha</h3>
            <TexBlock>{"R_n = \\sum_{i=1}^{n} f(x_i)\\,\\Delta x"}</TexBlock>
            <p className="text-sm text-muted-foreground">
              Sobrestima el área si <Tex>{"f"}</Tex> es creciente.
            </p>
          </Card>
          <Card>
            <h3 className="font-semibold">Punto medio</h3>
            <TexBlock>{"M_n = \\sum_{i=1}^{n} f\\!\\left(\\bar{x}_i\\right)\\Delta x"}</TexBlock>
            <p className="text-sm text-muted-foreground">
              Con <Tex>{"\\bar{x}_i = \\tfrac{x_{i-1}+x_i}{2}"}</Tex>: mucho más precisa.
            </p>
          </Card>
        </div>
        <p>
          Cuando <Tex>{"n \\to \\infty"}</Tex> las tres sumas convergen al mismo valor: la integral
          definida.
        </p>
        <TexBlock boxed>
          {"\\int_a^b f(x)\\,dx = \\lim_{n \\to \\infty} \\sum_{i=1}^{n} f(x_i^{*})\\,\\Delta x"}
        </TexBlock>
      </Section>

      <Section title="Visualizador interactivo" eyebrow="Laboratorio">
        <p>
          Cambia la función, los límites y desliza <Tex>{"n"}</Tex> para observar la convergencia
          numérica en tiempo real.
        </p>
        <RectanglesLab />
      </Section>

      <Section title="Ejemplos resueltos" eyebrow="Práctica">
        <Example
          title="Ejemplo 1 — Suma derecha de f(x) = x² en [0, 2] con n = 4"
          statement="Aproxima el área bajo la parábola usando rectángulos con altura en el extremo derecho."
          steps={[
            { label: "Calcular Δx", tex: "\\Delta x = \\frac{2-0}{4} = 0.5" },
            { label: "Nodos", tex: "x_1=0.5,\\; x_2=1,\\; x_3=1.5,\\; x_4=2" },
            {
              label: "Evaluar la función",
              tex: "f(0.5)=0.25,\\; f(1)=1,\\; f(1.5)=2.25,\\; f(2)=4",
            },
            {
              label: "Sumar y multiplicar por Δx",
              tex: "R_4 = 0.5\\,(0.25+1+2.25+4) = 0.5(7.5)",
            },
            {
              label: "Comparar con el valor exacto",
              tex: "\\int_0^2 x^2\\,dx = \\frac{8}{3} \\approx 2.6667",
            },
          ]}
          result="R_4 = 3.75 \\quad (\\text{error} \\approx 1.0833)"
        />
        <Example
          title="Ejemplo 2 — Límite de la suma de Riemann de f(x) = x² en [0, 1]"
          statement="Calcula la integral exacta como límite de la suma derecha."
          steps={[
            { label: "Partición uniforme", tex: "\\Delta x = \\frac{1}{n}, \\quad x_i = \\frac{i}{n}" },
            {
              label: "Armar la suma",
              tex: "S_n = \\sum_{i=1}^{n} \\left(\\frac{i}{n}\\right)^2 \\frac{1}{n} = \\frac{1}{n^3}\\sum_{i=1}^{n} i^2",
            },
            {
              label: "Usar la fórmula de suma de cuadrados",
              tex: "\\sum_{i=1}^{n} i^2 = \\frac{n(n+1)(2n+1)}{6}",
            },
            {
              label: "Simplificar",
              tex: "S_n = \\frac{(n+1)(2n+1)}{6n^2} = \\frac{2n^2+3n+1}{6n^2}",
            },
            {
              label: "Tomar el límite",
              tex: "\\lim_{n\\to\\infty} S_n = \\frac{2}{6} = \\frac{1}{3}",
            },
          ]}
          result="\\int_0^1 x^2\\,dx = \\frac{1}{3}"
        />
      </Section>
    </>
  );
}
