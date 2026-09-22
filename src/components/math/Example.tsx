import type { ReactNode } from "react";
import { TexBlock } from "./Tex";

export function Example({
  title,
  statement,
  steps,
  result,
}: {
  title: string;
  statement: string;
  steps: { label: string; body?: ReactNode; tex?: string }[];
  result: string;
}) {
  return (
    <article className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{statement}</p>
      <ol className="mt-4 space-y-4">
        {steps.map((s, i) => (
          <li key={i} className="border-l-2 border-accent/70 pl-4">
            <p className="text-sm font-semibold">
              Paso {i + 1}. {s.label}
            </p>
            {s.body && <div className="mt-1 text-sm text-foreground/90">{s.body}</div>}
            {s.tex && <TexBlock>{s.tex}</TexBlock>}
          </li>
        ))}
      </ol>
      <div className="mt-4 rounded-lg bg-highlight px-4 py-3 text-highlight-foreground">
        <p className="text-xs font-semibold uppercase tracking-widest">Resultado</p>
        <TexBlock className="!py-1">{result}</TexBlock>
      </div>
    </article>
  );
}
