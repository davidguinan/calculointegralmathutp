export type ModuleMeta = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  status: "activo" | "proximamente";
  fase?: "Fase 2" | "Fase 3";
};

export const MODULES: ModuleMeta[] = [
  {
    id: 1,
    slug: "sumas-de-riemann",
    title: "Sumas de Riemann",
    summary: "Suma izquierda, derecha y punto medio: la aproximación del área como límite.",
    tags: ["aproximación", "límite", "particiones"],
    status: "activo",
  },
  {
    id: 2,
    slug: "regla-del-trapecio",
    title: "Regla del Trapecio",
    summary: "Aproximación con trapecios y su justificación geométrica.",
    tags: ["cuadratura", "trapecios"],
    status: "activo",
  },
  {
    id: 3,
    slug: "regla-del-punto-medio",
    title: "Regla del Punto Medio",
    summary: "Rectángulos centrados en el punto medio de cada subintervalo.",
    tags: ["cuadratura", "rectángulos"],
    status: "activo",
  },
  {
    id: 4,
    slug: "regla-de-simpson",
    title: "Regla de Simpson",
    summary: "Parábolas ajustadas por tramos y la condición de n par.",
    tags: ["cuadratura", "parábolas"],
    status: "activo",
  },
  {
    id: 5,
    slug: "integral-definida",
    title: "Integral Definida y Área bajo la Curva",
    summary: "Teorema Fundamental del Cálculo y área entre curvas.",
    tags: ["TFC", "área"],
    status: "activo",
  },
  {
    id: 6,
    slug: "integracion-directa",
    title: "Integración Directa",
    summary: "Compendio de fórmulas básicas y relación entre f(x) y F(x).",
    tags: ["antiderivadas", "fórmulas"],
    status: "activo",
  },
  {
    id: 7,
    slug: "sustitucion-potencias",
    title: "Sustitución / Potencias",
    summary: "Método de sustitución y la regla de la potencia generalizada.",
    tags: ["sustitución"],
    status: "proximamente",
    fase: "Fase 2",
  },
  {
    id: 8,
    slug: "exponenciales",
    title: "Integrales Exponenciales",
    summary: "Integrales con base e y bases arbitrarias.",
    tags: ["exponencial"],
    status: "proximamente",
    fase: "Fase 2",
  },
  {
    id: 9,
    slug: "logaritmicas",
    title: "Integrales Logarítmicas",
    summary: "Formas que conducen al logaritmo natural.",
    tags: ["logaritmo"],
    status: "proximamente",
    fase: "Fase 2",
  },
  {
    id: 10,
    slug: "trigonometricas",
    title: "Integrales Trigonométricas",
    summary: "Potencias y productos de funciones trigonométricas.",
    tags: ["trigonometría"],
    status: "proximamente",
    fase: "Fase 2",
  },
  {
    id: 11,
    slug: "trigonometricas-inversas",
    title: "Trigonométricas Inversas",
    summary: "Formas que producen arcsen, arctan y arcsec.",
    tags: ["inversas"],
    status: "proximamente",
    fase: "Fase 3",
  },
  {
    id: 12,
    slug: "hiperbolicas-inversas",
    title: "Hiperbólicas Inversas",
    summary: "Integrales asociadas a arcsinh, arccosh y arctanh.",
    tags: ["hiperbólicas"],
    status: "proximamente",
    fase: "Fase 3",
  },
  {
    id: 13,
    slug: "trinomio-cuadratico",
    title: "Trinomio ax² + bx + c",
    summary: "Completación de cuadrados para integrandos cuadráticos.",
    tags: ["trinomio"],
    status: "proximamente",
    fase: "Fase 3",
  },
  {
    id: 14,
    slug: "integracion-por-partes",
    title: "Integración por Partes",
    summary: "La fórmula ∫u dv = uv − ∫v du y la estrategia LIATE.",
    tags: ["por partes"],
    status: "proximamente",
    fase: "Fase 3",
  },
];

export const getModule = (slug: string) => MODULES.find((m) => m.slug === slug);
