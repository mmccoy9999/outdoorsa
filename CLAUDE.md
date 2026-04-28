# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at localhost:3000
npm run build    # Production build
npm run start    # Run production build
npm run lint     # Run ESLint
```

No test suite is configured yet.

## Architecture

This is a **Next.js 16 App Router** project (JavaScript, not TypeScript) with **Tailwind CSS v4** and **React 19**.

- `src/app/layout.js` — Root layout. Loads two Google Fonts via `next/font`: `Barlow` (body, `--font-barlow`) and `Barlow_Condensed` (headings/display, `--font-barlow-condensed`). Sets site metadata.
- `src/app/page.js` — Single-page landing site for OutdoorSA, a San Antonio outdoor activity guide. Marked `'use client'`. All CSS is written as a `<style>` tag inline in the component using CSS custom properties defined in `:root`. **Do not move styles to Tailwind or external CSS files unless asked** — the inline style approach is intentional.
- `src/app/globals.css` — Imports Tailwind and sets base CSS variables. The page-level styles in `page.js` override these at the body level.

## Design system

All colors are defined as CSS custom properties inside `page.js`:

| Token | Value | Use |
|---|---|---|
| `--green-dark` | `#3B6D11` | Primary CTA, headings accent |
| `--green-mid` | `#639922` | Secondary green, section labels |
| `--green-light` | `#97C459` | Highlights on dark backgrounds |
| `--green-pale` | `#EAF3DE` | Light green backgrounds |
| `--stone` | `#2C2C2A` | Primary text, dark backgrounds |
| `--stone-mid` | `#5F5E5A` | Secondary text |
| `--stone-light` | `#D3D1C7` | Borders, dividers |
| `--cream` | `#F7F5EF` | Page background |
| `--amber` | `#BA7517` | Shade rating badges |
| `--amber-light` | `#FAEEDA` | Shade badge background |

Typography: `var(--font-barlow-condensed)` for all headings, logos, numbers, and labels; `var(--font-barlow)` for body copy and buttons.

## Product context

OutdoorSA is a pre-launch landing page for a San Antonio outdoor guide. Key differentiators: shade ratings (SA summers are hot), 12 activity types beyond hiking, weather-aware filters, and a Spanish-language version planned as "Afuera SA." The page is a single `page.js` with sections: Nav → Hero → Features strip → Why OutdoorSA → Activities → Email capture → Footer.
