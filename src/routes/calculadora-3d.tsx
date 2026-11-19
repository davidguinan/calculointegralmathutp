import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Box } from "lucide-react";
import { Shell } from "@/components/site/Shell";
import { Surface3D } from "@/components/calc3d/Surface3D";
import { SliderField, Stat } from "@/components/math/Controls";
import { Tex, TexBlock } from "@/components/math/Tex";
import { compileExpression, simpson1D, simpson2D, type Compiled } from "@/lib/parser3d";

export const Route = createFileRoute("/calculadora-3d")({
  head: () => ({
    meta: [
      { title: "Calculadora 3D — Cálculo Integral UTP" },
      {
        name: "description",
        content:
          "Grafica superficies z = f(x, y) en 3D, gíralas y calcula el volumen bajo la superficie con integrales dobles y sumas de Riemann.",
      },
      { property: "og:title", content: "Calculadora 3D — Cálculo Integral UTP" },
      {
        property: "og:description",
        content: "Superficies en 3D, volumen bajo la superficie y cortes transversales.",
      },
    ],
  }),
  component: Calculadora3D,
});

type Preset = { label: string; expr: string; x: [number, number]; y: [number, number] };

const PRESETS: Preset[] = [
  { label: "Paraboloide", expr: "x^2 + y^2", x: [-2, 2], y: [-2, 2] },
  { label: "Silla de montar", expr: "x^2 - y^2", x: [-2, 2], y: [-2, 2] },
  { label: "Ondas", expr: "sin(x) cos(y)", x: [-3.14, 3.14], y: [-3.14, 3.14] },
  { label: "Campana de Gauss", expr: "4 e^(-(x^2 + y^2))", x: [-2.5, 2.5], y: [-2.5, 2.5] },
  { label: "Semiesfera", expr: "sqrt(9 - x^2 - y^2)", x: [-2.1, 2.1], y: [-2.1, 2.1] },
  { label: "Plano", expr: "6 - 2x - y", x: [0, 2], y: [0, 2] },
  { label: "Ondulación", expr: "sin(sqrt(x^2 + y^2))", x: [-8, 8], y: [-8, 8] },
  { label: "Cono", expr: "4 - sqrt(x^2 + y^2)", x: [-3, 3], y: [-3, 3] },
];

const AYUDA: [string, string][] = [
  ["x^2  ó  x²", "potencias"],
  ["2xy", "producto implícito"],
  ["sin(x), sen(x), cos, tan", "trigonométricas"],
  ["e^(x+y), exp(x)", "exponencial"],
  ["ln(x), log(x)", "logaritmo natural / base 10"],
  ["sqrt(x), √x, abs(x)", "raíz y valor absoluto"],
  ["pi, π, e", "constantes"],
  ["asin, atan, sinh, cosh…", "inversas e hiperbólicas"],
];

function NumField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  const [txt, setTxt] = useState(String(value));
  const [last, setLast] = useState(value);
  if (value !== last) {
    setLast(value);
    setTxt(String(value));
  }
  return (
    <label className="block text-sm">
      <span className="font-medium">
        <Tex>{label}</Tex>
      </span>
      <input
        inputMode="decimal"
        value={txt}
        onChange={(e) => {
          setTxt(e.target.value);
          try {
            const v = compileExpression(e.target.value).f(0, 0);
            if (Number.isFinite(v)) {
              setLast(v);
              onChange(v);
            }
          } catch {
            /* espera a que el número esté completo */
          }
        }}
        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-sm"
      />
    </label>
  );
}

function Toggle({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="size-4 accent-[var(--primary)]"
      />
      {children}
    </label>
  );
}

function Calculadora3D() {
  const [expr, setExpr] = useState(PRESETS[0]!.expr);
  const [compiled, setCompiled] = useState<Compiled>(() => compileExpression(PRESETS[0]!.expr));
  const [error, setError] = useState<string | null>(null);
  const [xr, setXr] = useState<[number, number]>(PRESETS[0]!.x);
  const [yr, setYr] = useState<[number, number]>(PRESETS[0]!.y);
  const [res, setRes] = useState(40);
  const [wire, setWire] = useState(true);
  const [withZero, setWithZero] = useState(false);
  const [showPrisms, setShowPrisms] = useState(false);
  const [nPrisms, setNPrisms] = useState(6);
  const [showPoint, setShowPoint] = useState(true);
  const [pt, setPt] = useState<[number, number]>([1, 1]);
  const [showSlice, setShowSlice] = useState(false);
  const [x0, setX0] = useState(0);

  const xValid = xr[1] > xr[0];
  const yValid = yr[1] > yr[0];
  const x = useMemo<[number, number]>(
    () => (xr[1] > xr[0] ? [xr[0], xr[1]] : [xr[0], xr[0] + 1]),
    [xr[0], xr[1]],
  );
  const y = useMemo<[number, number]>(
    () => (yr[1] > yr[0] ? [yr[0], yr[1]] : [yr[0], yr[0] + 1]),
    [yr[0], yr[1]],
  );
  const clampTo = (v: number, [a, b]: [number, number]) => Math.min(b, Math.max(a, v));
  const px = clampTo(pt[0], x);
  const py = clampTo(pt[1], y);
  const sx = clampTo(x0, x);
  const point = useMemo<[number, number] | null>(
    () => (showPoint ? [px, py] : null),
    [showPoint, px, py],
  );

  const onExpr = (s: string) => {
    setExpr(s);
    try {
      const c = compileExpression(s);
      setCompiled(c);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const loadPreset = (p: Preset) => {
    onExpr(p.expr);
    setXr(p.x);
    setYr(p.y);
    setPt([(p.x[0] + p.x[1]) / 2 + (p.x[1] - p.x[0]) / 4, (p.y[0] + p.y[1]) / 2]);
    setX0((p.x[0] + p.x[1]) / 2);
  };

  const f = compiled.f;
  const area = (x[1] - x[0]) * (y[1] - y[0]);

  const integral = useMemo(() => simpson2D(f, x[0], x[1], y[0], y[1], 120), [f, x, y]);

  const riemann = useMemo(() => {
    const n = nPrisms;
    const hx = (x[1] - x[0]) / n;
    const hy = (y[1] - y[0]) / n;
    let s = 0;
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++) s += f(x[0] + (i + 0.5) * hx, y[0] + (j + 0.5) * hy);
    return s * hx * hy;
  }, [f, x, y, nPrisms]);

  const sliceArea = useMemo(() => simpson1D((t) => f(sx, t), y[0], y[1], 200), [f, sx, y]);

  const fPoint = f(px, py);
  const xs = (v: number) => (Number.isFinite(v) ? String(+v.toFixed(3)) : "—");
  const step = (r: [number, number]) => +((r[1] - r[0]) / 200).toPrecision(2);

  return (
    <Shell>
      <section className="border-b border-border bg-secondary/40 paper-grid">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> Volver a los módulos
          </Link>
          <h1 className="mt-4 flex items-center gap-3 text-3xl font-bold sm:text-4xl">
            <span className="grid size-11 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Box className="size-6" />
            </span>
            Calculadora 3D
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Escribe una función <Tex>{"z = f(x, y)"}</Tex>, gírala en el espacio y calcula el
            volumen bajo la superficie con la integral doble. Activa los prismas para ver la suma de
            Riemann en 3D, o un corte transversal para entender la integral iterada.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-4">
          <div className="rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
            <label className="block text-sm font-medium" htmlFor="expr3d">
              Función <Tex>{"z = f(x, y)"}</Tex>
            </label>
            <div className="mt-2 flex items-center gap-2">
              <span className="shrink-0 whitespace-nowrap font-mono text-lg text-muted-foreground">
                z =
              </span>
              <input
                id="expr3d"
                value={expr}
                onChange={(e) => onExpr(e.target.value)}
                spellCheck={false}
                autoComplete="off"
                placeholder="por ejemplo: x^2 + y^2"
                className={`w-full rounded-md border bg-background px-3 py-2.5 font-mono text-base outline-none focus:ring-2 focus:ring-ring/40 ${
                  error ? "border-destructive" : "border-input"
                }`}
              />
            </div>
            {error ? (
              <p className="mt-2 text-sm text-destructive">{error}</p>
            ) : (
              <div className="mt-1 overflow-x-auto text-lg">
                <TexBlock>{`z = ${compiled.tex}`}</TexBlock>
              </div>
            )}
            <div className="mt-2 flex flex-wrap gap-1.5">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => loadPreset(p)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    expr === p.expr
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-secondary hover:bg-background"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <Surface3D
            opts={{
              f,
              x,
              y,
              res,
              wire,
              prisms: showPrisms ? nPrisms : 0,
              point,
              slice: showSlice ? sx : null,
              withZero,
            }}
          />

          <div className="grid gap-3 sm:grid-cols-3">
            <Stat
              label="Volumen ∬ f dA"
              value={Number.isFinite(integral) ? xs(integral) : "no definido"}
              tone="success"
            />
            <Stat
              label="Valor promedio"
              value={Number.isFinite(integral) ? xs(integral / area) : "—"}
            />
            <Stat label="Área de la región R" value={xs(area)} />
          </div>

          <div className="rounded-xl border border-border bg-card p-4 text-sm">
            <p className="font-semibold">Integral doble sobre el rectángulo R</p>
            <TexBlock>
              {`\\iint_R f(x,y)\\,dA = \\int_{${xs(x[0])}}^{${xs(x[1])}}\\!\\int_{${xs(y[0])}}^{${xs(y[1])}} f(x,y)\\,dy\\,dx \\approx ${
                Number.isFinite(integral) ? xs(integral) : "\\text{no definida}"
              }`}
            </TexBlock>
            <p className="text-muted-foreground">
              Cuando <Tex>{"f \\ge 0"}</Tex>, el resultado es el volumen del sólido bajo la
              superficie. Si <Tex>{"f"}</Tex> toma valores negativos, esas partes restan (volumen
              con signo). Se calcula con la regla de Simpson en dos dimensiones.
            </p>
            {showPrisms && (
              <TexBlock>
                {`\\sum_{i=1}^{${nPrisms}}\\sum_{j=1}^{${nPrisms}} f(\\bar x_i, \\bar y_j)\\,\\Delta A = ${xs(
                  riemann,
                )}\\quad(\\text{error} \\approx ${
                  Number.isFinite(integral) ? xs(Math.abs(riemann - integral)) : "—"
                })`}
              </TexBlock>
            )}
            {showSlice && (
              <TexBlock>
                {`A(${xs(sx)}) = \\int_{${xs(y[0])}}^{${xs(y[1])}} f(${xs(sx)}, y)\\,dy \\approx ${
                  Number.isFinite(sliceArea) ? xs(sliceArea) : "\\text{no definida}"
                }`}
              </TexBlock>
            )}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="space-y-3 rounded-xl border border-border bg-card p-4">
            <p className="text-sm font-semibold">Región R = [a, b] × [c, d]</p>
            <div className="grid grid-cols-2 gap-3">
              <NumField label="x_{\min}" value={xr[0]} onChange={(v) => setXr([v, xr[1]])} />
              <NumField label="x_{\max}" value={xr[1]} onChange={(v) => setXr([xr[0], v])} />
              <NumField label="y_{\min}" value={yr[0]} onChange={(v) => setYr([v, yr[1]])} />
              <NumField label="y_{\max}" value={yr[1]} onChange={(v) => setYr([yr[0], v])} />
            </div>
            {(!xValid || !yValid) && (
              <p className="text-xs text-destructive">
                El valor máximo debe ser mayor que el mínimo.
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Puedes escribir expresiones como <code>pi</code> o <code>2pi</code>.
            </p>
          </div>

          <div className="space-y-3 rounded-xl border border-border bg-card p-4">
            <p className="text-sm font-semibold">Visualización</p>
            <SliderField
              label="Resolución de la malla"
              value={res}
              min={10}
              max={70}
              step={2}
              onChange={setRes}
              display={`${res} × ${res}`}
            />
            <Toggle checked={wire} onChange={setWire}>
              Mostrar malla
            </Toggle>
            <Toggle checked={withZero} onChange={setWithZero}>
              Incluir el plano z = 0 en la escala
            </Toggle>
          </div>

          <div className="space-y-3 rounded-xl border border-border bg-card p-4">
            <Toggle checked={showPoint} onChange={setShowPoint}>
              <span className="font-semibold">Evaluar en un punto</span>
            </Toggle>
            {showPoint && (
              <>
                <SliderField
                  label="x₀"
                  value={px}
                  min={x[0]}
                  max={x[1]}
                  step={step(x)}
                  onChange={(v) => setPt([v, py])}
                  display={xs(px)}
                />
                <SliderField
                  label="y₀"
                  value={py}
                  min={y[0]}
                  max={y[1]}
                  step={step(y)}
                  onChange={(v) => setPt([px, v])}
                  display={xs(py)}
                />
                <div className="rounded-lg bg-secondary px-3 py-2 text-center">
                  <Tex>{`f(${xs(px)}, ${xs(py)}) = ${Number.isFinite(fPoint) ? xs(fPoint) : "\\text{no definida}"}`}</Tex>
                </div>
              </>
            )}
          </div>

          <div className="space-y-3 rounded-xl border border-border bg-card p-4">
            <Toggle checked={showPrisms} onChange={setShowPrisms}>
              <span className="font-semibold">Suma de Riemann doble (prismas)</span>
            </Toggle>
            {showPrisms && (
              <SliderField
                label="Subdivisiones por lado (n)"
                value={nPrisms}
                min={2}
                max={20}
                onChange={setNPrisms}
                display={`${nPrisms} × ${nPrisms} = ${nPrisms * nPrisms} prismas`}
              />
            )}
            <p className="text-xs text-muted-foreground">
              Cada prisma tiene base <Tex>{"\\Delta A = \\Delta x\\,\\Delta y"}</Tex> y altura{" "}
              <Tex>{"f"}</Tex> en el punto medio de su celda.
            </p>
          </div>

          <div className="space-y-3 rounded-xl border border-border bg-card p-4">
            <Toggle checked={showSlice} onChange={setShowSlice}>
              <span className="font-semibold">Corte transversal x = x₀</span>
            </Toggle>
            {showSlice && (
              <SliderField
                label="Posición del corte"
                value={sx}
                min={x[0]}
                max={x[1]}
                step={step(x)}
                onChange={setX0}
                display={`x = ${xs(sx)}`}
              />
            )}
            <p className="text-xs text-muted-foreground">
              El área del corte <Tex>{"A(x)"}</Tex> integrada de <Tex>{"a"}</Tex> a <Tex>{"b"}</Tex>{" "}
              da el volumen: <Tex>{"V = \\int_a^b A(x)\\,dx"}</Tex>.
            </p>
          </div>

          <details className="rounded-xl border border-border bg-card p-4 text-sm">
            <summary className="cursor-pointer font-semibold">¿Cómo escribo las funciones?</summary>
            <ul className="mt-3 space-y-1.5">
              {AYUDA.map(([a, b]) => (
                <li key={a} className="flex justify-between gap-3">
                  <code className="font-mono text-xs">{a}</code>
                  <span className="text-right text-xs text-muted-foreground">{b}</span>
                </li>
              ))}
            </ul>
          </details>
        </aside>
      </section>
    </Shell>
  );
}
