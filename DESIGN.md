---
name: Educational ABG Tutor & Clinical Analysis Suite
description: Apple Medical Clean clinical decision support and educational tutor interface
colors:
  primary: "#007AFF"
  primary-dark: "#0056B3"
  medical-blue: "#0A84FF"
  accent-cyan: "#30B0C7"
  vital-green: "#28CD41"
  alert-red: "#FF3B30"
  warning-orange: "#FF9500"
  neutral-bg: "#F2F2F7"
  surface-white: "#FFFFFF"
  surface-card: "#FFFFFF"
  text-primary: "#1C1C1E"
  text-secondary: "#6C6C70"
  text-tertiary: "#8E8E93"
  border-subtle: "#E5E5EA"
  border-strong: "#D1D1D6"
typography:
  display:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "2rem"
    fontWeight: 700
    lineHeight: 1.2
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "1.35rem"
    fontWeight: 600
    lineHeight: 1.3
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "1.1rem"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.05em"
rounded:
  sm: "6px"
  md: "10px"
  lg: "16px"
  xl: "20px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface-white}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  button-primary-hover:
    backgroundColor: "{colors.primary-dark}"
  card-clinical:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: "20px"
---

# Design System: Educational ABG Tutor & Clinical Analysis Suite

## Overview

**Creative North Star: "The Clinical Precision Instrument"**

The Educational ABG Tutor & Clinical Analysis Suite is crafted in the Apple Medical Clean aesthetic: serene, authoritative, pristine, and functionally transparent. Built for critical care environments where visual clarity directly influences decision speed and diagnostic precision, the interface replaces visual noise with rigorous spatial hierarchy, crisp typography, and purposeful status color coding.

The aesthetic philosophy centers on light slate-gray canvas backgrounds (`#F2F2F7`), pure white elevated card containers (`#FFFFFF`), subtle high-contrast borders (`#E5E5EA`), and refined typography powered by Apple's San Francisco (SF Pro) family. Decorative visual fluff—such as background text gradients, zero-offset glowing halos, side-tab accent stripes, auto-scrolling marquees, and artificial pulsing dots—is strictly eliminated in favor of calm, clinical precision.

**Key Characteristics:**
- Apple Medical Clean visual vocabulary: ultra-legible typography, subtle depth, high contrast, and neutral canvas.
- Purposeful status color coding (Medical Blue for primary actions, Vital Emerald for normal ranges, Alert Rose for critical abnormalities, Warning Amber for borderline compensation).
- Strict legibility floor (no functional UI text below 11px / 0.75rem).
- Clean, non-distracting motion with exponential deceleration curves (`cubic-bezier(0.16, 1, 0.3, 1)`).

## Colors

The color system uses Apple system color roles to ensure high contrast, calm presentation, and clear status differentiation across clinical parameters.

### Primary
- **Apple Medical Blue** (`#007AFF` / `rgb(0, 122, 255)`): Used for primary interactive actions, active navigation tabs, and primary diagnostic focus highlights.
- **Deep Clinical Blue** (`#0056B3`): Primary hover and active button state.

### Secondary & Status Accent
- **Vital Emerald** (`#28CD41`): Normal physiological ranges, normal Anion Gap, and physiological stability indicators.
- **Alert Rose** (`#FF3B30`): Severe acid-base disorders, uncompensated states, severe hypoxemia, and critical drug dose warnings.
- **Warning Amber** (`#FF9500`): Partial compensation, mild hypoxemia, or elevated anion gap warnings.
- **Clinical Cyan** (`#30B0C7`): Secondary informational badges, diagnostic step indicators, and clinical tutor callouts.

### Neutral
- **System Off-White Canvas** (`#F2F2F7`): Page background canvas providing soft contrast behind elevated white cards.
- **Pure Surface White** (`#FFFFFF`): Elevated cards, modals, and input fields.
- **Clinical Slate Primary Text** (`#1C1C1E`): High-contrast primary headings, numeric values, and body copy (WCAG AA ratio > 14:1).
- **Secondary Slate Text** (`#6C6C70`): Subtitles, parameter units, and metadata (WCAG AA ratio > 4.8:1).
- **Subtle Divider Border** (`#E5E5EA`): Card borders, input field strokes, and tab dividers.

### Named Rules
**The Single-Purpose Accent Rule.** Color is reserved exclusively for interactive states and diagnostic status. No color is applied purely for decoration.
**The Strict Contrast Rule.** Body text contrast must maintain ≥ 4.5:1 against its background surface under all light/dark theme modes.

## Typography

**Display Font:** `-apple-system`, `BlinkMacSystemFont`, `'SF Pro Display'`, `'Segoe UI'`, `Roboto`, `Helvetica`, `Arial`, `sans-serif`
**Body Font:** `-apple-system`, `BlinkMacSystemFont`, `'SF Pro Text'`, `'Segoe UI'`, `Roboto`, `Helvetica`, `Arial`, `sans-serif`
**Label/Mono Font:** `ui-monospace`, `SFMono-Regular`, `Menlo`, `Monaco`, `Consolas`, `monospace` (used strictly for numeric lab values, drip calculations, and formulas).

**Character:** Authoritative, crisp, and highly readable at point-of-care distance. SF Pro Display provides confidence for diagnostic headlines, while SF Pro Text ensures fatigue-free reading for clinical rationales.

### Hierarchy
- **Display** (Bold, 32px / 2rem, line-height 1.2): Main header title.
- **Headline** (Semibold, 22px / 1.375rem, line-height 1.3): Section headers (e.g., "Blood Gas Parameters", "Diagnostic Interpretation").
- **Title** (Semibold, 16px / 1rem, line-height 1.4): Card headings, step titles, modal headers.
- **Body** (Regular, 14px-15px / 0.9375rem, line-height 1.5): Clinical rationale text, tutorial explanations, drug guidance. Max measure 70ch.
- **Label** (Semibold, 11px-12px / 0.75rem, letter-spacing 0.05em, uppercase): Parameter labels (e.g., "pH", "PaCO2", "ANION GAP"). Never below 11px.

### Named Rules
**The 11px Legibility Floor Rule.** Functional UI text and medical parameter labels must never fall below 11px.
**The No-Gradient Text Rule.** Text must always render in solid, high-contrast ink (`#1C1C1E` or `#FFFFFF`). Gradient clipping on typography is prohibited.

## Layout

The spatial model uses an Apple HIG-inspired grid with generous 24px-32px section gaps, 16px card internal padding, and 12px-16px element spacing.

- **Responsive Grid:** 12-column grid on desktop screens, 2-column layout on iPad/tablets, single-column stacked layout on mobile devices.
- **Container Bounds:** Maximum content width capped at 1280px for desktop viewing to maintain optimal line length and quick scanning.
- **Vertical Rhythm:** Headings carry 24px top spacing and 8px bottom spacing to clearly anchor to their child contents.

## Elevation & Depth

Depth is established through soft, multi-layered background tinting and delicate ambient shadows rather than harsh outlines or dark glowing halos.

### Shadow Vocabulary
- **Card Ambient Rest** (`box-shadow: 0 2px 8px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)`): Rest state for clinical cards and input containers.
- **Card Hover Elevation** (`box-shadow: 0 8px 24px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)`): Interactive hover state for clickable cards and buttons.
- **Modal Floating Elevation** (`box-shadow: 0 20px 40px rgba(0,0,0,0.12)`): Modal dialogs and overlay dropdowns.

### Named Rules
**The Zero-Glow Halo Rule.** Zero-offset colored box-shadows or text-shadow glows are strictly banned.
**The Crisp Edge Rule.** All elevated containers pair a soft shadow with a subtle 1px border (`#E5E5EA`) to define clear boundaries.

## Shapes

- **Corner Radius Scale:**
  - `6px` (`--radius-sm`): Badges, status pills, small action buttons.
  - `10px` (`--radius-md`): Form inputs, standard buttons, select dropdowns.
  - `16px` (`--radius-lg`): Diagnostic cards, parameter panels, tutorial containers.
  - `20px` (`--radius-xl`): Modal dialogs, major section wrappers.

## Components

### Buttons
- **Shape:** Rounded corners (`10px`).
- **Primary:** Apple Medical Blue (`#007AFF`) background with crisp white text (`#FFFFFF`), font weight 600.
- **Hover / Focus:** Deep Clinical Blue (`#0056B3`) on hover with smooth 150ms transition. Blue focus outline (`0 0 0 3px rgba(0,122,255,0.25)`).

### Cards / Containers
- **Corner Style:** Rounded (`16px`).
- **Background:** Pure White (`#FFFFFF`).
- **Border:** 1px subtle stroke (`#E5E5EA`). No thick side-tab accent stripes (`border-left: 4px`)!
- **Internal Padding:** `20px` desktop, `16px` mobile.

### Input Fields
- **Style:** Clean white background (`#FFFFFF`), 1px border (`#D1D1D6`), 10px radius, 10px 14px padding.
- **Focus:** 1px `#007AFF` border with 3px focus ring (`rgba(0, 122, 255, 0.2)`).

### Diagnostic Badges & Pills
- **Style:** Solid pastel background tint (e.g., `#EBF5FF` for blue, `#E8F8EC` for green, `#FFEEEE` for red) with high-contrast text (`#007AFF`, `#1E7E34`, `#D70015`).
- **Shape:** Pill radius (`6px` or `9999px`). No pulsing dot animations!

## Do's and Don'ts

### Do:
- **Do** maintain WCAG AA contrast ratio (≥ 4.5:1 for body copy, ≥ 3:1 for large text).
- **Do** use SF Pro / Apple system font hierarchy for immediate familiarity and clarity.
- **Do** enforce exponential smooth easing (`cubic-bezier(0.16, 1, 0.3, 1)`) for UI transitions.
- **Do** maintain a strict 11px typography floor for all functional text and labels.

### Don't:
- **Don't** use colored `border-left` or `border-right` accent stripes (> 1px) on cards or callout containers (side-tab antipattern).
- **Don't** use gradient text (`background-clip: text`) on headings or numeric indicators.
- **Don't** add pulsing status dot animations (`@keyframes livePulse`) on static header indicators.
- **Don't** use auto-scrolling marquees (`@keyframes ecgScroll`) for ECG or status banners.
- **Don't** use bounce or elastic easing (`cubic-bezier(0.34, 1.56, 0.64, 1)`).
- **Don't** use hairline borders paired with wide 30px+ diffuse dark shadows.
