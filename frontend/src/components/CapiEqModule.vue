<template>
  <div class="capi-module" :data-state="active ? 'act' : 'byp'">
    <span class="module-screw module-screw--t"></span>

    <header class="module-header">
      <span class="module-capi">CAPI</span>
      <span class="module-pk">
        <span class="module-pk-led" aria-hidden="true"></span>PK
      </span>
    </header>

    <div class="module-body">
      <div class="module-row" v-for="row in rowPairs" :key="row[0].i">
        <div class="module-knob" v-for="k in row" :key="k.i">
          <CapiKnob
            :animated="true"
            :paused="!active"
            :sweep="sweep"
            :duration="k.duration"
            :delay="k.delay"
            :reverse="k.reverse"
          />
        </div>
      </div>
    </div>

    <footer class="module-footer">
      <div class="module-toggles">
        <span class="module-mini-led module-mini-led--red" aria-hidden="true"></span>
        BYP
        <button
          type="button"
          class="module-toggle"
          :aria-pressed="active"
          aria-label="Bypass / Active"
          @click="active = !active"
        ></button>
        ACT
        <span class="module-mini-led module-mini-led--green" aria-hidden="true"></span>
      </div>
      <div class="module-nameplate">{{ name }}</div>
    </footer>

    <span class="module-screw module-screw--b"></span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import CapiKnob from './CapiKnob.vue'

/**
 * CapiEqModule — a complete CAPI 500-series EQ module (LC25 / LC40 style):
 * black anodized panel, CAPI corner stamp + PK LED, a grid of CapiKnob
 * volume plates, two rusted square-drive screws, and a BYP/ACT rocker.
 *
 * Clicking the rocker toggles Active ↔ Bypass: the matching LED lights and
 * — because the knobs are paused via a single reactive attribute — the
 * whole rack of knobs freezes/resumes with zero per-knob JS work.
 */
const props = withDefaults(defineProps<{
  /** Nameplate text (e.g. "LC25"). */
  name?: string
  /** Number of knob rows (2 knobs per row). */
  rows?: number
  /** Sweep angle to each dial stop, in degrees. */
  sweep?: number
  /** Initial state. */
  initialActive?: boolean
}>(), {
  name: 'LC25',
  rows: 5,
  sweep: 100,
  initialActive: true,
})

const active = ref(props.initialActive)

// Per-knob sweep params, computed ONCE so re-renders never reshuffle them.
// Varied duration + direction + a negative start delay keep the rack from
// sweeping in lockstep, mimicking a hand-tuned EQ.
const knobs = computed(() => {
  const count = props.rows * 2
  const durations = [8, 9.5, 11, 12]
  return Array.from({ length: count }, (_, i) => ({
    i,
    duration: durations[i % durations.length],
    delay: -((i * 1.7) % props.sweep / 10) - (i % 3) * 0.6,
    reverse: i % 2 === 1,
  }))
})

const rowPairs = computed(() => {
  const out: (typeof knobs.value)[] = []
  for (let i = 0; i < knobs.value.length; i += 2) {
    out.push(knobs.value.slice(i, i + 2))
  }
  return out
})

const sweep = computed(() => props.sweep)
</script>

<style scoped>
/* === The 500-series module ===
   Real 500-series modules are 1.5" wide × 5.25" tall (≈ 1 : 3.5).
   Black anodized aluminium, shown flat-on (no 3D tilt). */
.capi-module {
  width: 380px;
  height: 1180px;
  flex-shrink: 0;
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 32px 18px 22px;
  border-radius: 4px;
  background-image:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='m'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23m)' opacity='0.5'/%3E%3C/svg%3E"),
    repeating-linear-gradient(180deg,
      rgba(255,255,255,0.022) 0px, rgba(255,255,255,0.022) 1px,
      rgba(0,0,0,0.05) 1px, rgba(0,0,0,0.05) 2px,
      transparent 2px, transparent 4px),
    linear-gradient(180deg, #232323 0%, #121212 6%, #0d0d0d 94%, #232323 100%);
  background-size: 160px 160px, auto, auto;
  background-blend-mode: overlay, normal, normal;
  box-shadow:
    0 24px 50px rgba(0,0,0,0.6),
    0 8px 18px rgba(0,0,0,0.5),
    inset 0  1px 0 rgba(255,255,255,0.06),
    inset 0 -1px 0 rgba(0,0,0,0.7),
    inset  1px 0 0 rgba(255,255,255,0.04),
    inset -1px 0 0 rgba(0,0,0,0.55);
}

/* === Mounting screws: rusted square-drive, big countersunk seat === */
.module-screw {
  position: absolute;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background:
    radial-gradient(circle at 68% 72%, rgba(40,20,8,0.85) 0%, transparent 32%),
    radial-gradient(circle at 30% 64%, rgba(150,70,28,0.6) 0%, transparent 38%),
    radial-gradient(circle at 60% 30%, rgba(190,120,60,0.55) 0%, transparent 40%),
    radial-gradient(circle at 38% 34%,
      #b9824a 0%, #8a5128 32%, #5c3417 64%, #2c1908 100%);
  box-shadow:
    inset 0 -2px 4px rgba(0,0,0,0.7),
    inset 0  2px 2px rgba(255,220,170,0.18),
    0 0 0 3px #0c0c0c,
    0 0 0 5px rgba(255,255,255,0.05),
    0 2px 5px rgba(0,0,0,0.7);
}
.module-screw::before {
  content: '';
  position: absolute;
  top: 50%; left: 50%;
  width: 42%; height: 42%;
  transform: translate(-50%, -50%) rotate(-18deg);
  border-radius: 2px;
  background:
    radial-gradient(circle at 38% 34%, #3a2110 0%, #1c0f06 55%, #0a0502 100%);
  box-shadow:
    inset 0 2px 3px rgba(0,0,0,0.85),
    inset 0 -1px 1px rgba(210,160,110,0.22),
    0 1px 0 rgba(210,160,110,0.2);
}
.module-screw--t { top: 9px;    left: 50%; transform: translateX(-50%); }
.module-screw--b { bottom: 9px; left: 50%; transform: translateX(-50%); }

/* === Module header: CAPI corner-stamp + PK LED === */
.module-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 0 6px; margin-bottom: 18px;
  position: relative;
}
.module-capi {
  position: relative;
  display: inline-block;
  padding: 5px 24px 5px 10px;
  border: 1px solid #2a2a2a;
  border-radius: 2px;
  background: #050505;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif;
  font-weight: 900;
  font-size: 19px;
  letter-spacing: -0.03em;
  color: #fff;
}
.module-capi::after {
  content: '';
  position: absolute;
  top: 0; right: 0;
  width: 15px; height: 15px;
  background: linear-gradient(135deg, transparent 50%, #007DC5 50%);
  border-radius: 0 2px 0 0;
}
.module-pk {
  display: flex; align-items: center; gap: 5px;
  font-family: -apple-system, sans-serif;
  font-size: 8px; font-weight: 700;
  letter-spacing: 0.18em; text-transform: uppercase;
  color: #d0d0d0;
}
.module-pk-led {
  width: 6px; height: 6px; border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #ff8080 0%, #e02020 50%, #6a0404 100%);
  box-shadow: 0 0 5px rgba(255, 30, 30, 0.85), 0 0 12px rgba(255, 20, 20, 0.35);
}

/* === Knob grid (rows × 2 columns) === */
.module-body {
  flex: 1;
  display: flex; flex-direction: column;
  justify-content: space-around;
  padding: 6px 0;
}
.module-row {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
}
.module-knob {
  width: 170px; height: 170px;
  justify-self: center;
  position: relative;
}
.module-knob > svg { width: 100%; height: 100%; }

/* === Module footer: BYP/ACT switch + cyan nameplate === */
.module-footer {
  display: flex; flex-direction: column; align-items: center;
  gap: 12px; padding: 6px 0;
  margin-bottom: 40px;
}
.module-toggles {
  display: flex; align-items: center; gap: 9px;
  font-family: -apple-system, sans-serif;
  font-size: 8.5px; font-weight: 700;
  letter-spacing: 0.18em; color: #d0d0d0;
}
.module-toggle {
  width: 18px; height: 30px; border-radius: 4px;
  position: relative; padding: 0; cursor: pointer;
  background: linear-gradient(180deg, #3a3a3a 0%, #141414 55%, #232323 100%);
  border: 1px solid #050505;
  box-shadow:
    inset 0  1px 0 rgba(255,255,255,0.10),
    inset 0 -2px 0 rgba(0,0,0,0.5);
}
.module-toggle::after {
  content: '';
  position: absolute; left: 2px; right: 2px; top: 2px;
  height: 12px; border-radius: 3px;
  background: linear-gradient(180deg, #f0f0f0 0%, #b4b4b4 60%, #8a8a8a 100%);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.5),
    0 1px 2px rgba(0,0,0,0.55);
  transition: top .14s ease, bottom .14s ease;
}
.capi-module[data-state="act"] .module-toggle::after { top: 2px;  bottom: auto; }
.capi-module[data-state="byp"] .module-toggle::after { top: auto; bottom: 2px;  }

.module-mini-led {
  width: 6px; height: 6px; border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #2a2a2a 0%, #0c0c0c 100%);
  box-shadow: inset 0 1px 1px rgba(0,0,0,0.7);
  transition: background .14s ease, box-shadow .14s ease;
}
.capi-module[data-state="byp"] .module-mini-led--red {
  background: radial-gradient(circle at 35% 30%, #ff7070 0%, #d02020 50%, #500404 100%);
  box-shadow: 0 0 5px rgba(255, 30, 30, 0.85), 0 0 11px rgba(255,20,20,0.35);
}
.capi-module[data-state="act"] .module-mini-led--green {
  background: radial-gradient(circle at 35% 30%, #b8ffb8 0%, #20c020 50%, #052005 100%);
  box-shadow: 0 0 5px rgba(80, 220, 80, 0.8), 0 0 11px rgba(60,210,60,0.32);
}

.module-nameplate {
  background: #007DC5;
  color: #fff;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  font-weight: 800; font-size: 13px;
  letter-spacing: 0.06em;
  padding: 5px 22px;
  border-radius: 1px;
  box-shadow:
    inset 0  1px 0 rgba(255,255,255,0.20),
    inset 0 -1px 0 rgba(0,0,0,0.25),
    0 1px 0 rgba(0,0,0,0.5);
  margin-top: 2px;
}
</style>
