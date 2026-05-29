/**
 * Static geometry for the CapiKnob dB dial (hollow ring + tick marks +
 * numbers). It's identical for every knob, so it's computed exactly ONCE
 * here at module load and shared by all <CapiKnob> instances — no per-knob
 * trig, no re-allocation on re-render.
 */

export const CX = 230
export const CY = 55
export const R_RING = 71

const R_TICK_IN = 70
const R_TICK_OUT_MAJ = 78
const R_TICK_OUT_MIN = 74
const R_NUM = 86

const LABELS = [15, 12, 9, 6, 4, 2, 0, 2, 4, 6, 9, 12, 15]
const START = -135
const STEP = 22.5

const polar = (deg: number, r: number): [number, number] => {
  const rad = (deg * Math.PI) / 180
  return [CX + r * Math.sin(rad), CY - r * Math.cos(rad)]
}

const round = (n: number) => Number(n.toFixed(1))

export interface DialTick {
  x1: number; y1: number; x2: number; y2: number
  color: string; width: number
  nx: number; ny: number
  val: number; font: number; fill: string
}

export const TICKS: readonly DialTick[] = LABELS.map((val, i) => {
  const deg = START + i * STEP
  const major = val === 0 || val === 6 || val === 12 || val === 15
  const [x1, y1] = polar(deg, R_TICK_IN)
  const [x2, y2] = polar(deg, major ? R_TICK_OUT_MAJ : R_TICK_OUT_MIN)
  const [nx, ny] = polar(deg, R_NUM)
  return {
    x1: round(x1), y1: round(y1), x2: round(x2), y2: round(y2),
    color: major ? '#f0f0f0' : '#9aa0a6',
    width: major ? 1.8 : 1.1,
    nx: round(nx), ny: round(ny + 4),
    val, font: major ? 12 : 10,
    fill: val === 0 ? '#3FB5F0' : '#e6e6e6',
  }
})

export interface DialSign { sym: string; x: number; y: number }

export const SIGNS: readonly DialSign[] = ([['−', -1], ['+', 1]] as const).map(
  ([sym, side]) => {
    const [x, y] = polar(side * 12, R_NUM + 9)
    return { sym, x: round(x), y: round(y + 4) }
  },
)
