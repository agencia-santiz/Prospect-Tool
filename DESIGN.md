# Design System Inspired by Zapier — Adapted for Santiz

## 1. Visual Theme & Atmosphere

This design system inherits Zapier's warm, approachable professionalism but replaces the orange accent identity with **Santiz Crimson** (`#ba0c2f`) — a deep, authoritative ruby red that conveys confidence and premium quality. The cream-tinted canvas (`#fffefb`) remains, feeling like unbleached paper — the digital equivalent of a well-organized notebook. The near-black (`#000000`) text retains its faint reddish-brown warmth, now harmonizing naturally with the crimson accent.

The typographic system is a deliberate interplay of two distinct personalities. **Degular Display** — a geometric, wide-set display face — handles hero-scale headlines at 56-80px with medium weight (500) and extraordinarily tight line-heights (0.90), creating headlines that compress vertically like stacked blocks. **Inter** serves as the workhorse for everything else, from section headings to body text and navigation, with fallbacks to Helvetica and Arial. **GT Alpina**, an elegant thin-weight serif with aggressive negative letter-spacing (-1.6px to -1.92px), makes occasional appearances for softer editorial moments.

The brand's signature **Santiz Crimson** (`#ba0c2f`) is unmistakable — a deep, saturated ruby red that commands authority without aggression. It's used sparingly but decisively: primary CTA buttons, active state underlines, and accent borders. Against the warm cream background, this crimson creates a color relationship that feels luxurious and trustworthy.

**Key Characteristics:**
- Warm cream canvas (`#fffefb`) instead of pure white — organic, paper-like warmth
- Near-black with reddish undertone (`#000000`) — text that breathes rather than dominates
- Degular Display for hero headlines at 0.90 line-height — compressed, impactful, modern
- Inter as the universal UI font across all functional typography
- GT Alpina for editorial accents — thin-weight serif with extreme negative tracking
- Santiz Crimson (`#ba0c2f`) as the primary accent — deep, authoritative, sparingly applied
- Santiz Crimson Light (`#d4143a`) for hover states — vivid, energetic
- Warm Gold (`#c9a046`) as secondary accent — pairs elegantly with crimson
- Warm neutral palette: borders (`#c5b8a8`), muted text (`#8a8278`), surface tints (`#ebe6dd`)
- 8px base spacing system with generous padding on CTAs (20px 24px)
- Border-forward design: `1px solid` borders in warm grays define structure over shadows

## 2. Color Palette & Roles

### Primary Brand
- **Santiz Crimson** (`#ba0c2f`): Primary CTA buttons, active underline indicators, accent borders. The signature color — deep, authoritative, warm.
- **Crimson Light** (`#d4143a`): Hover state for primary CTAs, highlighted text. Brighter, more energetic.
- **Crimson Dark** (`#8a0923`): Pressed/active states, dark accent backgrounds. Deeper, more intense.
- **Crimson Glow** (`rgba(186, 12, 47, 0.12)`): Subtle glow effects, focus rings, hover backgrounds.
- **Crimson Tint** (`#f9e6ea`): Very light crimson for subtle background highlights, selected rows.

### Neutrals (Warm)
- **Santiz Black** (`#080808`): Primary text, headings, dark button backgrounds. A true near-black — deep and authoritative.
- **Cream White** (`#fffefb`): Page background, card surfaces, light button fills. Not pure white; the yellowish warmth is intentional.
- **Off-White** (`#fffdf9`): Secondary background surface, subtle alternate tint. Nearly indistinguishable from cream white but creates depth.

### Neutral Scale
- **Dark Charcoal** (`#36302a`): Secondary text, footer text, border color for strong dividers. A warm dark gray-brown.
- **Warm Gray** (`#8a8278`): Tertiary text, muted labels, timestamp-style content. Mid-range with warm undertone.
- **Sand** (`#c5b8a8`): Primary border color, hover state backgrounds, divider lines. The backbone of structural elements.
- **Light Sand** (`#ebe6dd`): Secondary button backgrounds, light borders, subtle card surfaces.
- **Mid Warm** (`#b0a99e`): Alternate border tone, used on specific span elements.

### Secondary Accent
- **Warm Gold** (`#c9a046`): Secondary accent for badges, highlights, premium indicators. Pairs elegantly with crimson.
- **Gold Light** (`#d4b366`): Hover state for gold elements.
- **Gold Dark** (`#a8842e`): Pressed state, dark gold accents.

### Semantic Colors
- **Success** (`#2a9d6f`): Positive states, confirmations, completed actions.
- **Warning** (`#d4913d`): Caution states, pending actions.
- **Error** (`#ba0c2f`): Error states (reuses primary crimson — errors deserve authority).
- **Info** (`#3a7bc8`): Informational states, help indicators.

### Interactive
- **Crimson CTA** (`#ba0c2f`): Primary action buttons and active tab underlines.
- **Dark CTA** (`#080808`): Secondary dark buttons with sand hover state.
- **Light CTA** (`#ebe6dd`): Tertiary/ghost buttons with sand hover.
- **Link Default** (`#080808`): Standard link color, matching body text.
- **Hover Underline**: Links remove `text-decoration: underline` on hover (inverse pattern).

### Overlay & Surface
- **Semi-transparent Dark** (`rgba(45, 45, 46, 0.5)`): Overlay button variant, backdrop-like elements.
- **Pill Surface** (`#fffefb`): White pill buttons with sand borders.
- **Crimson Overlay** (`rgba(186, 12, 47, 0.08)`): Subtle crimson background tint for highlighted sections.

### Shadows & Depth
- **Inset Underline** (`rgb(186, 12, 47) 0px -4px 0px 0px inset`): Active tab indicator — crimson underline using inset box-shadow.
- **Hover Underline** (`rgb(197, 184, 168) 0px -4px 0px 0px inset`): Inactive tab hover — sand-colored underline.

## 3. Typography Rules

### Font Families
- **Display**: `Degular Display` — wide geometric display face for hero headlines
- **Primary**: `Inter`, with fallbacks: `Helvetica, Arial`
- **Editorial**: `GT Alpina` — thin-weight serif for editorial moments
- **System**: `Arial` — fallback for form elements and system UI

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|------|--------|-------------|----------------|-------|
| Display Hero XL | Degular Display | 80px (5.00rem) | 500 | 0.90 (tight) | normal | Maximum impact, compressed block |
| Display Hero | Degular Display | 56px (3.50rem) | 500 | 0.90-1.10 (tight) | 0-1.12px | Primary hero headlines |
| Display Hero SM | Degular Display | 40px (2.50rem) | 500 | 0.90 (tight) | normal | Smaller hero variant |
| Display Button | Degular Display | 24px (1.50rem) | 600 | 1.00 (tight) | 1px | Large CTA button text |
| Section Heading | Inter | 48px (3.00rem) | 500 | 1.04 (tight) | normal | Major section titles |
| Editorial Heading | GT Alpina | 48px (3.00rem) | 250 | normal | -1.92px | Thin editorial headlines |
| Editorial Sub | GT Alpina | 40px (2.50rem) | 300 | 1.08 (tight) | -1.6px | Editorial subheadings |
| Sub-heading LG | Inter | 36px (2.25rem) | 500 | normal | -1px | Large sub-sections |
| Sub-heading | Inter | 32px (2.00rem) | 400 | 1.25 (tight) | normal | Standard sub-sections |
| Sub-heading MD | Inter | 28px (1.75rem) | 500 | normal | normal | Medium sub-headings |
| Card Title | Inter | 24px (1.50rem) | 600 | normal | -0.48px | Card headings |
| Body Large | Inter | 20px (1.25rem) | 400-500 | 1.00-1.20 (tight) | -0.2px | Feature descriptions |
| Body Emphasis | Inter | 18px (1.13rem) | 600 | 1.00 (tight) | normal | Emphasized body text |
| Body | Inter | 16px (1.00rem) | 400-500 | 1.20-1.25 | -0.16px | Standard reading text |
| Body Semibold | Inter | 16px (1.00rem) | 600 | 1.16 (tight) | normal | Strong labels |
| Button | Inter | 16px (1.00rem) | 600 | normal | normal | Standard buttons |
| Button SM | Inter | 14px (0.88rem) | 600 | normal | normal | Small buttons |
| Caption | Inter | 14px (0.88rem) | 500 | 1.25-1.43 | normal | Labels, metadata |
| Caption Upper | Inter | 14px (0.88rem) | 600 | normal | 0.5px | Uppercase section labels |
| Micro | Inter | 12px (0.75rem) | 600 | 0.90-1.33 | 0.5px | Tiny labels, often uppercase |
| Micro SM | Inter | 13px (0.81rem) | 500 | 1.00-1.54 | normal | Small metadata text |

### Principles
- **Three-font system, clear roles**: Degular Display commands attention at hero scale only. Inter handles everything functional. GT Alpina adds editorial warmth sparingly.
- **Compressed display**: Degular at 0.90 line-height creates vertically compressed headline blocks that feel modern and architectural.
- **Weight as hierarchy signal**: Inter uses 400 (reading), 500 (navigation/emphasis), 600 (headings/CTAs). Degular uses 500 (display) and 600 (buttons).
- **Uppercase for labels**: Section labels (like "01 / Colors") and small categorization use `text-transform: uppercase` with 0.5px letter-spacing.
- **Negative tracking for elegance**: GT Alpina uses -1.6px to -1.92px letter-spacing for its thin-weight editorial headlines.

## 4. Component Stylings

### Buttons

**Primary Crimson**
- Background: `#ba0c2f`
- Text: `#fffefb`
- Padding: 8px 16px
- Radius: 4px
- Border: `1px solid #ba0c2f`
- Hover: background shifts to `#d4143a` (Crimson Light)
- Active: background shifts to `#8a0923` (Crimson Dark)
- Use: Primary CTA ("Get Started", "Sign up free")

**Primary Dark**
- Background: `#000000`
- Text: `#fffefb`
- Padding: 20px 24px
- Radius: 8px
- Border: `1px solid #000000`
- Hover: background shifts to `#c5b8a8`, text to `#000000`
- Use: Large secondary CTA buttons

**Light / Ghost**
- Background: `#ebe6dd`
- Text: `#36302a`
- Padding: 20px 24px
- Radius: 8px
- Border: `1px solid #c5b8a8`
- Hover: background shifts to `#c5b8a8`, text to `#000000`
- Use: Tertiary actions, filter buttons

**Pill Button**
- Background: `#fffefb`
- Text: `#36302a`
- Padding: 0px 16px
- Radius: 20px
- Border: `1px solid #c5b8a8`
- Use: Tag-like selections, filter pills

**Overlay Semi-transparent**
- Background: `rgba(45, 45, 46, 0.5)`
- Text: `#fffefb`
- Radius: 20px
- Hover: background becomes fully opaque `#2d2d2e`
- Use: Video play buttons, floating actions

**Tab / Navigation (Inset Shadow)**
- Background: transparent
- Text: `#000000`
- Padding: 12px 16px
- Shadow: `rgb(186, 12, 47) 0px -4px 0px 0px inset` (active crimson underline)
- Hover shadow: `rgb(197, 184, 168) 0px -4px 0px 0px inset` (sand underline)
- Use: Horizontal tab navigation

**Gold Accent Button** (New)
- Background: `#c9a046`
- Text: `#000000`
- Padding: 8px 16px
- Radius: 4px
- Border: `1px solid #c9a046`
- Hover: background shifts to `#d4b366`
- Use: Premium/upgrade CTAs, highlight actions

### Cards & Containers
- Background: `#fffefb`
- Border: `1px solid #c5b8a8` (warm sand border)
- Radius: 5px (standard), 8px (featured)
- No shadow elevation by default — borders define containment
- Hover: subtle border color intensification
- Selected state: `1px solid #ba0c2f` border + `rgba(186, 12, 47, 0.04)` background tint

### Inputs & Forms
- Background: `#fffefb`
- Text: `#000000`
- Border: `1px solid #c5b8a8`
- Radius: 5px
- Focus: border color shifts to `#ba0c2f` (crimson) + `0 0 0 3px rgba(186, 12, 47, 0.12)` ring
- Placeholder: `#8a8278`
- Error: border color `#ba0c2f`, helper text in `#ba0c2f`
- Success: border color `#2a9d6f`

### Navigation
- Clean horizontal nav on cream background
- Brand logo left-aligned
- Links: Inter 16px weight 500, `#000000` text
- CTA: Crimson button ("Get Started")
- Tab navigation uses inset box-shadow underline technique
- Mobile: hamburger collapse

### Image Treatment
- Product screenshots with `1px solid #c5b8a8` border
- Rounded corners: 5-8px
- Dashboard/workflow screenshots prominent in feature sections
- Light gradient backgrounds behind hero content

### Distinctive Components

**Status Badge**
- Crimson dot + text for active/important items
- Gold background pill for premium/featured items
- Sand background pill for neutral status

**Stat Counter**
- Large display number using Inter 48px weight 500
- Muted description below in `#36302a`
- Crimson accent for key metrics

**Social Proof Icons**
- Circular icon buttons: 14px radius
- Sand border: `1px solid #c5b8a8`
- Used for social media follow links in footer

## 5. Layout Principles

### Spacing System
- Base unit: 8px
- Scale: 1px, 4px, 6px, 8px, 10px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 56px, 64px, 72px
- CTA buttons use generous padding: 20px 24px for large, 8px 16px for standard
- Section padding: 64px-80px vertical

### Grid & Container
- Max content width: approximately 1200px
- Hero: centered single-column with large top padding
- Feature sections: 2-3 column grids
- Full-width sand-bordered dividers between sections
- Footer: multi-column dark background (`#000000`)

### Whitespace Philosophy
- **Warm breathing room**: Generous vertical spacing between sections (64px-80px), but content areas are relatively dense — information packed efficiently within the cream canvas.
- **Architectural compression**: Degular Display headlines at 0.90 line-height compress vertically, contrasting with the open spacing around them.
- **Section rhythm**: Cream background throughout, with sections separated by sand-colored borders rather than background color changes.

### Border Radius Scale
- Tight (3px): Small inline spans
- Standard (4px): Buttons (crimson CTA), tags, small elements
- Content (5px): Cards, links, general containers
- Comfortable (8px): Featured cards, large buttons, tabs
- Social (14px): Social icon buttons, pill-like elements
- Pill (20px): Play buttons, large pill buttons, floating actions

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat (Level 0) | No shadow | Page background, text blocks |
| Bordered (Level 1) | `1px solid #c5b8a8` | Standard cards, containers, inputs |
| Strong Border (Level 1b) | `1px solid #36302a` | Dark dividers, emphasized sections |
| Active Tab (Level 2) | `rgb(186, 12, 47) 0px -4px 0px 0px inset` | Active tab underline (crimson) |
| Hover Tab (Level 2b) | `rgb(197, 184, 168) 0px -4px 0px 0px inset` | Hover tab underline (sand) |
| Focus (Accessibility) | `0 0 0 3px rgba(186, 12, 47, 0.12)` | Focus ring on interactive elements |
| Selected (Level 3) | `1px solid #ba0c2f` + crimson tint bg | Selected cards, active items |

**Shadow Philosophy**: Structure is defined almost entirely through borders — warm sand (`#c5b8a8`) borders for standard containment, dark charcoal (`#36302a`) borders for emphasis. The only shadow-like technique is the inset box-shadow used for tab underlines, where a `0px -4px 0px 0px inset` shadow creates a bottom-bar indicator. This border-first approach keeps the design grounded and tangible rather than floating.

### Decorative Depth
- Crimson inset underline on active tabs creates visual "weight" at the bottom of elements
- Sand hover underlines provide preview states without layout shifts
- No background gradients in main content — the cream canvas is consistent
- Footer uses full dark background (`#000000`) for contrast reversal
- Selected/highlighted items use subtle crimson tint (`rgba(186, 12, 47, 0.04)`)

## 7. Do's and Don'ts

### Do
- Use Degular Display exclusively for hero-scale headlines (40px+) with 0.90 line-height for compressed impact
- Use Inter for all functional UI — navigation, body text, buttons, labels
- Apply warm cream (`#fffefb`) as the background, never pure white
- Use `#000000` for text, never pure black — the reddish warmth matters
- Keep Santiz Crimson (`#ba0c2f`) reserved for primary CTAs and active state indicators
- Use Warm Gold (`#c9a046`) as secondary accent for premium/highlight elements
- Use sand (`#c5b8a8`) borders as the primary structural element instead of shadows
- Apply generous button padding (20px 24px) for large CTAs — buttons should feel spacious
- Use inset box-shadow underlines for tab navigation rather than border-bottom
- Apply uppercase with 0.5px letter-spacing for section labels and micro-categorization
- Use `#d4143a` (Crimson Light) for hover states on primary buttons
- Use `#8a0923` (Crimson Dark) for pressed/active states

### Don't
- Don't use Degular Display for body text or UI elements — it's display-only
- Don't use pure white (`#ffffff`) or pure black (`#000000`) — the palette is warm-shifted
- Don't apply box-shadow elevation to cards — use borders instead
- Don't scatter Santiz Crimson across the UI — it's reserved for CTAs, active states, and key metrics
- Don't use tight padding on large CTA buttons — buttons are deliberately spacious
- Don't ignore the warm neutral system — borders should be `#c5b8a8`, not gray
- Don't use GT Alpina for functional UI — it's an editorial accent at thin weights only
- Don't apply positive letter-spacing to GT Alpina — it uses aggressive negative tracking (-1.6px to -1.92px)
- Don't use rounded pill shapes (9999px) for primary buttons — pills are for tags and social icons
- Don't mix crimson and gold in the same button — each has its own role
- Don't use crimson for informational or neutral states — keep it for action and emphasis

## 8. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile Small | <450px | Tight single column, reduced hero text |
| Mobile | 450-600px | Standard mobile, stacked layout |
| Mobile Large | 600-640px | Slight horizontal breathing room |
| Tablet Small | 640-680px | 2-column grids begin |
| Tablet | 680-768px | Card grids expand |
| Tablet Large | 768-991px | Full card grids, expanded padding |
| Desktop Small | 991-1024px | Desktop layout initiates |
| Desktop | 1024-1280px | Full layout, maximum content width |
| Large Desktop | >1280px | Centered with generous margins |

### Touch Targets
- Large CTA buttons: 20px 24px padding (comfortable 60px+ height)
- Standard buttons: 8px 16px padding
- Navigation links: 16px weight 500 with adequate spacing
- Social icons: 14px radius circular buttons
- Tab items: 12px 16px padding

### Collapsing Strategy
- Hero: Degular 80px display scales to 40-56px on smaller screens
- Navigation: horizontal links + CTA collapse to hamburger menu
- Feature cards: 3-column grid to 2-column to single-column stacked
- Footer: multi-column dark section collapses to stacked
- Section spacing: 64-80px reduces to 40-48px on mobile

### Image Behavior
- Product screenshots maintain sand border treatment at all sizes
- App icons maintain fixed sizes within responsive containers
- Hero illustrations scale proportionally
- Full-width sections maintain edge-to-edge treatment

## 9. Agent Prompt Guide

### Quick Color Reference
- Primary CTA: Santiz Crimson (`#ba0c2f`)
- Primary Hover: Crimson Light (`#d4143a`)
- Primary Active: Crimson Dark (`#8a0923`)
- Secondary Accent: Warm Gold (`#c9a046`)
- Background: Cream White (`#fffefb`)
- Heading text: Santiz Black (`#000000`)
- Body text: Dark Charcoal (`#36302a`)
- Border: Sand (`#c5b8a8`)
- Secondary surface: Light Sand (`#ebe6dd`)
- Muted text: Warm Gray (`#8a8278`)
- Success: `#2a9d6f`
- Warning: `#d4913d`
- Info: `#3a7bc8`

### Example Component Prompts
- "Create a hero section on cream background (`#fffefb`). Headline at 56px Degular Display weight 500, line-height 0.90, color `#000000`. Subtitle at 20px Inter weight 400, line-height 1.20, color `#36302a`. Crimson CTA button (`#ba0c2f`, 4px radius, 8px 16px padding, cream text, hover `#d4143a`) and dark button (`#000000`, 8px radius, 20px 24px padding, cream text)."
- "Design a card: cream background (`#fffefb`), `1px solid #c5b8a8` border, 5px radius. Title at 24px Inter weight 600, letter-spacing -0.48px, `#000000`. Body at 16px weight 400, `#36302a`. No box-shadow. Selected state: `1px solid #ba0c2f` border with `rgba(186, 12, 47, 0.04)` background."
- "Build a tab navigation: transparent background. Inter 16px weight 500, `#000000` text. Active tab: `box-shadow: rgb(186, 12, 47) 0px -4px 0px 0px inset`. Hover: `box-shadow: rgb(197, 184, 168) 0px -4px 0px 0px inset`. Padding 12px 16px."
- "Create navigation: cream sticky header (`#fffefb`). Inter 16px weight 500 for links, `#000000` text. Crimson pill CTA 'Get Started' right-aligned (`#ba0c2f`, 4px radius, 8px 16px padding, cream text)."
- "Design a footer with dark background (`#000000`). Text `#fffefb`. Links in `#c5b8a8` with hover to `#fffefb`. Multi-column layout. Social icons as 14px-radius circles with sand borders."
- "Create a premium badge: Warm Gold background (`#c9a046`), `#000000` text, 4px radius, 6px 12px padding, uppercase Inter 12px weight 600."

### Iteration Guide
1. Always use warm cream (`#fffefb`) background, never pure white — the warmth defines the system
2. Borders (`1px solid #c5b8a8`) are the structural backbone — avoid shadow elevation
3. Santiz Crimson (`#ba0c2f`) is the primary accent; Warm Gold (`#c9a046`) is the secondary — everything else is warm neutrals
4. Three fonts, strict roles: Degular Display (hero), Inter (UI), GT Alpina (editorial)
5. Large CTA buttons need generous padding (20px 24px) — buttons feel spacious
6. Tab navigation uses inset box-shadow underlines, not border-bottom
7. Text is always warm: `#000000` for dark, `#36302a` for body, `#8a8278` for muted
8. Uppercase labels at 12-14px with 0.5px letter-spacing for section categorization
9. Crimson hover = `#d4143a`, Crimson pressed = `#8a0923` — always three states
10. Gold accent sparingly — premium badges, upgrade CTAs, key highlights only
