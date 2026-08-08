# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Critical care physicians, ICU nurses, pulmonology fellows, medical students, and clinical staff requiring rapid, high-precision Arterial Blood Gas (ABG) interpretation, drip rate calculations, electrolyte balance evaluation, and clinical decision support.

## Product Purpose
Provide an all-in-one clinical analysis and educational suite combining real-time ABG interpretation (acid-base diagnostics, compensation status, anion gap, oxygenation index), ICU drip calculator, electrolyte disturbance protocols, and interactive clinical case studies for bedside learning and point-of-care verification.

## Positioning
An ultra-clean, clinical-grade medical decision support & interactive tutor suite inspired by Apple's human interface guidelines (Apple Medical Clean design), delivering instant multi-parameter blood gas analysis, physiological rationale explanations, and step-by-step diagnostic workflows without cognitive overload.

## Operating Context
Hospital ICU bedside, emergency departments, clinical rounds, medical simulation labs, and self-paced clinical education. Works seamlessly on desktop workstation screens, tablets (iPad clinical rounds), and mobile devices.

## Capabilities and Constraints
- Multi-step ABG analysis engine (pH, PaCO2, HCO3, Anion Gap, PaO2, FiO2, Na, Cl, K, Albumin).
- Automated compensation calculations (Winter's formula, Delta Ratio, Expected PaCO2/HCO3).
- Oxygenation status determination (PaO2/FiO2 ratio, A-a Gradient, Hypoxemia grading).
- ICU Drip Rate & Infusion Dose calculations (Vasoactive agents, Inotropes, Sedatives).
- Electrolyte & Fluid replacement calculators (Free Water Deficit, Sodium Correction, Potassium Deficit).
- Clinical Tutor mode with interactive case studies, practice questions, and physiological explanations.
- High-contrast clinical typography, zero-clutter visual hierarchy, WCAG AA compliance.

## Brand Commitments
- Style: Apple Medical Clean (SF Pro typography aesthetic, subtle translucency, clean white/slate canvas, precise clinical accents - Medical Blue, Clinical Cyan, Alert Rose, Vital Emerald).
- Zero AI visual slop: No gradient text, no side-tab accent stripes, no pulsing status dots, no auto-scrolling marquees, no harsh neon dark glows, no elastic bounce animations.

## Evidence on Hand
- Authoritative calculation routines in `abg-engine.js` and system state handlers in `app.js`.
- Existing HTML structure in `index.html` and stylesheet in `style.css`.

## Product Principles
1. Clinical Clarity First: Medical data must be unambiguous, legible at 1-meter distance, and hierarchically organized.
2. Apple Medical Precision: Crisp borders, subtle background elevations, deliberate typography scaling, and calm color palette.
3. Educational Rationale: Every calculation result provides step-by-step diagnostic reasoning for clinical learners.
4. Error-Proofed Input: Smart boundaries, instant validation, and clear feedback loops for clinical safety.

## Accessibility & Inclusion
- Full WCAG AA contrast ratio compliance (≥ 4.5:1 body, ≥ 3:1 large text).
- Accessible touch targets (≥ 44px min target size).
- Keyboard navigable form elements and clear semantic ARIA structure.
