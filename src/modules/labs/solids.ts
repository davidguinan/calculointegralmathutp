import { simpson, type Fn } from "@/lib/numeric";

/** Región plana a ≤ x ≤ b, g(x) ≤ y ≤ f(x) que se hace girar. */
export type Region = {
  id: string;
  label: string;
  f: Fn;
  g: Fn;
  a: number;
  b: number;
  texF: string;
  texG: string;
  /** Volumen exacto al girar alrededor del eje x (y = 0) */
  exactX?: string;
  /** Volumen exacto al girar alrededor del eje y (x = 0) */
  exactY?: string;
};

export const REGIONS: Region[] = [
  {
    id: "clase",
    label: "Ejemplo de clase: y = x², y² = 8x",
    f: (x) => Math.sqrt(Math.max(8 * x, 0)),
    g: (x) => x * x,
    a: 0,
    b: 2,
    texF: "\\sqrt{8x}",
    texG: "x^2",
    exactX: "\\tfrac{48\\pi}{5}",
    exactY: "\\tfrac{24\\pi}{5}",
  },
  {
    id: "sqrt",
    label: "y = √x, y = 0, 0 ≤ x ≤ 4",
    f: (x) => Math.sqrt(Math.max(x, 0)),
    g: () => 0,
    a: 0,
    b: 4,
    texF: "\\sqrt{x}",
    texG: "0",
    exactX: "8\\pi",
    exactY: "\\tfrac{128\\pi}{5}",
  },
  {
    id: "x2",
    label: "y = x², y = 0, 0 ≤ x ≤ 2",
    f: (x) => x * x,
    g: () => 0,
    a: 0,
    b: 2,
    texF: "x^2",
    texG: "0",
    exactX: "\\tfrac{32\\pi}{5}",
    exactY: "8\\pi",
  },
  {
    id: "between",
    label: "Entre y = x y y = x² (arandela)",
    f: (x) => x,
    g: (x) => x * x,
    a: 0,
    b: 1,
    texF: "x",
    texG: "x^2",
    exactX: "\\tfrac{2\\pi}{15}",
    exactY: "\\tfrac{\\pi}{6}",
  },
  {
    id: "x2u",
    label: "y = x², y = 0, 0 ≤ x ≤ 1",
    f: (x) => x * x,
    g: () => 0,
    a: 0,
    b: 1,
    texF: "x^2",
    texG: "0",
    exactX: "\\tfrac{\\pi}{5}",
    exactY: "\\tfrac{\\pi}{2}",
  },
  {
    id: "sin",
    label: "y = sen x, y = 0, 0 ≤ x ≤ π",
    f: (x) => Math.max(Math.sin(x), 0),
    g: () => 0,
    a: 0,
    b: Math.PI,
    texF: "\\sin x",
    texG: "0",
    exactX: "\\tfrac{\\pi^2}{2}",
    exactY: "2\\pi^2",
  },
  {
    id: "cone",
    label: "Cono: y = x/2, 0 ≤ x ≤ 4",
    f: (x) => x / 2,
    g: () => 0,
    a: 0,
    b: 4,
    texF: "\\tfrac{x}{2}",
    texG: "0",
    exactX: "\\tfrac{16\\pi}{3}",
    exactY: "\\tfrac{64\\pi}{3}",
  },
  {
    id: "sphere",
    label: "Esfera: y = √(4 − x²), −2 ≤ x ≤ 2",
    f: (x) => Math.sqrt(Math.max(4 - x * x, 0)),
    g: () => 0,
    a: -2,
    b: 2,
    texF: "\\sqrt{4-x^2}",
    texG: "0",
    exactX: "\\tfrac{32\\pi}{3}",
  },
  {
    id: "inv",
    label: "y = 1/x, y = 0, 1 ≤ x ≤ 3",
    f: (x) => 1 / x,
    g: () => 0,
    a: 1,
    b: 3,
    texF: "\\tfrac{1}{x}",
    texG: "0",
    exactX: "\\tfrac{2\\pi}{3}",
    exactY: "4\\pi",
  },
  {
    id: "torus",
    label: "Toro: círculo de radio 1 centrado en (0, 2)",
    f: (x) => 2 + Math.sqrt(Math.max(1 - x * x, 0)),
    g: (x) => 2 - Math.sqrt(Math.max(1 - x * x, 0)),
    a: -1,
    b: 1,
    texF: "2+\\sqrt{1-x^2}",
    texG: "2-\\sqrt{1-x^2}",
    exactX: "4\\pi^2",
  },
];

export type Axis = { kind: "h" | "v"; c: number };

const N = 2000;

/** Volumen del sólido completo (giro de 2π) y método usado. */
export function solidVolume(r: Region, axis: Axis) {
  if (axis.kind === "h") {
    let anyHole = false;
    const integrand = (x: number) => {
      const d1 = r.f(x) - axis.c;
      const d2 = r.g(x) - axis.c;
      const R = Math.max(Math.abs(d1), Math.abs(d2));
      const rr = d1 * d2 >= 0 ? Math.min(Math.abs(d1), Math.abs(d2)) : 0;
      if (rr > 1e-6) anyHole = true;
      return R * R - rr * rr;
    };
    const value = Math.PI * simpson(integrand, r.a, r.b, N).value;
    return { value, method: anyHole ? ("arandelas" as const) : ("discos" as const) };
  }
  const integrand = (x: number) => Math.abs(x - axis.c) * (r.f(x) - r.g(x));
  const value = 2 * Math.PI * simpson(integrand, r.a, r.b, N).value;
  return { value, method: "capas" as const };
}

export const fmt = (v: number) => {
  const s = Number.isInteger(v) ? String(v) : v.toFixed(1);
  return s;
};

const paren = (e: string) => (/[+-]/.test(e) ? `\\left(${e}\\right)` : e);

/** expr − c en LaTeX */
function minus(expr: string, c: number) {
  if (expr === "0") return fmt(-c);
  if (c === 0) return expr;
  return c > 0 ? `${expr} - ${fmt(c)}` : `${expr} + ${fmt(-c)}`;
}
/** c − expr en LaTeX */
function cminus(c: number, expr: string) {
  if (expr === "0") return fmt(c);
  return c === 0 ? `-${paren(expr)}` : `${fmt(c)} - ${paren(expr)}`;
}

const sq = (e: string) => `\\left(${e}\\right)^2`;
const lim = (v: number) =>
  Math.abs(v - Math.PI) < 1e-9 ? "\\pi" : Math.abs(v + Math.PI) < 1e-9 ? "-\\pi" : fmt(v);

/** Planteamiento de la integral del volumen en LaTeX. */
export function volumeTex(r: Region, axis: Axis): string {
  const A = lim(r.a);
  const B = lim(r.b);
  if (axis.kind === "v") {
    const radius = axis.c <= r.a ? (axis.c === 0 ? "x" : minus("x", axis.c)) : `${fmt(axis.c)} - x`;
    const height = r.texG === "0" ? r.texF : `${r.texF} - ${paren(r.texG)}`;
    return `V = 2\\pi\\int_{${A}}^{${B}} \\underbrace{\\left(${radius}\\right)}_{\\text{radio}}\\,\\underbrace{\\left(${height}\\right)}_{\\text{altura}}\\,dx`;
  }
  // eje horizontal y = c
  const xs = Array.from({ length: 41 }, (_, i) => r.a + ((r.b - r.a) * i) / 40);
  const minG = Math.min(...xs.map(r.g));
  const maxF = Math.max(...xs.map(r.f));
  let outer: string;
  let inner: string;
  if (axis.c <= minG + 1e-9) {
    outer = minus(r.texF, axis.c);
    inner = minus(r.texG, axis.c);
  } else if (axis.c >= maxF - 1e-9) {
    outer = cminus(axis.c, r.texG);
    inner = cminus(axis.c, r.texF);
  } else {
    return `V = \\pi\\int_{${A}}^{${B}} \\Big[R(x)^2 - r(x)^2\\Big]\\,dx \\quad \\text{(el eje corta la región)}`;
  }
  if (inner === "0") return `V = \\pi\\int_{${A}}^{${B}} ${sq(outer)}\\,dx`;
  return `V = \\pi\\int_{${A}}^{${B}} \\Big[\\underbrace{${sq(outer)}}_{R(x)^2} - \\underbrace{${sq(inner)}}_{r(x)^2}\\Big]\\,dx`;
}
