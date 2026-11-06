/** Banco de preguntas básicas para la Arena Integral. Opciones en LaTeX; `a` es el índice correcto. */
export type GameQuestion = {
  m: number;
  q: string;
  tex?: string;
  options: string[];
  a: number;
  why: string;
};

const T = (s: string) => `\\text{${s}}`;

export const QUESTIONS: GameQuestion[] = [
  // Módulo 1 — Riemann
  {
    m: 1,
    q: "¿Cuánto mide Δx?",
    tex: "[a,b]=[0,4],\\; n=8",
    options: ["0.5", "2", "4", "8"],
    a: 0,
    why: "Δx = (b − a)/n = 4/8 = 0.5.",
  },
  {
    m: 1,
    q: "Al aumentar n, la suma de Riemann…",
    options: [T("se acerca a la integral"), T("siempre crece"), T("se vuelve 0"), T("no cambia")],
    a: 0,
    why: "La integral definida es el límite de las sumas cuando n → ∞.",
  },
  {
    m: 1,
    q: "En la suma izquierda, la altura se toma en…",
    options: [
      T("el extremo izquierdo"),
      T("el extremo derecho"),
      T("el punto medio"),
      T("el máximo"),
    ],
    a: 0,
    why: "Por eso se llama suma izquierda.",
  },
  {
    m: 1,
    q: "Si f es creciente, la suma izquierda…",
    options: [T("subestima el área"), T("sobreestima el área"), T("es exacta"), T("es negativa")],
    a: 0,
    why: "Cada rectángulo queda por debajo de la curva.",
  },
  {
    m: 1,
    q: "Suma derecha de f(x) = x en [0, 2] con n = 2:",
    options: ["3", "2", "1", "4"],
    a: 0,
    why: "Δx = 1 y f(1) + f(2) = 1 + 2 = 3.",
  },
  // Módulo 2 — Trapecio
  {
    m: 2,
    q: "¿Cuál es la regla del trapecio?",
    options: [
      "\\tfrac{\\Delta x}{2}[f_0+2f_1+\\cdots+2f_{n-1}+f_n]",
      "\\tfrac{\\Delta x}{3}[f_0+4f_1+2f_2+\\cdots+f_n]",
      "\\Delta x[f_0+f_1+\\cdots+f_{n-1}]",
      "\\tfrac{\\Delta x}{2}[f_0+f_n]^2",
    ],
    a: 0,
    why: "Los extremos cuentan una vez y los nodos interiores dos veces.",
  },
  {
    m: 2,
    q: "El trapecio es exacto para funciones…",
    options: [T("lineales"), T("cuadráticas"), T("exponenciales"), T("trigonométricas")],
    a: 0,
    why: "Une los puntos con rectas: si f ya es recta, no hay error.",
  },
  {
    m: 2,
    q: "Trapecio con n = 1 para f(x) = x² en [0, 2]:",
    options: ["4", "\\tfrac83", "2", "8"],
    a: 0,
    why: "(2/2)·(f(0) + f(2)) = 1·(0 + 4) = 4.",
  },
  {
    m: 2,
    q: "Si f es cóncava hacia arriba, el trapecio…",
    options: [T("sobreestima"), T("subestima"), T("es exacto"), T("da cero")],
    a: 0,
    why: "Las cuerdas quedan por encima de la curva.",
  },
  // Módulo 3 — Punto medio
  {
    m: 3,
    q: "¿Cuál es el punto medio de [2, 4]?",
    options: ["3", "2", "4", "6"],
    a: 0,
    why: "(2 + 4)/2 = 3.",
  },
  {
    m: 3,
    q: "Punto medio con n = 1 para f(x) = x² en [0, 2]:",
    options: ["2", "4", "\\tfrac83", "1"],
    a: 0,
    why: "Δx·f(1) = 2·1 = 2.",
  },
  {
    m: 3,
    q: "Si f es cóncava hacia arriba, el punto medio…",
    options: [T("subestima"), T("sobreestima"), T("es exacto"), T("da cero")],
    a: 0,
    why: "Es el comportamiento opuesto al del trapecio.",
  },
  {
    m: 3,
    q: "El error del punto medio es, aprox., ___ el del trapecio.",
    options: [T("la mitad de"), T("el doble de"), T("igual a"), T("cero veces")],
    a: 0,
    why: "Se cumple |E_M| ≈ |E_T|/2.",
  },
  // Módulo 4 — Simpson
  {
    m: 4,
    q: "Simpson exige que n sea…",
    options: [T("par"), T("impar"), T("primo"), T("mayor que 100")],
    a: 0,
    why: "Cada parábola usa dos subintervalos.",
  },
  {
    m: 4,
    q: "Coeficientes de Simpson:",
    options: ["1,4,2,4,\\dots,4,1", "1,2,2,\\dots,2,1", "1,1,\\dots,1", "2,4,2,\\dots,2"],
    a: 0,
    why: "Extremos 1, impares 4, pares interiores 2.",
  },
  {
    m: 4,
    q: "Simpson aproxima la curva con…",
    options: [T("parábolas"), T("rectas"), T("rectángulos"), T("círculos")],
    a: 0,
    why: "Ajusta una parábola por cada par de subintervalos.",
  },
  {
    m: 4,
    q: "Simpson es exacto para polinomios de grado hasta…",
    options: ["3", "2", "1", "4"],
    a: 0,
    why: "Sorprendentemente también integra exacto los cúbicos.",
  },
  {
    m: 4,
    q: "El factor delante de la suma en Simpson es…",
    options: [
      "\\tfrac{\\Delta x}{3}",
      "\\tfrac{\\Delta x}{2}",
      "\\Delta x",
      "\\tfrac{\\Delta x}{6}",
    ],
    a: 0,
    why: "S = (Δx/3)[f₀ + 4f₁ + 2f₂ + … + fₙ].",
  },
  // Módulo 5 — Integral definida
  {
    m: 5,
    q: "Calcula:",
    tex: "\\int_0^2 3\\,dx",
    options: ["6", "3", "2", "0"],
    a: 0,
    why: "Es un rectángulo de base 2 y altura 3.",
  },
  {
    m: 5,
    q: "Si g(x) = ∫ₐˣ f(t) dt, entonces g′(x) =",
    options: ["f(x)", "F(x)", "f'(x)", "0"],
    a: 0,
    why: "Primera parte del Teorema Fundamental del Cálculo.",
  },
  {
    m: 5,
    q: "Calcula:",
    tex: "\\int_a^a f(x)\\,dx",
    options: ["0", "f(a)", "a", "1"],
    a: 0,
    why: "Un intervalo de longitud cero tiene área cero.",
  },
  {
    m: 5,
    q: "Calcula:",
    tex: "\\int_0^1 x\\,dx",
    options: ["\\tfrac12", "1", "2", "\\tfrac13"],
    a: 0,
    why: "[x²/2] de 0 a 1 = 1/2.",
  },
  {
    m: 5,
    q: "Si ∫₀² f = 5, ¿cuánto vale ∫₂⁰ f?",
    options: ["-5", "5", "0", "10"],
    a: 0,
    why: "Invertir los límites cambia el signo.",
  },
  // Módulo 6 — Directa
  {
    m: 6,
    q: "Integra:",
    tex: "\\int x^3\\,dx",
    options: ["\\tfrac{x^4}{4}+C", "3x^2+C", "x^4+C", "\\tfrac{x^3}{3}+C"],
    a: 0,
    why: "Regla de la potencia: xⁿ⁺¹/(n+1).",
  },
  {
    m: 6,
    q: "Integra:",
    tex: "\\int \\cos x\\,dx",
    options: ["\\sin x+C", "-\\sin x+C", "\\cos x+C", "\\tan x+C"],
    a: 0,
    why: "La derivada de sin x es cos x.",
  },
  {
    m: 6,
    q: "Integra:",
    tex: "\\int 5\\,dx",
    options: ["5x+C", "5+C", "\\tfrac{5x^2}{2}+C", "0"],
    a: 0,
    why: "La integral de una constante k es kx + C.",
  },
  {
    m: 6,
    q: "Integra:",
    tex: "\\int \\frac{1}{x^2}\\,dx",
    options: ["-\\tfrac1x+C", "\\ln x^2+C", "\\tfrac{1}{x}+C", "-\\tfrac{2}{x^3}+C"],
    a: 0,
    why: "x⁻² → x⁻¹/(−1) = −1/x.",
  },
  {
    m: 6,
    q: "Integra:",
    tex: "\\int \\sec^2 x\\,dx",
    options: ["\\tan x+C", "\\sec x+C", "\\cot x+C", "\\sin^2 x+C"],
    a: 0,
    why: "La derivada de tan x es sec² x.",
  },
  // Módulo 7 — Sustitución
  {
    m: 7,
    q: "¿Qué u conviene?",
    tex: "\\int 2x\\,(x^2+1)^5\\,dx",
    options: ["u=x^2+1", "u=2x", "u=(x^2+1)^5", "u=x"],
    a: 0,
    why: "Su derivada 2x aparece como factor.",
  },
  {
    m: 7,
    q: "Integra:",
    tex: "\\int \\cos(3x)\\,dx",
    options: ["\\tfrac{\\sin 3x}{3}+C", "3\\sin 3x+C", "\\sin 3x+C", "-\\tfrac{\\sin 3x}{3}+C"],
    a: 0,
    why: "u = 3x, dx = du/3.",
  },
  {
    m: 7,
    q: "Integra:",
    tex: "\\int (2x+1)^4\\,dx",
    options: ["\\tfrac{(2x+1)^5}{10}+C", "\\tfrac{(2x+1)^5}{5}+C", "8(2x+1)^3+C", "(2x+1)^5+C"],
    a: 0,
    why: "u = 2x + 1, du = 2dx ⇒ (1/2)·u⁵/5.",
  },
  {
    m: 7,
    q: "Si u = x² + 1 y x va de 0 a 1, u va de…",
    options: ["1 \\text{ a } 2", "0 \\text{ a } 1", "0 \\text{ a } 2", "1 \\text{ a } 3"],
    a: 0,
    why: "u(0) = 1 y u(1) = 2.",
  },
  // Módulo 8 — Exponenciales
  {
    m: 8,
    q: "Integra:",
    tex: "\\int e^{x}\\,dx",
    options: ["e^{x}+C", "xe^{x-1}+C", "\\tfrac{e^{x+1}}{x+1}+C", "e+C"],
    a: 0,
    why: "eˣ es su propia antiderivada.",
  },
  {
    m: 8,
    q: "Integra:",
    tex: "\\int e^{5x}\\,dx",
    options: ["\\tfrac{e^{5x}}{5}+C", "5e^{5x}+C", "e^{5x}+C", "\\tfrac{e^{6x}}{6}+C"],
    a: 0,
    why: "∫e^{kx}dx = e^{kx}/k.",
  },
  {
    m: 8,
    q: "Integra:",
    tex: "\\int 2^{x}\\,dx",
    options: [
      "\\tfrac{2^{x}}{\\ln 2}+C",
      "2^{x}\\ln 2+C",
      "\\tfrac{2^{x+1}}{x+1}+C",
      "x\\,2^{x-1}+C",
    ],
    a: 0,
    why: "∫aˣdx = aˣ/ln a.",
  },
  {
    m: 8,
    q: "Calcula:",
    tex: "\\int_0^1 e^{x}\\,dx",
    options: ["e-1", "e", "1", "e+1"],
    a: 0,
    why: "e¹ − e⁰ = e − 1.",
  },
  // Módulo 9 — Logarítmicas
  {
    m: 9,
    q: "Integra:",
    tex: "\\int \\frac{1}{x}\\,dx",
    options: ["\\ln|x|+C", "-\\tfrac{1}{x^2}+C", "\\tfrac{x^0}{0}+C", "e^{x}+C"],
    a: 0,
    why: "Es el caso n = −1 de la potencia.",
  },
  {
    m: 9,
    q: "Integra:",
    tex: "\\int \\frac{3}{3x+1}\\,dx",
    options: ["\\ln|3x+1|+C", "3\\ln|3x+1|+C", "\\tfrac13\\ln|3x+1|+C", "\\tfrac{-3}{(3x+1)^2}+C"],
    a: 0,
    why: "El numerador es la derivada del denominador.",
  },
  {
    m: 9,
    q: "Integra:",
    tex: "\\int \\tan x\\,dx",
    options: ["-\\ln|\\cos x|+C", "\\sec^2 x+C", "\\ln|\\sin x|+C", "\\tfrac{\\tan^2x}{2}+C"],
    a: 0,
    why: "tan x = sin x/cos x, con u = cos x.",
  },
  {
    m: 9,
    q: "Integra:",
    tex: "\\int \\frac{2x}{x^2+1}\\,dx",
    options: ["\\ln(x^2+1)+C", "\\arctan x+C", "2\\ln(x^2+1)+C", "\\tfrac{1}{x^2+1}+C"],
    a: 0,
    why: "f′/f integra a ln|f|.",
  },
  // Módulo 10 — Trigonométricas
  {
    m: 10,
    q: "¿A qué es igual sin²x?",
    options: ["\\tfrac{1-\\cos 2x}{2}", "\\tfrac{1+\\cos 2x}{2}", "1+\\cos^2x", "2\\sin x\\cos x"],
    a: 0,
    why: "Identidad del ángulo doble.",
  },
  {
    m: 10,
    q: "Integra:",
    tex: "\\int \\sin x\\,dx",
    options: ["-\\cos x+C", "\\cos x+C", "-\\sin x+C", "\\tan x+C"],
    a: 0,
    why: "La derivada de −cos x es sin x.",
  },
  {
    m: 10,
    q: "Integra:",
    tex: "\\int \\sin x\\cos x\\,dx",
    options: ["\\tfrac{\\sin^2x}{2}+C", "\\sin x\\cos x+C", "\\cos 2x+C", "-\\sin^2 x+C"],
    a: 0,
    why: "u = sin x, du = cos x dx.",
  },
  {
    m: 10,
    q: "Calcula:",
    tex: "\\int_0^{2\\pi}\\sin x\\,dx",
    options: ["0", "2", "2\\pi", "-2"],
    a: 0,
    why: "En un periodo completo el área positiva y la negativa se cancelan.",
  },
  // Módulo 11 — Trig. inversas
  {
    m: 11,
    q: "Integra:",
    tex: "\\int \\frac{dx}{1+x^2}",
    options: ["\\arctan x+C", "\\ln(1+x^2)+C", "\\arcsin x+C", "\\tfrac{1}{1+x^2}+C"],
    a: 0,
    why: "La derivada de arctan x es 1/(1+x²).",
  },
  {
    m: 11,
    q: "Integra:",
    tex: "\\int \\frac{dx}{\\sqrt{1-x^2}}",
    options: ["\\arcsin x+C", "\\arctan x+C", "\\sqrt{1-x^2}+C", "\\ln|1-x^2|+C"],
    a: 0,
    why: "La derivada de arcsin x es 1/√(1−x²).",
  },
  {
    m: 11,
    q: "Integra:",
    tex: "\\int \\frac{dx}{9+x^2}",
    options: [
      "\\tfrac13\\arctan\\tfrac{x}{3}+C",
      "\\arctan\\tfrac{x}{3}+C",
      "\\tfrac19\\arctan x+C",
      "3\\arctan 3x+C",
    ],
    a: 0,
    why: "(1/a)·arctan(x/a) con a = 3.",
  },
  {
    m: 11,
    q: "Calcula:",
    tex: "\\int_0^1\\frac{dx}{1+x^2}",
    options: ["\\tfrac{\\pi}{4}", "\\tfrac{\\pi}{2}", "1", "\\ln 2"],
    a: 0,
    why: "arctan 1 − arctan 0 = π/4.",
  },
  // Módulo 12 — Hiperbólicas inversas
  {
    m: 12,
    q: "Identidad hiperbólica fundamental:",
    options: [
      "\\cosh^2x-\\sinh^2x=1",
      "\\sinh^2x+\\cosh^2x=1",
      "\\sinh^2x-\\cosh^2x=1",
      "\\tanh x=\\cosh x",
    ],
    a: 0,
    why: "Se verifica con las definiciones exponenciales.",
  },
  {
    m: 12,
    q: "Integra:",
    tex: "\\int \\frac{dx}{\\sqrt{x^2+1}}",
    options: ["\\operatorname{arcsenh} x+C", "\\arcsin x+C", "\\arctan x+C", "\\ln|x^2+1|+C"],
    a: 0,
    why: "Suma de cuadrados bajo raíz ⇒ arcsenh.",
  },
  {
    m: 12,
    q: "¿Cómo se define sinh x?",
    options: [
      "\\tfrac{e^{x}-e^{-x}}{2}",
      "\\tfrac{e^{x}+e^{-x}}{2}",
      "e^{x}-e^{-x}",
      "\\tfrac{e^{x}}{e^{-x}}",
    ],
    a: 0,
    why: "Seno hiperbólico: semidiferencia de exponenciales.",
  },
  {
    m: 12,
    q: "Integra (|x| < 1):",
    tex: "\\int \\frac{dx}{1-x^2}",
    options: ["\\operatorname{arctanh} x+C", "\\arctan x+C", "\\arcsin x+C", "-\\ln|1-x^2|+C"],
    a: 0,
    why: "a² − u² sin raíz ⇒ arctanh.",
  },
  // Módulo 13 — Trinomio
  {
    m: 13,
    q: "Completa el cuadrado:",
    tex: "x^2+6x+10",
    options: ["(x+3)^2+1", "(x+6)^2+10", "(x+3)^2+10", "(x-3)^2+1"],
    a: 0,
    why: "(x + 3)² = x² + 6x + 9, y 10 − 9 = 1.",
  },
  {
    m: 13,
    q: "Integra:",
    tex: "\\int \\frac{dx}{x^2+2x+2}",
    options: ["\\arctan(x+1)+C", "\\ln(x^2+2x+2)+C", "\\arcsin(x+1)+C", "\\tfrac{1}{x+1}+C"],
    a: 0,
    why: "x² + 2x + 2 = (x + 1)² + 1.",
  },
  {
    m: 13,
    q: "Integra:",
    tex: "\\int \\frac{dx}{(x+1)^2}",
    options: ["-\\tfrac{1}{x+1}+C", "\\ln|x+1|+C", "\\arctan(x+1)+C", "\\tfrac{(x+1)^3}{3}+C"],
    a: 0,
    why: "Potencia −2 de (x + 1).",
  },
  {
    m: 13,
    q: "Si 4ac − b² > 0 en ∫dx/(ax²+bx+c), el resultado es un…",
    options: [T("arcotangente"), T("logaritmo"), T("arcoseno"), T("polinomio")],
    a: 0,
    why: "Sin raíces reales queda una suma de cuadrados.",
  },
  // Módulo 14 — Por partes
  {
    m: 14,
    q: "Fórmula de integración por partes:",
    options: [
      "\\int u\\,dv=uv-\\int v\\,du",
      "\\int u\\,dv=uv+\\int v\\,du",
      "\\int u\\,dv=u'v'",
      "\\int u\\,dv=\\tfrac{u}{v}",
    ],
    a: 0,
    why: "Sale de integrar la regla del producto.",
  },
  {
    m: 14,
    q: "En ∫ x eˣ dx, según LIATE, u =",
    options: ["x", "e^{x}", "xe^{x}", "1"],
    a: 0,
    why: "Algebraica va antes que Exponencial.",
  },
  {
    m: 14,
    q: "En ∫ ln x dx, se toma dv =",
    options: ["dx", "\\ln x\\,dx", "\\tfrac{dx}{x}", "x\\,dx"],
    a: 0,
    why: "u = ln x y dv = dx: el truco clásico.",
  },
  {
    m: 14,
    q: "Integra:",
    tex: "\\int x e^{x}\\,dx",
    options: ["e^{x}(x-1)+C", "xe^{x}+C", "\\tfrac{x^2}{2}e^{x}+C", "e^{x}(x+1)+C"],
    a: 0,
    why: "xeˣ − ∫eˣdx = xeˣ − eˣ.",
  },
];

export const MODULE_TITLES: Record<number, string> = {
  1: "Sumas de Riemann",
  2: "Regla del Trapecio",
  3: "Regla del Punto Medio",
  4: "Regla de Simpson",
  5: "Integral Definida",
  6: "Integración Directa",
  7: "Sustitución",
  8: "Exponenciales",
  9: "Logarítmicas",
  10: "Trigonométricas",
  11: "Trig. Inversas",
  12: "Hiperbólicas Inversas",
  13: "Trinomio",
  14: "Por Partes",
};

/** Mezcla un arreglo (Fisher–Yates) sin mutar el original */
export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

/** Devuelve la pregunta con las opciones barajadas y el índice correcto actualizado */
export function withShuffledOptions(q: GameQuestion): GameQuestion {
  const order = shuffle(q.options.map((_, i) => i));
  return { ...q, options: order.map((i) => q.options[i]!), a: order.indexOf(q.a) };
}

/** Generador de preguntas sin repetición hasta agotar el banco filtrado */
export function questionDeck(modules: number[]) {
  const pool = QUESTIONS.filter((q) => modules.includes(q.m));
  let deck: GameQuestion[] = [];
  return () => {
    if (deck.length === 0) deck = shuffle(pool);
    return withShuffledOptions(deck.pop()!);
  };
}
