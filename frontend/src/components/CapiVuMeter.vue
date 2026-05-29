<template>
  <svg
    ref="svgEl"
    class="capi-vu"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 400 280"
    role="img"
    aria-label="VU meter"
  >
    <!--
      ============================================================
      Defs: gradients, vignette, and the SVG fractal-noise filter
      that produces the kale-konjishki red-mahogany wood grain.
      ============================================================
    -->
    <defs>
      <!-- Wood base: kale-konjishki red mahogany, diagonal flow -->
      <linearGradient :id="ids.bezelGrad" x1="0%" y1="0%" x2="80%" y2="100%">
        <stop offset="0%"   stop-color="#1a0504" />
        <stop offset="22%"  stop-color="#3a0d08" />
        <stop offset="48%"  stop-color="#5d1810" />
        <stop offset="68%"  stop-color="#421008" />
        <stop offset="100%" stop-color="#1d0604" />
      </linearGradient>

      <!-- Thin chrome inner rim — metal trim that pins the wood to the chassis -->
      <linearGradient :id="ids.bezelRim" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%"   stop-color="#5a5a5a" />
        <stop offset="40%"  stop-color="#1a1a1a" />
        <stop offset="100%" stop-color="#3a3a3a" />
      </linearGradient>

      <!--
        Wood-grain noise. baseFrequency='0.014 0.42' is the calibration
        that gives the long horizontal strands and dense vertical bands
        of cut rosewood. feColorMatrix turns the noise into a dark layer
        with alpha tied to the noise's own brightness — so painting an
        empty rect with this filter on top of the wood base stamps grain
        without obliterating the colour underneath.
      -->
      <filter :id="ids.woodGrain" x="0%" y="0%" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.014 0.42"
                      numOctaves="3" seed="11" result="noise" />
        <feColorMatrix in="noise" type="matrix" values="
          0 0 0 0 0.05
          0 0 0 0 0.008
          0 0 0 0 0
          0.5 0 0 0 -0.05" />
      </filter>

      <!-- Aged-paper meter face: warm cream that's seen 30 years of tungsten light -->
      <linearGradient :id="ids.faceGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%"   stop-color="#f5e6b0" />
        <stop offset="55%"  stop-color="#e8cf83" />
        <stop offset="100%" stop-color="#c9a55a" />
      </linearGradient>

      <!-- Warm amber backlight (incandescent bulb behind the face) -->
      <radialGradient :id="ids.glowGrad" cx="50%" cy="100%" r="80%">
        <stop offset="0%"   stop-color="#ffc26a" stop-opacity="0.95" />
        <stop offset="55%"  stop-color="#ff9520" stop-opacity="0.35" />
        <stop offset="100%" stop-color="#ff8000" stop-opacity="0" />
      </radialGradient>

      <!-- Sun-bleached centre, smoke-stained edges -->
      <radialGradient :id="ids.faceVignette" cx="50%" cy="55%" r="65%">
        <stop offset="55%"  stop-color="#3a2810" stop-opacity="0" />
        <stop offset="100%" stop-color="#3a2810" stop-opacity="0.55" />
      </radialGradient>

      <!-- Center pivot screw -->
      <radialGradient :id="ids.pivotGrad" cx="35%" cy="30%" r="80%">
        <stop offset="0%"   stop-color="#a0a0a0" />
        <stop offset="55%"  stop-color="#3a3a3a" />
        <stop offset="100%" stop-color="#0a0a0a" />
      </radialGradient>

      <!-- Corner panel screws -->
      <radialGradient :id="ids.screwGrad" cx="35%" cy="30%" r="80%">
        <stop offset="0%"   stop-color="#9a9a9a" />
        <stop offset="55%"  stop-color="#4a4a4a" />
        <stop offset="100%" stop-color="#1a1a1a" />
      </radialGradient>
    </defs>

    <!-- ===== Outer housing: black backer + chrome rim + wood frame + dark well ===== -->
    <rect x="0"  y="0"  width="400" height="280" rx="10" fill="#000" />
    <rect x="3"  y="3"  width="394" height="274" rx="9"  :fill="`url(#${ids.bezelRim})`" />
    <!-- Wood base colour -->
    <rect x="10" y="10" width="380" height="260" rx="6"  :fill="`url(#${ids.bezelGrad})`" />
    <!-- Wood grain stamp: empty rect carrying only the noise filter. -->
    <rect x="10" y="10" width="380" height="260" rx="6"
          fill="none" :filter="`url(#${ids.woodGrain})`" />
    <!-- 3D bevel: top-edge highlight + bottom-edge thickness shadow -->
    <rect x="10" y="10"  width="380" height="6" rx="6" fill="#ffffff" opacity="0.06" />
    <rect x="10" y="262" width="380" height="8" rx="2" fill="#000"    opacity="0.45" />
    <!-- Inner dark well where the meter face sits -->
    <rect x="16" y="16" width="368" height="248" rx="3" fill="#0a0a0a" />

    <!-- ===== Cream-coloured aged-paper face ===== -->
    <rect x="22" y="22" width="356" height="236" rx="2" :fill="`url(#${ids.faceGrad})`" />
    <!-- Warm amber backlight glow (behind needle) -->
    <ellipse class="face-glow" cx="200" cy="230" rx="170" ry="85"
             :fill="`url(#${ids.glowGrad})`" />
    <!-- Sun-bleached vignette (after glow so corners darken without dimming centre) -->
    <rect x="22" y="22" width="356" height="236" rx="2" :fill="`url(#${ids.faceVignette})`" />

    <!-- Brand label — slightly faded ink -->
    <text x="200" y="55" text-anchor="middle"
          font-family="Georgia, 'Times New Roman', serif"
          font-size="9" font-weight="700" letter-spacing="0.45em"
          fill="#3a2a08" opacity="0.82">CAPI · STUDIO</text>
    <!-- Vintage type-approval microcopy on the lower corners -->
    <text x="36" y="252"
          font-family="Georgia, 'Times New Roman', serif"
          font-size="6.5" font-weight="600" letter-spacing="0.2em"
          fill="#3a2a08" opacity="0.55">TYPE A · VU 7B</text>
    <text x="364" y="252" text-anchor="end"
          font-family="Georgia, 'Times New Roman', serif"
          font-size="6.5" font-weight="600" letter-spacing="0.2em"
          fill="#3a2a08" opacity="0.55">MADE IN U.S.A.</text>

    <!-- Black scale arc -->
    <path d="M 94,114 A 150,150 0 0 1 306,114"
          fill="none" stroke="#0a0a0a" stroke-width="1.4" />
    <!-- Red overshoot zone (0 dB → +3 dB) -->
    <path d="M 256,81 A 150,150 0 0 1 306,114"
          fill="none" stroke="#c01020" stroke-width="3.2" stroke-linecap="butt" />

    <!-- Major ticks -->
    <line v-for="t in majorTicks" :key="`maj-${t.ang}`"
          :x1="t.x1" :y1="t.y1" :x2="t.x2" :y2="t.y2"
          :stroke="t.red ? '#c01020' : '#0a0a0a'"
          stroke-width="1.8" stroke-linecap="round" />

    <!-- Minor ticks -->
    <line v-for="m in minorTicks" :key="`min-${m.ang}`"
          :x1="m.x1" :y1="m.y1" :x2="m.x2" :y2="m.y2"
          :stroke="m.red ? '#c01020' : '#0a0a0a'" stroke-width="1.0" />

    <!-- Tick number labels -->
    <text v-for="t in majorTicks" :key="`num-${t.ang}`"
          :x="t.lx" :y="t.ly" text-anchor="middle"
          font-family="Georgia, 'Times New Roman', serif"
          font-size="13" font-weight="600"
          :fill="t.red ? '#c01020' : '#0a0a0a'">{{ t.label }}</text>

    <!-- Tiny "dB" hint under the scale -->
    <text x="200" y="155" text-anchor="middle"
          font-family="Georgia, 'Times New Roman', serif"
          font-size="10" font-weight="600" letter-spacing=".2em"
          fill="#3a2a08">dB</text>

    <!-- Big "VU" mark, dead-centre on the face -->
    <text x="200" y="200" text-anchor="middle"
          font-family="Georgia, 'Times New Roman', serif"
          font-size="36" font-weight="700" letter-spacing="2"
          fill="#0a0a0a">VU</text>

    <!-- Needle — angle is reactive on `needleAngle` -->
    <g class="needle" :transform="`rotate(${needleAngle.toFixed(2)} 200 220)`">
      <line x1="200" y1="220" x2="200" y2="60"
            stroke="#0a0a0a" stroke-width="2" stroke-linecap="round" />
      <rect x="196" y="222" width="8" height="13" fill="#0a0a0a" />
    </g>

    <!-- Center pivot screw -->
    <circle cx="200" cy="220" r="13" :fill="`url(#${ids.pivotGrad})`"
            stroke="#0a0a0a" stroke-width="1" />
    <circle cx="200" cy="220" r="4" fill="#0a0a0a" />
    <circle cx="199" cy="219" r="1" fill="#5a5a5a" />

    <!-- Four corner housing screws (slot drives, slight diagonal) -->
    <g v-for="s in cornerScrews" :key="`scr-${s.cx}-${s.cy}`">
      <circle :cx="s.cx" :cy="s.cy" r="6.5" fill="#1a1a1a" stroke="#000" stroke-width="0.6" />
      <circle :cx="s.cx" :cy="s.cy" r="4.5" :fill="`url(#${ids.screwGrad})`" />
      <line :x1="s.cx - 4" :y1="s.cy - 2.5" :x2="s.cx + 4" :y2="s.cy + 2.5"
            stroke="#000" stroke-width="0.9" stroke-linecap="round" />
    </g>
  </svg>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

/* =============================================================
 *  Props
 * ============================================================= */
const props = withDefaults(defineProps<{
  /** When true (default) the needle bobs on a spring sim, simulating audio.
   *  When false the meter sits at rest (or wherever `db` says). */
  animated?: boolean
  /** Externally driven dB value (-22 .. +5). When provided, the spring sim
   *  is bypassed and the needle reads this value directly. */
  db?: number | null
}>(), {
  animated: true,
  db: null,
})

const emit = defineEmits<{
  /** Fires every frame while animating, with the current needle dB value. */
  (e: 'level', db: number): void
}>()

/* =============================================================
 *  Unique IDs (avoid collisions when multiple meters render)
 * ============================================================= */
const uid = Math.random().toString(36).slice(2, 9)
const ids = {
  bezelGrad:    `vu-bezel-${uid}`,
  bezelRim:     `vu-rim-${uid}`,
  woodGrain:    `vu-wood-${uid}`,
  faceGrad:     `vu-face-${uid}`,
  glowGrad:     `vu-glow-${uid}`,
  faceVignette: `vu-vignette-${uid}`,
  pivotGrad:    `vu-pivot-${uid}`,
  screwGrad:    `vu-screw-${uid}`,
}

/* =============================================================
 *  Tick geometry: hand-calibrated so 0 VU sits at ~70 % of the
 *  scale, matching ANSI / IEC type-A movements.
 * ============================================================= */
const PIVOT_X = 200
const PIVOT_Y = 220
const R_OUTER = 150
const R_MAJOR = 138
const R_MINOR = 144
const R_LABEL = 170

const VU_TICKS = [
  { ang: -45, label: '20', red: false },
  { ang: -22, label: '10', red: false },
  { ang: -10, label:  '7', red: false },
  { ang:  -2, label:  '5', red: false },
  { ang:   7, label:  '3', red: false },
  { ang:  11, label:  '2', red: false },
  { ang:  17, label:  '1', red: false },
  { ang:  22, label:  '0', red: true  },
  { ang:  30, label: '+1', red: true  },
  { ang:  37, label: '+2', red: true  },
  { ang:  45, label: '+3', red: true  },
] as const

const VU_MINOR_TICK_ANGLES = [-35, -30, -16, -6, 3, 9, 14, 19, 26, 33, 41]

function polar(ang: number, r: number) {
  const rad = (ang * Math.PI) / 180
  return {
    x: PIVOT_X + r * Math.sin(rad),
    y: PIVOT_Y - r * Math.cos(rad),
  }
}

const majorTicks = computed(() => VU_TICKS.map((t) => {
  const outer = polar(t.ang, R_OUTER)
  const inner = polar(t.ang, R_MAJOR)
  const label = polar(t.ang, R_LABEL)
  return {
    ang:  t.ang,
    label: t.label,
    red:   t.red,
    x1: +outer.x.toFixed(2), y1: +outer.y.toFixed(2),
    x2: +inner.x.toFixed(2), y2: +inner.y.toFixed(2),
    lx: +label.x.toFixed(2), ly: +(label.y + 4).toFixed(2),
  }
}))

const minorTicks = computed(() => VU_MINOR_TICK_ANGLES.map((ang) => {
  const outer = polar(ang, R_OUTER)
  const inner = polar(ang, R_MINOR)
  return {
    ang,
    red: ang > 22,
    x1: +outer.x.toFixed(2), y1: +outer.y.toFixed(2),
    x2: +inner.x.toFixed(2), y2: +inner.y.toFixed(2),
  }
}))

const cornerScrews = [
  { cx: 32,  cy: 32  },
  { cx: 368, cy: 32  },
  { cx: 32,  cy: 248 },
  { cx: 368, cy: 248 },
]

/* =============================================================
 *  dB → angle interpolation (linear between calibration points)
 * ============================================================= */
const VU_DB_TABLE = [
  { db: -22, ang: -50 }, { db: -20, ang: -45 }, { db: -10, ang: -22 },
  { db:  -7, ang: -10 }, { db:  -5, ang:  -2 }, { db:  -3, ang:   7 },
  { db:  -2, ang:  11 }, { db:  -1, ang:  17 }, { db:   0, ang:  22 },
  { db:   1, ang:  30 }, { db:   2, ang:  37 }, { db:   3, ang:  45 },
  { db:   5, ang:  50 },
]
function dbToAngle(db: number): number {
  if (db <= VU_DB_TABLE[0].db) return VU_DB_TABLE[0].ang
  const last = VU_DB_TABLE[VU_DB_TABLE.length - 1]
  if (db >= last.db) return last.ang
  for (let i = 0; i < VU_DB_TABLE.length - 1; i++) {
    const a = VU_DB_TABLE[i], b = VU_DB_TABLE[i + 1]
    if (db >= a.db && db <= b.db) {
      const t = (db - a.db) / (b.db - a.db)
      return a.ang + t * (b.ang - a.ang)
    }
  }
  return 0
}

/* =============================================================
 *  Needle physics: 2nd-order spring + damping. Real moving-coil
 *  VU meters have a ~300 ms rise time and a small overshoot —
 *  exactly what STIFFNESS / DAMPING here reproduce.
 * ============================================================= */
const internalDb = ref(-22)
const needleAngle = computed(() =>
  dbToAngle(props.db != null ? props.db : internalDb.value)
)

watch(() => internalDb.value, (v) => emit('level', v))

let rafId = 0
let target = -16
let velocity = 0
let nextTargetAt = 0
const STIFFNESS = 0.06
const DAMPING   = 0.78

function pickNewTarget(now: number) {
  // Distribution roughly mimics broadcast-style program material:
  //   6% peak into +red zone, 4% near 0 VU, 45% typical level,
  //   45% quieter passages.
  const r = Math.random()
  if      (r < 0.06) target =  0.5 + Math.random() * 2.5
  else if (r < 0.10) target = -2   + Math.random() * 2
  else if (r < 0.55) target = -10  + Math.random() * 7
  else               target = -17  + Math.random() * 5
  nextTargetAt = now + 90 + Math.random() * 260
}

function frame(now: number) {
  // Bail out if animation got disabled or external control kicked in.
  if (!props.animated || props.db != null) { rafId = 0; return }

  if (now >= nextTargetAt) pickNewTarget(now)

  const force = (target - internalDb.value) * STIFFNESS
  velocity = (velocity + force) * DAMPING
  let next = internalDb.value + velocity

  // Soft mechanical stops, like a real meter bouncing off the end pegs.
  if (next < -22) { next = -22; velocity *= -0.25 }
  if (next >   5) { next =   5; velocity *= -0.25 }

  internalDb.value = next
  rafId = requestAnimationFrame(frame)
}

function startAnimation() {
  if (rafId) return
  rafId = requestAnimationFrame(frame)
}
function stopAnimation() {
  if (rafId) { cancelAnimationFrame(rafId); rafId = 0 }
}

onMounted(() => {
  if (props.animated && props.db == null) startAnimation()
})
onBeforeUnmount(stopAnimation)

// React to prop changes — e.g. caller flips `animated` off, or starts driving
// the meter externally via `db`.
watch(
  () => [props.animated, props.db] as const,
  ([anim, db]) => {
    if (anim && db == null) startAnimation()
    else stopAnimation()
  }
)

// SVG ref retained in case parents want to inspect it (currently unused).
const svgEl = ref<SVGSVGElement | null>(null)
</script>

<style scoped>
.capi-vu {
  display: block;
  width: 100%;
  height: auto;
  user-select: none;
  filter: drop-shadow(0 14px 30px rgba(0, 0, 0, 0.72))
          drop-shadow(0 2px 0 rgba(255, 255, 255, 0.04));
}
.capi-vu .needle { transition: none; }

/* Slow "breathing" of the amber backlight so the meter feels warm and alive
   even while the needle is barely moving. */
@keyframes vuGlowPulse {
  0%, 100% { opacity: 0.55; }
  50%      { opacity: 0.72; }
}
.capi-vu .face-glow { animation: vuGlowPulse 4.5s ease-in-out infinite; }

/* Respect users who prefer reduced motion. */
@media (prefers-reduced-motion: reduce) {
  .capi-vu .face-glow { animation: none; }
}
</style>
