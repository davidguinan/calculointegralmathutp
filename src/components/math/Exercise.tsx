import { useState } from "react";
import { CheckCircle2, Eye, Lightbulb, RotateCcw, XCircle } from "lucide-react";
import { Tex, TexBlock } from "./Tex";

/** Evalúa respuestas escritas por el estudiante: 48pi/5, 2*sqrt(2), 9/2, 3.1416… */
export function parseAnswer(input: string): number | null {
  const s = input
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/,/g, ".")
    .replace(/π/g, "pi")
    .replace(/√/g, "sqrt")
    .replace(/×|·/g, "*")
    .replace(/\^/g, "**");
  if (!s || !/^[0-9.+\-*/()a-z]*$/.test(s)) return null;
  const words = s.match(/[a-z]+/g) ?? [];
  if (words.some((w) => !["pi", "sqrt", "e", "ln"].includes(w))) return null;
  const js = s
    .replace(/sqrt(\d+(?:\.\d+)?)/g, "sqrt($1)")
    .replace(/(\d|\))(?=pi|sqrt|ln|e\b|\()/g, "$1*")
    .replace(/pi/g, "(Math.PI)")
    .replace(/sqrt/g, "Math.sqrt")
    .replace(/ln/g, "Math.log")
    .replace(/\be\b/g, "(Math.E)");
  try {
    const v = Function(`"use strict";return (${js});`)() as unknown;
    return typeof v === "number" && Number.isFinite(v) ? v : null;
  } catch {
    return null;
  }
}

export function Exercise({
  n,
  title,
  statement,
  tex,
  steps,
  answerTex,
  answer,
  onShow,
  showLabel = "Ver en la gráfica",
}: {
  n: number;
  title: string;
  statement: string;
  tex?: string;
  steps: { label: string; tex: string }[];
  answerTex: string;
  answer: number;
  onShow?: (() => void) | undefined;
  showLabel?: string;
}) {
  const [value, setValue] = useState("");
  const [result, setResult] = useState<"ok" | "bad" | "invalid" | null>(null);
  const [shown, setShown] = useState(0);

  const check = () => {
    const v = parseAnswer(value);
    if (v === null) return setResult("invalid");
    setResult(Math.abs(v - answer) <= Math.max(1e-3, Math.abs(answer) * 2e-3) ? "ok" : "bad");
  };

  return (
    <article className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs font-semibold text-muted-foreground">EJERCICIO {n}</p>
          <h3 className="font-display text-lg font-semibold">{title}</h3>
        </div>
        {onShow && (
          <button
            onClick={onShow}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90"
          >
            <Eye className="size-3.5" /> {showLabel}
          </button>
        )}
      </div>
      <p className="mt-2 text-sm text-foreground/90">{statement}</p>
      {tex && <TexBlock>{tex}</TexBlock>}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setResult(null);
          }}
          onKeyDown={(e) => e.key === "Enter" && check()}
          placeholder="Tu respuesta (ej: 48pi/5, 9/2, 2sqrt(2))"
          className="min-w-0 flex-1 rounded-md border border-input bg-background px-3 py-2 font-mono text-sm"
        />
        <button
          onClick={check}
          className="rounded-md bg-accent px-3 py-2 text-sm font-semibold text-accent-foreground hover:opacity-90"
        >
          Comprobar
        </button>
      </div>
      {result && (
        <div
          className={`mt-2 flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
            result === "ok" ? "bg-success/15" : "bg-destructive/10"
          }`}
        >
          {result === "ok" ? (
            <CheckCircle2 className="size-4 shrink-0 text-success" />
          ) : (
            <XCircle className="size-4 shrink-0 text-destructive" />
          )}
          {result === "ok" && (
            <span>
              <strong>¡Correcto!</strong> <Tex>{answerTex}</Tex>
            </span>
          )}
          {result === "bad" && <span>Todavía no. Revisa el planteamiento o pide una pista.</span>}
          {result === "invalid" && (
            <span>No entendí la respuesta. Usa números, pi, sqrt( ), / y ^.</span>
          )}
        </div>
      )}

      {shown > 0 && (
        <ol className="mt-4 space-y-3">
          {steps.slice(0, shown).map((s, i) => (
            <li key={i} className="border-l-2 border-accent/70 pl-4">
              <p className="text-sm font-semibold">
                Paso {i + 1}. {s.label}
              </p>
              <TexBlock className="!py-1">{s.tex}</TexBlock>
            </li>
          ))}
        </ol>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        {shown < steps.length && (
          <button
            onClick={() => setShown((v) => v + 1)}
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:bg-secondary"
          >
            <Lightbulb className="size-3.5" />
            {shown === 0 ? "Ver primer paso" : "Siguiente paso"}
          </button>
        )}
        {shown === steps.length && (
          <div className="rounded-lg bg-highlight px-3 py-1.5 text-sm text-highlight-foreground">
            Resultado: <Tex>{answerTex}</Tex>
          </div>
        )}
        {shown > 0 && (
          <button
            onClick={() => {
              setShown(0);
              setValue("");
              setResult(null);
            }}
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:bg-secondary"
          >
            <RotateCcw className="size-3.5" /> Ocultar
          </button>
        )}
      </div>
    </article>
  );
}
