<template>
  <span class="capi-mark-lockup" :style="{ gap: `${gap}px` }">
    <svg
      class="capi-mark"
      :style="{ width: `${size}px`, height: `${size}px` }"
      viewBox="0 0 64 64"
      role="img"
      :aria-label="label"
    >
      <g transform="translate(32 33) scale(0.44) translate(-231 -55)">
        <!-- Octagon plate as an outline in the chosen colour -->
        <path
          d="M 208,5 L 282,3 L 283,4
             L 280,77 Q 259,84 252,105
             L 208,105 Q 201,84 180,77
             L 180,33 Q 201,26 208,5 Z"
          fill="none" :stroke="color" stroke-width="3.4" stroke-linejoin="round"
        />
        <!-- Knob cap -->
        <circle cx="230" cy="55" r="30" :fill="color" />
        <!-- Indicator notch (contrasts against the cap) -->
        <circle cx="230" cy="24" r="4" :fill="notch" />
      </g>
    </svg>
    <span v-if="wordmark" class="capi-mark-word" :style="{ color, fontSize: `${size * 0.37}px` }">
      {{ wordmark }}
    </span>
  </span>
</template>

<script setup lang="ts">
/**
 * CapiMark — the compact CAPI octagon knob "mark" (monochrome), with an
 * optional wordmark beneath it. Defaults to a clean white lockup for use
 * on dark surfaces (e.g. above the login card), but the colour is fully
 * controllable so it can sit on light backgrounds too.
 */
withDefaults(defineProps<{
  /** Pixel size of the square mark. */
  size?: number
  /** Mark colour (octagon outline + knob cap). */
  color?: string
  /** Colour of the small indicator notch on the knob. */
  notch?: string
  /** Optional wordmark text shown beneath the mark (empty = hidden). */
  wordmark?: string
  /** Gap between the mark and the wordmark, in px. */
  gap?: number
  /** Accessible label for the SVG. */
  label?: string
}>(), {
  size: 60,
  color: '#ffffff',
  notch: '#0a0a0a',
  wordmark: '',
  gap: 10,
  label: 'CAPI',
})
</script>

<style scoped>
.capi-mark-lockup {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
}
.capi-mark { display: block; }
.capi-mark-word {
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif;
  font-weight: 900;
  letter-spacing: 0.06em;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
}
</style>
