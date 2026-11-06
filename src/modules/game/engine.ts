/** Motor de la Arena Integral: lógica pura, sin React. */

export const W = 960;
export const H = 540;

export type PowerKind = "triple" | "shield" | "heal" | "beam" | "speed";

export const POWERS: Record<
  PowerKind,
  { label: string; glyph: string; color: string; desc: string }
> = {
  triple: {
    label: "Disparo triple",
    glyph: "3×",
    color: "#f59e0b",
    desc: "Disparas 3 proyectiles durante 8 s",
  },
  shield: {
    label: "Escudo",
    glyph: "◈",
    color: "#38bdf8",
    desc: "Bloquea todo el daño durante 6 s",
  },
  heal: { label: "Curación", glyph: "+", color: "#22c55e", desc: "Recuperas 30 puntos de vida" },
  beam: {
    label: "Rayo integral",
    glyph: "∫",
    color: "#e879f9",
    desc: "Rayo instantáneo de gran daño",
  },
  speed: {
    label: "Velocidad",
    glyph: "»",
    color: "#facc15",
    desc: "Te mueves y disparas más rápido 8 s",
  },
};

export type BossDef = {
  name: string;
  title: string;
  modules: number[];
  hp: number;
  color: string;
  patterns: Pattern[];
};

type Pattern = "aimed" | "radial" | "spiral" | "burst" | "rain";

export const BOSSES: BossDef[] = [
  {
    name: "Guardián de Riemann",
    title: "Métodos numéricos (M1–M4)",
    modules: [1, 2, 3, 4],
    hp: 280,
    color: "#f97316",
    patterns: ["aimed", "radial"],
  },
  {
    name: "Titán del TFC",
    title: "Integral definida y directa (M5–M6)",
    modules: [5, 6],
    hp: 360,
    color: "#ef4444",
    patterns: ["aimed", "radial", "burst"],
  },
  {
    name: "Hechicero de la Sustitución",
    title: "Sustitución, exp. y log. (M7–M9)",
    modules: [7, 8, 9],
    hp: 440,
    color: "#a855f7",
    patterns: ["aimed", "spiral", "burst"],
  },
  {
    name: "Señor de los Ángulos",
    title: "Trigonométricas e inversas (M10–M12)",
    modules: [10, 11, 12],
    hp: 520,
    color: "#06b6d4",
    patterns: ["radial", "spiral", "rain", "burst"],
  },
  {
    name: "Rey de las Partes",
    title: "Trinomio y por partes (M13–M14)",
    modules: [13, 14],
    hp: 640,
    color: "#eab308",
    patterns: ["aimed", "radial", "spiral", "rain", "burst"],
  },
];

export type Input = {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  fire: boolean;
  mx?: number | undefined;
  my?: number | undefined;
};
export const emptyInput = (): Input => ({
  up: false,
  down: false,
  left: false,
  right: false,
  fire: false,
});

export type Fighter = {
  id: "p1" | "p2" | "boss";
  name: string;
  x: number;
  y: number;
  r: number;
  hp: number;
  maxHp: number;
  speed: number;
  color: string;
  cooldown: number;
  triple: number;
  shield: number;
  fast: number;
  slow: number;
  hitFlash: number;
};

type Bullet = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  dmg: number;
  owner: Fighter["id"];
  color: string;
};
type Orb = { x: number; y: number; r: number; kind: PowerKind; ttl: number; phase: number };
type Beam = { x1: number; y1: number; x2: number; y2: number; ttl: number; color: string };
type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  ttl: number;
  max: number;
  color: string;
};
type FloatText = { x: number; y: number; text: string; ttl: number; color: string };

export type GameState = {
  mode: "campaign" | "duel";
  level: number;
  fighters: Fighter[];
  bullets: Bullet[];
  orbs: Orb[];
  beams: Beam[];
  particles: Particle[];
  texts: FloatText[];
  orbTimer: number;
  bossAttack: number;
  bossTarget: { x: number; y: number };
  spiral: { t: number; angle: number };
  time: number;
  shake: number;
  over: null | { winner: Fighter["id"] };
};

export type OrbEvent = { who: "p1" | "p2"; kind: PowerKind };

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const dist = (ax: number, ay: number, bx: number, by: number) => Math.hypot(ax - bx, ay - by);
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

function fighter(
  id: Fighter["id"],
  name: string,
  x: number,
  y: number,
  color: string,
  hp = 100,
): Fighter {
  return {
    id,
    name,
    x,
    y,
    r: id === "boss" ? 34 : 18,
    hp,
    maxHp: hp,
    speed: id === "boss" ? 120 : 260,
    color,
    cooldown: 0,
    triple: 0,
    shield: 0,
    fast: 0,
    slow: 0,
    hitFlash: 0,
  };
}

export function newGame(
  mode: "campaign" | "duel",
  level = 0,
  names: [string, string] = ["Jugador 1", "Jugador 2"],
): GameState {
  const fighters: Fighter[] =
    mode === "campaign"
      ? [
          fighter("p1", names[0], 160, H / 2, "#3b82f6"),
          fighter(
            "boss",
            BOSSES[level]!.name,
            W - 180,
            H / 2,
            BOSSES[level]!.color,
            BOSSES[level]!.hp,
          ),
        ]
      : [
          fighter("p1", names[0], 160, H / 2, "#3b82f6"),
          fighter("p2", names[1], W - 160, H / 2, "#ef4444"),
        ];
  if (mode === "campaign") fighters[1]!.speed = 110 + level * 18;
  return {
    mode,
    level,
    fighters,
    bullets: [],
    orbs: [],
    beams: [],
    particles: [],
    texts: [],
    orbTimer: 2.5,
    bossAttack: 1.8,
    bossTarget: { x: W - 200, y: H / 2 },
    spiral: { t: 0, angle: 0 },
    time: 0,
    shake: 0,
    over: null,
  };
}

const get = (s: GameState, id: Fighter["id"]) => s.fighters.find((f) => f.id === id)!;
const opponentOf = (s: GameState, f: Fighter) => s.fighters.find((o) => o.id !== f.id)!;

function burst(s: GameState, x: number, y: number, color: string, n = 10, spd = 160) {
  for (let i = 0; i < n; i++) {
    const a = rand(0, Math.PI * 2);
    const v = rand(spd * 0.3, spd);
    const ttl = rand(0.25, 0.6);
    s.particles.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, ttl, max: ttl, color });
  }
}

function float(s: GameState, x: number, y: number, text: string, color: string) {
  s.texts.push({ x, y, text, ttl: 1.1, color });
}

function shoot(
  s: GameState,
  f: Fighter,
  angle: number,
  speed: number,
  dmg: number,
  r = 5,
  color = f.color,
) {
  s.bullets.push({
    x: f.x + Math.cos(angle) * (f.r + 4),
    y: f.y + Math.sin(angle) * (f.r + 4),
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    r,
    dmg,
    owner: f.id,
    color,
  });
}

function damage(s: GameState, target: Fighter, dmg: number, color: string) {
  if (target.shield > 0) {
    burst(s, target.x, target.y, "#38bdf8", 4, 90);
    return;
  }
  target.hp = Math.max(0, target.hp - dmg);
  target.hitFlash = 0.12;
  burst(s, target.x, target.y, color, 6, 140);
  if (target.id !== "boss") s.shake = Math.max(s.shake, 0.15);
}

function playerMove(f: Fighter, inp: Input, dt: number) {
  let dx = (inp.right ? 1 : 0) - (inp.left ? 1 : 0);
  let dy = (inp.down ? 1 : 0) - (inp.up ? 1 : 0);
  if (inp.mx !== undefined && inp.my !== undefined) {
    dx = inp.mx;
    dy = inp.my;
  }
  const len = Math.hypot(dx, dy);
  if (len > 1) {
    dx /= len;
    dy /= len;
  }
  const sp = f.speed * (f.fast > 0 ? 1.45 : 1) * (f.slow > 0 ? 0.55 : 1);
  f.x = clamp(f.x + dx * sp * dt, f.r, W - f.r);
  f.y = clamp(f.y + dy * sp * dt, f.r + 30, H - f.r);
}

function playerFire(s: GameState, f: Fighter, inp: Input) {
  if (!inp.fire || f.cooldown > 0) return;
  const t = opponentOf(s, f);
  const a = Math.atan2(t.y - f.y, t.x - f.x);
  const dmg = s.mode === "duel" ? 4 : 9;
  const angles = f.triple > 0 ? [a - 0.2, a, a + 0.2] : [a];
  for (const ang of angles) shoot(s, f, ang, 560, dmg, 5);
  f.cooldown = f.fast > 0 ? 0.13 : 0.22;
}

function bossThink(s: GameState, dt: number) {
  const boss = get(s, "boss");
  const p = get(s, "p1");
  const def = BOSSES[s.level]!;
  const lvl = s.level;
  // Movimiento hacia un punto objetivo
  if (dist(boss.x, boss.y, s.bossTarget.x, s.bossTarget.y) < 12) {
    s.bossTarget = { x: rand(W * 0.45, W - 60), y: rand(80, H - 60) };
  }
  const a = Math.atan2(s.bossTarget.y - boss.y, s.bossTarget.x - boss.x);
  boss.x += Math.cos(a) * boss.speed * dt;
  boss.y += Math.sin(a) * boss.speed * dt;

  const enraged = boss.hp < boss.maxHp * 0.4;
  const bspd = 210 + lvl * 25 + (enraged ? 40 : 0);

  // Espiral en curso
  if (s.spiral.t > 0) {
    s.spiral.t -= dt;
    s.spiral.angle += dt * 5;
    if (Math.floor(s.spiral.t * 20) !== Math.floor((s.spiral.t + dt) * 20)) {
      shoot(s, boss, s.spiral.angle, bspd * 0.8, 7, 6);
      shoot(s, boss, s.spiral.angle + Math.PI, bspd * 0.8, 7, 6);
    }
  }

  s.bossAttack -= dt;
  if (s.bossAttack > 0) return;
  const pattern = def.patterns[Math.floor(Math.random() * def.patterns.length)]!;
  const toP = Math.atan2(p.y - boss.y, p.x - boss.x);
  switch (pattern) {
    case "aimed": {
      const k = 3 + Math.min(lvl, 2) * 2;
      for (let i = 0; i < k; i++) shoot(s, boss, toP + (i - (k - 1) / 2) * 0.16, bspd, 8, 6);
      break;
    }
    case "radial": {
      const k = 12 + lvl * 3;
      const off = rand(0, Math.PI);
      for (let i = 0; i < k; i++) shoot(s, boss, off + (i * Math.PI * 2) / k, bspd * 0.75, 7, 6);
      break;
    }
    case "spiral":
      s.spiral = { t: 1.6, angle: toP };
      break;
    case "burst":
      for (let i = 0; i < 5; i++)
        shoot(s, boss, toP + rand(-0.05, 0.05), bspd * (1.1 + i * 0.12), 6, 5);
      break;
    case "rain":
      for (let i = 0; i < 9; i++) {
        const x = rand(40, W * 0.7);
        s.bullets.push({
          x,
          y: 30,
          vx: rand(-20, 20),
          vy: bspd * 0.7,
          r: 6,
          dmg: 7,
          owner: "boss",
          color: boss.color,
        });
      }
      break;
  }
  s.bossAttack = Math.max(0.55, 1.7 - lvl * 0.2 - (enraged ? 0.3 : 0)) + rand(0, 0.4);
}

/** Avanza la simulación. Devuelve un OrbEvent si un jugador toca un orbe. */
export function update(
  s: GameState,
  dt: number,
  inputs: { p1: Input; p2: Input },
): OrbEvent | null {
  if (s.over) return null;
  s.time += dt;
  s.shake = Math.max(0, s.shake - dt);

  for (const f of s.fighters) {
    f.cooldown = Math.max(0, f.cooldown - dt);
    f.triple = Math.max(0, f.triple - dt);
    f.shield = Math.max(0, f.shield - dt);
    f.fast = Math.max(0, f.fast - dt);
    f.slow = Math.max(0, f.slow - dt);
    f.hitFlash = Math.max(0, f.hitFlash - dt);
  }

  const p1 = get(s, "p1");
  playerMove(p1, inputs.p1, dt);
  playerFire(s, p1, inputs.p1);
  if (s.mode === "duel") {
    const p2 = get(s, "p2");
    playerMove(p2, inputs.p2, dt);
    playerFire(s, p2, inputs.p2);
  } else {
    bossThink(s, dt);
  }

  // Proyectiles
  for (const b of s.bullets) {
    b.x += b.vx * dt;
    b.y += b.vy * dt;
  }
  s.bullets = s.bullets.filter((b) => {
    if (b.x < -20 || b.x > W + 20 || b.y < -20 || b.y > H + 20) return false;
    for (const f of s.fighters) {
      if (f.id === b.owner) continue;
      if (dist(b.x, b.y, f.x, f.y) < b.r + f.r) {
        damage(s, f, b.dmg, b.color);
        return false;
      }
    }
    return true;
  });

  // Orbes
  s.orbTimer -= dt;
  if (s.orbTimer <= 0) {
    if (s.orbs.length < 2) {
      const kinds = Object.keys(POWERS) as PowerKind[];
      const kind = kinds[Math.floor(Math.random() * kinds.length)]!;
      const x = s.mode === "campaign" ? rand(60, W * 0.55) : rand(W * 0.3, W * 0.7);
      s.orbs.push({ x, y: rand(90, H - 50), r: 16, kind, ttl: 11, phase: rand(0, 6) });
    }
    s.orbTimer = s.mode === "campaign" ? rand(4, 6.5) : rand(3.5, 5.5);
  }
  let event: OrbEvent | null = null;
  s.orbs = s.orbs.filter((o) => {
    o.ttl -= dt;
    o.phase += dt * 3;
    if (o.ttl <= 0) return false;
    if (event) return true;
    for (const f of s.fighters) {
      if (f.id === "boss") continue;
      if (dist(o.x, o.y, f.x, f.y) < o.r + f.r) {
        event = { who: f.id as "p1" | "p2", kind: o.kind };
        burst(s, o.x, o.y, POWERS[o.kind].color, 14, 120);
        return false;
      }
    }
    return true;
  });

  // Efectos
  for (const p of s.particles) {
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.ttl -= dt;
  }
  s.particles = s.particles.filter((p) => p.ttl > 0);
  for (const b of s.beams) b.ttl -= dt;
  s.beams = s.beams.filter((b) => b.ttl > 0);
  for (const t of s.texts) {
    t.ttl -= dt;
    t.y -= 30 * dt;
  }
  s.texts = s.texts.filter((t) => t.ttl > 0);

  // Fin
  for (const f of s.fighters) {
    if (f.hp <= 0) {
      s.over = { winner: opponentOf(s, f).id };
      burst(s, f.x, f.y, f.color, 40, 260);
      s.shake = 0.4;
    }
  }
  return event;
}

/** Aplica el resultado de una pregunta */
export function resolveOrb(s: GameState, ev: OrbEvent, correct: boolean) {
  const f = get(s, ev.who);
  if (!correct) {
    f.slow = 3;
    float(s, f.x, f.y - 30, "¡Lento!", "#94a3b8");
    return;
  }
  const P = POWERS[ev.kind];
  float(s, f.x, f.y - 30, P.label, P.color);
  switch (ev.kind) {
    case "triple":
      f.triple = 8;
      break;
    case "shield":
      f.shield = 6;
      break;
    case "heal":
      f.hp = Math.min(f.maxHp, f.hp + 30);
      break;
    case "speed":
      f.fast = 8;
      break;
    case "beam": {
      const t = opponentOf(s, f);
      s.beams.push({ x1: f.x, y1: f.y, x2: t.x, y2: t.y, ttl: 0.45, color: P.color });
      damage(s, t, s.mode === "duel" ? 25 : 60, P.color);
      s.shake = 0.3;
      break;
    }
  }
}

/** Dibuja el estado en un contexto 2D (coordenadas lógicas W×H) */
export function draw(ctx: CanvasRenderingContext2D, s: GameState) {
  ctx.save();
  if (s.shake > 0) ctx.translate(rand(-5, 5) * s.shake * 6, rand(-5, 5) * s.shake * 6);

  // Fondo
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, "#0b1430");
  g.addColorStop(1, "#111c3d");
  ctx.fillStyle = g;
  ctx.fillRect(-10, -10, W + 20, H + 20);
  ctx.strokeStyle = "rgba(148,163,184,0.08)";
  ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  for (let y = 0; y <= H; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }
  ctx.fillStyle = "rgba(148,163,184,0.07)";
  ctx.font = "bold 90px serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("∫ f(x) dx", W / 2, H / 2 + 20);

  // Orbes
  for (const o of s.orbs) {
    const P = POWERS[o.kind];
    const pulse = 1 + Math.sin(o.phase) * 0.12;
    const blink = o.ttl < 3 && Math.floor(o.ttl * 6) % 2 === 0;
    if (blink) continue;
    ctx.beginPath();
    ctx.arc(o.x, o.y, o.r * 1.9 * pulse, 0, Math.PI * 2);
    ctx.fillStyle = P.color + "22";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(o.x, o.y, o.r * pulse, 0, Math.PI * 2);
    ctx.fillStyle = P.color;
    ctx.fill();
    ctx.fillStyle = "#0b1430";
    ctx.font = "bold 16px system-ui, sans-serif";
    ctx.fillText(P.glyph, o.x, o.y + 1);
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "bold 11px system-ui, sans-serif";
    ctx.fillText("?", o.x + o.r, o.y - o.r);
  }

  // Rayos
  for (const b of s.beams) {
    ctx.strokeStyle = b.color;
    ctx.globalAlpha = Math.min(1, b.ttl * 3);
    ctx.lineWidth = 14 * b.ttl * 2;
    ctx.beginPath();
    ctx.moveTo(b.x1, b.y1);
    ctx.lineTo(b.x2, b.y2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // Proyectiles
  for (const b of s.bullets) {
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.fillStyle = b.color;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r * 0.45, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
  }

  // Luchadores
  for (const f of s.fighters) {
    if (f.hp <= 0) continue;
    if (f.shield > 0) {
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r + 10, 0, Math.PI * 2);
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 3;
      ctx.globalAlpha = 0.5 + Math.sin(s.time * 10) * 0.3;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    ctx.beginPath();
    ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
    ctx.fillStyle = f.hitFlash > 0 ? "#ffffff" : f.color;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.stroke();
    ctx.fillStyle = "#0b1430";
    ctx.font = f.id === "boss" ? "bold 30px serif" : "bold 18px serif";
    ctx.fillText(f.id === "boss" ? "Σ" : f.id === "p1" ? "∫" : "∂", f.x, f.y + 1);
    if (f.slow > 0) {
      ctx.fillStyle = "#94a3b8";
      ctx.font = "bold 11px system-ui";
      ctx.fillText("lento", f.x, f.y + f.r + 12);
    }
    // Mini barra de vida
    const bw = f.r * 2.2;
    ctx.fillStyle = "rgba(15,23,42,0.8)";
    ctx.fillRect(f.x - bw / 2, f.y - f.r - 12, bw, 5);
    ctx.fillStyle = f.color;
    ctx.fillRect(f.x - bw / 2, f.y - f.r - 12, (bw * f.hp) / f.maxHp, 5);
  }

  // Partículas y textos
  for (const p of s.particles) {
    ctx.globalAlpha = p.ttl / p.max;
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
  }
  ctx.globalAlpha = 1;
  for (const t of s.texts) {
    ctx.globalAlpha = Math.min(1, t.ttl * 2);
    ctx.fillStyle = t.color;
    ctx.font = "bold 16px system-ui, sans-serif";
    ctx.fillText(t.text, t.x, t.y);
  }
  ctx.globalAlpha = 1;
  ctx.restore();

  // HUD superior
  const [a, b] = s.fighters as [Fighter, Fighter];
  hpBar(ctx, a, 16, 10, "left");
  hpBar(ctx, b, W - 16, 10, "right");
}

function hpBar(
  ctx: CanvasRenderingContext2D,
  f: Fighter,
  x: number,
  y: number,
  align: "left" | "right",
) {
  const w = 300;
  const x0 = align === "left" ? x : x - w;
  ctx.fillStyle = "rgba(15,23,42,0.85)";
  ctx.fillRect(x0, y, w, 14);
  ctx.fillStyle = f.color;
  const fw = (w * f.hp) / f.maxHp;
  ctx.fillRect(align === "left" ? x0 : x0 + w - fw, y, fw, 14);
  ctx.strokeStyle = "rgba(255,255,255,0.3)";
  ctx.strokeRect(x0, y, w, 14);
  ctx.fillStyle = "#e2e8f0";
  ctx.font = "bold 12px system-ui, sans-serif";
  ctx.textAlign = align;
  ctx.textBaseline = "top";
  const tags = [f.triple > 0 ? "3×" : "", f.shield > 0 ? "◈" : "", f.fast > 0 ? "»" : ""]
    .filter(Boolean)
    .join(" ");
  ctx.fillText(`${f.name} · ${Math.ceil(f.hp)}/${f.maxHp} ${tags}`, x, y + 18);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
}
