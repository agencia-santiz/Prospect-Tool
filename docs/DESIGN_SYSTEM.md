# Bloom Leads Design System

_Template and source of truth for the Bloom Leads visual language._
_Generated on 2026-04-30._

## 0. How to use this file

- Treat this file as the canonical reference for color, typography, spacing, and modal behavior.
- When component styles conflict with this document, update the component to match the system.
- Keep the language simple and implementation-ready.
- The current codebase maps these tokens to CSS custom properties named `--santiz-*` and Tailwind aliases under `santiz.*`.

## 1. Design principles

- Warm, structured, and precise.
- Dense enough for B2B work, but never cramped.
- Border-first, not shadow-first.
- One strong brand accent, used sparingly.
- Functional clarity before decorative effect.

## 2. Token library

### 2.1 Color tokens

| Token | Value | Use | Current alias |
| --- | --- | --- | --- |
| `color.brand.primary` | `#ba0c2f` | Primary CTA, active state, emphasis | `--santiz-crimson` |
| `color.brand.primaryHover` | `#d4143a` | Hover state for primary action | `--santiz-crimson-light` |
| `color.brand.primaryActive` | `#8a0923` | Pressed state for primary action | `--santiz-crimson-dark` |
| `color.brand.primaryTint` | `#f9e6ea` | Selected rows, soft highlight | `--santiz-crimson-tint` |
| `color.brand.secondary` | `#c9a046` | Premium accents, upgrade cues | `--santiz-gold` |
| `color.surface.canvas` | `#fffefb` | Main page canvas, cards, panels | `--santiz-cream` |
| `color.surface.subtle` | `#fffdf9` | Secondary surface, warm variation | `--santiz-off-white` |
| `color.surface.soft` | `#ebe6dd` | Light panels, soft backgrounds | `--santiz-sand-light` |
| `color.text.primary` | `#000000` | Main text, titles, strong labels | `--santiz-black` |
| `color.text.secondary` | `#36302a` | Body text, secondary copy | `--santiz-charcoal` |
| `color.text.muted` | `#8a8278` | Metadata, helper text, timestamps | `--santiz-warm-gray` |
| `color.border.default` | `#c5b8a8` | Default borders, dividers, inputs | `--santiz-sand` |
| `color.border.soft` | `#ebe6dd` | Light borders, subtle separators | `--santiz-sand-light` |
| `color.status.success` | `#2a9d6f` | Confirmed, completed, positive states | `--santiz-success` |
| `color.status.warning` | `#d4913d` | Caution, pending, attention states | `--santiz-warning` |
| `color.status.info` | `#3a7bc8` | Informational states, help, hints | `--santiz-info` |
| `color.overlay.scrim` | `rgba(45, 45, 46, 0.5)` | Modal backdrop and dimming layer | n/a |
| `color.overlay.focus` | `rgba(186, 12, 47, 0.12)` | Focus ring, active halo | `--santiz-crimson-glow` |

### 2.2 Typography tokens

| Token | Value | Use |
| --- | --- | --- |
| `font.family.display` | `Degular Display, sans-serif` | Hero headlines, special emphasis |
| `font.family.body` | `Inter, Helvetica, Arial, sans-serif` | All functional UI text |
| `font.family.editorial` | `GT Alpina, serif` | Editorial accents only |
| `font.size.displayXL` | `80px` | Largest hero title or campaign-level headline |
| `font.size.displayLG` | `56px` | Primary hero headline |
| `font.size.displayMD` | `40px` | Reduced hero, modal spotlight, large stats |
| `font.size.headingLG` | `32px` | Section titles, modal titles on desktop |
| `font.size.headingMD` | `24px` | Card titles, key labels |
| `font.size.bodyLG` | `20px` | Value props, supporting copy |
| `font.size.body` | `16px` | Standard reading text |
| `font.size.caption` | `14px` | Labels, metadata, helper text |
| `font.size.micro` | `12px` | Tiny labels, badges, tertiary notes |
| `font.lineHeight.tight` | `0.90` | Display type and compressed headings |
| `font.lineHeight.body` | `1.20-1.25` | Standard readable text |
| `font.weight.regular` | `400` | Body text |
| `font.weight.medium` | `500` | Navigation and display labels |
| `font.weight.semibold` | `600` | Buttons, headings, emphasis |
| `font.weight.bold` | `700` | Strong hierarchy, counters |

### 2.3 Spacing tokens

| Token | Value | Use |
| --- | --- | --- |
| `space.1` | `4px` | Tight inline gaps |
| `space.2` | `8px` | Default small spacing |
| `space.3` | `12px` | Compact text groups |
| `space.4` | `16px` | Default component padding |
| `space.5` | `20px` | Primary action padding |
| `space.6` | `24px` | Section spacing inside panels |
| `space.8` | `32px` | Standard block separation |
| `space.10` | `40px` | Larger group spacing |
| `space.12` | `48px` | Modal padding and dense sections |
| `space.16` | `64px` | Page and section rhythm |
| `space.20` | `80px` | Large vertical breathing room |

## 3. Modal system

### 3.1 Common anatomy

Every modal in Bloom Leads should follow the same basic structure:

1. `Scrim`
   - Fixed backdrop that dims the app and prevents accidental interaction.
2. `Dialog shell`
   - Centered container with a clear boundary, warm surface, and predictable width.
3. `Header`
   - Title, optional support copy, and a visible close control.
4. `Body`
   - Main working area, allowed to scroll independently when content is long.
5. `Footer`
   - Final action area with one obvious primary action and optional secondary action.

### 3.2 Common rules

- Use a single modal at a time.
- Keep the close control visible at all times.
- Trap focus inside the modal while it is open.
- Allow `Escape` to close the modal.
- Lock page scroll while the modal is open.
- Prefer scrolling the modal body, not the page behind it.
- Keep the title task-oriented and explicit.
- Do not mix more than one primary action in the footer.
- If a modal is simulated, label it clearly as simulated or preview-only.
- Do not show real payment or security claims for mock flows.
- Keep modal copy concise and factual.

### 3.3 PricingModal

Purpose:
- Present the pricing narrative and upgrade path.
- Work as a simulated upsell until billing is real.

Recommended anatomy:

1. `Left value rail`
   - Brand-led summary, recommended badge, feature list, trust strip.
2. `Right conversion rail`
   - Plan title, price, confirmation CTA, legal microcopy, and optional enterprise note.
3. `Primary CTA`
   - Single clear action for upgrade or continuation.
4. `Trust copy`
   - Small supporting text, never louder than the offer itself.

Usage rules:

- Keep the price visible above the fold on desktop.
- Keep one clear primary CTA.
- Avoid competing buttons that pull attention away from the upgrade path.
- On mobile, stack the value rail above the pricing rail.
- If the flow is still simulated, say so in the modal copy or badge.
- Keep trust language factual. Do not imply a live payment provider if the flow is only a demo.
- Use strong contrast between the value panel and the conversion panel so the hierarchy is obvious at a glance.

### 3.4 SettingsModal

Purpose:
- Expose local product preferences and pipeline configuration.
- Let the user tune the working surface without leaving the main app flow.

Recommended anatomy:

1. `Header`
   - Title and close action.
2. `Tab bar`
   - Separate pipeline stages from card visibility settings.
3. `Scrollable content`
   - Dense, readable controls with enough space for touch interaction.
4. `Footer`
   - Single confirmation action, usually a closing action like `Concluir`.

Usage rules:

- Keep labels literal and task-focused.
- Make state changes easy to understand immediately.
- Use one active tab style everywhere.
- Do not hide destructive actions inside the same visual group as harmless toggles.
- Keep each option row large enough to tap comfortably on mobile.
- If more settings are added later, split them into additional tabs or a new surface instead of crowding the current modal.
- Preserve the user's current tab when reopening, if the app supports it later.
- Keep the footer action consistent across the product: one clear confirm/close action, no competing actions.

### 3.5 Shared modal styling rules

- Shell radius should stay soft and premium, not sharp.
- Border treatment should stay visible even when shadows are subtle.
- Primary buttons inside modals should use the brand crimson.
- Secondary buttons should remain neutral and quiet.
- The overlay should be dark enough to separate the modal from the app, but not fully opaque.
- A modal should feel like a temporary workspace, not a new page.

## 4. Open items [aberto]

- [aberto] Confirm whether the final token naming will remain `santiz-*` in code or move to a Bloom Leads-specific alias set.
- [aberto] Confirm whether the pricing flow stays simulated or gets a real billing backend.
- [aberto] Confirm whether `SettingsModal` should stay as one surface or split into separate settings screens later.
- [aberto] Confirm whether `Degular Display` and `GT Alpina` are guaranteed to remain available in the build environment.



