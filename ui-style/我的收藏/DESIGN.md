---
name: Cyber-Tech HUD
colors:
  surface: '#131314'
  surface-dim: '#131314'
  surface-bright: '#3a393a'
  surface-container-lowest: '#0e0e0f'
  surface-container-low: '#1c1b1c'
  surface-container: '#201f20'
  surface-container-high: '#2a2a2b'
  surface-container-highest: '#353436'
  on-surface: '#e5e2e3'
  on-surface-variant: '#cbc3d7'
  inverse-surface: '#e5e2e3'
  inverse-on-surface: '#313031'
  outline: '#958ea0'
  outline-variant: '#494454'
  surface-tint: '#d0bcff'
  primary: '#d0bcff'
  on-primary: '#3c0091'
  primary-container: '#a078ff'
  on-primary-container: '#340080'
  inverse-primary: '#6d3bd7'
  secondary: '#ddfcff'
  on-secondary: '#00363a'
  secondary-container: '#00f1fe'
  on-secondary-container: '#006a70'
  tertiary: '#ffb2b8'
  on-tertiary: '#67001d'
  tertiary-container: '#ff506e'
  on-tertiary-container: '#5b0018'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e9ddff'
  primary-fixed-dim: '#d0bcff'
  on-primary-fixed: '#23005c'
  on-primary-fixed-variant: '#5516be'
  secondary-fixed: '#74f5ff'
  secondary-fixed-dim: '#00dbe7'
  on-secondary-fixed: '#002022'
  on-secondary-fixed-variant: '#004f54'
  tertiary-fixed: '#ffdadb'
  tertiary-fixed-dim: '#ffb2b8'
  on-tertiary-fixed: '#40000f'
  on-tertiary-fixed-variant: '#91002d'
  background: '#131314'
  on-background: '#e5e2e3'
  surface-variant: '#353436'
typography:
  headline-xl:
    fontFamily: Space Mono
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Mono
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  headline-md:
    fontFamily: Space Mono
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-sm:
    fontFamily: Space Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.1em
  headline-lg-mobile:
    fontFamily: Space Mono
    fontSize: 28px
    fontWeight: '700'
    lineHeight: '1.2'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 40px
  xl: 64px
  gutter: 16px
  margin-desktop: 32px
  margin-mobile: 16px
---

## Brand & Style

This design system is built for a high-performance Cyberpunk PC Builder interface, evoking the feeling of an advanced hardware terminal or a futuristic HUD. The aesthetic is defined by a "Digital Noir" atmosphere: high-contrast neon elements set against an infinite, dark void. 

The visual style utilizes **Glassmorphism** to create layers of information that feel like transparent holographic projections. Elements are tied together with subtle scanline textures and background grid patterns that emphasize a precision-engineered environment. The emotional response is one of power, technical sophistication, and immersive customization.

## Colors

The palette is anchored in **Deep Obsidian (#0A0A0B)** to provide a canvas where light can truly pop. 

- **Primary (Electric Violet):** Used for critical actions, highlights, and primary branding elements.
- **Secondary (Glacier Blue):** Used for data visualization, technical details, and secondary interactive states.
- **Tertiary (Cyber Pink):** Reserved for alerts, errors, or "Extreme" hardware performance indicators.
- **Surface Palette:** Translucent variations of the neutral color (e.g., `rgba(10, 10, 11, 0.7)`) are used for glass panels.

Neon glows should use the primary and secondary colors with a 40-60% opacity spread to simulate light emission.

## Typography

The typography in this design system balances technical precision with high readability. 

**Space Mono** is used for all headlines, data points, and labels. Its fixed-width nature reinforces the terminal aesthetic. All labels should be set in uppercase with increased letter-spacing to mimic hardware markings.

**Geist** is the workhorse for body descriptions and long-form content. Its clean, geometric sans-serif construction ensures that even dense hardware specifications remain legible against dark, blurred backgrounds.

## Layout & Spacing

The layout follows a **12-column fixed grid** on desktop, centered to create a "terminal window" effect. Spacing is strictly mathematical, built on an **8px base unit**.

- **Margins:** Large 32px outer margins ensure the UI feels like a floating HUD within the viewport.
- **Gutters:** 16px gutters between components maintain a tight, integrated tech look.
- **Safe Areas:** Complex components (like 3D PC builders) should occupy a central "Stage" while configuration panels dock to the left or right with 24px internal padding.
- **Responsive:** On mobile, the 12-column grid collapses to 4 columns. Glass panels become full-width with 16px margins.

## Elevation & Depth

This design system avoids traditional drop shadows in favor of **Light Emission and Backdrop Blurs.**

- **Z-Axis Hierarchy:** Depth is created by varying the `backdrop-filter: blur()`. Base panels use a 10px blur, while active modals use a 24px blur to isolate them from the background grid.
- **Borders as Light:** Surfaces are defined by 1px solid borders. Neutral surfaces use low-opacity white (`rgba(255, 255, 255, 0.1)`), while active or "powered-on" components use the primary or secondary neon hex values.
- **Outer Glow:** Active elements feature a `box-shadow` that mimics a neon tube—narrow and intense at the source, broad and soft for the ambient falloff.
- **Grid Layer:** A subtle 20px x 20px repeating grid pattern exists at the lowest elevation to provide a sense of scale and digital space.

## Shapes

The shape language is primarily **angular and industrial**. While a base roundedness of 4px (`rounded-sm`) is used to prevent the UI from feeling dated, the system thrives on geometric sharpness.

- **Chamfered Corners:** Where possible, use CSS `clip-path` to create 45-degree "cut corners" on large glass panels and primary buttons.
- **Dividers:** Use 1px vertical or horizontal lines with faded gradients at the ends rather than full-width solid lines.

## Components

### Buttons
Primary buttons use a solid Electric Violet fill with a high-intensity glow. Secondary buttons use a transparent background with a Glacier Blue border. Hover states should trigger a "glitch" animation or a rapid color-shift between primary and secondary.

### Cards (Hardware Modules)
Cards are the core of the builder. They feature a 1px border and a semi-transparent background. Include a "Tech Spec" label in the top-right corner of every card using `label-sm`.

### Input Fields
Inputs are bottom-bordered only, mimicking command-line prompts. The cursor should be a solid, blinking Glacier Blue block.

### Status Chips
Used for "In Stock" or "Compatibility" checks. These are small, sharp-edged rectangles with a subtle background tint and matching text color.

### HUD Gauges (Unique Component)
Circular or linear progress bars used for Wattage, Thermal Headroom, and Budget. These use the Glacier Blue secondary color with a "pulse" animation when approaching maximum capacity.

### Checkboxes & Radios
Custom geometric shapes. Checkboxes use a diagonal cross-hatch pattern when selected rather than a standard checkmark.