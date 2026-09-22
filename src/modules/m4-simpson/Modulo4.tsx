import { Section } from "@/components/site/ModulePage";
import { Example } from "@/components/math/Example";
import { Tex, TexBlock } from "@/components/math/Tex";
import { SimpsonLab } from "@/modules/labs/SimpsonLab";

export function Modulo4() {
  return (
    <>
      <Section title="La regla de Simpson 1/3" eyebrow="Teoría">
        <p>
          En vez de segmentos rectos, se ajusta una <strong>parábola</strong> a cada par de
          subintervalos consecutivos. Por eso <Tex>{"n"}</Tex> debe ser <strong>par</strong>: cada
          parábola necesita tres nodos <Tex>{"(x_{i-1}, x_i, x_{i+1})"}</Tex>.
        </p>
        <TexBlock boxed>
          {"S_n = \\frac{h}{3}\\Big[f(x_0) + 4f(x_1) + 2f(x_2) + 4f(x_3) + \\cdots + 4f(x_{n-1}) + f(x_n)\\Big]"}
        </TexBlock>
        <p>
          El patrón de coeficientes es <Tex>{"1, 4, 2, 4, 2, \\ldots, 4, 1"}</Tex>: índices impares
          llevan 4 e índices pares interiores llevan 2.
        </p>
        <TexBlock boxed>{"|E_S| \\le \\frac{K (b-a)^5}{180 n^4}, \\quad |f^{(4)}(x)| \\le K"}</TexBlock>
        <p>
          Al decrecer como <Tex>{"1/n^4"}</Tex>, Simpson es exacta para polinomios de grado{" "}
          <Tex>{"\\le 3"}</Tex>.
        </p>
      </Section>

      <Section title="Visualizador de parábolas ajustadas" eyebrow="Laboratorio">
        <SimpsonLab />
      </Section>

      <Section title="Ejemplos resueltos" eyebrow="Práctica">
        <Example
          title="Ejemplo 1 — ∫₀² x² dx con n = 4"
          statement="Verifica que Simpson es exacta para polinomios de grado 2."
          steps={[
            { label: "Verificar n par", tex: "n = 4 \\text{ es par} \\;\\Rightarrow\\; h = 0.5" },
            { label: "Imágenes", tex: "f(0)=0,\\;f(0.5)=0.25,\\;f(1)=1,\\;f(1.5)=2.25,\\;f(2)=4" },
            {
              label: "Aplicar coeficientes 1,4,2,4,1",
              tex: "S_4 = \\frac{0.5}{3}\\big[0 + 4(0.25) + 2(1) + 4(2.25) + 4\\big]",
            },
            { label: "Operar", tex: "S_4 = \\frac{0.5}{3}(16) = \\frac{8}{3}" },
          ]}
          result="S_4 = \\frac{8}{3} \\approx 2.666667 \\quad (\\text{error} = 0)"
        />
        <Example
          title="Ejemplo 2 — ∫₁² (1/x) dx con n = 4"
          statement="Aproxima ln 2 con la regla de Simpson."
          steps={[
            { label: "Paso", tex: "h = \\frac{2-1}{4} = 0.25" },
            {
              label: "Imágenes",
              tex: "f(1)=1,\\;f(1.25)=0.8,\\;f(1.5)=0.\\overline{6},\\;f(1.75)=0.571429,\\;f(2)=0.5",
            },
            {
              label: "Sustituir",
              tex: "S_4 = \\frac{0.25}{3}\\big[1 + 4(0.8) + 2(0.6667) + 4(0.571429) + 0.5\\big]",
            },
            { label: "Operar", tex: "S_4 = \\frac{0.25}{3}(8.318048) \\approx 0.693254" },
            { label: "Comparar", tex: "\\ln 2 \\approx 0.693147" },
          ]}
          result="S_4 \\approx 0.693254 \\quad (\\text{error} \\approx 1.1\\times10^{-4})"
        />
      </Section>
    </>
  );
}
