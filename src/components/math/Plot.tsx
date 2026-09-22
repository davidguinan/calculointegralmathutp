import { useMemo, type ReactNode } from "react";

export type Scales = {
  sx: (x: number) => number;
  sy: (y: number) => number;
  x0: number;
  x1: number;
  y0: number;
  y1: number;
  W: number;
  H: number;
};

const W = 720;
const H = 420;
const PAD = { l: 48, r: 20, t: 20, b: 36 };

export function Plot({
  f,
  domain,
  extraPoints = [],
  children,
  caption,
}: {
  f: (x: number) => number;
  domain: [number, number];
  extraPoints?: number[];
  children?: (s: Scales) => ReactNode;
  caption?: string;
}) {
  const { scales, path, ticks } = useMemo(() => {
    const [a, b] = domain;
    const span = b - a || 1;
    const x0 = a - span * 0.12;
    const x1 = b + span * 0.12;
    const samples = Array.from({ length: 401 }, (_, i) => x0 + ((x1 - x0) * i) / 400);
    const ys = samples
      .map(f)
      .filter((v) => Number.isFinite(v) && Math.abs(v) < 1e6)
      .concat(extraPoints, [0]);
    let lo = Math.min(...ys);
    let hi = Math.max(...ys);
    if (hi - lo < 1e-9) {
      hi += 1;
      lo -= 1;
    }
    const padY = (hi - lo) * 0.12;
    lo -= padY;
    hi += padY;

    const sx = (x: number) => PAD.l + ((x - x0) / (x1 - x0)) * (W - PAD.l - PAD.r);
    const sy = (y: number) => H - PAD.b - ((y - lo) / (hi - lo)) * (H - PAD.t - PAD.b);

    let d = "";
    let pen = false;
    for (const x of samples) {
      const y = f(x);
      if (!Number.isFinite(y) || Math.abs(y) > 1e6) {
        pen = false;
        continue;
      }
      d += `${pen ? "L" : "M"}${sx(x).toFixed(2)},${sy(y).toFixed(2)} `;
      pen = true;
    }

    const tk = Array.from({ length: 5 }, (_, i) => ({
      x: x0 + ((x1 - x0) * i) / 4,
      y: lo + ((hi - lo) * i) / 4,
    }));

    return {
      scales: { sx, sy, x0, x1, y0: lo, y1: hi, W, H } as Scales,
      path: d,
      ticks: tk,
    };
  }, [f, domain, extraPoints]);

  return (
    <figure className="w-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full rounded-xl border border-border bg-card"
        role="img"
      >
        {ticks.map((t, i) => (
          <g key={i}>
            <line
              x1={PAD.l}
              x2={W - PAD.r}
              y1={scales.sy(t.y)}
              y2={scales.sy(t.y)}
              className="stroke-border"
              strokeWidth={1}
            />
            <text
              x={PAD.l - 8}
              y={scales.sy(t.y) + 4}
              textAnchor="end"
              className="fill-muted-foreground"
              fontSize={11}
            >
              {t.y.toFixed(1)}
            </text>
            <text
              x={scales.sx(t.x)}
              y={H - 12}
              textAnchor="middle"
              className="fill-muted-foreground"
              fontSize={11}
            >
              {t.x.toFixed(1)}
            </text>
          </g>
        ))}
        {/* eje x */}
        {scales.y0 <= 0 && scales.y1 >= 0 && (
          <line
            x1={PAD.l}
            x2={W - PAD.r}
            y1={scales.sy(0)}
            y2={scales.sy(0)}
            className="stroke-foreground/50"
            strokeWidth={1.5}
          />
        )}
        {children?.(scales)}
        <path d={path} fill="none" className="stroke-primary" strokeWidth={2.5} />
      </svg>
      {caption && <figcaption className="mt-2 text-sm text-muted-foreground">{caption}</figcaption>}
    </figure>
  );
}
