import { createFileRoute, notFound } from "@tanstack/react-router";
import { ComingSoon, ModulePage } from "@/components/site/ModulePage";
import { getModule } from "@/modules/registry";
import { Modulo1 } from "@/modules/m1-riemann/Modulo1";
import { Modulo2 } from "@/modules/m2-trapecio/Modulo2";
import { Modulo3 } from "@/modules/m3-punto-medio/Modulo3";
import { Modulo4 } from "@/modules/m4-simpson/Modulo4";
import { Modulo5 } from "@/modules/m5-integral-definida/Modulo5";
import { Modulo6 } from "@/modules/m6-integracion-directa/Modulo6";
import { Modulo7 } from "@/modules/m7-sustitucion/Modulo7";
import { Modulo8 } from "@/modules/m8-exponenciales/Modulo8";
import { Modulo9 } from "@/modules/m9-logaritmicas/Modulo9";
import { Modulo10 } from "@/modules/m10-trigonometricas/Modulo10";
import { Modulo11 } from "@/modules/m11-trig-inversas/Modulo11";
import { Modulo12 } from "@/modules/m12-hiperbolicas-inversas/Modulo12";
import { Modulo13 } from "@/modules/m13-trinomio/Modulo13";
import { Modulo14 } from "@/modules/m14-por-partes/Modulo14";

export const Route = createFileRoute("/modulo/$slug")({
  loader: ({ params }) => {
    const meta = getModule(params.slug);
    if (!meta) throw notFound();
    return { meta };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Módulo no encontrado" }, { name: "robots", content: "noindex" }],
      };
    }
    const { meta } = loaderData;
    const title = `Módulo ${meta.id}: ${meta.title} — Cálculo Integral UTP`;
    return {
      meta: [
        { title },
        { name: "description", content: meta.summary },
        { property: "og:title", content: title },
        { property: "og:description", content: meta.summary },
      ],
    };
  },
  component: ModuloRoute,
});

const CONTENT: Record<number, () => React.JSX.Element> = {
  1: Modulo1,
  2: Modulo2,
  3: Modulo3,
  4: Modulo4,
  5: Modulo5,
  6: Modulo6,
  7: Modulo7,
  8: Modulo8,
  9: Modulo9,
  10: Modulo10,
  11: Modulo11,
  12: Modulo12,
  13: Modulo13,
  14: Modulo14,
};

function ModuloRoute() {
  const { meta } = Route.useLoaderData();
  const Content = CONTENT[meta.id];

  return (
    <ModulePage meta={meta}>
      {meta.status === "activo" && Content ? <Content /> : <ComingSoon meta={meta} />}
    </ModulePage>
  );
}
