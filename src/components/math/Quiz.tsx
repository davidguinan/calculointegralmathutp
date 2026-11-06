import { useState } from "react";
import { CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import { Tex } from "./Tex";

export type QuizQuestion = {
  /** Enunciado en texto plano */
  prompt: string;
  /** Integral o expresión en LaTeX (opcional) */
  tex?: string;
  /** Opciones en LaTeX */
  options: string[];
  answer: number;
  /** Explicación mostrada tras responder */
  explain: string;
  explainTex?: string;
};

export function Quiz({ questions }: { questions: QuizQuestion[] }) {
  const [picked, setPicked] = useState<(number | null)[]>(() => questions.map(() => null));
  const answered = picked.filter((p) => p !== null).length;
  const correct = picked.filter((p, i) => p === questions[i]!.answer).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-secondary px-4 py-3 text-sm">
        <span>
          Respondidas <strong>{answered}</strong> de {questions.length} · Correctas{" "}
          <strong>{correct}</strong>
        </span>
        <button
          onClick={() => setPicked(questions.map(() => null))}
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium hover:bg-background"
        >
          <RotateCcw className="size-3.5" /> Reiniciar
        </button>
      </div>
      {questions.map((q, qi) => {
        const sel = picked[qi];
        const done = sel !== null && sel !== undefined;
        return (
          <article
            key={qi}
            className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]"
          >
            <p className="text-sm font-semibold">
              Pregunta {qi + 1}. {q.prompt}
            </p>
            {q.tex && (
              <div className="mt-2">
                <Tex>{q.tex}</Tex>
              </div>
            )}
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {q.options.map((opt, oi) => {
                const isRight = oi === q.answer;
                const isSel = oi === sel;
                let cls = "border-border hover:bg-secondary";
                if (done && isRight) cls = "border-success bg-success/15";
                else if (done && isSel) cls = "border-destructive bg-destructive/10";
                else if (done) cls = "border-border opacity-60";
                return (
                  <button
                    key={oi}
                    disabled={done}
                    onClick={() => setPicked((prev) => prev.map((v, i) => (i === qi ? oi : v)))}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors ${cls}`}
                  >
                    <span className="font-mono text-xs text-muted-foreground">
                      {String.fromCharCode(65 + oi)}
                    </span>
                    <Tex>{opt}</Tex>
                  </button>
                );
              })}
            </div>
            {done && (
              <div
                className={`mt-3 flex gap-2 rounded-lg px-3 py-2 text-sm ${
                  sel === q.answer ? "bg-success/15" : "bg-destructive/10"
                }`}
              >
                {sel === q.answer ? (
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
                ) : (
                  <XCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
                )}
                <div>
                  <strong>{sel === q.answer ? "¡Correcto! " : "Incorrecto. "}</strong>
                  {q.explain}
                  {q.explainTex && (
                    <div className="mt-1">
                      <Tex>{q.explainTex}</Tex>
                    </div>
                  )}
                </div>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
