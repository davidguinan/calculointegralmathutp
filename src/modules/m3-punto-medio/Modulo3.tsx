import { Section } from "@/components/site/ModulePage";
import { Example } from "@/components/math/Example";
import { Tex, TexBlock } from "@/components/math/Tex";
import { RectanglesLab } from "@/modules/labs/RectanglesLab";

export function Modulo3() {
  return (
    <>
      <Section title="La regla del punto medio" eyebrow="Teoría">
        <p>
          Se usan rectángulos cuya altura se toma en el centro de cada subintervalo. Con{" "}
          <Tex>{"h = \\frac{b-a}{n}"}</Tex> y <Tex>{"\\bar{x}_i = a + \\left(i - \\tfrac{1}{2}\\right)h"}</Tex>:
        </p>
        <TexBlock boxed>{"M_n = h\\sum_{i=1}^{n} f(\\bar{x}_i)"}</TexBlock>
        <p>
          Geométricamente, el exceso de área de un lado del rectángulo compensa el defecto del otro
          lado; por eso el punto medio suele ser <strong>el doble de preciso</strong> que el
          trapecio.
        </p>
        <TexBlock boxed>{"|E_M| \\le \\frac{K (b-a)^3}{24 n^2}"}</TexBlock>
        <p>
          Además se cumple la relación útil <Tex>{"S_{2n} = \\frac{T_n + 2M_n}{3}"}</Tex>, que
          conecta el punto medio y el trapecio con la regla de Simpson.
        </p>
      </Section>

      <Section title="Visualizador de rectángulos centrados" eyebrow="Laboratorio">
        <RectanglesLab fixedMode="mid" defaultFn="sqrt" />
      </Section>

      <Section title="Ejemplos resueltos" eyebrow="Práctica">
        <Example
          title="Ejemplo 1 — ∫₀² x² dx con n = 4"
          statement="Aplica la regla del punto medio y compara con el trapecio."
          steps={[
            { label: "Ancho de paso", tex: "h = \\frac{2-0}{4} = 0.5" },
            { label: "Puntos medios", tex: "0.25,\\;0.75,\\;1.25,\\;1.75" },
            { label: "Imágenes", tex: "0.0625,\\;0.5625,\\;1.5625,\\;3.0625" },
            { label: "Sumar", tex: "\\sum f(\\bar{x}_i) = 5.25" },
            { label: "Multiplicar por h", tex: "M_4 = 0.5 (5.25) = 2.625" },
            {
              label: "Comparar",
              tex: "\\left|2.625 - \\tfrac{8}{3}\\right| \\approx 0.0417 \\;<\\; 0.0833 = |E_{T_4}|",
            },
          ]}
          result="M_4 = 2.625"
        />
        <Example
          title="Ejemplo 2 — ∫₀^π sin(x) dx con n = 4"
          statement="Aproxima el área bajo un arco de seno (valor exacto = 2)."
          steps={[
            { label: "Ancho de paso", tex: "h = \\frac{\\pi}{4} \\approx 0.785398" },
            {
              label: "Puntos medios",
              tex: "\\frac{\\pi}{8},\\;\\frac{3\\pi}{8},\\;\\frac{5\\pi}{8},\\;\\frac{7\\pi}{8}",
            },
            { label: "Imágenes", tex: "0.382683,\\;0.923880,\\;0.923880,\\;0.382683" },
            { label: "Sumar", tex: "\\sum f(\\bar{x}_i) = 2.613126" },
            { label: "Multiplicar por h", tex: "M_4 = 0.785398 \\times 2.613126 \\approx 2.052344" },
          ]}
          result="M_4 \\approx 2.0523 \\quad (\\text{error} \\approx 0.0523)"
        />
      </Section>
    </>
  );
}
