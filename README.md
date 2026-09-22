# Integral Explorer

Crea una plataforma web educativa e interactiva para el curso de Cálculo Integral (Universidad Tecnológica de Pereira) estructurada en 14 módulos de navegación.

### 🎨 Diseño y UI/UX General:

- Diseño responsive (adaptable a móviles, tablets y escritorio) con estética profesional, limpia y académica.

- Usa Tailwind CSS y componentes de UI elegantes (como Lucide Icons y Shadcn UI).

- Integración de KaTeX para el renderizado preciso y elegante de todas las fórmulas matemáticas en LaTeX.

- Gráficas interactivas dinámicas usando Recharts, Canvas HTML5 o Plotly.js para mostrar las curvas, particiones, trapecios, rectángulos y áreas.

### 📱 Estructura de Navegación y Páginas:

1. Página Principal (Home / Dashboard):

   - Grid claro con los 14 Módulos de aprendizaje.

   - Estado claro por cada módulo (Activo vs. Próximamente).

   - Barra de búsqueda o filtros para navegación rápida.

2. Módulos 7 al 14 (Placeholders):

   - Al hacer clic en cualquiera de los módulos del 7 al 14, deben mostrar una pantalla o card de placeholder que indique claramente: "Próximamente - Fase 2/3".

   - Módulos 7-14: Sustitución/Potencias, Exponenciales, Logarítmicas, Trigonométricas, Trigonométricas Inversas, Hiperbólicas Inversas, Trinomio ax²+bx+c, Integración por Partes.

---

### 🧮 Desarrollo Completo de Módulos Activos (Módulos 1 al 6):

#### Módulo 1: Sumas de Riemann

- Explicación teórica interactiva (Suma Izquierda, Derecha y Punto Medio) con fórmulas en KaTeX.

- Visualizador interactivo de funciones (ej. f(x) = x², sin(x)) donde el usuario pueda ajustar el número de subintervalos (n) con un slider y ver la convergencia numérica en tiempo real.

- Al menos 2 ejemplos resueltos paso a paso detalladamente.

#### Módulo 2: Regla del Trapecio

- Explicación teórica detallada, fórmula matemática y su correspondiente justificación geométrica.

- Visualizador gráfico interactivo que grafique los trapecios formados bajo la curva al modificar `n` y los límites [a, b].

- Al menos 2 ejemplos resueltos paso a paso.

#### Módulo 3: Regla del Punto Medio

- Explicación teórica de la fórmula con KaTeX.

- Visualizador interactivo mostrando los rectángulos centrados en el punto medio de cada subintervalo.

- Al menos 2 ejemplos resueltos paso a paso.

#### Módulo 4: Regla de Simpson

- Explicación teórica con la fórmula y la condición necesaria de `n` par.

- Visualizador gráfico interactivo que muestre las parábolas ajustadas en cada subintervalo.

- Al menos 2 ejemplos resueltos paso a paso.

#### Módulo 5: Integral Definida y Área bajo la Curva

- Explicación clara y didáctica del Teorema Fundamental del Cálculo.

- Visualizador interactivo del área bajo la curva con sliders para ajustar los límites de integración `a` y `b`.

- Al menos 2 ejemplos resueltos paso a paso (incluyendo un ejemplo de cálculo de área entre dos curvas).

#### Módulo 6: Integración Directa

- Explicación teórica con un compendio de fórmulas básicas de integración.

- Al menos 3 ejemplos resueltos paso a paso con renderizado perfecto en KaTeX.

- Gráficas interactivas que muestren simultáneamente la función original f(x) y su antiderivada F(x).

---

### 🏗️ Requisitos Técnicos y de Estructura:

- Estructura de código modular y limpia en React (un componente o carpeta bien definida por cada módulo para exportar limpiamente al repositorio de GitHub).

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://calculointegralutp.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/97064228-1ac6-4628-a75b-f793369c07f1).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
