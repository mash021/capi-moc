# capi-moc

A design-driven mock-up for a recording-studio equipment shop, themed entirely
around vintage CAPI / 500-series hardware.

## Pages

| File | Description |
| --- | --- |
| `index.html` | Home: interactive octagon "volume knob" logo, hardware-style navbar, pilot lamp + dark/light theme toggle, and the LC25 / LC40 product modules. |
| `category.html` | **The Patch Bay** — the full catalog rendered as a wall of rack modules; each module pulls open to reveal its sub-categories as patch points. |
| `login.html` | Studio-gear themed sign-in panel (wood frame, anodized card, amber power lamp). |

## Reusable Vue components

Living in `frontend/src/components/` for the eventual Vue 3 + Vite build:

- `CapiLogo.vue` — the interactive knob logo
- `CapiKnob.vue` — a single octagon volume "plate" + dB dial
- `CapiEqModule.vue` — a complete 500-series EQ module
- `CapiVuMeter.vue` — animated, physics-driven VU meter
- `CapiMark.vue` — compact monochrome logo mark
- `capiDial.ts` — shared dial geometry

## Local preview

```bash
python3 -m http.server 8181
# then open http://localhost:8181/
```

## Stack (planned)

- **Frontend:** Vue 3 + Vite
- **Backend:** FastAPI
- **Database:** raw SQL

Category data is mirrored from [capi-gear.com](https://capi-gear.com/catalog/index.php).
CAPI™ is a trademark of Classic Audio Products, Inc. This is an unaffiliated design study.
