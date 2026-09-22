import { createFileRoute, notFound } from "@tanstack/react-router";
import { ComingSoon, ModulePage } from "@/components/site/ModulePage";
import { getModule } from "@/modules/registry";
import { Modulo1 } from "@/modules/m1-riemann/Modulo1";
import { Modulo2 } from "@/modules/m2-trapecio/Modulo2";
import { Modulo3 } from "@/modules/m3-punto-medio/Modulo3";
import { Modulo4 } from "@/modules/m4-simpson/Modulo4";
import { Modulo5 } from "@/modules/m5-integral-definida/Modulo5";
import { Modulo6 } from "@/modules/m6-integracion-directa/Modulo6";

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
