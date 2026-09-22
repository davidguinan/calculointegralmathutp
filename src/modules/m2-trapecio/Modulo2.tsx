import { Section } from "@/components/site/ModulePage";
import { Example } from "@/components/math/Example";
import { Tex, TexBlock } from "@/components/math/Tex";
import { TrapezoidLab } from "@/modules/labs/TrapezoidLab";

export function Modulo2() {
  return (
    <>
      <Section title="La regla del trapecio" eyebrow="Teoría">
        <p>
          En lugar de rectángulos, unimos con un segmento recto los puntos{" "}
          <Tex>{"(x_{i-1}, f(x_{i-1}))"}</Tex> y <Tex>{"(x_i, f(x_i))"}</Tex>. Cada subintervalo
          genera un trapecio de altura <Tex>{"h"}</Tex> y bases <Tex>{"f(x_{i-1})"}</Tex> y{" "}
          <Tex>{"f(x_i)"}</Tex>.
        </p>
        <TexBlock boxed>
          {"A_i = \\frac{h}{2}\\left[f(x_{i-1}) + f(x_i)\\right], \\qquad h = \\frac{b-a}{n}"}
        </TexBlock>
        <p>Al sumar todos los trapecios, los nodos interiores aparecen dos veces:</p>
        <TexBlock boxed>
          {"T_n = \\frac{h}{2}\\Big[f(x_0) + 2f(x_1) + 2f(x_2) + \\cdots + 2f(x_{n-1}) + f(x_n)\\Big]"}
        </TexBlock>
        <p>
          <strong>Error:</strong> si <Tex>{"|f''(x)| \\le K"}</Tex> en <Tex>{"[a,b]"}</Tex>,
          entonces
        </p>
        <TexBlock boxed>{"|E_T| \\le \\frac{K (b-a)^3}{12 n^2}"}</TexBlock>
        <p>
          Es decir, el error decrece con <Tex>{"1/n^2"}</Tex>: duplicar <Tex>{"n"}</Tex> reduce el
          error a la cuarta parte.
        </p>
      </Section>

      <Section title="Visualizador de trapecios" eyebrow="Laboratorio">
        <TrapezoidLab />
      </Section>

      <Section title="Ejemplos resueltos" eyebrow="Práctica">
        <Example
          title="Ejemplo 1 — ∫₀² x² dx con n = 4"
          statement="Aplica la regla del trapecio y compara con el valor exacto 8/3."
          steps={[
            { label: "Ancho de paso", tex: "h = \\frac{2-0}{4} = 0.5" },
            { label: "Nodos", tex: "x_0=0,\\;x_1=0.5,\\;x_2=1,\\;x_3=1.5,\\;x_4=2" },
            { label: "Imágenes", tex: "0,\\;0.25,\\;1,\\;2.25,\\;4" },
            {
              label: "Fórmula del trapecio",
              tex: "T_4 = \\frac{0.5}{2}\\big[0 + 2(0.25) + 2(1) + 2(2.25) + 4\\big]",
            },
            { label: "Operar", tex: "T_4 = 0.25\\,(11) = 2.75" },
            { label: "Error", tex: "|E| = \\left|2.75 - \\tfrac{8}{3}\\right| \\approx 0.0833" },
          ]}
          result="T_4 = 2.75"
        />
        <Example
          title="Ejemplo 2 — ∫₁² (1/x) dx con n = 4"
          statement="Aproxima el logaritmo natural de 2 mediante trapecios."
          steps={[
            { label: "Ancho de paso", tex: "h = \\frac{2-1}{4} = 0.25" },
            { label: "Nodos", tex: "1,\\;1.25,\\;1.5,\\;1.75,\\;2" },
            {
              label: "Imágenes",
              tex: "1,\\;0.8,\\;0.\\overline{6},\\;0.571428,\\;0.5",
            },
            {
              label: "Sustituir",
              tex: "T_4 = \\frac{0.25}{2}\\big[1 + 2(0.8) + 2(0.6667) + 2(0.5714) + 0.5\\big]",
            },
            { label: "Operar", tex: "T_4 = 0.125\\,(5.5762) \\approx 0.697024" },
            { label: "Comparar", tex: "\\ln 2 \\approx 0.693147" },
          ]}
          result="T_4 \\approx 0.6970 \\quad (\\text{error} \\approx 3.9\\times10^{-3})"
        />
      </Section>
    </>
  );
}
