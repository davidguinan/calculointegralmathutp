/**
 * Intérprete seguro de expresiones en x e y para la Calculadora 3D.
 * No usa eval: tokeniza, construye un árbol y lo compila a funciones.
 *
 * Admite: + − * / ^, paréntesis, multiplicación implícita (2x, xy, 3sin(x), (x+1)(y-1)),
 * constantes pi, π, e y funciones sin/sen, cos, tan, sec, csc, cot, asin/arcsen, acos,
 * atan, sinh, cosh, tanh, asinh, acosh, atanh, exp, ln, log, sqrt/raiz, cbrt, abs.
 */

type Node =
  | { k: "num"; v: number }
  | { k: "var"; name: "x" | "y" }
  | { k: "const"; name: "pi" | "e" }
  | { k: "neg"; a: Node }
  | { k: "bin"; op: "+" | "-" | "*" | "/" | "^"; a: Node; b: Node }
  | { k: "fn"; name: string; a: Node };

type Tok =
  | { t: "num"; v: number }
  | { t: "id"; v: string }
  | { t: "op"; v: string }
  | { t: "("; v: "(" }
  | { t: ")"; v: ")" };

const FUNCS: Record<string, (v: number) => number> = {
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  sec: (v) => 1 / Math.cos(v),
  csc: (v) => 1 / Math.sin(v),
  cot: (v) => 1 / Math.tan(v),
  asin: Math.asin,
  acos: Math.acos,
  atan: Math.atan,
  sinh: Math.sinh,
  cosh: Math.cosh,
  tanh: Math.tanh,
  asinh: Math.asinh,
  acosh: Math.acosh,
  atanh: Math.atanh,
  exp: Math.exp,
  ln: Math.log,
  log: Math.log10,
  sqrt: Math.sqrt,
  cbrt: Math.cbrt,
  abs: Math.abs,
};

/** Alias en español y nombres alternativos. */
const ALIAS: Record<string, string> = {
  sen: "sin",
  arcsen: "asin",
  arcsin: "asin",
  arccos: "acos",
  arctan: "atan",
  arcsinh: "asinh",
  arccosh: "acosh",
  arctanh: "atanh",
  senh: "sinh",
  raiz: "sqrt",
  tg: "tan",
};

const NAMES = [...Object.keys(FUNCS), ...Object.keys(ALIAS), "pi", "e", "x", "y"].sort(
  (a, b) => b.length - a.length,
);

export class ParseError extends Error {}

function tokenize(src: string): Tok[] {
  const s = src
    .toLowerCase()
    .replace(/π/g, "pi")
    .replace(/√/g, "sqrt")
    .replace(/²/g, "^2")
    .replace(/³/g, "^3")
    .replace(/[·×]/g, "*")
    .replace(/÷/g, "/")
    .replace(/[−–]/g, "-")
    .replace(/\*\*/g, "^")
    .replace(/,/g, ".");
  const out: Tok[] = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i]!;
    if (/\s/.test(c)) {
      i++;
      continue;
    }
    if (/[0-9.]/.test(c)) {
      const m = /^(\d+\.?\d*|\.\d+)(e[+-]?\d+)?/.exec(s.slice(i));
      if (!m) throw new ParseError(`Número mal escrito cerca de “${s.slice(i, i + 4)}”`);
      out.push({ t: "num", v: Number(m[0]) });
      i += m[0].length;
      continue;
    }
    if (/[a-z]/.test(c)) {
      let j = i;
      while (j < s.length && /[a-z]/.test(s[j]!)) j++;
      const word = s.slice(i, j);
      // Divide la palabra en nombres conocidos (coincidencia más larga primero): "xy" → x·y
      let p = 0;
      while (p < word.length) {
        const name = NAMES.find((n) => word.startsWith(n, p));
        if (!name) throw new ParseError(`Símbolo desconocido: “${word.slice(p)}”. Usa x, y.`);
        out.push({ t: "id", v: ALIAS[name] ?? name });
        p += name.length;
      }
      i = j;
      continue;
    }
    if ("+-*/^".includes(c)) {
      out.push({ t: "op", v: c });
      i++;
      continue;
    }
    if (c === "(" || c === "[" || c === "{") {
      out.push({ t: "(", v: "(" });
      i++;
      continue;
    }
    if (c === ")" || c === "]" || c === "}") {
      out.push({ t: ")", v: ")" });
      i++;
      continue;
    }
    throw new ParseError(`Carácter no válido: “${c}”`);
  }
  return out;
}

function parse(tokens: Tok[]): Node {
  let pos = 0;
  const peek = () => tokens[pos];
  const next = () => tokens[pos++];

  const startsPrimary = (t: Tok | undefined) =>
    !!t && (t.t === "num" || t.t === "id" || t.t === "(");

  function expr(): Node {
    let left = term();
    for (let t = peek(); t && t.t === "op" && (t.v === "+" || t.v === "-"); t = peek()) {
      next();
      left = { k: "bin", op: t.v as "+" | "-", a: left, b: term() };
    }
    return left;
  }

  function term(): Node {
    let left = unary();
    for (;;) {
      const t = peek();
      if (t && t.t === "op" && (t.v === "*" || t.v === "/")) {
        next();
        left = { k: "bin", op: t.v as "*" | "/", a: left, b: unary() };
      } else if (startsPrimary(t)) {
        left = { k: "bin", op: "*", a: left, b: power() };
      } else return left;
    }
  }

  function unary(): Node {
    const t = peek();
    if (t && t.t === "op" && (t.v === "-" || t.v === "+")) {
      next();
      const a = unary();
      return t.v === "-" ? { k: "neg", a } : a;
    }
    return power();
  }

  function power(): Node {
    const base = primary();
    const t = peek();
    if (t && t.t === "op" && t.v === "^") {
      next();
      return { k: "bin", op: "^", a: base, b: unary() };
    }
    return base;
  }

  function primary(): Node {
    const t = next();
    if (!t) throw new ParseError("La expresión está incompleta.");
    if (t.t === "num") return { k: "num", v: t.v };
    if (t.t === "(") {
      const e = expr();
      const c = next();
      if (!c || c.t !== ")") throw new ParseError("Falta cerrar un paréntesis “)”.");
      return e;
    }
    if (t.t === "id") {
      if (t.v === "x" || t.v === "y") return { k: "var", name: t.v };
      if (t.v === "pi" || t.v === "e") return { k: "const", name: t.v };
      // Función: sin(x) o sin x
      let arg: Node;
      // Potencia de función: sin^2(x) → (sin x)^2
      const p = peek();
      if (p && p.t === "op" && p.v === "^") {
        next();
        const exp = unary();
        arg = primaryArg();
        return { k: "bin", op: "^", a: { k: "fn", name: t.v, a: arg }, b: exp };
      }
      arg = primaryArg();
      return { k: "fn", name: t.v, a: arg };
    }
    throw new ParseError(`Sobra “${t.v}” en la expresión.`);
  }

  function primaryArg(): Node {
    const p = peek();
    if (!p) throw new ParseError("Falta el argumento de una función.");
    if (p.t === "(") return primary();
    return power();
  }

  const tree = expr();
  if (pos < tokens.length) {
    const t = tokens[pos]!;
    throw new ParseError(t.t === ")" ? "Sobra un paréntesis “)”." : `No entiendo “${t.v}”.`);
  }
  return tree;
}

type F2 = (x: number, y: number) => number;

function compileNode(n: Node): F2 {
  switch (n.k) {
    case "num": {
      const v = n.v;
      return () => v;
    }
    case "var":
      return n.name === "x" ? (x) => x : (_x, y) => y;
    case "const": {
      const v = n.name === "pi" ? Math.PI : Math.E;
      return () => v;
    }
    case "neg": {
      const a = compileNode(n.a);
      return (x, y) => -a(x, y);
    }
    case "fn": {
      const f = FUNCS[n.name]!;
      const a = compileNode(n.a);
      return (x, y) => f(a(x, y));
    }
    case "bin": {
      const a = compileNode(n.a);
      const b = compileNode(n.b);
      switch (n.op) {
        case "+":
          return (x, y) => a(x, y) + b(x, y);
        case "-":
          return (x, y) => a(x, y) - b(x, y);
        case "*":
          return (x, y) => a(x, y) * b(x, y);
        case "/":
          return (x, y) => a(x, y) / b(x, y);
        case "^":
          return (x, y) => {
            const base = a(x, y);
            const ex = b(x, y);
            // Raíces impares de negativos: (-8)^(1/3) = -2
            if (base < 0 && !Number.isInteger(ex)) {
              const inv = 1 / ex;
              if (Number.isInteger(Math.round(inv)) && Math.abs(inv - Math.round(inv)) < 1e-9) {
                const q = Math.round(inv);
                if (q % 2 !== 0) return -Math.pow(-base, ex);
              }
            }
            return Math.pow(base, ex);
          };
      }
    }
  }
}

const PREC: Record<string, number> = { "+": 1, "-": 1, "*": 2, "/": 2, neg: 3, "^": 4 };
const TEXFN: Record<string, string> = {
  sin: "\\sin",
  cos: "\\cos",
  tan: "\\tan",
  sec: "\\sec",
  csc: "\\csc",
  cot: "\\cot",
  asin: "\\arcsin",
  acos: "\\arccos",
  atan: "\\arctan",
  sinh: "\\sinh",
  cosh: "\\cosh",
  tanh: "\\tanh",
  asinh: "\\operatorname{arcsinh}",
  acosh: "\\operatorname{arccosh}",
  atanh: "\\operatorname{arctanh}",
  ln: "\\ln",
  log: "\\log",
};

function texNum(v: number) {
  return Number.isInteger(v) ? String(v) : String(+v.toFixed(6));
}

function toTex(n: Node, parent = 0): string {
  const wrap = (s: string, p: number) => (p < parent ? `\\left(${s}\\right)` : s);
  switch (n.k) {
    case "num":
      return texNum(n.v);
    case "var":
      return n.name;
    case "const":
      return n.name === "pi" ? "\\pi" : "e";
    case "neg":
      return wrap(`-${toTex(n.a, PREC["neg"]!)}`, PREC["neg"]!);
    case "fn": {
      const inner = toTex(n.a, 0);
      if (n.name === "sqrt") return `\\sqrt{${inner}}`;
      if (n.name === "cbrt") return `\\sqrt[3]{${inner}}`;
      if (n.name === "abs") return `\\left|${inner}\\right|`;
      if (n.name === "exp") return `e^{${inner}}`;
      return `${TEXFN[n.name] ?? n.name}\\left(${inner}\\right)`;
    }
    case "bin": {
      const p = PREC[n.op]!;
      if (n.op === "/") return wrap(`\\dfrac{${toTex(n.a, 0)}}{${toTex(n.b, 0)}}`, 5);
      if (n.op === "^") {
        const base = n.a.k === "fn" && n.a.name !== "sqrt" && n.a.name !== "abs" ? 5 : p + 1;
        return wrap(`{${toTex(n.a, base)}}^{${toTex(n.b, 0)}}`, p);
      }
      if (n.op === "*") {
        const l = toTex(n.a, p);
        const r = toTex(n.b, p);
        const needDot =
          /^[\d.-]/.test(r) || (n.b.k === "bin" && n.b.op === "^" && n.b.a.k === "num");
        return wrap(`${l}${needDot ? " \\cdot " : "\\,"}${r}`, p);
      }
      // + y −: el lado derecho de "−" necesita paréntesis si es suma/resta
      const r = toTex(n.b, n.op === "-" ? p + 1 : p);
      return wrap(`${toTex(n.a, p)} ${n.op} ${r}`, p);
    }
  }
}

export type Compiled = { f: F2; tex: string };

export function compileExpression(src: string): Compiled {
  if (!src.trim()) throw new ParseError("Escribe una función de x e y.");
  const tree = parse(tokenize(src));
  return { f: compileNode(tree), tex: toTex(tree) };
}

/** Integral doble por Simpson compuesto en ambas direcciones. */
export function simpson2D(f: F2, a: number, b: number, c: number, d: number, n = 120) {
  const m = n % 2 === 0 ? n : n + 1;
  const hx = (b - a) / m;
  const hy = (d - c) / m;
  const w = (i: number) => (i === 0 || i === m ? 1 : i % 2 === 1 ? 4 : 2);
  let s = 0;
  for (let i = 0; i <= m; i++) {
    const x = a + i * hx;
    const wi = w(i);
    for (let j = 0; j <= m; j++) {
      const v = f(x, c + j * hy);
      if (!Number.isFinite(v)) return NaN;
      s += wi * w(j) * v;
    }
  }
  return (hx * hy * s) / 9;
}

/** Integral simple por Simpson (para el área de un corte transversal). */
export function simpson1D(g: (t: number) => number, a: number, b: number, n = 200) {
  const h = (b - a) / n;
  let s = g(a) + g(b);
  for (let i = 1; i < n; i++) s += (i % 2 === 1 ? 4 : 2) * g(a + i * h);
  return (h / 3) * s;
}
