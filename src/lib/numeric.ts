export type Fn = (x: number) => number;

export const linspace = (a: number, b: number, n: number) =>
  Array.from({ length: n + 1 }, (_, i) => a + ((b - a) * i) / n);

export function riemann(f: Fn, a: number, b: number, n: number, mode: "left" | "right" | "mid") {
  const h = (b - a) / n;
  let sum = 0;
  const bars: { x0: number; x1: number; y: number; sample: number }[] = [];
  for (let i = 0; i < n; i++) {
    const x0 = a + i * h;
    const x1 = x0 + h;
    const sample = mode === "left" ? x0 : mode === "right" ? x1 : (x0 + x1) / 2;
    const y = f(sample);
    sum += y;
    bars.push({ x0, x1, y, sample });
  }
  return { value: sum * h, h, bars };
}

export function trapezoid(f: Fn, a: number, b: number, n: number) {
  const h = (b - a) / n;
  let sum = f(a) + f(b);
  const nodes: { x: number; y: number }[] = [{ x: a, y: f(a) }];
  for (let i = 1; i < n; i++) {
    const x = a + i * h;
    sum += 2 * f(x);
    nodes.push({ x, y: f(x) });
  }
  nodes.push({ x: b, y: f(b) });
  return { value: (h / 2) * sum, h, nodes };
}

export function simpson(f: Fn, a: number, b: number, n: number) {
  const m = n % 2 === 0 ? n : n + 1;
  const h = (b - a) / m;
  let sum = f(a) + f(b);
  for (let i = 1; i < m; i++) sum += (i % 2 === 1 ? 4 : 2) * f(a + i * h);
  return { value: (h / 3) * sum, h, n: m };
}

/** Valor de referencia por cuadratura de Simpson muy fina */
export function exactish(f: Fn, a: number, b: number) {
  return simpson(f, a, b, 2000).value;
}

/** Parábola que pasa por 3 puntos (interpolación de Lagrange) */
export function parabolaThrough(
  p0: [number, number],
  p1: [number, number],
  p2: [number, number],
): Fn {
  return (x) =>
    (p0[1] * ((x - p1[0]) * (x - p2[0]))) / ((p0[0] - p1[0]) * (p0[0] - p2[0])) +
    (p1[1] * ((x - p0[0]) * (x - p2[0]))) / ((p1[0] - p0[0]) * (p1[0] - p2[0])) +
    (p2[1] * ((x - p0[0]) * (x - p1[0]))) / ((p2[0] - p0[0]) * (p2[0] - p1[0]));
}
