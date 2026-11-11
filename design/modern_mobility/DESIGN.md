---
name: Modern Mobility
colors:
  surface: '#f9f9ff'
  surface-dim: '#d4daea'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3ff'
  surface-container: '#e8eeff'
  surface-container-high: '#e3e8f9'
  surface-container-highest: '#dde2f3'
  on-surface: '#161c27'
  on-surface-variant: '#434654'
  inverse-surface: '#2a303d'
  inverse-on-surface: '#ecf0ff'
  outline: '#747686'
  outline-variant: '#c4c5d7'
  surface-tint: '#1d52d8'
  primary: '#0848d0'
  on-primary: '#ffffff'
  primary-container: '#3563e9'
  on-primary-container: '#f0f1ff'
  inverse-primary: '#b6c4ff'
  secondary: '#0060a8'
  on-secondary: '#ffffff'
  secondary-container: '#55a7ff'
  on-secondary-container: '#003b6a'
  tertiary: '#aa1900'
  on-tertiary: '#ffffff'
  tertiary-container: '#d62504'
  on-tertiary-container: '#ffefeb'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#b6c4ff'
  on-primary-fixed: '#00164f'
  on-primary-fixed-variant: '#003ab1'
  secondary-fixed: '#d3e4ff'
  secondary-fixed-dim: '#a1c9ff'
  on-secondary-fixed: '#001c38'
  on-secondary-fixed-variant: '#004880'
  tertiary-fixed: '#ffdad3'
  tertiary-fixed-dim: '#ffb4a5'
  on-tertiary-fixed: '#3e0400'
  on-tertiary-fixed-variant: '#8e1300'
  background: '#f9f9ff'
  on-background: '#161c27'
  surface-variant: '#dde2f3'
typography:
  display-hero:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.03em
  display-hero-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  spec-code:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system defines an effortless, premium digital mobility ecosystem. It targets urban professionals, digital nomads, and modern travelers who demand frictionless, dependable car rental workflows without bureaucratic complexity.

The visual style blends **Corporate / Modern refinement** with high-clarity transactional UI:
- **Clean Precision:** Expansive white space, distinct functional regions, and frictionless typographic rhythm emphasize high-value vehicle inventory and transparent rental rates.
- **Dynamic Performance:** Electric blue accents drive clear calls-to-action against cool tinted background surfaces, evoking engineering prowess, speed, and trust.
- **Micro-tactility:** Generous boundary radiuses, subtle atmospheric elevation tiers, and high-legibility attribute badges produce an approachable yet authoritative product experience.

## Colors

The system employs a strict light-mode-first architecture engineered for high daylight legibility and seamless rental discovery:

- **Primary (`#3563E9`):** The operational core. Used for primary CTAs, active reservation indicators, route pathways, and focused control borders.
- **Secondary (`#54A6FF`):** A lighter electric sky blue used for secondary highlights, badge backgrounds in hover states, progress bars, and informative status accents.
- **Tertiary (`#FF4423`):** High-visibility safety crimson designated for dynamic rental promotions, heart/favorite toggles, cancellation notices, and urgency alerts.
- **Neutral Surface Palette:**
  - Base Screen Background: `#F6F7F9` (cool tint ensuring elevated cards visually lift off the page)
  - Card & Container Surface: `#FFFFFF`
  - Subtle Border Grays: `#E0E4EC`
  - Muted Text & Secondary Labels: `#90A3BF`
  - Headings & Deep Slate Typography: `#1A202C`

## Typography

The platform utilizes **Plus Jakarta Sans** uniformly across all functional display levels to evoke athletic precision and high-tech utility:

- **Headings:** Bold and tightened tracking (`-0.02em` to `-0.03em`) create a structured, commercial editorial layout. Numbers and daily rates display with crisp tabular alignments.
- **Body & Attributes:** Regular weight body levels ensure optimal reading comfort across vehicle metadata and rental conditions.
- **Spec Tags & Meta:** Small, uppercase tags with expanded tracking provide immediate scannability for vehicle specifications (e.g., fuel capacity, transmission, steering type).

## Layout & Spacing

The layout is built on an adaptive **fluid grid architecture** aligned to an 8px vertical baseline rhythm:

- **Desktop (≥ 1200px):** 12-column grid with a maximum content constraint of `1440px`. Gutters are fixed to `1.5rem` (24px) with minimum outer margins of `2rem` (32px).
- **Tablet (768px – 1199px):** 8-column layout. Sidebar navigation collapses to a responsive drawer or header control, and rental cards scale in pairs (2 columns).
- **Mobile (< 768px):** 4-column layout with `1rem` (16px) margins and gutters. Multi-step booking forms and pickup/drop-off pickers reflow vertically into unified card stacks.

## Elevation & Depth

Visual hierarchy uses **tonal layer nesting** combined with soft, slate-tinted ambient drops rather than harsh borders:

- **Level 0 (Canvas Base):** Muted cool canvas `#F6F7F9`. Flat, non-interactive foundation.
- **Level 1 (Card & Content Blocks):** White `#FFFFFF` panels resting over `#F6F7F9` using a hairline border of `1px solid #E0E4EC` and soft ambient occlusion: `0px 2px 12px rgba(26, 32, 44, 0.04)`.
- **Level 2 (Interactive Floating Elements & Hover States):** Triggered on vehicle card hover and filter dropdowns: `0px 12px 32px rgba(53, 99, 233, 0.08)`. The subtle blue tint reinforces brand identity.
- **Level 3 (Modals, Overlays, and Drawer Panels):** Deep elevation with maximum blur: `0px 24px 48px rgba(26, 32, 44, 0.16)`.

## Shapes

The design system incorporates geometric roundedness (`level 2`) to deliver an approachable, aerodynamic vehicle aesthetic:

- **Base Components (`rounded` / 0.5rem):** Input text boxes, small spec tags, filter buttons, and pagination controls.
- **Standard Cards (`rounded-lg` / 1rem):** Vehicle inventory cards, booking summary panels, and promotional sub-banners.
- **Feature Surfaces & Hero Banners (`rounded-xl` / 1.5rem):** Primary hero rental car promotions, search reservation bars, and dialogue modals.
- **Pill Attributes:** Status indicators (e.g., "Available", "Popular") and circular icon buttons (favorite hearts, step indicators) use full-round radius (`9999px`).

## Components

### Buttons
- **Primary:** Solid `#3563E9` background with white text, `rounded-md` (0.5rem), `12px 20px` padding, smooth transition on hover (`background-color: #264ac4`).
- **Secondary / Soft:** Tinted `#F0F5FF` background with `#3563E9` text. Hover shifts to `#E0ECFF`.
- **Ghost:** Transparent background with `#90A3BF` text and borders; turns `#1A202C` on hover.

### Vehicle Inventory Cards
- Constructed with `#FFFFFF` background, `rounded-xl` (1rem), subtle `1px solid #E0E4EC` border, and Level 1 elevation.
- Structure: Header row (Car Name, Category label, and Heart icon), expansive Vehicle Image container with transparent backdrop, Specification row (Fuel capacity, Transmission, Capacity chips), and Footer row (Daily Rate with highlighted bold integer alongside the "Rent Now" primary CTA).

### Chips & Spec Tags
- Icon-led pill badges rendered with a transparent or `#F6F7F9` surface, `#90A3BF` icons, and `#596780` typography.
- Active or highlighted tags use `#3563E9` with 10% opacity background and bold blue labels.

### Interactive Reservation Widget (Pick-Up & Drop-Off)
- Dual paired card components featuring radio status selectors ("Pick - Up" / "Drop - Off") stacked or mirrored.
- Three internal split selectors: Locations (Dropdown), Date (Calendar Popover), and Time (Selector Clock) separated by subtle `1px solid #E0E4EC` dividers.
- Floating central swap button (`48x48px`, `#3563E9` with Level 2 elevation) to quickly reverse route directions.

### Form Inputs & Controls
- **Inputs:** Crisp `#FFFFFF` surface with `1px solid #E0E4EC` border, height `56px`, `rounded-md`, labeled with `label-md` in `#1A202C`. On focus: `border-color: #3563E9` with a subtle `0 0 0 3px rgba(53, 99, 233, 0.15)` focus ring.
- **Checkboxes & Radios:** `20px` circular or rounded boxes with `#3563E9` fill and distinct white glyph checks when active.