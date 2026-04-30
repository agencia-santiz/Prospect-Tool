# Santiz Crimson Design System Skill
This skill ensures all UI development follows the "Santiz Crimson" design system defined in `DESIGN.md`.

## Core Identity
- **Canvas**: Warm Cream (`#fffefb`)
- **Primary Accent**: Santiz Crimson (`#ba0c2f`)
- **Secondary Accent**: Warm Gold (`#c9a046`)
- **Typography**: 
  - **Degular Display**: For Hero headlines (tight line-height 0.90)
  - **Inter**: For functional UI and body
  - **GT Alpina**: For editorial accents (serif)

## Implementation Rules
1. **No Pure Colors**: Never use `#ffffff` or `#000000`.
2. **Border-First**: Use `1px solid #c5b8a8` (Sand) for structure instead of shadows.
3. **Spacious CTAs**: Large buttons use `20px 24px` padding.
4. **Tab Underlines**: Use `box-shadow: inset` for active tab indicators.
5. **Lowercase/Uppercase**: Use Uppercase for labels with `0.5px` tracking.

## Tailwind Mapping
- `bg-santiz-cream`: `#fffefb`
- `text-santiz-crimson`: `#ba0c2f`
- `border-santiz-sand`: `#c5b8a8`
- `text-santiz-black`: `#201515`
