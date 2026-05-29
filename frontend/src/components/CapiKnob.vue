<template>
  <svg
    class="capi-knob-svg"
    :class="{ 'is-static': !animated, 'is-paused': animated && paused }"
    :style="cssVars"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="145 -45 170 195"
    role="img"
    aria-hidden="true"
  >
    <defs>
      <linearGradient :id="ids.plate" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stop-color="#E6E6E6" />
        <stop offset="50%"  stop-color="#B8B8B8" />
        <stop offset="100%" stop-color="#5E5E5E" />
      </linearGradient>
      <radialGradient :id="ids.knob" cx="40%" cy="35%" r="75%">
        <stop offset="0%"   stop-color="#3FB5F0" />
        <stop offset="55%"  stop-color="#007DC5" />
        <stop offset="100%" stop-color="#004A7A" />
      </radialGradient>
      <radialGradient :id="ids.screw" cx="35%" cy="30%" r="80%">
        <stop offset="0%"   stop-color="#8a8a8a" />
        <stop offset="60%"  stop-color="#4a4a4a" />
        <stop offset="100%" stop-color="#1a1a1a" />
      </radialGradient>
    </defs>

    <!-- STATIC dial: hollow ring + dB tick marks + numbers (never spins).
         Geometry is precomputed once at module scope and shared by every
         instance, so this is just a cheap v-for render. -->
    <g class="kn-scale">
      <circle
        :cx="CX" :cy="CY" :r="R_RING"
        fill="none" stroke="#d8d8d8" stroke-width="1.4" opacity="0.85"
      />
      <line
        v-for="(t, i) in TICKS" :key="'t' + i"
        :x1="t.x1" :y1="t.y1" :x2="t.x2" :y2="t.y2"
        :stroke="t.color" :stroke-width="t.width" stroke-linecap="round"
      />
      <text
        v-for="(t, i) in TICKS" :key="'n' + i"
        :x="t.nx" :y="t.ny" text-anchor="middle"
        font-family="-apple-system, sans-serif"
        :font-size="t.font" font-weight="700" :fill="t.fill"
      >{{ t.val }}</text>
      <text
        v-for="(s, i) in SIGNS" :key="'s' + i"
        :x="s.x" :y="s.y" text-anchor="middle"
        font-family="-apple-system, sans-serif"
        font-size="13" font-weight="800" fill="#3FB5F0"
      >{{ s.sym }}</text>
    </g>

    <!-- The knob is scaled down so the spinning octagon stays inside the
         dial ring. The inner <g> is the only animated element. -->
    <g transform="translate(230 55) scale(0.9) translate(-230 -55)">
      <g class="kn-spinner">
        <path
          d="M 208,5 L 282,3 L 283,4
             L 280,77 Q 259,84 252,105
             L 208,105 Q 201,84 180,77
             L 180,33 Q 201,26 208,5 Z"
          :fill="`url(#${ids.plate})`" stroke="#1a1a1a" stroke-width="1.4"
        />
        <path
          d="M 211,8 L 278,6 L 279,7
             L 277,75 Q 257,82 250,102
             L 210,102 Q 203,82 183,75
             L 183,35 Q 204,28 211,8 Z"
          fill="none" stroke="#7a7a7a" stroke-width="0.6" opacity="0.7"
        />
        <g>
          <circle cx="275" cy="13" r="3.4" fill="#2a2a2a" stroke="#0a0a0a" stroke-width="0.8" />
          <circle cx="275" cy="13" r="2.1" :fill="`url(#${ids.screw})`" />
          <line x1="272.5" y1="13" x2="277.5" y2="13" stroke="#000" stroke-width="0.9" stroke-linecap="round" />
        </g>
        <circle cx="230" cy="55" r="40" fill="#0a3640" />
        <circle cx="230" cy="55" r="38" :fill="`url(#${ids.knob})`" />
        <ellipse cx="218" cy="42" rx="14" ry="9" fill="#ffffff" fill-opacity="0.22" />
        <circle cx="230" cy="24" r="2.4" fill="#ffffff" fill-opacity="0.95" />
      </g>
    </g>
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CX, CY, R_RING, TICKS, SIGNS } from './capiDial'

/**
 * CapiKnob — a single CAPI volume "plate": a static dB dial (hollow ring +
 * tick marks + numbers) with a silver octagonal knob that sweeps back and
 * forth between the dial's end stops.
 *
 * The sweep is a pure-CSS keyframe animation (runs on the compositor — no
 * JS per-frame work), so a whole rack of these is cheap. Geometry for the
 * dial is computed ONCE at module scope and shared by every instance.
 */
const props = withDefaults(defineProps<{
  /** Whether the knob sweeps at all. When false it sits perfectly still. */
  animated?: boolean
  /** Freeze the sweep in place (e.g. when the module is bypassed). */
  paused?: boolean
  /** Max sweep angle to each side, in degrees (dial stops). */
  sweep?: number
  /** One full sweep cycle duration, in seconds. */
  duration?: number
  /** Animation start offset, in seconds (use a negative value to begin
   *  mid-sweep so a rack of knobs isn't in lockstep). */
  delay?: number
  /** Reverse the sweep direction. */
  reverse?: boolean
}>(), {
  animated: true,
  paused: false,
  sweep: 100,
  duration: 9,
  delay: 0,
  reverse: false,
})

// Per-instance unique ids so gradients from multiple knobs never collide.
const uid = Math.random().toString(36).slice(2, 9)
const ids = {
  plate: `kn-plate-${uid}`,
  knob:  `kn-knob-${uid}`,
  screw: `kn-screw-${uid}`,
}

const cssVars = computed(() => ({
  '--kn-sweep': String(props.sweep),
  '--kn-dur': `${props.duration}s`,
  '--kn-delay': `${props.delay}s`,
  '--kn-dir': props.reverse ? 'alternate-reverse' : 'alternate',
}))
</script>

<style scoped>
.capi-knob-svg {
  display: block;
  width: 100%;
  height: 100%;
  overflow: visible;
  filter: drop-shadow(0 4px 5px rgba(0, 0, 0, 0.6));
}

/* The pointer sweeps back-and-forth only within the dial end stops. */
.kn-spinner {
  transform-box: fill-box;
  transform-origin: center;
  animation: knobSweep var(--kn-dur, 9s) ease-in-out infinite alternate;
  animation-delay: var(--kn-delay, 0s);
  animation-direction: var(--kn-dir, alternate);
  will-change: transform;
}
.is-paused .kn-spinner { animation-play-state: paused; }
.is-static .kn-spinner { animation: none; }

@keyframes knobSweep {
  from { transform: rotate(calc(var(--kn-sweep, 100) * -1deg)); }
  to   { transform: rotate(calc(var(--kn-sweep, 100) *  1deg)); }
}

@media (prefers-reduced-motion: reduce) {
  .kn-spinner { animation: none; }
}
</style>
