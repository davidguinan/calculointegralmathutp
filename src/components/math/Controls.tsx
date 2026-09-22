import { FUNCTIONS } from "@/lib/functions";

export function FunctionSelect({
  value,
  onChange,
  options = FUNCTIONS,
}: {
  value: string;
  onChange: (id: string) => void;
  options?: typeof FUNCTIONS;
}) {
  return (
    <label className="block text-sm">
      <span className="font-medium">Función</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
      >
        {options.map((f) => (
          <option key={f.id} value={f.id}>
            {f.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function SliderField({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  display,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  display?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="flex items-baseline justify-between">
        <span className="font-medium">{label}</span>
        <span className="font-mono text-muted-foreground">{display ?? value}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-[var(--primary)]"
      />
    </label>
  );
}

export function Stat({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "accent" | "success";
}) {
  const tones = {
    default: "bg-secondary text-secondary-foreground",
    accent: "bg-highlight text-highlight-foreground",
    success: "bg-success/15 text-foreground",
  };
  return (
    <div className={`rounded-lg px-4 py-3 ${tones[tone]}`}>
      <p className="text-xs uppercase tracking-widest opacity-70">{label}</p>
      <p className="mt-1 font-mono text-lg font-semibold">{value}</p>
    </div>
  );
}
