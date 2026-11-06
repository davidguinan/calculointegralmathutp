import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { Tex, TexBlock } from "@/components/math/Tex";

type Choice = {
  u: string;
  dv: string;
  du: string;
  v: string;
  /** uv − ∫ v du */
  next: string;
  good: boolean;
  comment: string;
};

type PartsCase = {
  id: string;
  label: string;
  tex: string;
  choices: Choice[];
  result: string;
};

const CASES: PartsCase[] = [
  {
    id: "xex",
    label: "∫ x eˣ dx",
    tex: "\\int x\\,e^{x}\\,dx",
    choices: [
      {
        u: "x",
        dv: "e^{x}dx",
        du: "dx",
        v: "e^{x}",
        next: "x e^{x} - \\int e^{x}\\,dx",
        good: true,
        comment: "La nueva integral es inmediata. LIATE: Algebraica (x) antes que Exponencial.",
      },
      {
        u: "e^{x}",
        dv: "x\\,dx",
        du: "e^{x}dx",
        v: "\\tfrac{x^2}{2}",
        next: "\\tfrac{x^2}{2}e^{x} - \\int \\tfrac{x^2}{2}e^{x}\\,dx",
        good: false,
        comment: "La potencia de x subió: la integral nueva es más difícil que la original.",
      },
    ],
    result: "x e^{x} - e^{x} + C = e^{x}(x-1) + C",
  },
  {
    id: "xsin",
    label: "∫ x sin x dx",
    tex: "\\int x\\sin x\\,dx",
    choices: [
      {
        u: "x",
        dv: "\\sin x\\,dx",
        du: "dx",
        v: "-\\cos x",
        next: "-x\\cos x + \\int \\cos x\\,dx",
        good: true,
        comment: "Al derivar x desaparece y queda una integral directa.",
      },
      {
        u: "\\sin x",
        dv: "x\\,dx",
        du: "\\cos x\\,dx",
        v: "\\tfrac{x^2}{2}",
        next: "\\tfrac{x^2}{2}\\sin x - \\int \\tfrac{x^2}{2}\\cos x\\,dx",
        good: false,
        comment: "Se complica: ahora aparece x² en la nueva integral.",
      },
    ],
    result: "-x\\cos x + \\sin x + C",
  },
  {
    id: "lnx",
    label: "∫ ln x dx",
    tex: "\\int \\ln x\\,dx",
    choices: [
      {
        u: "\\ln x",
        dv: "dx",
        du: "\\tfrac{1}{x}dx",
        v: "x",
        next: "x\\ln x - \\int x\\cdot\\tfrac{1}{x}\\,dx",
        good: true,
        comment: "Truco clásico: dv = dx. Logarítmica es la primera letra de LIATE.",
      },
      {
        u: "1",
        dv: "\\ln x\\,dx",
        du: "0",
        v: "\\;?",
        next: "\\text{necesitaríamos ya conocer } \\int \\ln x\\,dx",
        good: false,
        comment: "Para integrar dv habría que saber la respuesta: es un razonamiento circular.",
      },
    ],
    result: "x\\ln x - x + C",
  },
  {
    id: "x2ex",
    label: "∫ x² eˣ dx",
    tex: "\\int x^2 e^{x}\\,dx",
    choices: [
      {
        u: "x^2",
        dv: "e^{x}dx",
        du: "2x\\,dx",
        v: "e^{x}",
        next: "x^2e^{x} - 2\\int x e^{x}\\,dx",
        good: true,
        comment: "Baja un grado; se aplica partes otra vez (o el método tabular).",
      },
      {
        u: "e^{x}",
        dv: "x^2dx",
        du: "e^{x}dx",
        v: "\\tfrac{x^3}{3}",
        next: "\\tfrac{x^3}{3}e^{x} - \\tfrac{1}{3}\\int x^3 e^{x}\\,dx",
        good: false,
        comment: "El grado sube a x³: dirección equivocada.",
      },
    ],
    result: "e^{x}(x^2 - 2x + 2) + C",
  },
  {
    id: "atan",
    label: "∫ arctan x dx",
    tex: "\\int \\arctan x\\,dx",
    choices: [
      {
        u: "\\arctan x",
        dv: "dx",
        du: "\\tfrac{1}{1+x^2}dx",
        v: "x",
        next: "x\\arctan x - \\int \\tfrac{x}{1+x^2}\\,dx",
        good: true,
        comment: "La nueva integral se resuelve por sustitución u = 1 + x².",
      },
      {
        u: "1",
        dv: "\\arctan x\\,dx",
        du: "0",
        v: "\\;?",
        next: "\\text{circular}",
        good: false,
        comment: "Igual que con ln x: no sabemos integrar dv todavía.",
      },
    ],
    result: "x\\arctan x - \\tfrac{1}{2}\\ln(1+x^2) + C",
  },
  {
    id: "exsin",
    label: "∫ eˣ sin x dx (cíclica)",
    tex: "\\int e^{x}\\sin x\\,dx",
    choices: [
      {
        u: "\\sin x",
        dv: "e^{x}dx",
        du: "\\cos x\\,dx",
        v: "e^{x}",
        next: "e^{x}\\sin x - \\int e^{x}\\cos x\\,dx",
        good: true,
        comment:
          "Aplicando partes otra vez aparece la integral original I: se despeja 2I = eˣ(sin x − cos x).",
      },
      {
        u: "e^{x}",
        dv: "\\sin x\\,dx",
        du: "e^{x}dx",
        v: "-\\cos x",
        next: "-e^{x}\\cos x + \\int e^{x}\\cos x\\,dx",
        good: true,
        comment: "¡También funciona! En las cíclicas ambas elecciones sirven si eres consistente.",
      },
    ],
    result: "\\tfrac{e^{x}}{2}(\\sin x - \\cos x) + C",
  },
];

export function PartsLab() {
  const [id, setId] = useState(CASES[0]!.id);
  const [pick, setPick] = useState<number | null>(null);
  const c = CASES.find((k) => k.id === id)!;
  const ch = pick !== null ? c.choices[pick] : null;

  return (
    <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
      <div className="space-y-3">
        <label className="block text-sm">
          <span className="font-medium">Integral</span>
          <select
            value={id}
            onChange={(e) => {
              setId(e.target.value);
              setPick(null);
            }}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {CASES.map((k) => (
              <option key={k.id} value={k.id}>
                {k.label}
              </option>
            ))}
          </select>
        </label>
        <p className="text-sm font-medium">¿Qué eliges como u?</p>
        {c.choices.map((opt, i) => (
          <button
            key={i}
            onClick={() => setPick(i)}
            className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-sm transition-colors ${
              pick === i ? "border-primary bg-primary/10" : "border-border hover:bg-secondary"
            }`}
          >
            <span>
              <Tex>{`u = ${opt.u}`}</Tex>
            </span>
            <span className="text-muted-foreground">
              <Tex>{`dv = ${opt.dv}`}</Tex>
            </span>
          </button>
        ))}
        <p className="text-xs text-muted-foreground">
          LIATE: Logarítmica · Inversa trig. · Algebraica · Trigonométrica · Exponencial. La que
          aparece primero suele ser la mejor <Tex>{"u"}</Tex>.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
        <TexBlock>{c.tex}</TexBlock>
        {!ch ? (
          <p className="mt-4 text-sm text-muted-foreground">
            Elige una opción a la izquierda para ver cómo queda <Tex>{"uv - \\int v\\,du"}</Tex>.
          </p>
        ) : (
          <div className="mt-2 space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-md bg-secondary px-3 py-2">
                <Tex>{`u = ${ch.u}`}</Tex>
              </div>
              <div className="rounded-md bg-secondary px-3 py-2">
                <Tex>{`dv = ${ch.dv}`}</Tex>
              </div>
              <div className="rounded-md bg-secondary px-3 py-2">
                <Tex>{`du = ${ch.du}`}</Tex>
              </div>
              <div className="rounded-md bg-secondary px-3 py-2">
                <Tex>{`v = ${ch.v}`}</Tex>
              </div>
            </div>
            <TexBlock boxed>{`${c.tex} = ${ch.next}`}</TexBlock>
            <div
              className={`flex gap-2 rounded-lg px-3 py-2 text-sm ${
                ch.good ? "bg-success/15" : "bg-destructive/10"
              }`}
            >
              {ch.good ? (
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
              ) : (
                <XCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
              )}
              <span>
                <strong>{ch.good ? "Buena elección. " : "Mala elección. "}</strong>
                {ch.comment}
              </span>
            </div>
            {ch.good && (
              <div className="rounded-lg bg-highlight px-4 py-3 text-highlight-foreground">
                <p className="text-xs font-semibold uppercase tracking-widest">Resultado</p>
                <TexBlock className="!py-1">{`${c.tex} = ${c.result}`}</TexBlock>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
