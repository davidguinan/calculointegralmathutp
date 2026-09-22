import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight, BookOpen, Clock, Search, Sparkles } from "lucide-react";
import { Shell } from "@/components/site/Shell";
import { MODULES } from "@/modules/registry";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cálculo Integral UTP — 14 módulos interactivos" },
      {
        name: "description",
        content:
          "Curso interactivo de Cálculo Integral de la UTP: sumas de Riemann, trapecio, punto medio, Simpson, integral definida e integración directa.",
      },
      { property: "og:title", content: "Cálculo Integral UTP — 14 módulos interactivos" },
      {
        property: "og:description",
        content:
          "Visualizadores dinámicos, fórmulas en KaTeX y ejemplos resueltos paso a paso para el curso de Cálculo Integral.",
      },
    ],
  }),
  component: Index,
});

type Filter = "todos" | "activo" | "proximamente";

function Index() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("todos");

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    return MODULES.filter((m) => {
      const okFilter = filter === "todos" || m.status === filter;
      const okTerm =
        !term ||
        m.title.toLowerCase().includes(term) ||
        m.summary.toLowerCase().includes(term) ||
        m.tags.some((t) => t.toLowerCase().includes(term)) ||
        String(m.id) === term;
      return okFilter && okTerm;
    });
  }, [q, filter]);

  const activos = MODULES.filter((m) => m.status === "activo").length;

  return (
    <Shell>
      <section className="border-b border-border bg-secondary/40 paper-grid">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-highlight px-3 py-1 text-xs font-semibold text-highlight-foreground">
            <Sparkles className="size-3.5" /> Universidad Tecnológica de Pereira
          </span>
          <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
            Cálculo Integral, aprendido con gráficas que puedes mover
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            14 módulos con teoría en notación matemática real, visualizadores interactivos y
            ejemplos resueltos paso a paso. {activos} módulos activos hoy.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/modulo/$slug"
              params={{ slug: "sumas-de-riemann" }}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Empezar por el Módulo 1 <ArrowRight className="size-4" />
            </Link>
            <a
              href="#modulos"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-5 py-2.5 text-sm font-semibold hover:bg-secondary"
            >
              Ver todos los módulos
            </a>
          </div>
        </div>
      </section>

      <section id="modulos" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar módulo, tema o número…"
              className="w-full rounded-md border border-input bg-card py-2.5 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
            />
          </div>
          <div className="flex gap-1 rounded-lg bg-secondary p-1 text-sm font-medium">
            {(
              [
                ["todos", "Todos"],
                ["activo", "Activos"],
                ["proximamente", "Próximamente"],
              ] as const
            ).map(([k, label]) => (
              <button
                key={k}
                onClick={() => setFilter(k)}
                className={`rounded-md px-3 py-1.5 transition-colors ${
                  filter === k ? "bg-primary text-primary-foreground" : "hover:bg-background/70"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((m) => (
            <Link
              key={m.id}
              to="/modulo/$slug"
              params={{ slug: m.slug }}
              className="group flex flex-col rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)] transition-transform hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-muted-foreground">
                  MÓDULO {String(m.id).padStart(2, "0")}
                </span>
                {m.status === "activo" ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-1 text-xs font-semibold text-foreground">
                    <BookOpen className="size-3.5" /> Activo
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-highlight px-2.5 py-1 text-xs font-semibold text-highlight-foreground">
                    <Clock className="size-3.5" /> {m.fase}
                  </span>
                )}
              </div>
              <h2 className="mt-3 text-lg font-semibold group-hover:text-primary">{m.title}</h2>
              <p className="mt-1 flex-1 text-sm text-muted-foreground">{m.summary}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {m.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>

        {list.length === 0 && (
          <p className="mt-10 text-center text-muted-foreground">
            No se encontraron módulos para “{q}”.
          </p>
        )}
      </section>
    </Shell>
  );
}
