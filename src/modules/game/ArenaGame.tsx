import { Link } from "@tanstack/react-router";
import {
  CheckCircle2,
  Lock,
  Pause,
  Play,
  RotateCcw,
  Swords,
  Trophy,
  User,
  Users,
  XCircle,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as RPointerEvent,
} from "react";
import { Tex } from "@/components/math/Tex";
import { MODULES } from "@/modules/registry";
import {
  BOSSES,
  draw,
  emptyInput,
  H,
  newGame,
  POWERS,
  resolveOrb,
  update,
  W,
  type GameState,
  type Input,
  type OrbEvent,
} from "./engine";
import { MODULE_TITLES, questionDeck, type GameQuestion } from "./questions";

type Phase = "menu" | "playing" | "paused" | "question" | "end";
type Asked = { q: GameQuestion; ok: boolean; who: "p1" | "p2" };

const PROGRESS_KEY = "arena-integral-progreso";
const readProgress = () => {
  try {
    return Math.max(
      0,
      Math.min(BOSSES.length, Number(localStorage.getItem(PROGRESS_KEY) ?? 0) || 0),
    );
  } catch {
    return 0;
  }
};
const saveProgress = (v: number) => {
  try {
    localStorage.setItem(PROGRESS_KEY, String(v));
  } catch {
    /* sin almacenamiento: el progreso dura solo esta sesión */
  }
};

const ALL_MODULES = Array.from({ length: 14 }, (_, i) => i + 1);
const P1_NAME = "Jugador 1";
const P2_NAME = "Jugador 2";

export function ArenaGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<GameState | null>(null);
  const inputs = useRef<{ p1: Input; p2: Input }>({ p1: emptyInput(), p2: emptyInput() });
  const deckRef = useRef<() => GameQuestion>(() => questionDeck(ALL_MODULES)());
  const [phase, setPhase] = useState<Phase>("menu");
  const [mode, setMode] = useState<"campaign" | "duel">("campaign");
  const [level, setLevel] = useState(0);
  const [unlocked, setUnlocked] = useState(0);
  const [duelTopic, setDuelTopic] = useState(-1);
  const [pending, setPending] = useState<{
    ev: OrbEvent;
    q: GameQuestion;
    picked: number | null;
  } | null>(null);
  const [asked, setAsked] = useState<Asked[]>([]);
  const [winner, setWinner] = useState<"p1" | "p2" | "boss" | null>(null);
  const [touch, setTouch] = useState(false);

  useEffect(() => {
    if (import.meta.env.DEV) (window as unknown as { __arena: unknown }).__arena = stateRef;
    setUnlocked(readProgress());
    try {
      setTouch(window.matchMedia("(pointer: coarse)").matches);
    } catch {
      /* ignore */
    }
  }, []);

  const paint = useCallback(() => {
    const c = canvasRef.current;
    const s = stateRef.current;
    if (!c || !s) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    if (c.width !== W * dpr) {
      c.width = W * dpr;
      c.height = H * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    draw(ctx, s);
  }, []);

  // Pantalla de fondo en el menú
  useEffect(() => {
    if (!stateRef.current) stateRef.current = newGame("campaign", 0, [P1_NAME, P2_NAME]);
    paint();
  }, [paint]);

  const start = (m: "campaign" | "duel", lvl = 0) => {
    setMode(m);
    setLevel(lvl);
    setAsked([]);
    setWinner(null);
    setPending(null);
    inputs.current = { p1: emptyInput(), p2: emptyInput() };
    const mods =
      m === "campaign"
        ? BOSSES[lvl]!.modules
        : duelTopic < 0
          ? ALL_MODULES
          : BOSSES[duelTopic]!.modules;
    deckRef.current = questionDeck(mods);
    stateRef.current = newGame(m, lvl, [P1_NAME, m === "duel" ? P2_NAME : BOSSES[lvl]!.name]);
    setPhase("playing");
    if (touch) {
      requestAnimationFrame(() =>
        wrapRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      );
    }
  };

  // Bucle principal
  useEffect(() => {
    if (phase !== "playing") return;
    let raf = 0;
    let last = performance.now();
    let endTimer = 0;
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const s = stateRef.current!;
      const ev = update(s, dt, inputs.current);
      paint();
      if (ev) {
        setPending({ ev, q: deckRef.current(), picked: null });
        setPhase("question");
        return;
      }
      if (s.over) {
        endTimer += dt;
        if (endTimer > 1.2) {
          setWinner(s.over.winner);
          if (s.mode === "campaign" && s.over.winner === "p1") {
            const next = Math.max(readProgress(), s.level + 1);
            saveProgress(next);
            setUnlocked(next);
          }
          setPhase("end");
          return;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase, paint]);

  // Teclado
  useEffect(() => {
    const map = (code: string, down: boolean) => {
      const a = inputs.current.p1;
      const b = inputs.current.p2;
      const duel = mode === "duel";
      const p1Keys: Record<string, keyof Input> = {
        KeyW: "up",
        KeyS: "down",
        KeyA: "left",
        KeyD: "right",
        KeyF: "fire",
        Space: "fire",
      };
      const arrows: Record<string, keyof Input> = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right",
      };
      const p2Fire = ["KeyL", "Enter", "Numpad0", "ShiftRight"];
      let hit = false;
      if (p1Keys[code]) {
        (a[p1Keys[code]] as boolean) = down;
        hit = true;
      }
      if (arrows[code]) {
        ((duel ? b : a)[arrows[code]] as boolean) = down;
        hit = true;
      }
      if (p2Fire.includes(code)) {
        if (duel) b.fire = down;
        else a.fire = down;
        hit = true;
      }
      if (!duel && (code === "KeyJ" || code === "KeyK")) {
        a.fire = down;
        hit = true;
      }
      return hit;
    };
    const kd = (e: KeyboardEvent) => {
      if (phase === "playing") {
        if (e.code === "Escape" || e.code === "KeyP") {
          setPhase("paused");
          return;
        }
        if (map(e.code, true)) e.preventDefault();
      } else if (phase === "paused" && (e.code === "Escape" || e.code === "KeyP")) {
        inputs.current = { p1: emptyInput(), p2: emptyInput() };
        setPhase("playing");
      }
    };
    const ku = (e: KeyboardEvent) => {
      map(e.code, false);
    };
    window.addEventListener("keydown", kd);
    window.addEventListener("keyup", ku);
    return () => {
      window.removeEventListener("keydown", kd);
      window.removeEventListener("keyup", ku);
    };
  }, [phase, mode]);

  const answer = (i: number) => {
    if (!pending || pending.picked !== null) return;
    setPending({ ...pending, picked: i });
    setAsked((prev) => [...prev, { q: pending.q, ok: i === pending.q.a, who: pending.ev.who }]);
  };

  const resume = useCallback(() => {
    if (!pending || pending.picked === null || !stateRef.current) return;
    resolveOrb(stateRef.current, pending.ev, pending.picked === pending.q.a);
    inputs.current = { p1: emptyInput(), p2: emptyInput() };
    setPending(null);
    setPhase("playing");
  }, [pending]);

  // Teclas 1–4 y Enter en la pregunta
  useEffect(() => {
    if (phase !== "question") return;
    const kd = (e: KeyboardEvent) => {
      const n = [
        "Digit1",
        "Digit2",
        "Digit3",
        "Digit4",
        "Numpad1",
        "Numpad2",
        "Numpad3",
        "Numpad4",
      ].indexOf(e.code);
      if (n >= 0 && pending?.picked === null) {
        e.preventDefault();
        answer(n % 4);
      } else if ((e.code === "Enter" || e.code === "Space") && pending?.picked !== null) {
        e.preventDefault();
        resume();
      }
    };
    window.addEventListener("keydown", kd);
    return () => window.removeEventListener("keydown", kd);
  });

  const correct = asked.filter((a) => a.ok).length;
  const slugOf = (m: number) => MODULES.find((x) => x.id === m)?.slug ?? "";
  const whoName = (w: "p1" | "p2") => (w === "p1" ? P1_NAME : P2_NAME);

  return (
    <div ref={wrapRef} className="scroll-mt-20 space-y-4">
      <div className="relative overflow-hidden rounded-xl border border-border bg-[#0b1430] shadow-[var(--shadow-card)]">
        <canvas
          ref={canvasRef}
          className="block aspect-[16/9] w-full touch-none select-none"
          onPointerDown={() => {
            if (phase === "playing" && mode === "campaign" && !touch) inputs.current.p1.fire = true;
          }}
          onPointerUp={() => {
            if (mode === "campaign" && !touch) inputs.current.p1.fire = false;
          }}
          onPointerLeave={() => {
            if (mode === "campaign" && !touch) inputs.current.p1.fire = false;
          }}
        />

        {phase === "playing" && (
          <button
            onClick={() => setPhase("paused")}
            className="absolute right-3 top-11 rounded-md bg-slate-900/70 p-1.5 text-slate-200 hover:bg-slate-800"
            aria-label="Pausar"
          >
            <Pause className="size-4" />
          </button>
        )}

        {phase === "menu" && (
          <Overlay>
            <h3 className="text-2xl font-bold sm:text-3xl">Arena Integral</h3>
            <p className="mt-1 max-w-md text-sm text-slate-300">
              Toca los orbes <span className="font-semibold text-amber-300">?</span> para ganar
              poderes… pero solo si respondes bien la pregunta.
            </p>
            <div className="mt-5 grid w-full max-w-xl gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-slate-800/80 p-3 text-left">
                <p className="flex items-center gap-2 font-semibold">
                  <User className="size-4" /> Campaña
                </p>
                <div className="mt-2 space-y-1.5">
                  {BOSSES.map((b, i) => (
                    <button
                      key={b.name}
                      disabled={i > unlocked}
                      onClick={() => start("campaign", i)}
                      className="flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-xs hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <span>
                        <span className="font-semibold" style={{ color: b.color }}>
                          {i + 1}. {b.name}
                        </span>
                        <span className="block text-slate-400">{b.title}</span>
                      </span>
                      {i > unlocked ? (
                        <Lock className="size-3.5 shrink-0" />
                      ) : i < unlocked ? (
                        <Trophy className="size-3.5 shrink-0 text-amber-300" />
                      ) : (
                        <Play className="size-3.5 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col rounded-lg bg-slate-800/80 p-3 text-left">
                <p className="flex items-center gap-2 font-semibold">
                  <Users className="size-4" /> Duelo (2 jugadores)
                </p>
                <label className="mt-2 text-xs text-slate-300">
                  Preguntas de:
                  <select
                    value={duelTopic}
                    onChange={(e) => setDuelTopic(Number(e.target.value))}
                    className="mt-1 w-full rounded-md border border-slate-600 bg-slate-900 px-2 py-1.5 text-xs"
                  >
                    <option value={-1}>Todos los módulos (1–14)</option>
                    {BOSSES.map((b, i) => (
                      <option key={b.name} value={i}>
                        {b.title}
                      </option>
                    ))}
                  </select>
                </label>
                <p className="mt-2 text-xs text-slate-400">
                  <span className="text-blue-400">Azul:</span> W A S D + F ·{" "}
                  <span className="text-red-400">Rojo:</span> flechas + L
                  {touch && " · En táctil: cada jugador usa su lado de la pantalla."}
                </p>
                <button
                  onClick={() => start("duel")}
                  className="mt-auto inline-flex items-center justify-center gap-2 rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white hover:bg-red-600"
                >
                  <Swords className="size-4" /> ¡A pelear!
                </button>
              </div>
            </div>
          </Overlay>
        )}

        {phase === "paused" && (
          <Overlay>
            <h3 className="text-2xl font-bold">Pausa</h3>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  inputs.current = { p1: emptyInput(), p2: emptyInput() };
                  setPhase("playing");
                }}
                className="inline-flex items-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600"
              >
                <Play className="size-4" /> Continuar
              </button>
              <button
                onClick={() => setPhase("menu")}
                className="rounded-md bg-slate-700 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-600"
              >
                Menú
              </button>
            </div>
          </Overlay>
        )}

        {phase === "question" && pending && (
          <Overlay>
            <div className="w-full max-w-xl rounded-xl bg-slate-50 p-4 text-left text-slate-900 shadow-2xl sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span
                  className="rounded-full px-2.5 py-1 font-semibold text-slate-900"
                  style={{ background: POWERS[pending.ev.kind].color }}
                >
                  {POWERS[pending.ev.kind].glyph} {POWERS[pending.ev.kind].label}
                </span>
                <span className="text-slate-500">
                  {mode === "duel" && (
                    <strong className={pending.ev.who === "p1" ? "text-blue-600" : "text-red-600"}>
                      {whoName(pending.ev.who)} ·{" "}
                    </strong>
                  )}
                  Módulo {pending.q.m}: {MODULE_TITLES[pending.q.m]}
                </span>
              </div>
              <p className="mt-3 font-semibold">{pending.q.q}</p>
              {pending.q.tex && (
                <div className="mt-1 text-lg">
                  <Tex>{pending.q.tex}</Tex>
                </div>
              )}
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {pending.q.options.map((o, i) => {
                  const done = pending.picked !== null;
                  let cls = "border-slate-300 hover:bg-slate-200";
                  if (done && i === pending.q.a) cls = "border-green-600 bg-green-100";
                  else if (done && i === pending.picked) cls = "border-red-600 bg-red-100";
                  else if (done) cls = "border-slate-200 opacity-50";
                  return (
                    <button
                      key={i}
                      disabled={done}
                      onClick={() => answer(i)}
                      className={`flex min-h-11 items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm ${cls}`}
                    >
                      <span className="font-mono text-xs text-slate-500">{i + 1}</span>
                      <Tex>{o}</Tex>
                    </button>
                  );
                })}
              </div>
              {pending.picked !== null && (
                <div className="mt-3 space-y-3">
                  <div
                    className={`flex gap-2 rounded-lg px-3 py-2 text-sm ${
                      pending.picked === pending.q.a ? "bg-green-100" : "bg-red-100"
                    }`}
                  >
                    {pending.picked === pending.q.a ? (
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-green-700" />
                    ) : (
                      <XCircle className="mt-0.5 size-4 shrink-0 text-red-700" />
                    )}
                    <span>
                      <strong>
                        {pending.picked === pending.q.a
                          ? `¡Correcto! Obtienes ${POWERS[pending.ev.kind].label.toLowerCase()}. `
                          : "Incorrecto: quedas lento 3 s. "}
                      </strong>
                      {pending.q.why}
                    </span>
                  </div>
                  <button
                    onClick={resume}
                    autoFocus
                    className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
                  >
                    Continuar (Enter)
                  </button>
                </div>
              )}
            </div>
          </Overlay>
        )}

        {phase === "end" && (
          <Overlay>
            {mode === "campaign" ? (
              winner === "p1" ? (
                <>
                  <Trophy className="size-10 text-amber-300" />
                  <h3 className="mt-2 text-2xl font-bold">¡Derrotaste a {BOSSES[level]!.name}!</h3>
                  {level === BOSSES.length - 1 && (
                    <p className="mt-1 text-amber-200">
                      ¡Completaste toda la campaña! Eres maestro de la integral.
                    </p>
                  )}
                </>
              ) : (
                <>
                  <h3 className="text-2xl font-bold">Derrota</h3>
                  <p className="mt-1 text-sm text-slate-300">
                    {BOSSES[level]!.name} ganó esta vez. Repasa y vuelve a intentarlo.
                  </p>
                </>
              )
            ) : (
              <>
                <Trophy
                  className={`size-10 ${winner === "p1" ? "text-blue-400" : "text-red-400"}`}
                />
                <h3 className="mt-2 text-2xl font-bold">
                  ¡Gana {whoName(winner === "p2" ? "p2" : "p1")}!
                </h3>
              </>
            )}

            <p className="mt-2 text-sm text-slate-300">
              Preguntas correctas: <strong className="text-white">{correct}</strong> de{" "}
              {asked.length}
              {mode === "duel" && asked.length > 0 && (
                <>
                  {" "}
                  (azul {asked.filter((a) => a.who === "p1" && a.ok).length}/
                  {asked.filter((a) => a.who === "p1").length} · rojo{" "}
                  {asked.filter((a) => a.who === "p2" && a.ok).length}/
                  {asked.filter((a) => a.who === "p2").length})
                </>
              )}
            </p>

            {asked.some((a) => !a.ok) && (
              <div className="mt-3 max-h-36 w-full max-w-lg overflow-y-auto rounded-lg bg-slate-800/80 p-3 text-left text-xs">
                <p className="mb-1 font-semibold text-slate-200">Para repasar:</p>
                {asked
                  .filter((a) => !a.ok)
                  .map((a, i) => (
                    <p key={i} className="py-0.5 text-slate-300">
                      • {a.q.q} {a.q.tex && <Tex>{a.q.tex}</Tex>} →{" "}
                      <Link
                        to="/modulo/$slug"
                        params={{ slug: slugOf(a.q.m) }}
                        className="text-amber-300 underline"
                      >
                        Módulo {a.q.m}
                      </Link>
                    </p>
                  ))}
              </div>
            )}

            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {mode === "campaign" && winner === "p1" && level < BOSSES.length - 1 && (
                <button
                  onClick={() => start("campaign", level + 1)}
                  className="inline-flex items-center gap-2 rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-amber-400"
                >
                  <Play className="size-4" /> Siguiente jefe
                </button>
              )}
              <button
                onClick={() => start(mode, level)}
                className="inline-flex items-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600"
              >
                <RotateCcw className="size-4" />{" "}
                {mode === "campaign" && winner === "p1" ? "Jugar de nuevo" : "Reintentar"}
              </button>
              <button
                onClick={() => setPhase("menu")}
                className="rounded-md bg-slate-700 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-600"
              >
                Menú
              </button>
            </div>
          </Overlay>
        )}
      </div>

      {phase === "playing" && touch && (
        <div className="flex select-none items-center justify-between gap-3 rounded-xl bg-[#0b1430] p-3">
          <div className="flex items-center gap-3">
            <Joystick input={inputs.current.p1} color="#3b82f6" />
            {mode === "duel" && <FireButton input={inputs.current.p1} color="#3b82f6" />}
          </div>
          <div className="flex items-center gap-3">
            {mode === "duel" ? (
              <>
                <FireButton input={inputs.current.p2} color="#ef4444" />
                <Joystick input={inputs.current.p2} color="#ef4444" />
              </>
            ) : (
              <FireButton input={inputs.current.p1} color="#3b82f6" />
            )}
          </div>
        </div>
      )}

      <div className="grid gap-2 text-xs sm:grid-cols-5">
        {Object.values(POWERS).map((p) => (
          <div
            key={p.label}
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2"
          >
            <span
              className="grid size-7 shrink-0 place-items-center rounded-full text-sm font-bold text-slate-900"
              style={{ background: p.color }}
            >
              {p.glyph}
            </span>
            <span>
              <strong className="block">{p.label}</strong>
              <span className="text-muted-foreground">{p.desc}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Overlay({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-y-auto bg-slate-950/90 p-3 sm:absolute sm:z-auto sm:bg-slate-950/75 text-center text-slate-100 backdrop-blur-[2px] sm:p-6">
      {children}
    </div>
  );
}

/** Joystick virtual para pantallas táctiles */
function Joystick({ input, color }: { input: Input; color: string }) {
  const [knob, setKnob] = useState({ x: 0, y: 0 });
  const R = 42;
  const move = (e: RPointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    let dx = e.clientX - (r.left + r.width / 2);
    let dy = e.clientY - (r.top + r.height / 2);
    const len = Math.hypot(dx, dy);
    if (len > R) {
      dx = (dx / len) * R;
      dy = (dy / len) * R;
    }
    setKnob({ x: dx, y: dy });
    input.mx = dx / R;
    input.my = dy / R;
  };
  const end = () => {
    setKnob({ x: 0, y: 0 });
    input.mx = undefined;
    input.my = undefined;
  };
  return (
    <div
      className="relative size-28 touch-none rounded-full border-2 bg-slate-900/40"
      style={{ borderColor: color + "99" }}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        move(e);
      }}
      onPointerMove={(e) => {
        if (e.buttons || e.pointerType === "touch") move(e);
      }}
      onPointerUp={end}
      onPointerCancel={end}
    >
      <div
        className="absolute left-1/2 top-1/2 size-12 rounded-full"
        style={{
          background: color,
          transform: `translate(calc(-50% + ${knob.x}px), calc(-50% + ${knob.y}px))`,
        }}
      />
    </div>
  );
}

function FireButton({ input, color }: { input: Input; color: string }) {
  const on = () => (input.fire = true);
  const off = () => (input.fire = false);
  return (
    <button
      className="grid size-20 touch-none place-items-center rounded-full text-sm font-bold text-white shadow-lg active:scale-95"
      style={{ background: color }}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        on();
      }}
      onPointerUp={off}
      onPointerCancel={off}
      onContextMenu={(e) => e.preventDefault()}
      aria-label="Disparar"
    >
      FUEGO
    </button>
  );
}
