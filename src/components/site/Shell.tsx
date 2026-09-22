import { Link } from "@tanstack/react-router";
import { Sigma } from "lucide-react";
import type { ReactNode } from "react";

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Sigma className="size-5" />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-base font-semibold">Cálculo Integral</span>
              <span className="block text-xs text-muted-foreground">
                Universidad Tecnológica de Pereira
              </span>
            </span>
          </Link>
          <Link
            to="/"
            className="rounded-md border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-secondary"
          >
            Módulos
          </Link>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-6xl px-4 text-sm text-muted-foreground sm:px-6">
          Plataforma educativa de Cálculo Integral · UTP · 14 módulos
        </div>
      </footer>
    </div>
  );
}
