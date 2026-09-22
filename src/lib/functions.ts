export type MathFn = {
  id: string;
  label: string;
  latex: string;
  f: (x: number) => number;
  /** Antiderivada F(x) con C = 0 */
  F: (x: number) => number;
  latexF: string;
  suggested: [number, number];
};

export const FUNCTIONS: MathFn[] = [
  {
    id: "x2",
    label: "f(x) = x²",
    latex: "f(x) = x^2",
    f: (x) => x * x,
    F: (x) => (x * x * x) / 3,
    latexF: "F(x) = \\dfrac{x^3}{3}",
    suggested: [0, 2],
  },
  {
    id: "sin",
    label: "f(x) = sin(x)",
    latex: "f(x) = \\sin(x)",
    f: (x) => Math.sin(x),
    F: (x) => -Math.cos(x),
    latexF: "F(x) = -\\cos(x)",
    suggested: [0, Math.PI],
  },
  {
    id: "sqrt",
    label: "f(x) = √x",
    latex: "f(x) = \\sqrt{x}",
    f: (x) => Math.sqrt(Math.max(x, 0)),
    F: (x) => (2 / 3) * Math.pow(Math.max(x, 0), 1.5),
    latexF: "F(x) = \\dfrac{2}{3}x^{3/2}",
    suggested: [0, 4],
  },
  {
    id: "inv",
    label: "f(x) = 1/x",
    latex: "f(x) = \\dfrac{1}{x}",
    f: (x) => 1 / x,
    F: (x) => Math.log(Math.abs(x)),
    latexF: "F(x) = \\ln|x|",
    suggested: [1, 3],
  },
  {
    id: "exp",
    label: "f(x) = eˣ",
    latex: "f(x) = e^{x}",
    f: (x) => Math.exp(x),
    F: (x) => Math.exp(x),
    latexF: "F(x) = e^{x}",
    suggested: [0, 2],
  },
  {
    id: "cubic",
    label: "f(x) = x³ − 3x + 4",
    latex: "f(x) = x^3 - 3x + 4",
    f: (x) => x * x * x - 3 * x + 4,
    F: (x) => Math.pow(x, 4) / 4 - 1.5 * x * x + 4 * x,
    latexF: "F(x) = \\dfrac{x^4}{4} - \\dfrac{3x^2}{2} + 4x",
    suggested: [0, 2],
  },
];

export function getFunction(id: string): MathFn {
  return FUNCTIONS.find((fn) => fn.id === id) ?? FUNCTIONS[0]!;
}

export const fmt = (v: number, d = 6) =>
  Number.isFinite(v) ? v.toFixed(d).replace(/\.?0+$/, (m) => (m.includes(".") ? "" : m)) : "—";
