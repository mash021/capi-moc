<template>
  <svg
    ref="svgEl"
    class="capi-logo"
    :class="{ 'is-interactive': interactive }"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 320 130"
    role="img"
    aria-label="CAPI - capi-gear.com"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
    @wheel.prevent="onWheel"
  >
    <!--
      Transparent background by default — the host element provides the
      surface color. Pass a `bg` prop if you need an opaque background
      (e.g. when used standalone as a favicon).
    -->
    <rect v-if="bg" x="0" y="0" width="320" height="130" rx="2" :fill="bg" />

    <!-- CAPI wordmark -->
    <text
      x="18" y="78"
      font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif"
      font-weight="900" font-size="64" letter-spacing="-1"
      fill="#FFFFFF"
    >CAPI</text>

    <!-- Bottom URL -->
    <text
      x="14" y="118"
      font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif"
      font-weight="700" font-size="18"
      fill="#007DC5"
    >capi-gear.com</text>

    <!-- Registered mark -->
    <text
      x="306" y="122" text-anchor="middle"
      font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif"
      font-weight="600" font-size="14"
      fill="#FFFFFF"
    >®</text>

    <!-- Gradients & filters -->
    <defs>
      <linearGradient :id="ids.plate" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stop-color="#E6E6E6" />
        <stop offset="50%"  stop-color="#B8B8B8" />
        <stop offset="100%" stop-color="#5E5E5E" />
      </linearGradient>

      <radialGradient :id="ids.knob" cx="40%" cy="35%" r="75%">
        <!-- Brand cyan #007DC5; highlight & shadow derived from same hue -->
        <stop offset="0%"   stop-color="#3FB5F0" />
        <stop offset="55%"  stop-color="#007DC5" />
        <stop offset="100%" stop-color="#004A7A" />
      </radialGradient>

      <radialGradient :id="ids.screw" cx="35%" cy="30%" r="80%">
        <stop offset="0%"   stop-color="#8a8a8a" />
        <stop offset="60%"  stop-color="#4a4a4a" />
        <stop offset="100%" stop-color="#1a1a1a" />
      </radialGradient>

      <filter :id="ids.bevel" x="-10%" y="-10%" width="120%" height="120%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="0.6" />
        <feOffset dx="0" dy="0.6" result="offsetblur" />
        <feFlood flood-color="#000" flood-opacity="0.55" />
        <feComposite in2="offsetblur" operator="in" />
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    <!--
      Mounting plate that rotates like a real volume knob.
      Geometry:
        knob center  (230, 55)
        body         ~100 x 100
        TOP-RIGHT    sharp tip (signature of the brand)
        knob radius  38 (cyan #007DC5)
      Rotation is controlled by the parent via the `rotation` prop or by user
      interaction (drag / scroll wheel) when `interactive` is true.
    -->
    <g
      class="capi-spinner"
      :class="{ dragging: isDragging }"
      :transform="`rotate(${currentRotation.toFixed(2)} 230 55)`"
    >
      <!-- Plate body: top-right tip is CUT (small chamfer ~1.4 units wide).
           Other 3 corners stay gently concave. -->
      <path
        d="M 208,5
           L 282,3   L 283,4
           L 280,77   Q 259,84 252,105
           L 208,105  Q 201,84 180,77
           L 180,33   Q 201,26 208,5
           Z"
        :fill="`url(#${ids.plate})`"
        stroke="#1a1a1a"
        stroke-width="1.4"
        :filter="`url(#${ids.bevel})`"
      />

      <!-- Inner darker bevel ring (machined-plate depth) -->
      <path
        d="M 211,8
           L 278,6    L 279,7
           L 277,75   Q 257,82 250,102
           L 210,102  Q 203,82 183,75
           L 183,35   Q 204,28 211,8
           Z"
        fill="none"
        stroke="#7a7a7a"
        stroke-width="0.6"
        opacity="0.7"
      />

      <!-- Single screw inside the sharp tip -->
      <g class="capi-screws">
        <circle cx="275" cy="13" r="3.4" fill="#2a2a2a" stroke="#0a0a0a" stroke-width="0.8" />
        <circle cx="275" cy="13" r="2.1" :fill="`url(#${ids.screw})`" />
        <line x1="272.5" y1="13" x2="277.5" y2="13" stroke="#000" stroke-width="0.9" stroke-linecap="round" />
      </g>

      <!-- Cyan knob -->
      <circle cx="230" cy="55" r="40" fill="#0a3640" />
      <circle cx="230" cy="55" r="38" :fill="`url(#${ids.knob})`" />
      <ellipse cx="218" cy="42" rx="14" ry="9" fill="#ffffff" fill-opacity="0.22" />
      <circle cx="230" cy="24" r="2.4" fill="#ffffff" fill-opacity="0.95" />
    </g>
  </svg>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = withDefaults(defineProps<{
  /** Enables drag-to-rotate + wheel-to-rotate, like a real volume knob. */
  interactive?: boolean
  /** Controlled rotation, in degrees. When provided, overrides internal state. */
  rotation?: number | null
  /** Degrees per wheel tick. */
  wheelStep?: number
  /** Mechanical stops, mimicking a real knob. Defaults match a 267° sweep
   *  (similar to a typical studio volume knob: -179° CCW to +88° CW). */
  minRotation?: number
  maxRotation?: number
  /** Optional opaque background colour (e.g. "#000"). Default is transparent,
   *  which lets the host element's background show through. */
  bg?: string | null
}>(), {
  interactive: false,
  rotation: null,
  wheelStep: 8,
  minRotation: -179,
  maxRotation: 88,
  bg: null,
})

const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v))

const emit = defineEmits<{
  (e: 'update:rotation', deg: number): void
  (e: 'change', deg: number): void
}>()

// Unique gradient/filter ids so multiple <CapiLogo> instances don't collide.
// crypto.randomUUID is supported in all modern browsers we care about.
const uid = Math.random().toString(36).slice(2, 9)
const ids = {
  plate: `capi-plate-${uid}`,
  knob:  `capi-knob-${uid}`,
  screw: `capi-screw-${uid}`,
  bevel: `capi-bevel-${uid}`,
}

// --- Rotation state -------------------------------------------------------
const internalRotation = ref(0)
const currentRotation = computed(() =>
  props.rotation != null ? props.rotation : internalRotation.value
)

watch(currentRotation, (v) => emit('change', v))

function setRotation(deg: number) {
  const clamped = clamp(deg, props.minRotation, props.maxRotation)
  if (props.rotation != null) {
    emit('update:rotation', clamped)
  } else {
    internalRotation.value = clamped
  }
}

// --- Drag / wheel handlers (only fire when interactive) -------------------
const svgEl = ref<SVGSVGElement | null>(null)
const isDragging = ref(false)
let pointerStartAngle = 0
let rotationAtStart = 0

const KNOB_CX = 230
const KNOB_CY = 55
const VIEWBOX_W = 320
const VIEWBOX_H = 130

/** Angle (deg) from knob center to a pointer event, in *screen* space. */
function pointerAngle(e: PointerEvent): number {
  const svg = svgEl.value
  if (!svg) return 0
  const rect = svg.getBoundingClientRect()
  const cx = rect.left + (KNOB_CX / VIEWBOX_W) * rect.width
  const cy = rect.top  + (KNOB_CY / VIEWBOX_H) * rect.height
  return Math.atan2(e.clientY - cy, e.clientX - cx) * 180 / Math.PI
}

function onPointerDown(e: PointerEvent) {
  if (!props.interactive) return
  isDragging.value = true
  pointerStartAngle = pointerAngle(e)
  rotationAtStart = currentRotation.value
  svgEl.value?.setPointerCapture(e.pointerId)
  e.preventDefault()
}

function onPointerMove(e: PointerEvent) {
  if (!props.interactive || !isDragging.value) return
  const delta = pointerAngle(e) - pointerStartAngle
  setRotation(rotationAtStart + delta)
}

function onPointerUp(e: PointerEvent) {
  if (!isDragging.value) return
  isDragging.value = false
  try { svgEl.value?.releasePointerCapture(e.pointerId) } catch { /* noop */ }
}

function onWheel(e: WheelEvent) {
  if (!props.interactive) return
  const step = (e.deltaY > 0 ? 1 : -1) * props.wheelStep
  setRotation(currentRotation.value + step)
}
</script>

<style scoped>
.capi-logo {
  display: block;
  width: 100%;
  height: auto;
  user-select: none;
  touch-action: none; /* prevents page-scroll while dragging on touch */
  /* Let the rotating tip extend visually outside the SVG's box without
     being clipped. The tip's rotation circle reaches y = -19 at certain
     angles, which is above the viewBox top edge (y = 0). */
  overflow: visible;
}

/* Smooth interpolation between rotation values; disabled while actively
   dragging so the knob tracks the cursor 1:1. */
.capi-spinner {
  transition: transform 60ms linear;
}
.capi-spinner.dragging {
  transition: none;
}

.is-interactive .capi-spinner { cursor: grab; }
.is-interactive .capi-spinner.dragging { cursor: grabbing; }
</style>
