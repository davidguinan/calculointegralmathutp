import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import type { ReactNode } from "react";
import { MODULES, type ModuleMeta } from "@/modules/registry";
import { Shell } from "./Shell";

export function ModulePage({ meta, children }: { meta: ModuleMeta; children: ReactNode }) {
  const prev = MODULES.find((m) => m.id === meta.id - 1);
  const next = MODULES.find((m) => m.id === meta.id + 1);

  return (
    <Shell>
      <div className="border-b border-border bg-secondary/40 paper-grid">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> Todos los módulos
          </Link>
          <p className="mt-4 text-sm font-semibold tracking-wide text-accent-foreground">
            MÓDULO {meta.id}
          </p>
          <h1 className="mt-1 text-3xl font-bold sm:text-4xl">{meta.title}</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">{meta.summary}</p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl space-y-10 px-4 py-10 sm:px-6">{children}</div>

      <nav className="mx-auto flex max-w-5xl flex-col gap-3 px-4 pb-12 sm:flex-row sm:justify-between sm:px-6">
        {prev ? (
          <Link
            to="/modulo/$slug"
            params={{ slug: prev.slug }}
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-3 text-sm hover:bg-secondary"
          >
            <ArrowLeft className="size-4" /> {prev.id}. {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link
            to="/modulo/$slug"
            params={{ slug: next.slug }}
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-3 text-sm hover:bg-secondary"
          >
            {next.id}. {next.title} <ArrowRight className="size-4" />
          </Link>
        )}
      </nav>
    </Shell>
  );
}

export function Section({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow?: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4">
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {eyebrow}
        </p>
      )}
      <h2 className="text-2xl font-semibold">{title}</h2>
      <div className="space-y-4 leading-relaxed text-foreground/90">{children}</div>
    </section>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)] ${className}`}
    >
      {children}
    </div>
  );
}

export function ComingSoon({ meta }: { meta: ModuleMeta }) {
  return (
    <Card className="mx-auto max-w-2xl text-center">
      <div className="mx-auto grid size-14 place-items-center rounded-full bg-highlight text-highlight-foreground">
        <Clock className="size-7" />
      </div>
      <h2 className="mt-5 text-2xl font-semibold">Próximamente — {meta.fase ?? "Fase 2"}</h2>
      <p className="mt-3 text-muted-foreground">
        El módulo <strong>{meta.title}</strong> está en construcción y se habilitará en la{" "}
        {meta.fase ?? "Fase 2"} del curso.
      </p>
      <p className="mt-2 text-sm text-muted-foreground">{meta.summary}</p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
      >
        <ArrowLeft className="size-4" /> Volver a los módulos activos
      </Link>
    </Card>
  );
}
