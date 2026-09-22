import { Card, Section } from "@/components/site/ModulePage";
import { Example } from "@/components/math/Example";
import { Tex, TexBlock } from "@/components/math/Tex";
import { AreaLab } from "@/modules/labs/AreaLab";

export function Modulo5() {
  return (
    <>
      <Section title="Teorema Fundamental del Cálculo" eyebrow="Teoría">
        <p>
          El TFC conecta las dos ideas centrales del curso: la derivada y el área acumulada.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <h3 className="font-semibold">Primera parte</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Si <Tex>{"f"}</Tex> es continua en <Tex>{"[a,b]"}</Tex>, la función de área es
              derivable y su derivada es <Tex>{"f"}</Tex>.
            </p>
            <TexBlock>
              {"g(x) = \\int_a^x f(t)\\,dt \\;\\Longrightarrow\\; g'(x) = f(x)"}
            </TexBlock>
          </Card>
          <Card>
            <h3 className="font-semibold">Segunda parte</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Si <Tex>{"F"}</Tex> es cualquier antiderivada de <Tex>{"f"}</Tex>:
            </p>
            <TexBlock>{"\\int_a^b f(x)\\,dx = F(b) - F(a)"}</TexBlock>
          </Card>
        </div>
        <p>Propiedades esenciales de la integral definida:</p>
        <TexBlock boxed>
          {"\\int_a^b [\\,\\alpha f + \\beta g\\,]\\,dx = \\alpha\\!\\int_a^b f\\,dx + \\beta\\!\\int_a^b g\\,dx, \\qquad \\int_a^b f = \\int_a^c f + \\int_c^b f, \\qquad \\int_a^b f = -\\int_b^a f"}
        </TexBlock>
        <p>
          <strong>Área vs. integral:</strong> donde <Tex>{"f(x) < 0"}</Tex> la integral es
          negativa; para el área geométrica se usa <Tex>{"\\int_a^b |f(x)|\\,dx"}</Tex>. Entre dos
          curvas con <Tex>{"f \\ge g"}</Tex>:
        </p>
        <TexBlock boxed>{"A = \\int_a^b \\big[f(x) - g(x)\\big]\\,dx"}</TexBlock>
      </Section>

      <Section title="Área bajo la curva (a y b ajustables)" eyebrow="Laboratorio">
        <AreaLab />
      </Section>

      <Section title="Ejemplos resueltos" eyebrow="Práctica">
        <Example
          title="Ejemplo 1 — Área bajo f(x) = x² + 1 en [0, 3]"
          statement="Calcula la integral definida usando el TFC."
          steps={[
            { label: "Hallar una antiderivada", tex: "F(x) = \\frac{x^3}{3} + x" },
            { label: "Evaluar en los límites", tex: "F(3) = \\frac{27}{3} + 3 = 12" },
            { label: "Evaluar en a", tex: "F(0) = 0" },
            { label: "Restar", tex: "\\int_0^3 (x^2+1)\\,dx = 12 - 0" },
          ]}
          result="\\int_0^3 (x^2+1)\\,dx = 12"
        />
        <Example
          title="Ejemplo 2 — Área entre y = x² y y = 2x"
          statement="Determina el área de la región encerrada entre ambas curvas."
          steps={[
            {
              label: "Hallar los puntos de corte",
              tex: "x^2 = 2x \\;\\Rightarrow\\; x(x-2)=0 \\;\\Rightarrow\\; x=0,\\;x=2",
            },
            {
              label: "Identificar la curva superior",
              tex: "\\text{en } (0,2):\\; 2x \\ge x^2 \\quad (\\text{p.ej. } x=1:\\;2>1)",
            },
            { label: "Plantear la integral", tex: "A = \\int_0^2 \\big(2x - x^2\\big)\\,dx" },
            { label: "Antiderivar", tex: "A = \\left[ x^2 - \\frac{x^3}{3} \\right]_0^2" },
            { label: "Evaluar", tex: "A = \\left(4 - \\frac{8}{3}\\right) - 0 = \\frac{4}{3}" },
          ]}
          result="A = \\frac{4}{3} \\approx 1.3333 \\text{ u}^2"
        />
      </Section>
    </>
  );
}
