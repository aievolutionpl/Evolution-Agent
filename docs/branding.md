# AI Evolution Labs — branding & install icon

This document explains where to drop the official AI Evolution Labs
artwork so the PWA, desktop shortcut, sidebar, favicon, and dashboard
all pick it up automatically.

## Brand colors

| Token | Hex | Usage |
|---|---|---|
| Cyan (primary) | `#00E5FF` | Logo letters, primary accent, focus rings |
| Cyan light | `#7DF9FF` | Highlights, hover states |
| Cyan deep | `#0085A8` | Pressed states, deep gradients |
| Lime (secondary) | `#7DFF8A` | PCB traces, success / online dots |
| Lime bright | `#C7FF00` | LED ambient accents, marketing assets |
| Surface black | `#02110F` | Primary background |
| Surface deep | `#000A08` | Inset / deep surfaces |
| Text primary | `#E8FFFB` | Primary type on dark |
| Text muted | `#7FBFBA` | Muted captions |

## Image slots

All file paths are inside `public/`. SVG fallbacks ship with the repo
so the app never breaks. Replace the matching `.png` / `.jpg` for the
real raster art whenever you can re-export from the source files.

| Path | Used by | What to drop in |
|---|---|---|
| `public/aievolutionlabs-icon.svg` | Manifest, favicon, login splash | Already shipped. SVG mark of the "AI" letters. |
| `public/aievolutionlabs-icon-192.png` | PWA install icon (192×192, maskable) | 192×192 PNG export of the AI Evolution Labs logo image. Center-safe-zone 20% padding for maskable. |
| `public/aievolutionlabs-icon-512.png` | PWA install icon (512×512, maskable) | 512×512 PNG export. Same logo, same safe zone. |
| `public/aievolutionlabs-icon-1024.png` | Electron app icon (macOS/Windows) | 1024×1024 PNG. electron-builder will downscale. |
| `public/apple-touch-icon.png` | iOS home-screen install | 180×180 PNG (no safe zone required). |
| `public/aievolutionlabs-logo.svg` | Sidebar header, README | Already shipped (vector). |
| `public/aievolutionlabs-hero.jpg` | Dashboard hero card, README | The full marketing hero photo (two founders + robot + dashboard overlay). Falls back to the SVG below until you upload. |
| `public/aievolutionlabs-hero.svg` | Hero fallback | Already shipped (vector). |
| `public/social-preview.png` | OG / Twitter card (1200×630) | Already exists as a placeholder; replace with branded version. |

## How the install shortcut gets the icon

1. **PWA install** (Chrome / Edge / Safari on iOS):
   - The browser reads `public/manifest.json`.
   - It picks the largest matching maskable PNG icon
     (`aievolutionlabs-icon-512.png`).
   - That image becomes the desktop / home-screen shortcut.
2. **Electron desktop build**:
   - `electron-builder.config.cjs` reads `icon:
     "public/aievolutionlabs-icon-1024.png"`.
   - `electron-builder` converts to `.icns` (macOS) and `.ico`
     (Windows) automatically.
3. **Browser tab favicon**:
   - `index.html` references `/favicon.svg` and
     `/aievolutionlabs-icon-192.png` as PNG fallback.

## Recommended workflow when you have new branded art

```bash
# 1. Drop the raster source somewhere outside the repo (Figma export, etc.)
# 2. Export the sizes:
#    - 1024×1024 PNG  → public/aievolutionlabs-icon-1024.png
#    - 512×512  PNG   → public/aievolutionlabs-icon-512.png
#    - 192×192  PNG   → public/aievolutionlabs-icon-192.png
#    - 180×180  PNG   → public/apple-touch-icon.png
#    - 1200×630 PNG   → public/social-preview.png
#    - hero JPG       → public/aievolutionlabs-hero.jpg
# 3. Commit. No manifest / config edits required.
```

## Theme

The default app theme is `aievolution` — black surfaces with cyan
accents (see `src/styles.css`, `[data-theme='aievolution']`). Light
variant is `aievolution-light`. The theme picker in
**Settings → Appearance** lists 12 other themes — Nous, Matrix,
Bronze, Slate, SciFi, light + dark variants — for users who want
something else.
