/* ============================================================
   ICU Drip Rate Calculator — Application Logic
   Based on Standard ICU Drip Computation References
   ============================================================ */

// ── Drug Database ──
const DRUGS = {
  dopamine: {
    name: 'Dopamine',
    generic: 'Dopamine HCl',
    category: 'vasopressor',
    categoryLabel: 'Vasopressor',
    icon: '💉',
    formulation: '200 mg / 5 cc vial (40 mg/cc)',
    doseUnit: 'mcg/kg/min',
    weightBased: true,
    formulaType: 'weightPerMin',
    doseRange: { min: 1, max: 20 },
    doseRangeLabels: { low: 'Renal (1–5)', mid: 'Cardiac (5–10)', high: 'Pressor (>10)' },
    concentrations: {
      '250cc': [
        { label: 'Single', drugMg: 200, drugVol: 5, diluent: 245, totalVol: 250, concMcgPerCc: 800 },
        { label: 'Double', drugMg: 400, drugVol: 10, diluent: 240, totalVol: 250, concMcgPerCc: 1600 },
        { label: 'Triple', drugMg: 600, drugVol: 15, diluent: 235, totalVol: 250, concMcgPerCc: 2400 },
        { label: 'Quadro', drugMg: 800, drugVol: 20, diluent: 230, totalVol: 250, concMcgPerCc: 3200 },
        { label: 'Penta', drugMg: 1000, drugVol: 25, diluent: 225, totalVol: 250, concMcgPerCc: 4000 },
      ],
      '100cc': [
        { label: 'Single', drugMg: 80, drugVol: 2, diluent: 98, totalVol: 100, concMcgPerCc: 800 },
        { label: 'Double', drugMg: 160, drugVol: 4, diluent: 96, totalVol: 100, concMcgPerCc: 1600 },
        { label: 'Triple', drugMg: 240, drugVol: 6, diluent: 94, totalVol: 100, concMcgPerCc: 2400 },
        { label: 'Quadro', drugMg: 320, drugVol: 8, diluent: 92, totalVol: 100, concMcgPerCc: 3200 },
        { label: 'Penta', drugMg: 400, drugVol: 10, diluent: 90, totalVol: 100, concMcgPerCc: 4000 },
      ],
      '50cc': [
        { label: 'Single', drugMg: 40, drugVol: 1, diluent: 49, totalVol: 50, concMcgPerCc: 800 },
        { label: 'Double', drugMg: 80, drugVol: 2, diluent: 48, totalVol: 50, concMcgPerCc: 1600 },
        { label: 'Triple', drugMg: 120, drugVol: 3, diluent: 47, totalVol: 50, concMcgPerCc: 2400 },
        { label: 'Quadro', drugMg: 160, drugVol: 4, diluent: 46, totalVol: 50, concMcgPerCc: 3200 },
        { label: 'Penta', drugMg: 200, drugVol: 5, diluent: 45, totalVol: 50, concMcgPerCc: 4000 },
      ],
    },
    notes: 'Low dose (1–5 mcg/kg/min): renal vasodilation. Medium (5–10): increased cardiac output. High (>10): α-adrenergic vasoconstriction.',
  },

  dobutamine: {
    name: 'Dobutamine',
    generic: 'Dobutamine HCl',
    category: 'vasopressor',
    categoryLabel: 'Inotrope',
    icon: '💉',
    formulation: '250 mg / 20 cc vial or 50 mg / 5 cc amp',
    doseUnit: 'mcg/kg/min',
    weightBased: true,
    formulaType: 'weightPerMin',
    doseRange: { min: 2.5, max: 20 },
    concentrations: {
      '250cc': [
        { label: 'Single', drugMg: 250, drugVol: 20, diluent: 230, totalVol: 250, concMcgPerCc: 1000 },
        { label: 'Double', drugMg: 500, drugVol: 40, diluent: 210, totalVol: 250, concMcgPerCc: 2000 },
        { label: 'Triple', drugMg: 750, drugVol: 60, diluent: 190, totalVol: 250, concMcgPerCc: 3000 },
        { label: 'Quadro', drugMg: 1000, drugVol: 80, diluent: 170, totalVol: 250, concMcgPerCc: 4000 },
        { label: 'Penta', drugMg: 1250, drugVol: 100, diluent: 150, totalVol: 250, concMcgPerCc: 5000 },
      ],
      '100cc': [
        { label: 'Single', drugMg: 100, drugVol: 8, diluent: 92, totalVol: 100, concMcgPerCc: 1000 },
        { label: 'Double', drugMg: 200, drugVol: 16, diluent: 84, totalVol: 100, concMcgPerCc: 2000 },
        { label: 'Triple', drugMg: 300, drugVol: 24, diluent: 76, totalVol: 100, concMcgPerCc: 3000 },
        { label: 'Quadro', drugMg: 400, drugVol: 32, diluent: 68, totalVol: 100, concMcgPerCc: 4000 },
        { label: 'Penta', drugMg: 500, drugVol: 40, diluent: 60, totalVol: 100, concMcgPerCc: 5000 },
      ],
      '50cc': [
        { label: 'Single', drugMg: 50, drugVol: 4, diluent: 46, totalVol: 50, concMcgPerCc: 1000 },
        { label: 'Double', drugMg: 100, drugVol: 8, diluent: 42, totalVol: 50, concMcgPerCc: 2000 },
        { label: 'Triple', drugMg: 150, drugVol: 12, diluent: 38, totalVol: 50, concMcgPerCc: 3000 },
        { label: 'Quadro', drugMg: 200, drugVol: 16, diluent: 34, totalVol: 50, concMcgPerCc: 4000 },
        { label: 'Penta', drugMg: 250, drugVol: 20, diluent: 30, totalVol: 50, concMcgPerCc: 5000 },
      ],
    },
    notes: 'Primarily β1-agonist for inotropy. Typical range 2.5–20 mcg/kg/min.',
  },

  levophed: {
    name: 'Norepinephrine',
    generic: 'Norepinephrine Bitartrate',
    category: 'vasopressor',
    categoryLabel: 'Vasopressor',
    icon: '💉',
    formulation: '4 mg / 4 cc or 2 mg / 2 cc per ampule',
    doseUnit: 'mcg/kg/min',
    weightBased: true,
    formulaType: 'weightPerMin',
    doseRange: { min: 0.01, max: 3 },
    bolus: 'Syringe 1: Norepinephrine 2 mg + 48 cc PNSS → Syringe 2: 2 cc from S1 + 8 cc PNSS. Bolus conc: 0.0008 mg/cc.',
    concentrations: {
      '50cc': [
        { label: 'Single', drugMg: 4.0, drugVol: 4, diluent: 46, totalVol: 50, concMcgPerCc: 80, concNote: '4 mg (4 cc) + 46 cc PNSS (80 mcg/cc)' },
        { label: 'Double', drugMg: 8.0, drugVol: 8, diluent: 42, totalVol: 50, concMcgPerCc: 160, concNote: '8 mg (8 cc) + 42 cc PNSS (160 mcg/cc)' },
        { label: 'Triple', drugMg: 12.0, drugVol: 12, diluent: 38, totalVol: 50, concMcgPerCc: 240, concNote: '12 mg (12 cc) + 38 cc PNSS (240 mcg/cc)' },
        { label: 'Quadro', drugMg: 16.0, drugVol: 16, diluent: 34, totalVol: 50, concMcgPerCc: 320, concNote: '16 mg (16 cc) + 34 cc PNSS (320 mcg/cc)' },
        { label: 'Penta', drugMg: 20.0, drugVol: 20, diluent: 30, totalVol: 50, concMcgPerCc: 400, concNote: '20 mg (20 cc) + 30 cc PNSS (400 mcg/cc)' },
      ],
      '100cc': [
        { label: 'Single (4mg)', drugMg: 4.0, drugVol: 4, diluent: 96, totalVol: 100, concMcgPerCc: 40, concNote: '4 mg (4 cc) + 96 cc PNSS = 100 cc total (40 mcg/cc)' },
        { label: 'Single (8mg)', drugMg: 8.0, drugVol: 8, diluent: 92, totalVol: 100, concMcgPerCc: 80, concNote: '8 mg (8 cc) + 92 cc PNSS = 100 cc total (80 mcg/cc)' },
        { label: 'Double (16mg)', drugMg: 16.0, drugVol: 16, diluent: 84, totalVol: 100, concMcgPerCc: 160, concNote: '16 mg (16 cc) + 84 cc PNSS = 100 cc total (160 mcg/cc)' },
        { label: 'Triple (24mg)', drugMg: 24.0, drugVol: 24, diluent: 76, totalVol: 100, concMcgPerCc: 240, concNote: '24 mg (24 cc) + 76 cc PNSS = 100 cc total (240 mcg/cc)' },
        { label: 'Quadro (32mg)', drugMg: 32.0, drugVol: 32, diluent: 68, totalVol: 100, concMcgPerCc: 320, concNote: '32 mg (32 cc) + 68 cc PNSS = 100 cc total (320 mcg/cc)' },
        { label: 'Penta (40mg)', drugMg: 40.0, drugVol: 40, diluent: 60, totalVol: 100, concMcgPerCc: 400, concNote: '40 mg (40 cc) + 60 cc PNSS = 100 cc total (400 mcg/cc)' },
      ],
      '250cc': [
        { label: 'Single (4mg)', drugMg: 4.0, drugVol: 4, diluent: 246, totalVol: 250, concMcgPerCc: 16, concNote: '4 mg (4 cc) + 246 cc IVF = 250 cc total (16 mcg/cc)' },
        { label: 'Single (20mg)', drugMg: 20.0, drugVol: 20, diluent: 230, totalVol: 250, concMcgPerCc: 80, concNote: '20 mg (20 cc) + 230 cc IVF = 250 cc total (80 mcg/cc)' },
        { label: 'Double (40mg)', drugMg: 40.0, drugVol: 40, diluent: 210, totalVol: 250, concMcgPerCc: 160, concNote: '40 mg (40 cc) + 210 cc IVF = 250 cc total (160 mcg/cc)' },
        { label: 'Triple (60mg)', drugMg: 60.0, drugVol: 60, diluent: 190, totalVol: 250, concMcgPerCc: 240, concNote: '60 mg (60 cc) + 190 cc IVF = 250 cc total (240 mcg/cc)' },
        { label: 'Quadro (80mg)', drugMg: 80.0, drugVol: 80, diluent: 170, totalVol: 250, concMcgPerCc: 320, concNote: '80 mg (80 cc) + 170 cc IVF = 250 cc total (320 mcg/cc)' },
        { label: 'Penta (100mg)', drugMg: 100.0, drugVol: 100, diluent: 150, totalVol: 250, concMcgPerCc: 400, concNote: '100 mg (100 cc) + 150 cc IVF = 250 cc total (400 mcg/cc)' },
      ],
    },
    notes: 'First-line vasopressor in septic shock. Dose range 0.01–3 mcg/kg/min.',
  },

  epinephrine: {
    name: 'Epinephrine',
    generic: 'Epinephrine HCl',
    category: 'vasopressor',
    categoryLabel: 'Vasopressor',
    icon: '💉',
    formulation: '1 mg in 1 cc ampule',
    doseUnit: 'mcg/kg/min',
    weightBased: true,
    formulaType: 'weightPerMin',
    doseRange: { min: 0.1, max: 0.9 },
    bolus: 'Bolus: 1 amp = 1,000 units.\nSyringe 1: 1 amp + 10 cc PNSS (1:10,000)\nSyringe 2: 1 cc from S1 + 10 cc PNSS (1:100,000)\nSyringe 3: 5 cc from S2 + 5 cc PNSS (1:200,000)',
    concentrations: {
      '250cc': [
        { label: 'Single', drugMg: 5, drugVol: 5, diluent: 245, totalVol: 250, concMcgPerCc: 20 },
        { label: 'Double', drugMg: 10, drugVol: 10, diluent: 240, totalVol: 250, concMcgPerCc: 40 },
        { label: 'Triple', drugMg: 15, drugVol: 15, diluent: 235, totalVol: 250, concMcgPerCc: 60 },
        { label: 'Quadro', drugMg: 20, drugVol: 20, diluent: 230, totalVol: 250, concMcgPerCc: 80 },
        { label: 'Penta', drugMg: 25, drugVol: 25, diluent: 225, totalVol: 250, concMcgPerCc: 100 },
      ],
      '100cc': [
        { label: 'Single', drugMg: 2, drugVol: 2, diluent: 98, totalVol: 100, concMcgPerCc: 20 },
        { label: 'Double', drugMg: 4, drugVol: 4, diluent: 96, totalVol: 100, concMcgPerCc: 40 },
        { label: 'Triple', drugMg: 6, drugVol: 6, diluent: 94, totalVol: 100, concMcgPerCc: 60 },
        { label: 'Quadro', drugMg: 8, drugVol: 8, diluent: 92, totalVol: 100, concMcgPerCc: 80 },
        { label: 'Penta', drugMg: 10, drugVol: 10, diluent: 90, totalVol: 100, concMcgPerCc: 100 },
      ],
      '50cc': [
        { label: 'Single', drugMg: 1, drugVol: 1, diluent: 49, totalVol: 50, concMcgPerCc: 20 },
        { label: 'Double', drugMg: 2, drugVol: 2, diluent: 48, totalVol: 50, concMcgPerCc: 40 },
        { label: 'Triple', drugMg: 3, drugVol: 3, diluent: 47, totalVol: 50, concMcgPerCc: 60 },
        { label: 'Quadro', drugMg: 4, drugVol: 4, diluent: 46, totalVol: 50, concMcgPerCc: 80 },
        { label: 'Penta', drugMg: 5, drugVol: 5, diluent: 45, totalVol: 50, concMcgPerCc: 100 },
      ],
    },
    notes: 'Maintenance infusion: 0.1–0.9 mcg/kg/min. Both α and β agonist.',
  },

  vasopressin: {
    name: 'Vasopressin',
    generic: 'Argipressin / Antidiuretic Hormone',
    category: 'vasopressor',
    categoryLabel: 'Vasopressor',
    icon: '💉',
    formulation: '20 units / 1 mL vial',
    doseUnit: 'units/min',
    weightBased: false,
    formulaType: 'unitsPerMin',
    doseRange: { min: 0.01, max: 0.06 },
    concentrations: {
      '100cc': [
        { label: 'Standard (20u/100mL)', drugUnits: 20, drugVol: 1, diluent: 99, totalVol: 100, concUnitsPerCc: 0.2, concNote: '20 units (1 mL of 20 u/mL vial) + 99 mL diluent = 100 mL (0.2 units/mL)' },
        { label: 'Fluid-Restricted (40u/100mL)', drugUnits: 40, drugVol: 2, diluent: 98, totalVol: 100, concUnitsPerCc: 0.4, concNote: '40 units (2 mL of 20 u/mL vial) + 98 mL diluent = 100 mL (0.4 units/mL)' },
      ],
    },
    notes: 'Non-adrenergic, non-weight-based second-line vasopressor for septic/vasodilatory shock. Usually run as a fixed dose (standard 0.03 units/min), not continually titrated. Give via central line only (vesicant — extravasation risk). Monitor MAP, digit/skin perfusion, urine output, and serum sodium (hyponatremia risk from V2-receptor water retention).',
  },

  isoket: {
    name: 'Isosorbide Dinitrate',
    generic: 'Isosorbide Dinitrate',
    category: 'vasodilator',
    categoryLabel: 'Vasodilator',
    icon: '🫀',
    formulation: '10 mg / 10 cc amp',
    doseUnit: 'mg/hr',
    weightBased: false,
    formulaType: 'dosePerHour',
    doseRange: { min: 1, max: 10 },
    concentrations: {
      '100cc': [
        { label: 'Single', drugMg: 10, drugVol: 10, diluent: 90, totalVol: 100, concMgPerCc: 0.1 },
        { label: 'Double', drugMg: 20, drugVol: 20, diluent: 80, totalVol: 100, concMgPerCc: 0.2 },
        { label: 'Triple', drugMg: 30, drugVol: 30, diluent: 70, totalVol: 100, concMgPerCc: 0.3 },
        { label: 'Quadro', drugMg: 40, drugVol: 40, diluent: 60, totalVol: 100, concMgPerCc: 0.4 },
        { label: 'Penta', drugMg: 50, drugVol: 50, diluent: 50, totalVol: 100, concMgPerCc: 0.5 },
      ],
      '50cc': [
        { label: 'Single', drugMg: 5, drugVol: 5, diluent: 45, totalVol: 50, concMgPerCc: 0.1 },
        { label: 'Double', drugMg: 10, drugVol: 10, diluent: 40, totalVol: 50, concMgPerCc: 0.2 },
        { label: 'Triple', drugMg: 15, drugVol: 15, diluent: 35, totalVol: 50, concMgPerCc: 0.3 },
        { label: 'Quadro', drugMg: 20, drugVol: 20, diluent: 30, totalVol: 50, concMgPerCc: 0.4 },
        { label: 'Penta', drugMg: 25, drugVol: 25, diluent: 25, totalVol: 50, concMgPerCc: 0.5 },
      ],
    },
    notes: 'Nitrate vasodilator for angina/heart failure.',
  },

  ntg: {
    name: 'Nitroglycerin',
    generic: 'Nitroglycerin',
    category: 'vasodilator',
    categoryLabel: 'Vasodilator',
    icon: '🫀',
    formulation: '10 mg / 10 cc amp',
    doseUnit: 'mg/hr',
    weightBased: false,
    formulaType: 'dosePerHour',
    doseRange: { min: 0.5, max: 10 },
    bolus: 'Bolus: 0.1 mg/cc IV push (1 mg + 9 cc PNSS)',
    concentrations: {
      '250cc': [
        { label: 'Single', drugMg: 25, drugVol: 25, diluent: 225, totalVol: 250, concMgPerCc: 0.1 },
        { label: 'Double', drugMg: 50, drugVol: 50, diluent: 200, totalVol: 250, concMgPerCc: 0.2 },
        { label: 'Triple', drugMg: 75, drugVol: 75, diluent: 175, totalVol: 250, concMgPerCc: 0.3 },
        { label: 'Quadro', drugMg: 100, drugVol: 100, diluent: 150, totalVol: 250, concMgPerCc: 0.4 },
        { label: 'Penta', drugMg: 125, drugVol: 125, diluent: 125, totalVol: 250, concMgPerCc: 0.5 },
      ],
      '100cc': [
        { label: 'Single', drugMg: 10, drugVol: 10, diluent: 90, totalVol: 100, concMgPerCc: 0.1 },
        { label: 'Double', drugMg: 20, drugVol: 20, diluent: 80, totalVol: 100, concMgPerCc: 0.2 },
        { label: 'Triple', drugMg: 30, drugVol: 30, diluent: 70, totalVol: 100, concMgPerCc: 0.3 },
        { label: 'Quadro', drugMg: 40, drugVol: 40, diluent: 60, totalVol: 100, concMgPerCc: 0.4 },
        { label: 'Penta', drugMg: 50, drugVol: 50, diluent: 50, totalVol: 100, concMgPerCc: 0.5 },
      ],
      '50cc': [
        { label: 'Single', drugMg: 5, drugVol: 5, diluent: 45, totalVol: 50, concMgPerCc: 0.1 },
        { label: 'Double', drugMg: 10, drugVol: 10, diluent: 40, totalVol: 50, concMgPerCc: 0.2 },
        { label: 'Triple', drugMg: 15, drugVol: 15, diluent: 35, totalVol: 50, concMgPerCc: 0.3 },
        { label: 'Quadro', drugMg: 20, drugVol: 20, diluent: 30, totalVol: 50, concMgPerCc: 0.4 },
        { label: 'Penta', drugMg: 25, drugVol: 25, diluent: 25, totalVol: 50, concMgPerCc: 0.5 },
      ],
    },
    notes: 'Nitrate vasodilator. Use non-PVC tubing.',
  },

  nicardipine: {
    name: 'Nicardipine',
    generic: 'Nicardipine HCl',
    category: 'vasodilator',
    categoryLabel: 'Vasodilator',
    icon: '🫀',
    formulation: '10 mg / 10 cc or 2 mg / 2 cc ampule',
    doseUnit: 'mg/hr',
    weightBased: false,
    formulaType: 'dosePerHour',
    doseRange: { min: 1, max: 15 },
    concentrations: {
      '100cc': [
        { label: 'Single', drugMg: 10, drugVol: 10, diluent: 90, totalVol: 100, concMgPerCc: 0.1 },
        { label: 'Double', drugMg: 20, drugVol: 20, diluent: 80, totalVol: 100, concMgPerCc: 0.2 },
        { label: 'Triple', drugMg: 30, drugVol: 30, diluent: 70, totalVol: 100, concMgPerCc: 0.3 },
        { label: 'Quadro', drugMg: 40, drugVol: 40, diluent: 60, totalVol: 100, concMgPerCc: 0.4 },
        { label: 'Penta', drugMg: 50, drugVol: 50, diluent: 50, totalVol: 100, concMgPerCc: 0.5 },
      ],
      '50cc': [
        { label: 'Single', drugMg: 5, drugVol: 5, diluent: 45, totalVol: 50, concMgPerCc: 0.1 },
        { label: 'Double', drugMg: 10, drugVol: 10, diluent: 40, totalVol: 50, concMgPerCc: 0.2 },
        { label: 'Triple', drugMg: 15, drugVol: 15, diluent: 35, totalVol: 50, concMgPerCc: 0.3 },
        { label: 'Quadro', drugMg: 20, drugVol: 20, diluent: 30, totalVol: 50, concMgPerCc: 0.4 },
        { label: 'Penta', drugMg: 25, drugVol: 25, diluent: 25, totalVol: 50, concMgPerCc: 0.5 },
      ],
    },
    notes: 'Calcium channel blocker for hypertensive emergencies. Typical 5–15 mg/hr.',
  },

  cordarone: {
    name: 'Amiodarone',
    generic: 'Amiodarone HCl',
    category: 'antiarrhythmic',
    categoryLabel: 'Antiarrhythmic',
    icon: '⚡',
    formulation: '150 mg / 3 cc per ampule',
    doseUnit: 'mg/hr',
    weightBased: false,
    formulaType: 'dosePerHour',
    doseRange: { min: 0.5, max: 50 },
    bolus: 'IVTT bolus: 150 mg slow IV push',
    concentrations: {
      '250cc': [
        { label: 'Standard', drugMg: 600, drugVol: 12, diluent: 238, totalVol: 250, concMgPerCc: 2.4, concMcgPerCc: 2400, concNote: '600 mg + D5W 238 cc, run over 24 hrs (25 mg/hr)' },
        { label: 'High', drugMg: 1000, drugVol: 20, diluent: 230, totalVol: 250, concMgPerCc: 4.0, concMcgPerCc: 4000 },
        { label: 'Double', drugMg: 2000, drugVol: 40, diluent: 210, totalVol: 250, concMgPerCc: 8.0, concMcgPerCc: 8000 },
      ],
      '100cc': [
        { label: 'Standard', drugMg: 400, drugVol: 8, diluent: 92, totalVol: 100, concMgPerCc: 4.0, concMcgPerCc: 4000 },
        { label: 'Double', drugMg: 800, drugVol: 16, diluent: 84, totalVol: 100, concMgPerCc: 8.0, concMcgPerCc: 8000 },
      ],
      '50cc': [
        { label: 'Standard', drugMg: 200, drugVol: 4, diluent: 46, totalVol: 50, concMgPerCc: 4.0, concMcgPerCc: 4000 },
        { label: 'Double', drugMg: 400, drugVol: 8, diluent: 42, totalVol: 50, concMgPerCc: 8.0, concMcgPerCc: 8000 },
      ],
    },
    notes: 'Standard protocol: 150 mg bolus → 1 mg/min × 6 hrs → 0.5 mg/min × 18 hrs.',
  },

  esmolol: {
    name: 'Esmolol',
    generic: 'Esmolol HCl',
    category: 'antiarrhythmic',
    categoryLabel: 'Antiarrhythmic',
    icon: '⚡',
    formulation: '100 mg / 10 ml per ampule',
    doseUnit: 'mcg/kg/min',
    weightBased: true,
    formulaType: 'weightPerMin',
    doseRange: { min: 25, max: 200 },
    bolus: 'IV loading dose: 0.5 mg/kg over 1 min. Starting maintenance: 50 mcg/kg/min.',
    concentrations: {
      '80cc': [
        { label: 'Standard', drugMg: 600, drugVol: 60, diluent: 20, totalVol: 80, concMcgPerCc: 7500, concNote: 'D5W 20 cc + 6 amps' },
      ],
    },
    notes: 'Ultra-short-acting β-blocker. Loading 0.5 mg/kg, maintenance 25–200 mcg/kg/min.',
  },

  precedex: {
    name: 'Dexmedetomidine',
    generic: 'Dexmedetomidine HCl',
    category: 'sedative',
    categoryLabel: 'Sedative',
    icon: '😴',
    formulation: '100 mcg / ml (2 cc)',
    doseUnit: 'mcg/kg/hr',
    weightBased: true,
    formulaType: 'weightPerHour',
    doseRange: { min: 0.1, max: 0.8 },
    concentrations: {
      '100cc': [
        { label: 'Standard', drugMg: 0.2, drugVol: 2, diluent: 98, totalVol: 100, concMcgPerCc: 2, concNote: '200 mcg in 100 cc PNSS (Soluset)' },
        { label: 'Double', drugMg: 0.4, drugVol: 4, diluent: 96, totalVol: 100, concMcgPerCc: 4, concNote: '400 mcg in 100 cc PNSS (Soluset)' },
      ],
      '50cc': [
        { label: 'Standard', drugMg: 0.2, drugVol: 2, diluent: 48, totalVol: 50, concMcgPerCc: 4, concNote: '200 mcg in 50 cc PNSS' },
      ],
    },
    notes: 'α2-agonist sedative. Dose: 0.1–0.8 mcg/kg/hr. No respiratory depression at standard doses.',
  },

  heparin: {
    name: 'Heparin',
    generic: 'Unfractionated Heparin',
    category: 'anticoagulant',
    categoryLabel: 'Anticoagulant',
    icon: '🩸',
    formulation: '1000 IU/ml or 5000 IU/ml',
    doseUnit: 'units/hr',
    weightBased: false,
    formulaType: 'heparin',
    doseRange: { min: 500, max: 2500 },
    bolus: 'Loading dose: 3,000–5,000 IU slow IV push',
    concentrations: {
      '250cc': [
        { label: 'Standard', drugUnits: 10000, totalVol: 250, concUnitsPerCc: 40, concNote: '10,000 IU in D5W 250 cc' },
        { label: 'Double', drugUnits: 20000, totalVol: 250, concUnitsPerCc: 80, concNote: '20,000 IU in D5W 250 cc' },
        { label: 'High', drugUnits: 25000, totalVol: 250, concUnitsPerCc: 100, concNote: '25,000 IU in D5W 250 cc' },
      ],
      '100cc': [
        { label: 'Standard', drugUnits: 4000, totalVol: 100, concUnitsPerCc: 40, concNote: '4,000 IU in D5W 100 cc (Soluset)' },
        { label: 'Double', drugUnits: 8000, totalVol: 100, concUnitsPerCc: 80, concNote: '8,000 IU in D5W 100 cc (Soluset)' },
        { label: 'High', drugUnits: 10000, totalVol: 100, concUnitsPerCc: 100, concNote: '10,000 IU in D5W 100 cc (Soluset)' },
      ],
    },
    weightBasedOption: true,
    notes: 'Can dose as units/hr or units/kg/hr (typically 18 units/kg/hr). Monitor aPTT.',
  },

  streptokinase: {
    name: 'Streptokinase',
    generic: 'Streptokinase',
    category: 'thrombolytic',
    categoryLabel: 'Thrombolytic',
    icon: '🫁',
    formulation: '1,500,000 IU per vial',
    doseUnit: 'protocol',
    weightBased: false,
    formulaType: 'protocol',
    protocols: [
      { name: 'Acute MI', dose: '1,500,000 IU', diluent: 'PNSS 100 cc', duration: '30–60 min' },
      { name: 'Intracoronary', dose: '250,000–500,000 IU', diluent: 'PNSS 100 cc', duration: '30–60 min' },
      { name: 'Acute DVT / PE / Arterial Occlusion', dose: '250,000 IU', diluent: 'PNSS 100 cc', duration: '30 min' },
      { name: 'Maintenance', dose: '1,200,000 IU', diluent: 'PNSS 500 cc', duration: '100,000 IU/hr × 12 hr/day × 3 days' },
    ],
    notes: 'Thrombolytic agent. Monitor for bleeding. Contraindicated with recent surgery.',
  },

  magnesium: {
    name: 'MgSO₄',
    generic: 'Magnesium Sulfate',
    category: 'electrolyte',
    categoryLabel: 'Electrolyte',
    icon: '⚗️',
    formulation: '2500 mg / 10 cc amp or 5000 mg / 20 cc polyamp',
    doseUnit: 'mg/hr',
    weightBased: false,
    formulaType: 'dosePerHour',
    doseRange: { min: 500, max: 3000 },
    concentrations: {
      '250cc': [
        { label: 'Single', drugMg: 1000, drugVol: 4, diluent: 246, totalVol: 250, concMgPerCc: 4 },
        { label: 'Double', drugMg: 2000, drugVol: 8, diluent: 242, totalVol: 250, concMgPerCc: 8 },
        { label: 'Triple', drugMg: 3000, drugVol: 12, diluent: 238, totalVol: 250, concMgPerCc: 12 },
        { label: 'Quadro', drugMg: 4000, drugVol: 16, diluent: 234, totalVol: 250, concMgPerCc: 16 },
        { label: 'Penta', drugMg: 5000, drugVol: 20, diluent: 230, totalVol: 250, concMgPerCc: 20 },
      ],
      '100cc': [
        { label: 'Single', drugMg: 400, drugVol: 1.6, diluent: 98.4, totalVol: 100, concMgPerCc: 4 },
        { label: 'Double', drugMg: 800, drugVol: 3.2, diluent: 96.8, totalVol: 100, concMgPerCc: 8 },
        { label: 'Triple', drugMg: 1200, drugVol: 4.8, diluent: 95.2, totalVol: 100, concMgPerCc: 12 },
        { label: 'Quadro', drugMg: 1600, drugVol: 6.4, diluent: 93.6, totalVol: 100, concMgPerCc: 16 },
        { label: 'Penta', drugMg: 2000, drugVol: 8, diluent: 92, totalVol: 100, concMgPerCc: 20 },
      ],
      '50cc': [
        { label: 'Single', drugMg: 200, drugVol: 0.8, diluent: 49.2, totalVol: 50, concMgPerCc: 4 },
        { label: 'Double', drugMg: 400, drugVol: 1.6, diluent: 48.4, totalVol: 50, concMgPerCc: 8 },
        { label: 'Triple', drugMg: 600, drugVol: 2.4, diluent: 47.6, totalVol: 50, concMgPerCc: 12 },
        { label: 'Quadro', drugMg: 800, drugVol: 3.2, diluent: 46.8, totalVol: 50, concMgPerCc: 16 },
        { label: 'Penta', drugMg: 1000, drugVol: 4, diluent: 46, totalVol: 50, concMgPerCc: 20 },
      ],
    },
    notes: 'Can also be given slow IVTT bolus with 1:1 dilution. Monitor for respiratory depression.',
  },

  potassium: {
    name: 'K⁺ Replacement',
    generic: 'Potassium Chloride (KCL)',
    category: 'electrolyte',
    categoryLabel: 'Electrolyte',
    icon: '⚗️',
    formulation: 'KCL stock: 40 mEq / 20 cc',
    doseUnit: 'mEq',
    weightBased: true,
    formulaType: 'electrolyteDeficit',
    normalValue: 4.0,
    adultFactor: 0.3,
    pedsFactor: 0.6,
    stockConc: 40, // mEq per vial
    stockVol: 20,  // cc per vial
    notes: 'K⁺ deficit: Adult = (4 – pt value) × kg × 0.3; Pedia = (4 – pt value) × kg × 0.6. Max IV rate: 10–20 mEq/hr via central line.',
  },

  sodium: {
    name: 'Na⁺ Replacement',
    generic: 'Sodium Chloride',
    category: 'electrolyte',
    categoryLabel: 'Electrolyte',
    icon: '⚗️',
    formulation: 'Hypertonic saline',
    doseUnit: 'mEq',
    weightBased: true,
    formulaType: 'electrolyteDeficitNa',
    normalValue: 140,
    adultFactor: 0.3,
    pedsFactor: 0.6,
    notes: 'Na⁺ deficit = (normal – pt value) × kg × factor. Maintenance = kg × 2 mEq. Total = deficit + maintenance.',
  },

  bicarb: {
    name: 'NaHCO₃',
    generic: 'Sodium Bicarbonate',
    category: 'electrolyte',
    categoryLabel: 'Electrolyte',
    icon: '⚗️',
    formulation: 'Sodium Bicarbonate amp',
    doseUnit: 'mEq',
    weightBased: true,
    formulaType: 'bicarbDeficit',
    notes: 'Full correction = base deficit × kg × 0.3. Half correction = base deficit × kg × 0.3 ÷ 2.',
  },

  lidocaine: {
    name: 'Lidocaine',
    generic: 'Lidocaine HCl',
    category: 'antiarrhythmic',
    categoryLabel: 'Antiarrhythmic',
    icon: '⚡',
    formulation: '1000 mg / 50 cc vial or 100 mg / 5 cc respule',
    doseUnit: 'mg/min',
    weightBased: false,
    formulaType: 'dosePerMin',
    doseRange: { min: 1, max: 4 },
    concentrations: {
      '250cc': [
        { label: 'Standard', drugMg: 1000, drugVol: 50, diluent: 200, totalVol: 250, concMgPerCc: 4 },
        { label: 'Double', drugMg: 2000, drugVol: 100, diluent: 150, totalVol: 250, concMgPerCc: 8 },
      ],
      '100cc': [
        { label: 'Standard', drugMg: 400, drugVol: 20, diluent: 80, totalVol: 100, concMgPerCc: 4 },
        { label: 'Double', drugMg: 800, drugVol: 40, diluent: 60, totalVol: 100, concMgPerCc: 8 },
      ],
    },
    notes: 'Antiarrhythmic for ventricular arrhythmias. Loading 1–1.5 mg/kg, maintenance 1–4 mg/min.',
  },

  customDrip: {
    name: 'Custom Drip Calculator',
    generic: 'Universal / Any Drug Drip Rate',
    category: 'other',
    categoryLabel: 'Calculator',
    icon: '🧮',
    formulation: 'Custom Concentration & Dilution',
    doseUnit: 'custom',
    weightBased: true,
    formulaType: 'customDrip',
    notes: 'Use this universal calculator for any custom drug dose, weight, or container volume not in preset tables.',
  },

  tabletCalc: {
    name: 'Tablet Calculation',
    generic: 'Required Quantity = Prescribed / Available',
    category: 'basic_calc',
    categoryLabel: 'Basic Formula',
    icon: '💊',
    formulation: 'Tablets / Capsules',
    doseUnit: 'Tablets',
    weightBased: false,
    formulaType: 'tabletCalc',
    notes: 'Formula: Prescribed Dose ÷ Available Dose per Tablet. Example: 500 mg prescribed ÷ 250 mg available = 2 Tablets.',
    example: { prescribed: 500, available: 250 }
  },

  liquidCalc: {
    name: 'Liquid Calculation',
    generic: 'Required Vol = (Prescribed / Available) × Vol Available',
    category: 'basic_calc',
    categoryLabel: 'Basic Formula',
    icon: '🧪',
    formulation: 'Oral Liquid / Suspension',
    doseUnit: 'mL',
    weightBased: false,
    formulaType: 'liquidCalc',
    notes: 'Formula: (Prescribed Dose ÷ Available Dose) × Available Volume. Example: (250 mg ÷ 125 mg) × 5 mL = 10 mL.',
    example: { prescribed: 250, available: 125, availVol: 5 }
  },

  injectionCalc: {
    name: 'Injection Calculation',
    generic: 'Required Vol = (Prescribed / Available) × Diluent Vol',
    category: 'basic_calc',
    categoryLabel: 'Basic Formula',
    icon: '💉',
    formulation: 'IV / IM Vial Dosing',
    doseUnit: 'mL',
    weightBased: false,
    formulaType: 'injectionCalc',
    notes: 'Formula: (Prescribed Dose ÷ Available Vial Dose) × Available Diluent Volume. Example: (500 mg ÷ 1000 mg) × 10 mL = 5 mL.',
    example: { prescribed: 500, available: 1000, availVol: 10 }
  },

  ivFlowRate: {
    name: 'IV Flow Rate (mL/hr)',
    generic: 'Flow Rate = Total Volume (mL) ÷ Time (hours)',
    category: 'basic_calc',
    categoryLabel: 'Basic Formula',
    icon: '💧',
    formulation: 'Volumetric Pump Rate',
    doseUnit: 'mL/hr',
    weightBased: false,
    formulaType: 'ivFlowRateCalc',
    notes: 'Formula: Total Volume (mL) ÷ Time (hours). Example: 1000 mL over 8 hours = 125 mL/hr.',
    example: { volume: 1000, hours: 8 }
  },

  dropRate: {
    name: 'Drops Per Minute (gtt/min)',
    generic: 'Drop Rate = (Volume × Drop Factor) ÷ Time (min)',
    category: 'basic_calc',
    categoryLabel: 'Basic Formula',
    icon: '⏱️',
    formulation: 'Gravity IV Infusion',
    doseUnit: 'gtt/min',
    weightBased: false,
    formulaType: 'dropRateCalc',
    notes: 'Formula: (Total Volume in mL × Drop Factor) ÷ Time in minutes. Example: (500 mL × 20 gtt/mL) ÷ 240 min = 42 gtt/min.',
    example: { volume: 500, hours: 4, dropFactor: 20 }
  },

  weightDoseBasic: {
    name: 'Weight-Based Dosing',
    generic: 'Required Dose = Dose/kg × Patient Weight',
    category: 'basic_calc',
    categoryLabel: 'Basic Formula',
    icon: '⚖️',
    formulation: 'Single / Daily Weight-based Dose',
    doseUnit: 'mg',
    weightBased: true,
    formulaType: 'weightDoseCalc',
    notes: 'Formula: Dose per kg × Patient Weight (kg). Example: 15 mg/kg × 20 kg = 300 mg.',
    example: { dosePerKg: 15, weight: 20 }
  },
};

// ── Category Config ──
const CATEGORIES = [
  { key: 'all', label: 'All Drugs', icon: '💊' },
  { key: 'basic_calc', label: 'Basic Formulas', icon: '📝' },
  { key: 'other', label: 'Custom Calc', icon: '🧮' },
  { key: 'vasopressor', label: 'Vasopressors', icon: '💉' },
  { key: 'vasodilator', label: 'Vasodilators', icon: '🫀' },
  { key: 'antiarrhythmic', label: 'Antiarrhythmics', icon: '⚡' },
  { key: 'sedative', label: 'Sedatives', icon: '😴' },
  { key: 'anticoagulant', label: 'Anticoagulants', icon: '🩸' },
  { key: 'thrombolytic', label: 'Thrombolytics', icon: '🫁' },
  { key: 'electrolyte', label: 'Electrolytes', icon: '⚗️' },
];

// ── State ──
const state = {
  selectedDrug: null,
  selectedCategory: 'all',
  searchQuery: '',
  calcMode: 'doseToRate', // or 'rateToDose'
  selectedVolume: '250cc', // default IVF volume key
  selectedConc: 0,        // index into concentration array
  weight: '',
  dose: '',
  rate: '',
  heparinMode: 'unitsPerHr', // or 'unitsPerKgPerHr'
  patientType: 'adult',      // or 'pedia'
  labValue: '',
  baseDeficit: '',
  basicUnits: {
    prescribed: 'mg',
    available: 'mg',
    dosePerKg: 'mg',
    totalGiven: 'mg'
  },
};

// ── Utility Functions ──
function formatNumber(n, decimals = 2) {
  if (n === null || n === undefined || isNaN(n)) return '—';
  if (Number.isInteger(n) && decimals <= 2) return n.toString();
  return parseFloat(n.toFixed(decimals)).toString();
}

function getConcentration(drug, volKey, concIndex) {
  const volKeys = Object.keys(drug.concentrations);
  const vk = volKey || volKeys[0];
  const concs = drug.concentrations[vk];
  if (!concs || !concs[concIndex]) return null;
  return concs[concIndex];
}

function getAvailableVolumes(drug) {
  if (!drug || !drug.concentrations) return [];
  return Object.keys(drug.concentrations);
}

// ── Calculation Engine ──
function calculateDoseToRate(drug, dose, weight, concentration) {
  if (!dose || !concentration) return null;

  switch (drug.formulaType) {
    case 'weightPerMin': {
      // FR (cc/hr) = dose(mcg/kg/min) × wt × 60 / concentration(mcg/cc)
      if (!weight) return null;
      const conc = concentration.concMcgPerCc;
      const rate = (dose * weight * 60) / conc;
      return { rate, unit: 'cc/hr', conc, concUnit: 'mcg/cc' };
    }
    case 'weightPerHour': {
      // FR (cc/hr) = dose(mcg/kg/hr) × wt / concentration(mcg/cc)
      if (!weight) return null;
      const conc = concentration.concMcgPerCc;
      const rate = (dose * weight) / conc;
      return { rate, unit: 'cc/hr', conc, concUnit: 'mcg/cc' };
    }
    case 'dosePerHour': {
      // FR (cc/hr) = dose(mg/hr) / concentration(mg/cc)
      const conc = concentration.concMgPerCc || (concentration.concMcgPerCc ? concentration.concMcgPerCc / 1000 : null);
      if (!conc) return null;
      const rate = dose / conc;
      return { rate, unit: 'cc/hr', conc, concUnit: 'mg/cc' };
    }
    case 'dosePerMin': {
      // FR (cc/hr) = dose(mg/min) × 60 / concentration(mg/cc)
      const conc = concentration.concMgPerCc || (concentration.concMcgPerCc ? concentration.concMcgPerCc / 1000 : null);
      if (!conc) return null;
      const rate = (dose * 60) / conc;
      return { rate, unit: 'cc/hr', conc, concUnit: 'mg/cc' };
    }
    case 'heparin': {
      const conc = concentration.concUnitsPerCc;
      let rate;
      if (state.heparinMode === 'unitsPerKgPerHr') {
        if (!weight) return null;
        rate = (dose * weight) / conc;
      } else {
        rate = dose / conc;
      }
      return { rate, unit: 'cc/hr', conc, concUnit: 'units/cc' };
    }
    case 'unitsPerMin': {
      // FR (cc/hr) = dose(units/min) × 60 / concentration(units/cc)
      const conc = concentration.concUnitsPerCc;
      if (!conc) return null;
      const rate = (dose * 60) / conc;
      return { rate, unit: 'cc/hr', conc, concUnit: 'units/cc' };
    }
    default:
      return null;
  }
}

function calculateRateToDose(drug, rate, weight, concentration) {
  if (!rate || !concentration) return null;

  switch (drug.formulaType) {
    case 'weightPerMin': {
      if (!weight) return null;
      const conc = concentration.concMcgPerCc;
      const dose = (rate * conc) / (weight * 60);
      return { dose, unit: drug.doseUnit, conc, concUnit: 'mcg/cc' };
    }
    case 'weightPerHour': {
      if (!weight) return null;
      const conc = concentration.concMcgPerCc;
      const dose = (rate * conc) / weight;
      return { dose, unit: drug.doseUnit, conc, concUnit: 'mcg/cc' };
    }
    case 'dosePerHour': {
      const conc = concentration.concMgPerCc || (concentration.concMcgPerCc ? concentration.concMcgPerCc / 1000 : null);
      if (!conc) return null;
      const dose = rate * conc;
      return { dose, unit: drug.doseUnit, conc, concUnit: 'mg/cc' };
    }
    case 'dosePerMin': {
      const conc = concentration.concMgPerCc || (concentration.concMcgPerCc ? concentration.concMcgPerCc / 1000 : null);
      if (!conc) return null;
      const dose = (rate * conc) / 60;
      return { dose, unit: drug.doseUnit, conc, concUnit: 'mg/cc' };
    }
    case 'heparin': {
      const conc = concentration.concUnitsPerCc;
      let dose;
      if (state.heparinMode === 'unitsPerKgPerHr') {
        if (!weight) return null;
        dose = (rate * conc) / weight;
      } else {
        dose = rate * conc;
      }
      return { dose, unit: state.heparinMode === 'unitsPerKgPerHr' ? 'units/kg/hr' : 'units/hr', conc, concUnit: 'units/cc' };
    }
    case 'unitsPerMin': {
      const conc = concentration.concUnitsPerCc;
      if (!conc) return null;
      const dose = (rate * conc) / 60;
      return { dose, unit: drug.doseUnit, conc, concUnit: 'units/cc' };
    }
    default:
      return null;
  }
}

function calculateElectrolyteDeficit(drug, labValue, weight, patientType) {
  if (!labValue || !weight || labValue === '' || weight === '') return null;

  const factor = patientType === 'pedia' ? drug.pedsFactor : drug.adultFactor;
  const deficit = (drug.normalValue - parseFloat(labValue)) * parseFloat(weight) * factor;

  if (drug.formulaType === 'electrolyteDeficit') {
    // K+ replacement
    const stockCc = (deficit / drug.stockConc) * drug.stockVol;
    return {
      deficit: Math.max(0, deficit),
      stockCc: Math.max(0, stockCc),
      unit: 'mEq',
    };
  }

  if (drug.formulaType === 'electrolyteDeficitNa') {
    // Na replacement
    const maintenance = parseFloat(weight) * 2;
    const total = Math.max(0, deficit) + maintenance;
    return {
      deficit: Math.max(0, deficit),
      maintenance,
      total,
      unit: 'mEq',
    };
  }

  return null;
}

function calculateBicarbDeficit(baseDeficit, weight) {
  if (!baseDeficit || !weight) return null;
  const bd = parseFloat(baseDeficit);
  const wt = parseFloat(weight);
  const full = bd * wt * 0.3;
  const half = full / 2;
  return { full, half, unit: 'mEq' };
}

function getDoseWarning(drug, dose) {
  if (!drug.doseRange || !dose) return null;
  const d = parseFloat(dose);
  if (isNaN(d)) return null;

  if (d < drug.doseRange.min) {
    return { type: 'info', message: `Below typical range (${drug.doseRange.min}–${drug.doseRange.max} ${drug.doseUnit})` };
  }
  if (d > drug.doseRange.max * 1.5) {
    return { type: 'danger', message: `⚠ Significantly exceeds max dose (${drug.doseRange.max} ${drug.doseUnit})!` };
  }
  if (d > drug.doseRange.max) {
    return { type: 'warning', message: `Exceeds typical max (${drug.doseRange.max} ${drug.doseUnit})` };
  }
  return { type: 'success', message: `Within range (${drug.doseRange.min}–${drug.doseRange.max} ${drug.doseUnit})` };
}

function getDoseRangePercent(drug, dose) {
  if (!drug.doseRange || !dose) return 0;
  const d = parseFloat(dose);
  if (isNaN(d)) return 0;
  const range = drug.doseRange.max - drug.doseRange.min;
  const pct = ((d - drug.doseRange.min) / range) * 100;
  return Math.min(100, Math.max(0, pct));
}

// ── UI Rendering ──
function renderDrugGrid() {
  const grid = document.getElementById('drugGrid');
  if (!grid) return;

  // Build grid items once if grid is empty
  const cardElements = grid.querySelectorAll('.drug-card');
  if (cardElements.length === 0) {
    grid.innerHTML = Object.entries(DRUGS).map(([key, drug]) => `
      <div class="drug-card cat-${drug.category}" 
           data-drug="${key}" 
           data-category="${drug.category}" 
           data-search="${(drug.name + ' ' + drug.generic + ' ' + drug.categoryLabel).toLowerCase()}" 
           onclick="openCalculator('${key}')">
        <div class="drug-card-banner">
          <img src="assets/meds/${key}.png" alt="${drug.name}" class="drug-card-banner-img" loading="lazy" decoding="async" onerror="this.style.display='none';"/>
          <span class="drug-card-badge">${drug.categoryLabel}</span>
        </div>
        <div class="drug-card-body">
          <div class="drug-card-name">${drug.name}</div>
          <div class="drug-card-generic">${drug.generic}</div>
          <div class="drug-card-info">
            <div class="drug-card-tag">
              <span>📐</span> ${drug.doseUnit}
            </div>
            ${drug.weightBased ? '<div class="drug-card-tag"><span>⚖️</span> Weight-based</div>' : ''}
            ${drug.doseRange ? `<div class="drug-card-tag"><span>📊</span> ${drug.doseRange.min}–${drug.doseRange.max}</div>` : ''}
          </div>
        </div>
      </div>
    `).join('');
  }

  // Fast DOM visibility toggling (Instant performance)
  const q = (state.searchQuery || '').toLowerCase().trim();
  const selectedCat = state.selectedCategory || 'all';
  const cards = grid.querySelectorAll('.drug-card');
  let visibleCount = 0;

  cards.forEach(card => {
    const cat = card.getAttribute('data-category');
    const searchData = card.getAttribute('data-search') || '';
    const matchesCat = selectedCat === 'all' || cat === selectedCat;
    const matchesSearch = !q || searchData.includes(q);
    const visible = matchesCat && matchesSearch;

    card.style.display = visible ? '' : 'none';
    if (visible) visibleCount++;
  });

  // Toggle empty state notice
  let emptyStateEl = document.getElementById('drugGridEmptyState');
  if (visibleCount === 0) {
    if (!emptyStateEl) {
      emptyStateEl = document.createElement('div');
      emptyStateEl.id = 'drugGridEmptyState';
      emptyStateEl.className = 'empty-state';
      emptyStateEl.innerHTML = `
        <div class="empty-state-icon">🔍</div>
        <h3>No drugs found</h3>
        <p>Try adjusting your search or category filter</p>
      `;
      grid.appendChild(emptyStateEl);
    }
    emptyStateEl.style.display = 'block';
  } else if (emptyStateEl) {
    emptyStateEl.style.display = 'none';
  }
}

function renderCategoryPills() {
  const container = document.getElementById('categoryPills');
  container.innerHTML = CATEGORIES.map((cat, idx) => `
    <button class="category-pill ${state.selectedCategory === cat.key ? 'active' : ''}"
            style="animation-delay: ${idx * 45}ms"
            onclick="selectCategory('${cat.key}')">
      <span class="cat-pill-icon">${cat.icon}</span>
      <span class="cat-pill-label">${cat.label}</span>
    </button>
  `).join('');
}

function selectCategory(key) {
  state.selectedCategory = key;
  renderCategoryPills();
  renderDrugGrid();
}

// ── Calculator Panel ──
function openCalculator(drugKey) {
  const drug = DRUGS[drugKey];
  if (!drug) return;

  showDisclaimer();

  state.selectedDrug = drugKey;
  state.calcMode = 'doseToRate';
  state.dose = '';
  state.rate = '';

  // Set default volume
  const volumes = getAvailableVolumes(drug);
  state.selectedVolume = volumes.length > 0 ? volumes[0] : '250cc';
  state.selectedConc = 0;

  renderCalculatorPanel(drug);
  recalculate(drug);

  document.getElementById('calcOverlay').classList.add('open');
  document.getElementById('calcPanel').classList.add('open');
}

function closeCalculator() {
  closeDosingTable();
  if (typeof closeMathCalc === 'function') closeMathCalc();
  if (typeof closeQuickRef === 'function') closeQuickRef();
  document.getElementById('calcOverlay').classList.remove('open');
  document.getElementById('calcPanel').classList.remove('open');
  state.selectedDrug = null;
}

function renderCalculatorPanel(drug) {
  const panel = document.getElementById('calcPanelContent');

  // Header content and background image
  const key = state.selectedDrug;
  const header = document.querySelector('.calc-panel-header');
  if (header && key) {
    header.style.backgroundImage = `linear-gradient(180deg, rgba(2, 59, 114, 0.55) 0%, rgba(15, 23, 42, 0.88) 100%), url('assets/meds/${key}.png')`;
    header.style.backgroundSize = 'cover';
    header.style.backgroundPosition = 'center';
  }

  document.getElementById('calcDrugName').textContent = drug.name;
  document.getElementById('calcDrugGeneric').textContent = drug.generic;
  document.getElementById('calcDrugFormulation').textContent = drug.formulation;

  // Build panel content based on drug type
  let html = '';

  // Special: custom universal drip calculator
  if (drug.formulaType === 'customDrip') {
    html = renderCustomDripPanel(drug);
  }
  // Special: protocol-based drugs (streptokinase)
  else if (drug.formulaType === 'protocol') {
    html = renderProtocolPanel(drug);
  }
  // Special: electrolyte deficit calculators
  else if (drug.formulaType === 'electrolyteDeficit' || drug.formulaType === 'electrolyteDeficitNa') {
    html = renderElectrolytePanel(drug);
  }
  // Special: bicarb deficit
  else if (drug.formulaType === 'bicarbDeficit') {
    html = renderBicarbPanel(drug);
  }
  // Special: basic formulas (Drug Calculations Made Easy)
  else if (['tabletCalc', 'liquidCalc', 'injectionCalc', 'ivFlowRateCalc', 'dropRateCalc', 'weightDoseCalc'].includes(drug.formulaType)) {
    html = renderBasicFormulaPanel(drug);
  }
  // Standard drip calculators
  else {
    html = renderStandardPanel(drug);
  }

  panel.innerHTML = html;
  attachCalcListeners(drug);
}

function setBasicInput(id, val) {
  const el = document.getElementById(id);
  if (el) {
    el.value = val;
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }
}

function setBasicMultiInputs(pairs) {
  Object.entries(pairs).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el) {
      el.value = val;
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });
}

function setBasicUnit(key, val) {
  if (!state.basicUnits) {
    state.basicUnits = { prescribed: 'mg', available: 'mg', dosePerKg: 'mg', totalGiven: 'mg' };
  }
  state.basicUnits[key] = val;
  const recalcEl = document.getElementById('calcResult');
  if (recalcEl && state.currentDrug) {
    recalculate(state.currentDrug);
  }
}

function normalizeToBaseMg(val, unit) {
  const num = parseFloat(val);
  if (isNaN(num)) return 0;
  const u = (unit || 'mg').toLowerCase();
  if (u === 'mcg') return num / 1000;
  if (u === 'g') return num * 1000;
  return num;
}

function renderBasicFormulaPanel(drug) {
  let html = '';
  const ex = drug.example || {};
  const isForward = state.calcMode !== 'rateToDose';

  const presUnit = (state.basicUnits && state.basicUnits.prescribed) || 'mg';
  const availUnit = (state.basicUnits && state.basicUnits.available) || 'mg';
  const dosePerKgUnit = (state.basicUnits && state.basicUnits.dosePerKg) || 'mg';
  const totalGivenUnit = (state.basicUnits && state.basicUnits.totalGiven) || 'mg';

  if (drug.formulaType === 'tabletCalc') {
    html += `
      <div class="mode-switcher">
        <button class="mode-btn ${isForward ? 'active' : ''}" onclick="setCalcMode('doseToRate')">
          Dose → Tablets (Forward)
        </button>
        <button class="mode-btn ${!isForward ? 'active' : ''}" onclick="setCalcMode('rateToDose')">
          Tablets → Dose (Reverse)
        </button>
      </div>
    `;

    if (isForward) {
      html += `
        <div class="calc-section">
          <div class="calc-section-title">1. Prescribed Dose</div>
          <div class="input-group">
            <div class="input-wrapper">
              <input type="number" class="input-field" id="basicPrescribedDose" placeholder="e.g. 500" value="" step="any" min="0" inputmode="decimal">
              <select id="basicPrescribedUnit" class="input-unit-select" onchange="setBasicUnit('prescribed', this.value)">
                <option value="mg" ${presUnit === 'mg' ? 'selected' : ''}>mg</option>
                <option value="mcg" ${presUnit === 'mcg' ? 'selected' : ''}>mcg</option>
                <option value="g" ${presUnit === 'g' ? 'selected' : ''}>g</option>
              </select>
            </div>
            <div class="quick-presets-row">
              <span class="preset-label">Presets:</span>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicPrescribedDose', 125)">125</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicPrescribedDose', 250)">250</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicPrescribedDose', 500)">500</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicPrescribedDose', 650)">650</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicPrescribedDose', 1000)">1,000</button>
            </div>
          </div>
        </div>

        <div class="calc-section">
          <div class="calc-section-title">2. Available Dose per Tablet</div>
          <div class="input-group">
            <div class="input-wrapper">
              <input type="number" class="input-field" id="basicAvailableDose" placeholder="e.g. 250" value="" step="any" min="0" inputmode="decimal">
              <select id="basicAvailableUnit" class="input-unit-select" onchange="setBasicUnit('available', this.value)">
                <option value="mg" ${availUnit === 'mg' ? 'selected' : ''}>mg/tab</option>
                <option value="mcg" ${availUnit === 'mcg' ? 'selected' : ''}>mcg/tab</option>
                <option value="g" ${availUnit === 'g' ? 'selected' : ''}>g/tab</option>
              </select>
            </div>
            <div class="quick-presets-row">
              <span class="preset-label">Strength:</span>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicAvailableDose', 100)">100</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicAvailableDose', 250)">250</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicAvailableDose', 500)">500</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicAvailableDose', 1000)">1,000</button>
            </div>
          </div>
        </div>
      `;
    } else {
      html += `
        <div class="calc-section">
          <div class="calc-section-title">1. Number of Tablets Administered</div>
          <div class="input-group">
            <div class="input-wrapper">
              <input type="number" class="input-field" id="basicGivenTabs" placeholder="e.g. 2" value="" step="any" min="0" inputmode="decimal">
              <span class="input-suffix">tablets</span>
            </div>
            <div class="quick-presets-row">
              <span class="preset-label">Presets:</span>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicGivenTabs', 0.5)">0.5 tab</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicGivenTabs', 1)">1 tab</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicGivenTabs', 1.5)">1.5 tabs</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicGivenTabs', 2)">2 tabs</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicGivenTabs', 3)">3 tabs</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicGivenTabs', 4)">4 tabs</button>
            </div>
          </div>
        </div>

        <div class="calc-section">
          <div class="calc-section-title">2. Available Dose per Tablet</div>
          <div class="input-group">
            <div class="input-wrapper">
              <input type="number" class="input-field" id="basicAvailableDose" placeholder="e.g. 250" value="" step="any" min="0" inputmode="decimal">
              <select id="basicAvailableUnit" class="input-unit-select" onchange="setBasicUnit('available', this.value)">
                <option value="mg" ${availUnit === 'mg' ? 'selected' : ''}>mg/tab</option>
                <option value="mcg" ${availUnit === 'mcg' ? 'selected' : ''}>mcg/tab</option>
                <option value="g" ${availUnit === 'g' ? 'selected' : ''}>g/tab</option>
              </select>
            </div>
            <div class="quick-presets-row">
              <span class="preset-label">Strength:</span>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicAvailableDose', 100)">100</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicAvailableDose', 250)">250</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicAvailableDose', 500)">500</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicAvailableDose', 1000)">1,000</button>
            </div>
          </div>
        </div>
      `;
    }
  } else if (drug.formulaType === 'liquidCalc') {
    html += `
      <div class="mode-switcher">
        <button class="mode-btn ${isForward ? 'active' : ''}" onclick="setCalcMode('doseToRate')">
          Dose → Volume (Forward)
        </button>
        <button class="mode-btn ${!isForward ? 'active' : ''}" onclick="setCalcMode('rateToDose')">
          Volume → Dose (Reverse)
        </button>
      </div>
    `;

    if (isForward) {
      html += `
        <div class="calc-section">
          <div class="calc-section-title">1. Prescribed Dose</div>
          <div class="input-group">
            <div class="input-wrapper">
              <input type="number" class="input-field" id="basicPrescribedDose" placeholder="e.g. 250" value="" step="any" min="0" inputmode="decimal">
              <select id="basicPrescribedUnit" class="input-unit-select" onchange="setBasicUnit('prescribed', this.value)">
                <option value="mg" ${presUnit === 'mg' ? 'selected' : ''}>mg</option>
                <option value="mcg" ${presUnit === 'mcg' ? 'selected' : ''}>mcg</option>
                <option value="g" ${presUnit === 'g' ? 'selected' : ''}>g</option>
              </select>
            </div>
            <div class="quick-presets-row">
              <span class="preset-label">Presets:</span>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicPrescribedDose', 125)">125</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicPrescribedDose', 250)">250</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicPrescribedDose', 375)">375</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicPrescribedDose', 500)">500</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicPrescribedDose', 750)">750</button>
            </div>
          </div>
        </div>

        <div class="calc-section">
          <div class="calc-section-title">2. Stock Suspension Strength</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div class="input-group" style="margin-bottom:0;">
              <div class="input-wrapper">
                <input type="number" class="input-field" id="basicAvailableDose" placeholder="Dose (e.g. 125)" value="" step="any" min="0" inputmode="decimal">
                <select id="basicAvailableUnit" class="input-unit-select" onchange="setBasicUnit('available', this.value)">
                  <option value="mg" ${availUnit === 'mg' ? 'selected' : ''}>mg</option>
                  <option value="mcg" ${availUnit === 'mcg' ? 'selected' : ''}>mcg</option>
                  <option value="g" ${availUnit === 'g' ? 'selected' : ''}>g</option>
                </select>
              </div>
            </div>
            <div class="input-group" style="margin-bottom:0;">
              <div class="input-wrapper">
                <input type="number" class="input-field" id="basicAvailVol" placeholder="Vol (e.g. 5)" value="" step="any" min="0" inputmode="decimal">
                <span class="input-suffix">mL</span>
              </div>
            </div>
          </div>
          <div class="quick-presets-row">
            <span class="preset-label">Standard Stock:</span>
            <button type="button" class="preset-chip-btn" onclick="setBasicMultiInputs({basicAvailableDose: 125, basicAvailVol: 5})">125 / 5mL</button>
            <button type="button" class="preset-chip-btn" onclick="setBasicMultiInputs({basicAvailableDose: 250, basicAvailVol: 5})">250 / 5mL</button>
            <button type="button" class="preset-chip-btn" onclick="setBasicMultiInputs({basicAvailableDose: 200, basicAvailVol: 5})">200 / 5mL</button>
            <button type="button" class="preset-chip-btn" onclick="setBasicMultiInputs({basicAvailableDose: 400, basicAvailVol: 5})">400 / 5mL</button>
            <button type="button" class="preset-chip-btn" onclick="setBasicMultiInputs({basicAvailableDose: 100, basicAvailVol: 1})">100 / 1mL</button>
          </div>
        </div>
      `;
    } else {
      html += `
        <div class="calc-section">
          <div class="calc-section-title">1. Volume Administered</div>
          <div class="input-group">
            <div class="input-wrapper">
              <input type="number" class="input-field" id="basicAdminVol" placeholder="e.g. 10" value="" step="any" min="0" inputmode="decimal">
              <span class="input-suffix">mL</span>
            </div>
            <div class="quick-presets-row">
              <span class="preset-label">Presets:</span>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicAdminVol', 2.5)">2.5 mL</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicAdminVol', 5)">5 mL (1 tsp)</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicAdminVol', 7.5)">7.5 mL</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicAdminVol', 10)">10 mL</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicAdminVol', 15)">15 mL (1 tbsp)</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicAdminVol', 20)">20 mL</button>
            </div>
          </div>
        </div>

        <div class="calc-section">
          <div class="calc-section-title">2. Stock Suspension Strength</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div class="input-group" style="margin-bottom:0;">
              <div class="input-wrapper">
                <input type="number" class="input-field" id="basicAvailableDose" placeholder="Dose (e.g. 125)" value="" step="any" min="0" inputmode="decimal">
                <select id="basicAvailableUnit" class="input-unit-select" onchange="setBasicUnit('available', this.value)">
                  <option value="mg" ${availUnit === 'mg' ? 'selected' : ''}>mg</option>
                  <option value="mcg" ${availUnit === 'mcg' ? 'selected' : ''}>mcg</option>
                  <option value="g" ${availUnit === 'g' ? 'selected' : ''}>g</option>
                </select>
              </div>
            </div>
            <div class="input-group" style="margin-bottom:0;">
              <div class="input-wrapper">
                <input type="number" class="input-field" id="basicAvailVol" placeholder="Vol (e.g. 5)" value="" step="any" min="0" inputmode="decimal">
                <span class="input-suffix">mL</span>
              </div>
            </div>
          </div>
          <div class="quick-presets-row">
            <span class="preset-label">Standard Stock:</span>
            <button type="button" class="preset-chip-btn" onclick="setBasicMultiInputs({basicAvailableDose: 125, basicAvailVol: 5})">125 / 5mL</button>
            <button type="button" class="preset-chip-btn" onclick="setBasicMultiInputs({basicAvailableDose: 250, basicAvailVol: 5})">250 / 5mL</button>
            <button type="button" class="preset-chip-btn" onclick="setBasicMultiInputs({basicAvailableDose: 200, basicAvailVol: 5})">200 / 5mL</button>
            <button type="button" class="preset-chip-btn" onclick="setBasicMultiInputs({basicAvailableDose: 400, basicAvailVol: 5})">400 / 5mL</button>
            <button type="button" class="preset-chip-btn" onclick="setBasicMultiInputs({basicAvailableDose: 100, basicAvailVol: 1})">100 / 1mL</button>
          </div>
        </div>
      `;
    }
  } else if (drug.formulaType === 'injectionCalc') {
    html += `
      <div class="mode-switcher">
        <button class="mode-btn ${isForward ? 'active' : ''}" onclick="setCalcMode('doseToRate')">
          Dose → Diluent Vol (Forward)
        </button>
        <button class="mode-btn ${!isForward ? 'active' : ''}" onclick="setCalcMode('rateToDose')">
          Injected Vol → Dose (Reverse)
        </button>
      </div>
    `;

    if (isForward) {
      html += `
        <div class="calc-section">
          <div class="calc-section-title">1. Prescribed Dose</div>
          <div class="input-group">
            <div class="input-wrapper">
              <input type="number" class="input-field" id="basicPrescribedDose" placeholder="e.g. 500" value="" step="any" min="0" inputmode="decimal">
              <select id="basicPrescribedUnit" class="input-unit-select" onchange="setBasicUnit('prescribed', this.value)">
                <option value="mg" ${presUnit === 'mg' ? 'selected' : ''}>mg</option>
                <option value="mcg" ${presUnit === 'mcg' ? 'selected' : ''}>mcg</option>
                <option value="g" ${presUnit === 'g' ? 'selected' : ''}>g</option>
              </select>
            </div>
            <div class="quick-presets-row">
              <span class="preset-label">Presets:</span>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicPrescribedDose', 250)">250</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicPrescribedDose', 500)">500</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicPrescribedDose', 750)">750</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicPrescribedDose', 1000)">1,000</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicPrescribedDose', 2000)">2,000</button>
            </div>
          </div>
        </div>

        <div class="calc-section">
          <div class="calc-section-title">2. Available Vial & Diluent Volume</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div class="input-group" style="margin-bottom:0;">
              <div class="input-wrapper">
                <input type="number" class="input-field" id="basicAvailableDose" placeholder="Vial (e.g. 1000)" value="" step="any" min="0" inputmode="decimal">
                <select id="basicAvailableUnit" class="input-unit-select" onchange="setBasicUnit('available', this.value)">
                  <option value="mg" ${availUnit === 'mg' ? 'selected' : ''}>mg</option>
                  <option value="mcg" ${availUnit === 'mcg' ? 'selected' : ''}>mcg</option>
                  <option value="g" ${availUnit === 'g' ? 'selected' : ''}>g</option>
                </select>
              </div>
            </div>
            <div class="input-group" style="margin-bottom:0;">
              <div class="input-wrapper">
                <input type="number" class="input-field" id="basicAvailVol" placeholder="Diluent (e.g. 10)" value="" step="any" min="0" inputmode="decimal">
                <span class="input-suffix">mL</span>
              </div>
            </div>
          </div>
          <div class="quick-presets-row">
            <span class="preset-label">Vial Stock:</span>
            <button type="button" class="preset-chip-btn" onclick="setBasicMultiInputs({basicAvailableDose: 500, basicAvailVol: 5})">500 / 5mL</button>
            <button type="button" class="preset-chip-btn" onclick="setBasicMultiInputs({basicAvailableDose: 500, basicAvailVol: 10})">500 / 10mL</button>
            <button type="button" class="preset-chip-btn" onclick="setBasicMultiInputs({basicAvailableDose: 1000, basicAvailVol: 10})">1,000 / 10mL</button>
            <button type="button" class="preset-chip-btn" onclick="setBasicMultiInputs({basicAvailableDose: 1000, basicAvailVol: 20})">1,000 / 20mL</button>
            <button type="button" class="preset-chip-btn" onclick="setBasicMultiInputs({basicAvailableDose: 2000, basicAvailVol: 20})">2,000 / 20mL</button>
          </div>
        </div>
      `;
    } else {
      html += `
        <div class="calc-section">
          <div class="calc-section-title">1. Volume Injected / Administered</div>
          <div class="input-group">
            <div class="input-wrapper">
              <input type="number" class="input-field" id="basicAdminVol" placeholder="e.g. 5" value="" step="any" min="0" inputmode="decimal">
              <span class="input-suffix">mL</span>
            </div>
            <div class="quick-presets-row">
              <span class="preset-label">Presets:</span>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicAdminVol', 2)">2 mL</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicAdminVol', 5)">5 mL</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicAdminVol', 10)">10 mL</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicAdminVol', 15)">15 mL</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicAdminVol', 20)">20 mL</button>
            </div>
          </div>
        </div>

        <div class="calc-section">
          <div class="calc-section-title">2. Available Vial & Diluent Volume</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div class="input-group" style="margin-bottom:0;">
              <div class="input-wrapper">
                <input type="number" class="input-field" id="basicAvailableDose" placeholder="Vial (e.g. 1000)" value="" step="any" min="0" inputmode="decimal">
                <select id="basicAvailableUnit" class="input-unit-select" onchange="setBasicUnit('available', this.value)">
                  <option value="mg" ${availUnit === 'mg' ? 'selected' : ''}>mg</option>
                  <option value="mcg" ${availUnit === 'mcg' ? 'selected' : ''}>mcg</option>
                  <option value="g" ${availUnit === 'g' ? 'selected' : ''}>g</option>
                </select>
              </div>
            </div>
            <div class="input-group" style="margin-bottom:0;">
              <div class="input-wrapper">
                <input type="number" class="input-field" id="basicAvailVol" placeholder="Diluent (e.g. 10)" value="" step="any" min="0" inputmode="decimal">
                <span class="input-suffix">mL</span>
              </div>
            </div>
          </div>
          <div class="quick-presets-row">
            <span class="preset-label">Vial Stock:</span>
            <button type="button" class="preset-chip-btn" onclick="setBasicMultiInputs({basicAvailableDose: 500, basicAvailVol: 5})">500 / 5mL</button>
            <button type="button" class="preset-chip-btn" onclick="setBasicMultiInputs({basicAvailableDose: 500, basicAvailVol: 10})">500 / 10mL</button>
            <button type="button" class="preset-chip-btn" onclick="setBasicMultiInputs({basicAvailableDose: 1000, basicAvailVol: 10})">1,000 / 10mL</button>
            <button type="button" class="preset-chip-btn" onclick="setBasicMultiInputs({basicAvailableDose: 1000, basicAvailVol: 20})">1,000 / 20mL</button>
            <button type="button" class="preset-chip-btn" onclick="setBasicMultiInputs({basicAvailableDose: 2000, basicAvailVol: 20})">2,000 / 20mL</button>
          </div>
        </div>
      `;
    }
  } else if (drug.formulaType === 'ivFlowRateCalc') {
    html += `
      <div class="mode-switcher">
        <button class="mode-btn ${isForward ? 'active' : ''}" onclick="setCalcMode('doseToRate')">
          Time → Flow Rate (Forward)
        </button>
        <button class="mode-btn ${!isForward ? 'active' : ''}" onclick="setCalcMode('rateToDose')">
          Rate → Infusion Time (Reverse)
        </button>
      </div>
    `;

    if (isForward) {
      html += `
        <div class="calc-section">
          <div class="calc-section-title">1. Total Volume to Infuse</div>
          <div class="input-group">
            <div class="input-wrapper">
              <input type="number" class="input-field" id="basicTotalVol" placeholder="e.g. 1000" value="" step="any" min="0" inputmode="decimal">
              <span class="input-suffix">mL</span>
            </div>
            <div class="quick-presets-row">
              <span class="preset-label">Volume:</span>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicTotalVol', 100)">100 mL</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicTotalVol', 250)">250 mL</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicTotalVol', 500)">500 mL</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicTotalVol', 1000)">1,000 mL</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicTotalVol', 2000)">2,000 mL</button>
            </div>
          </div>
        </div>

        <div class="calc-section">
          <div class="calc-section-title">2. Infusion Time Duration</div>
          <div class="input-group">
            <div class="input-wrapper">
              <input type="number" class="input-field" id="basicTimeHours" placeholder="e.g. 8" value="" step="any" min="0" inputmode="decimal">
              <span class="input-suffix">hours</span>
            </div>
            <div class="quick-presets-row">
              <span class="preset-label">Duration:</span>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicTimeHours', 1)">1 hr</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicTimeHours', 2)">2 hrs</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicTimeHours', 4)">4 hrs</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicTimeHours', 6)">6 hrs</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicTimeHours', 8)">8 hrs</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicTimeHours', 12)">12 hrs</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicTimeHours', 24)">24 hrs</button>
            </div>
          </div>
        </div>
      `;
    } else {
      html += `
        <div class="calc-section">
          <div class="calc-section-title">1. Total Volume to Infuse</div>
          <div class="input-group">
            <div class="input-wrapper">
              <input type="number" class="input-field" id="basicTotalVol" placeholder="e.g. 1000" value="" step="any" min="0" inputmode="decimal">
              <span class="input-suffix">mL</span>
            </div>
            <div class="quick-presets-row">
              <span class="preset-label">Volume:</span>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicTotalVol', 100)">100 mL</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicTotalVol', 250)">250 mL</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicTotalVol', 500)">500 mL</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicTotalVol', 1000)">1,000 mL</button>
            </div>
          </div>
        </div>

        <div class="calc-section">
          <div class="calc-section-title">2. Pump Flow Rate</div>
          <div class="input-group">
            <div class="input-wrapper">
              <input type="number" class="input-field" id="basicPumpRate" placeholder="e.g. 125" value="" step="any" min="0" inputmode="decimal">
              <span class="input-suffix">mL/hr</span>
            </div>
            <div class="quick-presets-row">
              <span class="preset-label">Flow Rate:</span>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicPumpRate', 42)">42 mL/hr</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicPumpRate', 63)">63 mL/hr</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicPumpRate', 75)">75 mL/hr</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicPumpRate', 83)">83 mL/hr</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicPumpRate', 100)">100 mL/hr</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicPumpRate', 125)">125 mL/hr</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicPumpRate', 150)">150 mL/hr</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicPumpRate', 200)">200 mL/hr</button>
            </div>
          </div>
        </div>
      `;
    }
  } else if (drug.formulaType === 'dropRateCalc') {
    html += `
      <div class="mode-switcher">
        <button class="mode-btn ${isForward ? 'active' : ''}" onclick="setCalcMode('doseToRate')">
          Time → Drop Rate (Forward)
        </button>
        <button class="mode-btn ${!isForward ? 'active' : ''}" onclick="setCalcMode('rateToDose')">
          Drop Rate → Time (Reverse)
        </button>
      </div>
    `;

    if (isForward) {
      html += `
        <div class="calc-section">
          <div class="calc-section-title">1. Total Volume</div>
          <div class="input-group">
            <div class="input-wrapper">
              <input type="number" class="input-field" id="basicTotalVol" placeholder="e.g. 500" value="" step="any" min="0" inputmode="decimal">
              <span class="input-suffix">mL</span>
            </div>
            <div class="quick-presets-row">
              <span class="preset-label">Volume:</span>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicTotalVol', 100)">100 mL</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicTotalVol', 250)">250 mL</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicTotalVol', 500)">500 mL</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicTotalVol', 1000)">1,000 mL</button>
            </div>
          </div>
        </div>

        <div class="calc-section">
          <div class="calc-section-title">2. Tubing Drop Factor</div>
          <div class="input-group">
            <select class="input-field" id="basicDropFactor" style="background: rgba(15,23,42,0.8); color: #fff;">
              <option value="10">10 gtt/mL (Macro drip)</option>
              <option value="15">15 gtt/mL (Macro drip)</option>
              <option value="20" selected>20 gtt/mL (Standard macro drip)</option>
              <option value="60">60 gtt/mL (Micro drip / Pediatric)</option>
            </select>
            <div class="quick-presets-row">
              <span class="preset-label">Drop Sets:</span>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicDropFactor', '10')">10 gtt/mL</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicDropFactor', '15')">15 gtt/mL</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicDropFactor', '20')">20 gtt/mL</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicDropFactor', '60')">60 gtt/mL</button>
            </div>
          </div>
        </div>

        <div class="calc-section">
          <div class="calc-section-title">3. Infusion Time Duration</div>
          <div class="input-group">
            <div style="display: flex; gap: 8px;">
              <div class="input-wrapper" style="flex: 2;">
                <input type="number" class="input-field" id="basicTimeVal" placeholder="e.g. 4" value="" step="any" min="0" inputmode="decimal">
              </div>
              <select class="input-field" id="basicTimeUnit" style="flex: 1; background: rgba(15,23,42,0.8); color: #fff;">
                <option value="hours" selected>Hours</option>
                <option value="minutes">Minutes</option>
              </select>
            </div>
            <div class="quick-presets-row">
              <span class="preset-label">Time:</span>
              <button type="button" class="preset-chip-btn" onclick="setBasicMultiInputs({basicTimeVal: 1, basicTimeUnit: 'hours'})">1 hr</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicMultiInputs({basicTimeVal: 2, basicTimeUnit: 'hours'})">2 hrs</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicMultiInputs({basicTimeVal: 4, basicTimeUnit: 'hours'})">4 hrs</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicMultiInputs({basicTimeVal: 6, basicTimeUnit: 'hours'})">6 hrs</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicMultiInputs({basicTimeVal: 8, basicTimeUnit: 'hours'})">8 hrs</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicMultiInputs({basicTimeVal: 12, basicTimeUnit: 'hours'})">12 hrs</button>
            </div>
          </div>
        </div>
      `;
    } else {
      html += `
        <div class="calc-section">
          <div class="calc-section-title">1. Total Volume</div>
          <div class="input-group">
            <div class="input-wrapper">
              <input type="number" class="input-field" id="basicTotalVol" placeholder="e.g. 500" value="" step="any" min="0" inputmode="decimal">
              <span class="input-suffix">mL</span>
            </div>
            <div class="quick-presets-row">
              <span class="preset-label">Volume:</span>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicTotalVol', 100)">100 mL</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicTotalVol', 250)">250 mL</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicTotalVol', 500)">500 mL</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicTotalVol', 1000)">1,000 mL</button>
            </div>
          </div>
        </div>

        <div class="calc-section">
          <div class="calc-section-title">2. Tubing Drop Factor</div>
          <div class="input-group">
            <select class="input-field" id="basicDropFactor" style="background: rgba(15,23,42,0.8); color: #fff;">
              <option value="10">10 gtt/mL (Macro drip)</option>
              <option value="15">15 gtt/mL (Macro drip)</option>
              <option value="20" selected>20 gtt/mL (Standard macro drip)</option>
              <option value="60">60 gtt/mL (Micro drip / Pediatric)</option>
            </select>
          </div>
        </div>

        <div class="calc-section">
          <div class="calc-section-title">3. Observed / Ordered Drop Rate</div>
          <div class="input-group">
            <div class="input-wrapper">
              <input type="number" class="input-field" id="basicTargetGtt" placeholder="e.g. 42" value="" step="any" min="0" inputmode="decimal">
              <span class="input-suffix">gtt/min</span>
            </div>
            <div class="quick-presets-row">
              <span class="preset-label">Drop Rate:</span>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicTargetGtt', 15)">15 gtt/min</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicTargetGtt', 21)">21 gtt/min</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicTargetGtt', 31)">31 gtt/min</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicTargetGtt', 42)">42 gtt/min</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicTargetGtt', 63)">63 gtt/min</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicTargetGtt', 83)">83 gtt/min</button>
            </div>
          </div>
        </div>
      `;
    }
  } else if (drug.formulaType === 'weightDoseCalc') {
    html += `
      <div class="mode-switcher">
        <button class="mode-btn ${isForward ? 'active' : ''}" onclick="setCalcMode('doseToRate')">
          Dose/kg → Total Dose (Forward)
        </button>
        <button class="mode-btn ${!isForward ? 'active' : ''}" onclick="setCalcMode('rateToDose')">
          Total Dose → Dose/kg (Reverse)
        </button>
      </div>
    `;

    if (isForward) {
      html += `
        <div class="calc-section">
          <div class="calc-section-title">1. Dose Per Kilogram</div>
          <div class="input-group">
            <div class="input-wrapper">
              <input type="number" class="input-field" id="basicDosePerKg" placeholder="e.g. 15" value="" step="any" min="0" inputmode="decimal">
              <select id="basicDosePerKgUnit" class="input-unit-select" onchange="setBasicUnit('dosePerKg', this.value)">
                <option value="mg" ${dosePerKgUnit === 'mg' ? 'selected' : ''}>mg/kg</option>
                <option value="mcg" ${dosePerKgUnit === 'mcg' ? 'selected' : ''}>mcg/kg</option>
                <option value="g" ${dosePerKgUnit === 'g' ? 'selected' : ''}>g/kg</option>
              </select>
            </div>
            <div class="quick-presets-row">
              <span class="preset-label">Dose/kg:</span>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicDosePerKg', 5)">5</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicDosePerKg', 10)">10</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicDosePerKg', 15)">15</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicDosePerKg', 20)">20</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicDosePerKg', 25)">25</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicDosePerKg', 50)">50</button>
            </div>
          </div>
        </div>

        <div class="calc-section">
          <div class="calc-section-title">2. Patient Body Weight</div>
          <div class="input-group">
            <div class="input-wrapper">
              <input type="number" class="input-field" id="basicWeight" placeholder="e.g. 70" value="${state.weight || ''}" step="any" min="0" inputmode="decimal">
              <span class="input-suffix">kg</span>
            </div>
            <div class="quick-presets-row">
              <span class="preset-label">Weight:</span>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicWeight', 10)">10 kg</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicWeight', 20)">20 kg</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicWeight', 40)">40 kg</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicWeight', 50)">50 kg</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicWeight', 60)">60 kg</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicWeight', 70)">70 kg</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicWeight', 80)">80 kg</button>
            </div>
          </div>
        </div>
      `;
    } else {
      html += `
        <div class="calc-section">
          <div class="calc-section-title">1. Total Administered Dose</div>
          <div class="input-group">
            <div class="input-wrapper">
              <input type="number" class="input-field" id="basicTotalGivenDose" placeholder="e.g. 300" value="" step="any" min="0" inputmode="decimal">
              <select id="basicTotalGivenUnit" class="input-unit-select" onchange="setBasicUnit('totalGiven', this.value)">
                <option value="mg" ${totalGivenUnit === 'mg' ? 'selected' : ''}>mg</option>
                <option value="mcg" ${totalGivenUnit === 'mcg' ? 'selected' : ''}>mcg</option>
                <option value="g" ${totalGivenUnit === 'g' ? 'selected' : ''}>g</option>
              </select>
            </div>
            <div class="quick-presets-row">
              <span class="preset-label">Total Dose:</span>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicTotalGivenDose', 100)">100</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicTotalGivenDose', 250)">250</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicTotalGivenDose', 300)">300</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicTotalGivenDose', 500)">500</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicTotalGivenDose', 750)">750</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicTotalGivenDose', 1000)">1,000</button>
            </div>
          </div>
        </div>

        <div class="calc-section">
          <div class="calc-section-title">2. Patient Body Weight</div>
          <div class="input-group">
            <div class="input-wrapper">
              <input type="number" class="input-field" id="basicWeight" placeholder="e.g. 70" value="${state.weight || ''}" step="any" min="0" inputmode="decimal">
              <span class="input-suffix">kg</span>
            </div>
            <div class="quick-presets-row">
              <span class="preset-label">Weight:</span>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicWeight', 10)">10 kg</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicWeight', 20)">20 kg</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicWeight', 40)">40 kg</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicWeight', 50)">50 kg</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicWeight', 60)">60 kg</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicWeight', 70)">70 kg</button>
              <button type="button" class="preset-chip-btn" onclick="setBasicInput('basicWeight', 80)">80 kg</button>
            </div>
          </div>
        </div>
      `;
    }
  }

  // Result area
  html += '<div id="calcResult"></div>';

  // Clinical Notes Reference
  if (drug.notes) {
    html += `
      <div class="calc-section" style="margin-top: 16px;">
        <div class="dose-warning info">
          <span class="dose-warning-icon">ℹ️</span>
          <span>${drug.notes}</span>
        </div>
      </div>
    `;
  }

  return html;
}

function renderStandardPanel(drug) {
  const volumes = getAvailableVolumes(drug);
  const concs = drug.concentrations[state.selectedVolume] || [];

  let html = '';

  // Mode Switcher
  html += `
    <div class="mode-switcher">
      <button class="mode-btn ${state.calcMode === 'doseToRate' ? 'active' : ''}" onclick="setCalcMode('doseToRate')">
        Dose → Rate
      </button>
      <button class="mode-btn ${state.calcMode === 'rateToDose' ? 'active' : ''}" onclick="setCalcMode('rateToDose')">
        Rate → Dose
      </button>
    </div>

    <!-- Prominent Full Dosing Table Button at Top -->
    <div style="padding: 0 16px; margin-bottom: 12px;">
      <button class="formula-toggle-btn" style="background: linear-gradient(135deg, var(--orange-500), var(--orange-600)); color: var(--white); border: none; font-size: 0.88rem; padding: 12px; box-shadow: var(--shadow-orange);" onclick="openDosingTable()">
        📊 View Full Bedside Dosing Table (Min → Max Dose)
      </button>
    </div>
  `;

  // Bolus info
  if (drug.bolus) {
    html += `
      <div class="calc-section" style="padding: 0 0;">
        <div class="bolus-card">
          <div class="bolus-title">💉 Bolus / Loading Dose</div>
          <div class="bolus-text">${drug.bolus.replace(/\n/g, '<br>')}</div>
        </div>
      </div>
    `;
  }

  // Weight input (if weight-based)
  if (drug.weightBased) {
    html += `
      <div class="calc-section">
        <div class="calc-section-title">Patient Weight</div>
        <div class="input-group">
          <div class="input-wrapper">
            <input type="number" class="input-field" id="calcWeight" placeholder="Enter weight"
                   value="${state.weight}" step="0.1" min="0" inputmode="decimal">
            <span class="input-suffix">kg</span>
          </div>
        </div>
      </div>
    `;
  }

  // Heparin mode toggle
  if (drug.formulaType === 'heparin') {
    html += `
      <div class="calc-section">
        <div class="calc-section-title">Dosing Mode</div>
        <div class="vol-toggle">
          <button class="vol-btn ${state.heparinMode === 'unitsPerHr' ? 'active' : ''}" onclick="setHeparinMode('unitsPerHr')">
            <div class="vol-btn-label">units/hr</div>
            <div class="vol-btn-desc">Fixed rate</div>
          </button>
          <button class="vol-btn ${state.heparinMode === 'unitsPerKgPerHr' ? 'active' : ''}" onclick="setHeparinMode('unitsPerKgPerHr')">
            <div class="vol-btn-label">units/kg/hr</div>
            <div class="vol-btn-desc">Weight-based</div>
          </button>
        </div>
      </div>
    `;
  }

  // Volume selector
  if (volumes.length > 1) {
    html += `
      <div class="calc-section">
        <div class="calc-section-title">IVF / Solution Volume</div>
        <div class="vol-toggle">
          ${volumes.map(v => `
            <button class="vol-btn ${state.selectedVolume === v ? 'active' : ''}" onclick="setVolume('${v}')">
              <div class="vol-btn-label">${v}</div>
              <div class="vol-btn-desc">${v === '50cc' ? 'Syringe Pump' : v === '100cc' ? 'Soluset' : v === '80cc' ? 'Custom Mix' : 'IVF Bag'}</div>
            </button>
          `).join('')}
          <button class="vol-btn ${state.selectedVolume === 'custom' ? 'active' : ''}" onclick="setVolume('custom')">
            <div class="vol-btn-label">Custom</div>
            <div class="vol-btn-desc">Custom Vol</div>
          </button>
        </div>
        ${state.selectedVolume === 'custom' ? `
          <div class="input-group" style="margin-top: 10px;">
            <div class="input-label"><span class="input-label-text">Custom Container Solution Volume</span></div>
            <div class="input-wrapper">
              <input type="number" class="input-field" id="presetCustomVol" placeholder="e.g. 150" value="${state.presetCustomVol || ''}" step="any" min="1" inputmode="decimal">
              <span class="input-suffix">mL (cc)</span>
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  // Concentration selector
  if (concs.length > 0 || state.selectedVolume === 'custom') {
    html += `
      <div class="calc-section">
        <div class="calc-section-title">Concentration</div>
        <div class="conc-grid">
          ${concs.map((c, i) => {
            const concVal = c.concMcgPerCc ? `${formatNumber(c.concMcgPerCc)} mcg/cc` :
                           c.concMgPerCc ? `${formatNumber(c.concMgPerCc)} mg/cc` :
                           c.concUnitsPerCc ? `${formatNumber(c.concUnitsPerCc)} U/cc` : '';
            const mixInfo = c.drugUnits
              ? `${c.drugUnits.toLocaleString()} IU in ${c.totalVol} cc`
              : `${c.drugVol} cc + ${c.diluent} cc IVF`;
            return `
              <div class="conc-option ${state.selectedConc === i ? 'active' : ''}" onclick="setConc(${i})">
                <div class="conc-option-label">${c.label}</div>
                <div class="conc-option-value">${concVal}</div>
                <div class="conc-option-mix">${mixInfo}</div>
              </div>
            `;
          }).join('')}
          <div class="conc-option ${state.selectedConc === 'custom' ? 'active' : ''}" onclick="setConc('custom')">
            <div class="conc-option-label">Custom</div>
            <div class="conc-option-value">Custom Mix</div>
            <div class="conc-option-mix">Enter Drug Amount</div>
          </div>
        </div>

        ${(state.selectedConc === 'custom' || state.selectedVolume === 'custom') ? `
          <div class="mixing-card" style="margin-top: 12px; background: var(--orange-50); border-color: var(--orange-200);">
            <div class="mixing-title">🧪 Custom Drug Incorporation</div>
            <div class="input-group" style="margin-bottom: 8px;">
              <div class="input-label"><span class="input-label-text">Total Drug Amount Added</span></div>
              <div class="input-wrapper">
                <input type="number" class="input-field" id="presetCustomAmt" placeholder="e.g. 200" value="${state.presetCustomAmt || ''}" step="any" min="0" inputmode="decimal">
                <span class="input-suffix">${drug.formulaType === 'heparin' ? 'IU' : drug.doseUnit.startsWith('mcg') ? 'mg' : 'mg'}</span>
              </div>
            </div>
            <div id="presetCustomConcSummary" style="font-size: 0.8rem; font-weight: 700; color: var(--orange-700); margin-top: 4px;"></div>
          </div>
        ` : ''}
      </div>
    `;
  }

  // Dose / Rate input
  if (state.calcMode === 'doseToRate') {
    const doseUnit = drug.formulaType === 'heparin'
      ? (state.heparinMode === 'unitsPerKgPerHr' ? 'units/kg/hr' : 'units/hr')
      : drug.doseUnit;
    html += `
      <div class="calc-section">
        <div class="calc-section-title">Desired Dose</div>
        <div class="input-group">
          <div class="input-wrapper">
            <input type="number" class="input-field" id="calcDose" placeholder="Enter dose"
                   value="${state.dose}" step="any" min="0" inputmode="decimal">
            <span class="input-suffix">${doseUnit}</span>
          </div>
        </div>
        <div id="doseWarning"></div>
        ${drug.doseRange ? `
          <div class="dose-range-bar" id="doseRangeBar">
            <div class="dose-range-track">
              <div class="dose-range-fill"></div>
              <div class="dose-range-marker" id="doseMarker" style="left: 0%"></div>
            </div>
            <div class="dose-range-labels">
              <span>${drug.doseRange.min} ${doseUnit}</span>
              <span>${drug.doseRange.max} ${doseUnit}</span>
            </div>
          </div>
        ` : ''}
      </div>
    `;
  } else {
    html += `
      <div class="calc-section">
        <div class="calc-section-title">Current Flow Rate</div>
        <div class="input-group">
          <div class="input-wrapper">
            <input type="number" class="input-field" id="calcRate" placeholder="Enter rate"
                   value="${state.rate}" step="any" min="0" inputmode="decimal">
            <span class="input-suffix">cc/hr</span>
          </div>
        </div>
      </div>
    `;
  }

  // Result area
  html += '<div id="calcResult"></div>';

  // Mixing instructions
  if (concs.length > 0) {
    const c = concs[state.selectedConc];
    if (c) {
      html += `
        <div class="mixing-card">
          <div class="mixing-title">🧪 Mixing Instructions — ${c.label}</div>
          ${c.concNote ? `<div class="mixing-row"><span class="mixing-label">Note</span><span class="mixing-value">${c.concNote}</span></div>` : ''}
          ${c.drugMg !== undefined ? `<div class="mixing-row"><span class="mixing-label">Drug</span><span class="mixing-value">${c.drugMg} mg (${c.drugVol} cc)</span></div>` : ''}
          ${c.drugUnits !== undefined ? `<div class="mixing-row"><span class="mixing-label">Drug</span><span class="mixing-value">${c.drugUnits.toLocaleString()} IU</span></div>` : ''}
          <div class="mixing-row"><span class="mixing-label">Diluent</span><span class="mixing-value">${c.diluent !== undefined ? c.diluent + ' cc IVF' : c.totalVol + ' cc total'}</span></div>
          <div class="mixing-row"><span class="mixing-label">Total Volume</span><span class="mixing-value">${c.totalVol} cc</span></div>
          <div class="mixing-row"><span class="mixing-label">Concentration</span><span class="mixing-value">${c.concMcgPerCc ? formatNumber(c.concMcgPerCc) + ' mcg/cc' : c.concMgPerCc ? formatNumber(c.concMgPerCc) + ' mg/cc' : c.concUnitsPerCc ? formatNumber(c.concUnitsPerCc) + ' U/cc' : ''}</span></div>
        </div>
      `;
    }
  }

  // Notes
  if (drug.notes) {
    html += `
      <div class="calc-section" style="margin-top: 16px;">
        <div class="dose-warning info">
          <span class="dose-warning-icon">ℹ️</span>
          <span>${drug.notes}</span>
        </div>
      </div>
    `;
  }

  return html;
}

function renderProtocolPanel(drug) {
  let html = '<div class="calc-section" style="margin-top: 16px;">';
  html += '<div class="calc-section-title">Protocols</div>';

  drug.protocols.forEach(p => {
    html += `
      <div class="mixing-card" style="margin-bottom: 10px;">
        <div class="mixing-title">📋 ${p.name}</div>
        <div class="mixing-row"><span class="mixing-label">Dose</span><span class="mixing-value">${p.dose}</span></div>
        <div class="mixing-row"><span class="mixing-label">Diluent</span><span class="mixing-value">${p.diluent}</span></div>
        <div class="mixing-row"><span class="mixing-label">Duration</span><span class="mixing-value">${p.duration}</span></div>
      </div>
    `;
  });

  if (drug.notes) {
    html += `
      <div class="dose-warning info" style="margin-top: 12px;">
        <span class="dose-warning-icon">ℹ️</span>
        <span>${drug.notes}</span>
      </div>
    `;
  }

  html += '</div>';
  return html;
}

function renderElectrolytePanel(drug) {
  let html = '';

  // Patient type toggle
  html += `
    <div class="calc-section" style="margin-top: 16px;">
      <div class="calc-section-title">Patient Type</div>
      <div class="vol-toggle">
        <button class="vol-btn ${state.patientType === 'adult' ? 'active' : ''}" onclick="setPatientType('adult')">
          <div class="vol-btn-label">Adult</div>
          <div class="vol-btn-desc">Factor: ${drug.adultFactor}</div>
        </button>
        <button class="vol-btn ${state.patientType === 'pedia' ? 'active' : ''}" onclick="setPatientType('pedia')">
          <div class="vol-btn-label">Pediatric</div>
          <div class="vol-btn-desc">Factor: ${drug.pedsFactor}</div>
        </button>
      </div>
    </div>
  `;

  // Weight
  html += `
    <div class="calc-section">
      <div class="calc-section-title">Patient Weight</div>
      <div class="input-group">
        <div class="input-wrapper">
          <input type="number" class="input-field" id="calcWeight" placeholder="Enter weight"
                 value="${state.weight}" step="0.1" min="0" inputmode="decimal">
          <span class="input-suffix">kg</span>
        </div>
      </div>
    </div>
  `;

  // Lab value
  const labLabel = drug.formulaType === 'electrolyteDeficit' ? "Patient's K⁺ Level" : "Patient's Na⁺ Level";
  html += `
    <div class="calc-section">
      <div class="calc-section-title">${labLabel}</div>
      <div class="input-group">
        <div class="input-wrapper">
          <input type="number" class="input-field" id="calcLabValue" placeholder="Enter value"
                 value="${state.labValue}" step="0.1" min="0" inputmode="decimal">
          <span class="input-suffix">mEq/L</span>
        </div>
      </div>
    </div>
  `;

  // IVF volume for K+ (optional)
  if (drug.formulaType === 'electrolyteDeficit') {
    html += `
      <div class="calc-section">
        <div class="calc-section-title">IVF Volume (for mixing)</div>
        <div class="input-group">
          <div class="input-wrapper">
            <input type="number" class="input-field" id="calcIvfVol" placeholder="e.g. 250" value="250"
                   step="1" min="0" inputmode="numeric">
            <span class="input-suffix">cc</span>
          </div>
        </div>
      </div>
    `;
  }

  html += '<div id="calcResult"></div>';

  if (drug.notes) {
    html += `
      <div class="calc-section" style="margin-top: 12px;">
        <div class="dose-warning info">
          <span class="dose-warning-icon">ℹ️</span>
          <span>${drug.notes}</span>
        </div>
      </div>
    `;
  }

  return html;
}

function renderBicarbPanel(drug) {
  let html = '';

  html += `
    <div class="calc-section" style="margin-top: 16px;">
      <div class="calc-section-title">Patient Weight</div>
      <div class="input-group">
        <div class="input-wrapper">
          <input type="number" class="input-field" id="calcWeight" placeholder="Enter weight"
                 value="${state.weight}" step="0.1" min="0" inputmode="decimal">
          <span class="input-suffix">kg</span>
        </div>
      </div>
    </div>
    <div class="calc-section">
      <div class="calc-section-title">Base Deficit</div>
      <div class="input-group">
        <div class="input-wrapper">
          <input type="number" class="input-field" id="calcBaseDeficit" placeholder="Enter base deficit"
                 value="${state.baseDeficit}" step="0.1" min="0" inputmode="decimal">
          <span class="input-suffix">mEq/L</span>
        </div>
      </div>
    </div>
    <div id="calcResult"></div>
  `;

  if (drug.notes) {
    html += `
      <div class="calc-section" style="margin-top: 12px;">
        <div class="dose-warning info">
          <span class="dose-warning-icon">ℹ️</span>
          <span>${drug.notes}</span>
        </div>
      </div>
    `;
  }

  return html;
}

function renderCustomDripPanel(drug) {
  if (!state.customDrugUnit) state.customDrugUnit = 'mg';
  if (!state.customDoseUnit) state.customDoseUnit = 'mcg/kg/min';

  let html = `
    <div class="mode-switcher">
      <button class="mode-btn ${state.calcMode === 'doseToRate' ? 'active' : ''}" onclick="setCalcMode('doseToRate')">
        Dose → Rate
      </button>
      <button class="mode-btn ${state.calcMode === 'rateToDose' ? 'active' : ''}" onclick="setCalcMode('rateToDose')">
        Rate → Dose
      </button>
    </div>

    <!-- Drug Concentration Setup -->
    <div class="calc-section">
      <div class="calc-section-title">1. Solution Concentration</div>
      <div class="input-group">
        <div class="input-label"><span class="input-label-text">Drug Amount & Unit</span></div>
        <div class="input-wrapper" style="gap: 8px;">
          <input type="number" class="input-field" id="customDrugAmount" placeholder="e.g. 200"
                 value="${state.customDrugAmount || ''}" step="any" min="0" inputmode="decimal">
          <select class="input-field" id="customDrugUnit" style="width: 110px; flex-shrink: 0; padding: 0 8px;">
            <option value="mg" ${state.customDrugUnit === 'mg' ? 'selected' : ''}>mg</option>
            <option value="mcg" ${state.customDrugUnit === 'mcg' ? 'selected' : ''}>mcg</option>
            <option value="g" ${state.customDrugUnit === 'g' ? 'selected' : ''}>grams</option>
            <option value="units" ${state.customDrugUnit === 'units' ? 'selected' : ''}>units</option>
          </select>
        </div>
      </div>

      <div class="input-group">
        <div class="input-label"><span class="input-label-text">Total Diluent / Solution Volume</span></div>
        <div class="input-wrapper">
          <input type="number" class="input-field" id="customTotalVol" placeholder="e.g. 250"
                 value="${state.customTotalVol || ''}" step="any" min="0" inputmode="decimal">
          <span class="input-suffix">mL (cc)</span>
        </div>
      </div>

      <div id="customConcDisplay" style="font-size: 0.82rem; font-weight: 700; color: var(--orange-600); margin-top: 4px; min-height: 20px;"></div>
    </div>

    <!-- Dosing Setup -->
    <div class="calc-section">
      <div class="calc-section-title">2. Dose Unit & Patient Weight</div>
      <div class="input-group">
        <div class="input-label"><span class="input-label-text">Dose Unit</span></div>
        <select class="input-field" id="customDoseUnit" style="padding: 0 12px;">
          <option value="mcg/kg/min" ${state.customDoseUnit === 'mcg/kg/min' ? 'selected' : ''}>mcg / kg / min</option>
          <option value="mcg/kg/hr" ${state.customDoseUnit === 'mcg/kg/hr' ? 'selected' : ''}>mcg / kg / hr</option>
          <option value="mg/kg/min" ${state.customDoseUnit === 'mg/kg/min' ? 'selected' : ''}>mg / kg / min</option>
          <option value="mg/kg/hr" ${state.customDoseUnit === 'mg/kg/hr' ? 'selected' : ''}>mg / kg / hr</option>
          <option value="mcg/min" ${state.customDoseUnit === 'mcg/min' ? 'selected' : ''}>mcg / min</option>
          <option value="mcg/hr" ${state.customDoseUnit === 'mcg/hr' ? 'selected' : ''}>mcg / hr</option>
          <option value="mg/min" ${state.customDoseUnit === 'mg/min' ? 'selected' : ''}>mg / min</option>
          <option value="mg/hr" ${state.customDoseUnit === 'mg/hr' ? 'selected' : ''}>mg / hr</option>
          <option value="units/hr" ${state.customDoseUnit === 'units/hr' ? 'selected' : ''}>units / hr</option>
          <option value="units/kg/hr" ${state.customDoseUnit === 'units/kg/hr' ? 'selected' : ''}>units / kg / hr</option>
        </select>
      </div>

      <div class="input-group" id="customWeightGroup">
        <div class="input-label"><span class="input-label-text">Patient Weight</span></div>
        <div class="input-wrapper">
          <input type="number" class="input-field" id="calcWeight" placeholder="Enter weight"
                 value="${state.weight || ''}" step="0.1" min="0" inputmode="decimal">
          <span class="input-suffix">kg</span>
        </div>
      </div>
    </div>

    <!-- Mode Specific Computation -->
    <div class="calc-section">
      <div class="calc-section-title">3. Computation</div>
      ${state.calcMode === 'doseToRate' ? `
        <div class="input-group">
          <div class="input-label"><span class="input-label-text">Desired Dose</span></div>
          <div class="input-wrapper">
            <input type="number" class="input-field" id="calcDose" placeholder="Enter dose"
                   value="${state.dose || ''}" step="any" min="0" inputmode="decimal">
            <span class="input-suffix" id="customDoseUnitSuffix">${state.customDoseUnit}</span>
          </div>
        </div>
      ` : `
        <div class="input-group">
          <div class="input-label"><span class="input-label-text">Current Flow Rate</span></div>
          <div class="input-wrapper">
            <input type="number" class="input-field" id="calcRate" placeholder="Enter rate"
                   value="${state.rate || ''}" step="any" min="0" inputmode="decimal">
            <span class="input-suffix">cc/hr</span>
          </div>
        </div>
      `}
    </div>

    <div id="calcResult"></div>
  `;

  return html;
}

function attachCalcListeners(drug) {
  const weightEl = document.getElementById('calcWeight');
  const doseEl = document.getElementById('calcDose');
  const rateEl = document.getElementById('calcRate');
  const labValueEl = document.getElementById('calcLabValue');
  const baseDeficitEl = document.getElementById('calcBaseDeficit');
  const ivfVolEl = document.getElementById('calcIvfVol');

  // Custom drip elements
  const customAmountEl = document.getElementById('customDrugAmount');
  const customUnitEl = document.getElementById('customDrugUnit');
  const customTotalVolEl = document.getElementById('customTotalVol');
  const customDoseUnitEl = document.getElementById('customDoseUnit');

  let recalcScheduled = false;
  const recalc = () => {
    if (recalcScheduled) return;
    recalcScheduled = true;
    requestAnimationFrame(() => {
      recalcScheduled = false;
      recalculate(drug);
    });
  };

  if (weightEl) {
    weightEl.addEventListener('input', (e) => { state.weight = e.target.value; recalc(); });
  }
  if (doseEl) {
    doseEl.addEventListener('input', (e) => { state.dose = e.target.value; recalc(); });
  }
  if (rateEl) {
    rateEl.addEventListener('input', (e) => { state.rate = e.target.value; recalc(); });
  }
  if (labValueEl) {
    labValueEl.addEventListener('input', (e) => { state.labValue = e.target.value; recalc(); });
  }
  if (baseDeficitEl) {
    baseDeficitEl.addEventListener('input', (e) => { state.baseDeficit = e.target.value; recalc(); });
  }
  if (ivfVolEl) {
    ivfVolEl.addEventListener('input', recalc);
  }

  if (customAmountEl) {
    customAmountEl.addEventListener('input', (e) => { state.customDrugAmount = e.target.value; recalc(); });
  }
  if (customUnitEl) {
    customUnitEl.addEventListener('change', (e) => { state.customDrugUnit = e.target.value; recalc(); });
  }
  if (customTotalVolEl) {
    customTotalVolEl.addEventListener('input', (e) => { state.customTotalVol = e.target.value; recalc(); });
  }
  if (customDoseUnitEl) {
    customDoseUnitEl.addEventListener('change', (e) => {
      state.customDoseUnit = e.target.value;
      const suf = document.getElementById('customDoseUnitSuffix');
      if (suf) suf.textContent = e.target.value;
      recalc();
    });
  }

  const presetCustomVolEl = document.getElementById('presetCustomVol');
  const presetCustomAmtEl = document.getElementById('presetCustomAmt');

  if (presetCustomVolEl) {
    presetCustomVolEl.addEventListener('input', (e) => { state.presetCustomVol = e.target.value; recalc(); });
  }
  if (presetCustomAmtEl) {
    presetCustomAmtEl.addEventListener('input', (e) => { state.presetCustomAmt = e.target.value; recalc(); });
  }

  // Basic Formulas Listeners
  const basicInputs = [
    'basicPrescribedDose', 'basicAvailableDose', 'basicAvailVol', 'basicTotalVol',
    'basicTimeHours', 'basicDropFactor', 'basicTimeVal', 'basicTimeUnit',
    'basicDosePerKg', 'basicWeight', 'basicGivenTabs', 'basicAdminVol',
    'basicPumpRate', 'basicTargetGtt', 'basicTotalGivenDose'
  ];
  basicInputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', recalc);
      el.addEventListener('change', recalc);
    }
  });

  // Trigger initial calculation when panel loads
  recalc();
}

function recalculateBasicFormula(drug, resultEl) {
  const isForward = state.calcMode !== 'rateToDose';
  let resultCardHTML = '';
  let equationText = '';
  let steps = [];
  let finalValText = '';

  const renderEmptyCard = () => {
    resultEl.innerHTML = `
      <div class="result-card" style="text-align: center; padding: 26px 16px; border: 1px dashed var(--gray-300); background: var(--gray-50); box-shadow: none;">
        <div style="font-size: 1.8rem; margin-bottom: 6px;">⌨️</div>
        <div class="result-label" style="font-size: 0.95rem; font-weight: 600; color: var(--gray-700);">Enter Values or Tap a Preset</div>
        <div style="font-size: 0.8rem; color: var(--gray-500); margin-top: 4px;">The answer and complete step-by-step math will generate automatically as you type.</div>
      </div>
    `;
  };

  if (drug.formulaType === 'tabletCalc') {
    const presUnit = document.getElementById('basicPrescribedUnit')?.value || state.basicUnits?.prescribed || 'mg';
    const availUnit = document.getElementById('basicAvailableUnit')?.value || state.basicUnits?.available || 'mg';

    if (isForward) {
      const pres = parseFloat(document.getElementById('basicPrescribedDose')?.value);
      const avail = parseFloat(document.getElementById('basicAvailableDose')?.value);
      if (isNaN(pres) || isNaN(avail) || avail <= 0) { renderEmptyCard(); return; }

      const presMg = normalizeToBaseMg(pres, presUnit);
      const availMg = normalizeToBaseMg(avail, availUnit);
      const qty = presMg / availMg;
      const whole = Math.floor(qty);
      const frac = qty % 1;
      const fracText = frac === 0 ? `${qty} Whole Tablets` : `${whole > 0 ? whole + ' Whole + ' : ''}${formatNumber(frac, 2)} Tablet`;
      const isCrossUnit = presUnit !== availUnit;

      resultCardHTML = `
        <div class="result-card">
          <div class="result-label">Required Tablet Quantity</div>
          <div class="result-value">${formatNumber(qty, 2)}</div>
          <div class="result-unit">Tablets / Capsules</div>
          <div class="result-details">
            <div class="result-detail">
              <div class="result-detail-label">Prescribed Dose</div>
              <div class="result-detail-value">${pres} ${presUnit}${isCrossUnit ? ' (' + formatNumber(presMg, 4) + ' mg)' : ''}</div>
            </div>
            <div class="result-detail">
              <div class="result-detail-label">Available Strength</div>
              <div class="result-detail-value">${avail} ${availUnit}/tab${isCrossUnit ? ' (' + formatNumber(availMg, 4) + ' mg/tab)' : ''}</div>
            </div>
            <div class="result-detail">
              <div class="result-detail-label">Tablet Breakdown</div>
              <div class="result-detail-value">${fracText}</div>
            </div>
            <div class="result-detail">
              <div class="result-detail-label">Formula</div>
              <div class="result-detail-value">Prescribed ÷ Available</div>
            </div>
          </div>
        </div>
      `;

      equationText = `Required Quantity (Tabs) = Prescribed Dose (${presUnit}) ÷ Available Dose per Tablet (${availUnit}/tab)`;
      steps = [
        {
          num: 'Step 1: Clinical Values',
          desc: `Prescribed = ${pres} ${presUnit}${isCrossUnit ? ' (converted to ' + formatNumber(presMg, 4) + ' mg)' : ''}, Available Tablet Strength = ${avail} ${availUnit}/tab${isCrossUnit ? ' (converted to ' + formatNumber(availMg, 4) + ' mg/tab)' : ''}`,
          math: `Equation: Quantity = Prescribed ÷ Available`
        },
        {
          num: 'Step 2: Solve Quantity',
          desc: `Divide prescribed dose by tablet strength`,
          math: isCrossUnit
            ? `${formatNumber(presMg, 4)} mg ÷ ${formatNumber(availMg, 4)} mg/tab = ${formatNumber(qty, 2)} Tablets`
            : `${pres} ${presUnit} ÷ ${avail} ${availUnit}/tab = ${formatNumber(qty, 2)} Tablets`
        },
        {
          num: 'Step 3: Clinical Administration',
          desc: frac === 0 ? 'Administer exact whole tablets' : 'Split score line or adjust with liquid formulation if available',
          math: fracText
        }
      ];
      finalValText = `${formatNumber(qty, 2)} Tablets (${fracText})`;
    } else {
      const tabs = parseFloat(document.getElementById('basicGivenTabs')?.value);
      const avail = parseFloat(document.getElementById('basicAvailableDose')?.value);
      if (isNaN(tabs) || isNaN(avail) || avail <= 0) { renderEmptyCard(); return; }
      const totalDose = tabs * avail;

      resultCardHTML = `
        <div class="result-card">
          <div class="result-label">Delivered Total Dose</div>
          <div class="result-value">${formatNumber(totalDose, 2)}</div>
          <div class="result-unit">${availUnit}</div>
          <div class="result-details">
            <div class="result-detail">
              <div class="result-detail-label">Tablets Given</div>
              <div class="result-detail-value">${tabs} tabs</div>
            </div>
            <div class="result-detail">
              <div class="result-detail-label">Available Strength</div>
              <div class="result-detail-value">${avail} ${availUnit}/tab</div>
            </div>
            <div class="result-detail">
              <div class="result-detail-label">Formula</div>
              <div class="result-detail-value">Tablets × Available Strength</div>
            </div>
            <div class="result-detail">
              <div class="result-detail-label">Proof</div>
              <div class="result-detail-value">${tabs} tabs × ${avail} ${availUnit}</div>
            </div>
          </div>
        </div>
      `;

      equationText = `Delivered Dose (${availUnit}) = Number of Tablets × Available Dose per Tablet (${availUnit}/tab)`;
      steps = [
        {
          num: 'Step 1: Identify Given Units',
          desc: `Administered Tablets = ${tabs} tabs, Tablet Strength = ${avail} ${availUnit}/tab`,
          math: `Equation: Delivered Dose = Tablets × Strength`
        },
        {
          num: 'Step 2: Multiply Dosage',
          desc: `Multiply administered tablets by strength per tablet`,
          math: `${tabs} tabs × ${avail} ${availUnit}/tab = ${formatNumber(totalDose, 2)} ${availUnit}`
        }
      ];
      finalValText = `${formatNumber(totalDose, 2)} ${availUnit}`;
    }
  } else if (drug.formulaType === 'liquidCalc') {
    const presUnit = document.getElementById('basicPrescribedUnit')?.value || state.basicUnits?.prescribed || 'mg';
    const availUnit = document.getElementById('basicAvailableUnit')?.value || state.basicUnits?.available || 'mg';

    if (isForward) {
      const pres = parseFloat(document.getElementById('basicPrescribedDose')?.value);
      const avail = parseFloat(document.getElementById('basicAvailableDose')?.value);
      const vol = parseFloat(document.getElementById('basicAvailVol')?.value);
      if (isNaN(pres) || isNaN(avail) || isNaN(vol) || avail <= 0 || vol <= 0) { renderEmptyCard(); return; }

      const presMg = normalizeToBaseMg(pres, presUnit);
      const availMg = normalizeToBaseMg(avail, availUnit);
      const qty = (presMg / availMg) * vol;
      const conc = avail / vol;
      const isCrossUnit = presUnit !== availUnit;

      resultCardHTML = `
        <div class="result-card">
          <div class="result-label">Required Liquid Volume</div>
          <div class="result-value">${formatNumber(qty, 2)}</div>
          <div class="result-unit">mL (Liquid / Suspension)</div>
          <div class="result-details">
            <div class="result-detail">
              <div class="result-detail-label">Stock Concentration</div>
              <div class="result-detail-value">${formatNumber(conc, 2)} ${availUnit}/mL</div>
            </div>
            <div class="result-detail">
              <div class="result-detail-label">Household Teaspoon</div>
              <div class="result-detail-value">${formatNumber(qty / 5, 1)} tsp (${formatNumber(qty / 15, 1)} tbsp)</div>
            </div>
            <div class="result-detail">
              <div class="result-detail-label">Prescribed Dose</div>
              <div class="result-detail-value">${pres} ${presUnit}${isCrossUnit ? ' (' + formatNumber(presMg, 4) + ' mg)' : ''}</div>
            </div>
            <div class="result-detail">
              <div class="result-detail-label">Stock Formulation</div>
              <div class="result-detail-value">${avail} ${availUnit} in ${vol} mL</div>
            </div>
          </div>
        </div>
      `;

      equationText = `Required Volume (mL) = [Prescribed Dose (${presUnit}) ÷ Available Dose (${availUnit})] × Available Volume (mL)`;
      steps = [
        {
          num: 'Step 1: Concentration Determination',
          desc: `Stock bottle contains ${avail} ${availUnit} in ${vol} mL`,
          math: `Stock Conc = ${avail} ${availUnit} ÷ ${vol} mL = ${formatNumber(conc, 2)} ${availUnit}/mL`
        },
        {
          num: 'Step 2: Calculate Dose Ratio',
          desc: isCrossUnit ? `Convert and divide: ${formatNumber(presMg, 4)} mg ÷ ${formatNumber(availMg, 4)} mg` : `Prescribed dose divided by available dose`,
          math: `Ratio = ${formatNumber(presMg / availMg, 4)}`
        },
        {
          num: 'Step 3: Solve Volume to Measure',
          desc: `Multiply dose ratio by available volume`,
          math: `(${formatNumber(presMg / availMg, 4)}) × ${vol} mL = ${formatNumber(qty, 2)} mL`
        },
        {
          num: 'Step 4: Household Measure Equivalent',
          desc: `1 teaspoon (tsp) = 5 mL, 1 tablespoon (tbsp) = 15 mL`,
          math: `${formatNumber(qty, 2)} mL ÷ 5 = ${formatNumber(qty / 5, 1)} tsp`
        }
      ];
      finalValText = `${formatNumber(qty, 2)} mL (${formatNumber(qty / 5, 1)} tsp)`;
    } else {
      const adminVol = parseFloat(document.getElementById('basicAdminVol')?.value);
      const avail = parseFloat(document.getElementById('basicAvailableDose')?.value);
      const vol = parseFloat(document.getElementById('basicAvailVol')?.value);
      if (isNaN(adminVol) || isNaN(avail) || isNaN(vol) || vol <= 0) { renderEmptyCard(); return; }
      const dose = (adminVol / vol) * avail;
      const conc = avail / vol;

      resultCardHTML = `
        <div class="result-card">
          <div class="result-label">Delivered Liquid Dose</div>
          <div class="result-value">${formatNumber(dose, 2)}</div>
          <div class="result-unit">${availUnit}</div>
          <div class="result-details">
            <div class="result-detail">
              <div class="result-detail-label">Administered Volume</div>
              <div class="result-detail-value">${adminVol} mL</div>
            </div>
            <div class="result-detail">
              <div class="result-detail-label">Stock Concentration</div>
              <div class="result-detail-value">${formatNumber(conc, 2)} ${availUnit}/mL</div>
            </div>
            <div class="result-detail">
              <div class="result-detail-label">Stock Formulation</div>
              <div class="result-detail-value">${avail} ${availUnit} in ${vol} mL</div>
            </div>
            <div class="result-detail">
              <div class="result-detail-label">Formula Proof</div>
              <div class="result-detail-value">(${adminVol} ÷ ${vol}) × ${avail} ${availUnit}</div>
            </div>
          </div>
        </div>
      `;

      equationText = `Delivered Dose (${availUnit}) = [Administered Volume (mL) ÷ Available Volume (mL)] × Available Dose (${availUnit})`;
      steps = [
        {
          num: 'Step 1: Stock Concentration',
          desc: `${avail} ${availUnit} in ${vol} mL`,
          math: `${avail} ${availUnit} ÷ ${vol} mL = ${formatNumber(conc, 2)} ${availUnit}/mL`
        },
        {
          num: 'Step 2: Solve Delivered Dose',
          desc: `Multiply administered volume by stock concentration`,
          math: `${adminVol} mL × ${formatNumber(conc, 2)} ${availUnit}/mL = ${formatNumber(dose, 2)} ${availUnit}`
        }
      ];
      finalValText = `${formatNumber(dose, 2)} ${availUnit}`;
    }
  } else if (drug.formulaType === 'injectionCalc') {
    const presUnit = document.getElementById('basicPrescribedUnit')?.value || state.basicUnits?.prescribed || 'mg';
    const availUnit = document.getElementById('basicAvailableUnit')?.value || state.basicUnits?.available || 'mg';

    if (isForward) {
      const pres = parseFloat(document.getElementById('basicPrescribedDose')?.value);
      const avail = parseFloat(document.getElementById('basicAvailableDose')?.value);
      const vol = parseFloat(document.getElementById('basicAvailVol')?.value);
      if (isNaN(pres) || isNaN(avail) || isNaN(vol) || avail <= 0 || vol <= 0) { renderEmptyCard(); return; }

      const presMg = normalizeToBaseMg(pres, presUnit);
      const availMg = normalizeToBaseMg(avail, availUnit);
      const qty = (presMg / availMg) * vol;
      const conc = avail / vol;
      const isCrossUnit = presUnit !== availUnit;

      resultCardHTML = `
        <div class="result-card">
          <div class="result-label">Required Injectable Volume</div>
          <div class="result-value">${formatNumber(qty, 2)}</div>
          <div class="result-unit">mL (IV / IM Vial)</div>
          <div class="result-details">
            <div class="result-detail">
              <div class="result-detail-label">Vial Concentration</div>
              <div class="result-detail-value">${formatNumber(conc, 2)} ${availUnit}/mL</div>
            </div>
            <div class="result-detail">
              <div class="result-detail-label">Prescribed Dose</div>
              <div class="result-detail-value">${pres} ${presUnit}${isCrossUnit ? ' (' + formatNumber(presMg, 4) + ' mg)' : ''}</div>
            </div>
            <div class="result-detail">
              <div class="result-detail-label">Vial Total Strength</div>
              <div class="result-detail-value">${avail} ${availUnit} in ${vol} mL</div>
            </div>
            <div class="result-detail">
              <div class="result-detail-label">Formula Proof</div>
              <div class="result-detail-value">(${pres} ÷ ${avail}) × ${vol} mL</div>
            </div>
          </div>
        </div>
      `;

      equationText = `Required Volume (mL) = [Prescribed Dose (${presUnit}) ÷ Available Dose (${availUnit})] × Diluent Volume (mL)`;
      steps = [
        {
          num: 'Step 1: Reconstitution Concentration',
          desc: `Reconstituted vial contains ${avail} ${availUnit} in ${vol} mL diluent`,
          math: `Vial Conc = ${avail} ${availUnit} ÷ ${vol} mL = ${formatNumber(conc, 2)} ${availUnit}/mL`
        },
        {
          num: 'Step 2: Solve Injectable Volume',
          desc: isCrossUnit ? `Prescribed dose divided by concentration (with unit normalization)` : `Prescribed dose divided by concentration`,
          math: `Volume = ${formatNumber(qty, 2)} mL`
        }
      ];
      finalValText = `${formatNumber(qty, 2)} mL`;
    } else {
      const adminVol = parseFloat(document.getElementById('basicAdminVol')?.value);
      const avail = parseFloat(document.getElementById('basicAvailableDose')?.value);
      const vol = parseFloat(document.getElementById('basicAvailVol')?.value);
      if (isNaN(adminVol) || isNaN(avail) || isNaN(vol) || vol <= 0) { renderEmptyCard(); return; }
      const dose = (adminVol / vol) * avail;
      const conc = avail / vol;

      resultCardHTML = `
        <div class="result-card">
          <div class="result-label">Delivered Injected Dose</div>
          <div class="result-value">${formatNumber(dose, 2)}</div>
          <div class="result-unit">${availUnit}</div>
          <div class="result-details">
            <div class="result-detail">
              <div class="result-detail-label">Volume Injected</div>
              <div class="result-detail-value">${adminVol} mL</div>
            </div>
            <div class="result-detail">
              <div class="result-detail-label">Reconstituted Conc</div>
              <div class="result-detail-value">${formatNumber(conc, 2)} ${availUnit}/mL</div>
            </div>
            <div class="result-detail">
              <div class="result-detail-label">Vial Preparation</div>
              <div class="result-detail-value">${avail} ${availUnit} in ${vol} mL</div>
            </div>
            <div class="result-detail">
              <div class="result-detail-label">Proof</div>
              <div class="result-detail-value">(${adminVol} ÷ ${vol}) × ${avail} ${availUnit}</div>
            </div>
          </div>
        </div>
      `;

      equationText = `Delivered Dose (${availUnit}) = [Injected Volume (mL) ÷ Diluent Volume (mL)] × Vial Dose (${availUnit})`;
      steps = [
        {
          num: 'Step 1: Vial Concentration',
          desc: `${avail} ${availUnit} reconstituted in ${vol} mL`,
          math: `${avail} ${availUnit} ÷ ${vol} mL = ${formatNumber(conc, 2)} ${availUnit}/mL`
        },
        {
          num: 'Step 2: Calculate Administered Dose',
          desc: `Multiply injected volume by concentration`,
          math: `${adminVol} mL × ${formatNumber(conc, 2)} ${availUnit}/mL = ${formatNumber(dose, 2)} ${availUnit}`
        }
      ];
      finalValText = `${formatNumber(dose, 2)} ${availUnit}`;
    }
  } else if (drug.formulaType === 'ivFlowRateCalc') {
    if (isForward) {
      const vol = parseFloat(document.getElementById('basicTotalVol')?.value);
      const hours = parseFloat(document.getElementById('basicTimeHours')?.value);
      if (isNaN(vol) || isNaN(hours) || hours <= 0) { renderEmptyCard(); return; }
      const rate = vol / hours;
      const macro15 = (rate * 15) / 60;
      const macro20 = (rate * 20) / 60;
      const micro60 = rate;

      resultCardHTML = `
        <div class="result-card">
          <div class="result-label">IV Infusion Flow Rate</div>
          <div class="result-value">${formatNumber(rate, 2)}</div>
          <div class="result-unit">mL/hr (cc/hr)</div>
          <div class="result-details">
            <div class="result-detail">
              <div class="result-detail-label">Macro Drip (15 gtt)</div>
              <div class="result-detail-value">${formatNumber(macro15, 1)} gtt/min</div>
            </div>
            <div class="result-detail">
              <div class="result-detail-label">Macro Drip (20 gtt)</div>
              <div class="result-detail-value">${formatNumber(macro20, 1)} gtt/min</div>
            </div>
            <div class="result-detail">
              <div class="result-detail-label">Micro Drip (60 gtt)</div>
              <div class="result-detail-value">${formatNumber(micro60, 1)} gtt/min</div>
            </div>
            <div class="result-detail">
              <div class="result-detail-label">Total Volume</div>
              <div class="result-detail-value">${vol} mL over ${hours} hrs</div>
            </div>
          </div>
        </div>
      `;

      equationText = `Flow Rate (mL/hr) = Total Infusion Volume (mL) ÷ Infusion Duration (hours)`;
      steps = [
        {
          num: 'Step 1: Clinical Values',
          desc: `Total Volume = ${vol} mL, Duration = ${hours} hours`,
          math: `Rate (mL/hr) = Volume ÷ Time`
        },
        {
          num: 'Step 2: Solve Volumetric Pump Rate',
          desc: `Divide total volume by total duration`,
          math: `${vol} mL ÷ ${hours} hrs = ${formatNumber(rate, 2)} mL/hr`
        },
        {
          num: 'Step 3: Macro Drip Conversion (15 gtt/mL)',
          desc: `gtt/min = (Rate × 15) ÷ 60`,
          math: `(${formatNumber(rate, 2)} × 15) ÷ 60 = ${formatNumber(macro15, 1)} gtt/min`
        },
        {
          num: 'Step 4: Standard Drip Conversion (20 gtt/mL)',
          desc: `gtt/min = (Rate × 20) ÷ 60`,
          math: `(${formatNumber(rate, 2)} × 20) ÷ 60 = ${formatNumber(macro20, 1)} gtt/min`
        }
      ];
      finalValText = `${formatNumber(rate, 2)} mL/hr (${formatNumber(macro15, 1)} gtt/min)`;
    } else {
      const vol = parseFloat(document.getElementById('basicTotalVol')?.value);
      const rate = parseFloat(document.getElementById('basicPumpRate')?.value);
      if (isNaN(vol) || isNaN(rate) || rate <= 0) { renderEmptyCard(); return; }
      const hours = vol / rate;
      const hrsInt = Math.floor(hours);
      const minsInt = Math.round((hours % 1) * 60);

      resultCardHTML = `
        <div class="result-card">
          <div class="result-label">Total Infusion Duration</div>
          <div class="result-value">${formatNumber(hours, 2)} hrs</div>
          <div class="result-unit">(${hrsInt}h ${minsInt}m)</div>
          <div class="result-details">
            <div class="result-detail">
              <div class="result-detail-label">Total Minutes</div>
              <div class="result-detail-value">${formatNumber(hours * 60, 0)} min</div>
            </div>
            <div class="result-detail">
              <div class="result-detail-label">Pump Flow Rate</div>
              <div class="result-detail-value">${rate} mL/hr</div>
            </div>
            <div class="result-detail">
              <div class="result-detail-label">Total Volume</div>
              <div class="result-detail-value">${vol} mL</div>
            </div>
            <div class="result-detail">
              <div class="result-detail-label">Proof</div>
              <div class="result-detail-value">${vol} mL ÷ ${rate} mL/hr</div>
            </div>
          </div>
        </div>
      `;

      equationText = `Infusion Duration (hours) = Total Infusion Volume (mL) ÷ Pump Flow Rate (mL/hr)`;
      steps = [
        {
          num: 'Step 1: Parameters',
          desc: `Volume = ${vol} mL, Pump Flow Rate = ${rate} mL/hr`,
          math: `Time = Volume ÷ Flow Rate`
        },
        {
          num: 'Step 2: Solve Time in Hours',
          desc: `Divide volume by rate`,
          math: `${vol} mL ÷ ${rate} mL/hr = ${formatNumber(hours, 2)} hours`
        },
        {
          num: 'Step 3: Convert to Hours & Minutes',
          desc: `${formatNumber(hours % 1, 2)} hrs × 60 min`,
          math: `${hrsInt} hours and ${minsInt} minutes`
        }
      ];
      finalValText = `${formatNumber(hours, 2)} hours (${hrsInt}h ${minsInt}m)`;
    }
  } else if (drug.formulaType === 'dropRateCalc') {
    if (isForward) {
      const vol = parseFloat(document.getElementById('basicTotalVol')?.value);
      const dropFactor = parseFloat(document.getElementById('basicDropFactor')?.value || 20);
      const timeVal = parseFloat(document.getElementById('basicTimeVal')?.value);
      const timeUnit = document.getElementById('basicTimeUnit')?.value || 'hours';
      if (isNaN(vol) || isNaN(timeVal) || timeVal <= 0) { renderEmptyCard(); return; }
      const timeMin = timeUnit === 'hours' ? timeVal * 60 : timeVal;
      const gttMin = (vol * dropFactor) / timeMin;
      const equivRate = vol / (timeMin / 60);

      resultCardHTML = `
        <div class="result-card">
          <div class="result-label">Gravity Infusion Drop Rate</div>
          <div class="result-value">${formatNumber(gttMin, 1)}</div>
          <div class="result-unit">gtt/min (drops/minute)</div>
          <div class="result-details">
            <div class="result-detail">
              <div class="result-detail-label">Pump Equivalent</div>
              <div class="result-detail-value">${formatNumber(equivRate, 1)} mL/hr</div>
            </div>
            <div class="result-detail">
              <div class="result-detail-label">Tubing Drop Factor</div>
              <div class="result-detail-value">${dropFactor} gtt/mL</div>
            </div>
            <div class="result-detail">
              <div class="result-detail-label">Total Duration</div>
              <div class="result-detail-value">${timeMin} min (${formatNumber(timeMin / 60, 2)} hrs)</div>
            </div>
            <div class="result-detail">
              <div class="result-detail-label">Total Infusion Drops</div>
              <div class="result-detail-value">${formatNumber(vol * dropFactor)} drops</div>
            </div>
          </div>
        </div>
      `;

      equationText = `Drop Rate (gtt/min) = [Total Volume (mL) × Drop Factor (gtt/mL)] ÷ Infusion Time (min)`;
      steps = [
        {
          num: 'Step 1: Calculate Total Drops',
          desc: `Multiply container volume by tubing calibration factor`,
          math: `${vol} mL × ${dropFactor} gtt/mL = ${formatNumber(vol * dropFactor)} total drops`
        },
        {
          num: 'Step 2: Convert Duration to Minutes',
          desc: `${timeVal} ${timeUnit}`,
          math: `Time = ${timeMin} minutes`
        },
        {
          num: 'Step 3: Solve Gravity Drop Rate',
          desc: `Total drops divided by total minutes`,
          math: `${formatNumber(vol * dropFactor)} drops ÷ ${timeMin} min = ${formatNumber(gttMin, 1)} gtt/min`
        }
      ];
      finalValText = `${formatNumber(gttMin, 1)} gtt/min (≈ ${Math.round(gttMin)} drops/min)`;
    } else {
      const vol = parseFloat(document.getElementById('basicTotalVol')?.value);
      const dropFactor = parseFloat(document.getElementById('basicDropFactor')?.value || 20);
      const targetGtt = parseFloat(document.getElementById('basicTargetGtt')?.value);
      if (isNaN(vol) || isNaN(targetGtt) || targetGtt <= 0) { renderEmptyCard(); return; }
      const totalDrops = vol * dropFactor;
      const timeMin = totalDrops / targetGtt;
      const hours = timeMin / 60;
      const hrsInt = Math.floor(hours);
      const minsInt = Math.round(timeMin % 60);

      resultCardHTML = `
        <div class="result-card">
          <div class="result-label">Total Infusion Time</div>
          <div class="result-value">${formatNumber(hours, 2)} hrs</div>
          <div class="result-unit">(${hrsInt}h ${minsInt}m)</div>
          <div class="result-details">
            <div class="result-detail">
              <div class="result-detail-label">Total Minutes</div>
              <div class="result-detail-value">${formatNumber(timeMin, 1)} min</div>
            </div>
            <div class="result-detail">
              <div class="result-detail-label">Set Drop Rate</div>
              <div class="result-detail-value">${targetGtt} gtt/min</div>
            </div>
            <div class="result-detail">
              <div class="result-detail-label">Drop Factor</div>
              <div class="result-detail-value">${dropFactor} gtt/mL</div>
            </div>
            <div class="result-detail">
              <div class="result-detail-label">Total Drops</div>
              <div class="result-detail-value">${formatNumber(totalDrops)} drops</div>
            </div>
          </div>
        </div>
      `;

      equationText = `Infusion Time (min) = [Total Volume (mL) × Drop Factor (gtt/mL)] ÷ Drop Rate (gtt/min)`;
      steps = [
        {
          num: 'Step 1: Total Drops',
          desc: `Volume × Drop Factor`,
          math: `${vol} mL × ${dropFactor} gtt/mL = ${formatNumber(totalDrops)} drops`
        },
        {
          num: 'Step 2: Solve Time in Minutes',
          desc: `Total drops divided by drop rate`,
          math: `${formatNumber(totalDrops)} drops ÷ ${targetGtt} gtt/min = ${formatNumber(timeMin, 1)} min`
        },
        {
          num: 'Step 3: Convert to Hours & Minutes',
          desc: `${formatNumber(timeMin, 1)} min ÷ 60`,
          math: `${hrsInt} hours and ${minsInt} minutes`
        }
      ];
      finalValText = `${formatNumber(hours, 2)} hours (${hrsInt}h ${minsInt}m)`;
    }
  } else if (drug.formulaType === 'weightDoseCalc') {
    if (isForward) {
      const dosePerKg = parseFloat(document.getElementById('basicDosePerKg')?.value);
      const wt = parseFloat(document.getElementById('basicWeight')?.value);
      const unit = document.getElementById('basicDosePerKgUnit')?.value || state.basicUnits?.dosePerKg || 'mg';
      if (isNaN(dosePerKg) || isNaN(wt) || wt <= 0) { renderEmptyCard(); return; }
      const reqDose = dosePerKg * wt;

      let altUnitVal = '';
      let altUnitLabel = '';
      if (unit === 'mg') {
        altUnitVal = `${formatNumber(reqDose / 1000, 3)} g`;
        altUnitLabel = 'Gram Equivalent';
      } else if (unit === 'mcg') {
        altUnitVal = `${formatNumber(reqDose / 1000, 3)} mg`;
        altUnitLabel = 'Milligram Equivalent';
      } else if (unit === 'g') {
        altUnitVal = `${formatNumber(reqDose * 1000, 1)} mg`;
        altUnitLabel = 'Milligram Equivalent';
      }

      resultCardHTML = `
        <div class="result-card">
          <div class="result-label">Required Total Dose</div>
          <div class="result-value">${formatNumber(reqDose, 2)}</div>
          <div class="result-unit">${unit}</div>
          <div class="result-details">
            ${altUnitVal ? `
              <div class="result-detail">
                <div class="result-detail-label">${altUnitLabel}</div>
                <div class="result-detail-value">${altUnitVal}</div>
              </div>
            ` : ''}
            <div class="result-detail">
              <div class="result-detail-label">Dose per kg</div>
              <div class="result-detail-value">${dosePerKg} ${unit}/kg</div>
            </div>
            <div class="result-detail">
              <div class="result-detail-label">Patient Weight</div>
              <div class="result-detail-value">${wt} kg</div>
            </div>
            <div class="result-detail">
              <div class="result-detail-label">Daily BID (q12h)</div>
              <div class="result-detail-value">${formatNumber(reqDose * 2, 2)} ${unit}/day</div>
            </div>
          </div>
        </div>
      `;

      equationText = `Required Total Dose (${unit}) = Dose per Kilogram (${unit}/kg) × Patient Weight (kg)`;
      steps = [
        {
          num: 'Step 1: Clinical Values',
          desc: `Dose Specification = ${dosePerKg} ${unit}/kg, Patient Weight = ${wt} kg`,
          math: `Total Dose = Dose/kg × Weight`
        },
        {
          num: 'Step 2: Solve Total Dose',
          desc: `Multiply dose per kg by patient weight`,
          math: `${dosePerKg} ${unit}/kg × ${wt} kg = ${formatNumber(reqDose, 2)} ${unit}`
        }
      ];
      if (altUnitVal) {
        steps.push({
          num: 'Step 3: Unit Equivalent',
          desc: altUnitLabel,
          math: altUnitVal
        });
      }
      finalValText = `${formatNumber(reqDose, 2)} ${unit}${altUnitVal ? ' (' + altUnitVal + ')' : ''}`;
    } else {
      const totalGivenDose = parseFloat(document.getElementById('basicTotalGivenDose')?.value);
      const wt = parseFloat(document.getElementById('basicWeight')?.value);
      const unit = document.getElementById('basicTotalGivenUnit')?.value || state.basicUnits?.totalGiven || 'mg';
      if (isNaN(totalGivenDose) || isNaN(wt) || wt <= 0) { renderEmptyCard(); return; }
      const deliveredDosePerKg = totalGivenDose / wt;

      resultCardHTML = `
        <div class="result-card">
          <div class="result-label">Delivered Dose per kg</div>
          <div class="result-value">${formatNumber(deliveredDosePerKg, 2)}</div>
          <div class="result-unit">${unit}/kg</div>
          <div class="result-details">
            <div class="result-detail">
              <div class="result-detail-label">Total Given Dose</div>
              <div class="result-detail-value">${totalGivenDose} ${unit}</div>
            </div>
            <div class="result-detail">
              <div class="result-detail-label">Patient Weight</div>
              <div class="result-detail-value">${wt} kg</div>
            </div>
            <div class="result-detail">
              <div class="result-detail-label">Formula</div>
              <div class="result-detail-value">Total Dose ÷ Weight</div>
            </div>
            <div class="result-detail">
              <div class="result-detail-label">Proof</div>
              <div class="result-detail-value">${totalGivenDose} ${unit} ÷ ${wt} kg</div>
            </div>
          </div>
        </div>
      `;

      equationText = `Delivered Dose per kg (${unit}/kg) = Total Administered Dose (${unit}) ÷ Patient Weight (kg)`;
      steps = [
        {
          num: 'Step 1: Clinical Values',
          desc: `Total Given Dose = ${totalGivenDose} ${unit}, Patient Weight = ${wt} kg`,
          math: `Dose/kg = Total Dose ÷ Weight`
        },
        {
          num: 'Step 2: Solve Delivered Dose/kg',
          desc: `Divide total administered dose by patient weight`,
          math: `${totalGivenDose} ${unit} ÷ ${wt} kg = ${formatNumber(deliveredDosePerKg, 2)} ${unit}/kg`
        }
      ];
      finalValText = `${formatNumber(deliveredDosePerKg, 2)} ${unit}/kg`;
    }
  }

  let html = resultCardHTML;
  html += `
    <button class="formula-toggle-btn" onclick="toggleFormulaBreakdown()">
      📐 ${state.showFormulaBreakdown ? 'Hide Computation Formula' : 'Show Computation Formula & Steps'}
    </button>

    <button class="formula-toggle-btn" style="background: var(--white); border-color: var(--orange-500); color: var(--orange-700);" onclick="openDosingTable()">
      📊 Generate Dosing Table & Export to Excel / Google Sheets
    </button>
  `;

  if (state.showFormulaBreakdown) {
    html += `
      <div class="formula-card">
        <div class="formula-card-header">
          <div class="formula-card-title">📐 Step-by-Step Computation Formula</div>
          <button type="button" class="search-clear visible" onclick="toggleFormulaBreakdown()" title="Close breakdown" style="position:static;">✕</button>
        </div>

        <div class="formula-equation-box">
          ${equationText}
        </div>

        <div class="formula-step-list">
          ${steps.map(s => `
            <div class="formula-step-item">
              <div class="formula-step-num">${s.num}</div>
              <div class="formula-step-desc">${s.desc}</div>
              <div class="formula-step-math">${s.math}</div>
            </div>
          `).join('')}
        </div>

        <div class="formula-final-box">
          <span>Calculated Result:</span>
          <span class="formula-final-val">${finalValText}</span>
        </div>
      </div>
    `;
  }

  resultEl.innerHTML = html;
}

function recalculate(drug) {
  const resultEl = document.getElementById('calcResult');
  if (!resultEl) return;

  // Basic Drug Calculations Made Easy
  if (['tabletCalc', 'liquidCalc', 'injectionCalc', 'ivFlowRateCalc', 'dropRateCalc', 'weightDoseCalc'].includes(drug.formulaType)) {
    recalculateBasicFormula(drug, resultEl);
    return;
  }

  // Custom drip calculator
  if (drug.formulaType === 'customDrip') {
    recalculateCustomDrip();
    return;
  }

  // Electrolyte deficit calculators
  if (drug.formulaType === 'electrolyteDeficit' || drug.formulaType === 'electrolyteDeficitNa') {
    const result = calculateElectrolyteDeficit(drug, state.labValue, state.weight, state.patientType);
    if (!result || result.deficit === undefined) {
      resultEl.innerHTML = '';
      return;
    }

    if (drug.formulaType === 'electrolyteDeficit') {
      const ivfVol = parseFloat(document.getElementById('calcIvfVol')?.value || 250);
      const totalVol = result.stockCc + ivfVol;
      resultEl.innerHTML = `
        <div class="result-card">
          <div class="result-label">K⁺ Deficit</div>
          <div class="result-value">${formatNumber(result.deficit)}</div>
          <div class="result-unit">mEq</div>
          <div class="result-details">
            <div class="result-detail">
              <div class="result-detail-label">KCL Volume</div>
              <div class="result-detail-value">${formatNumber(result.stockCc)} cc</div>
            </div>
            <div class="result-detail">
              <div class="result-detail-label">Total Vol</div>
              <div class="result-detail-value">${formatNumber(totalVol)} cc</div>
            </div>
          </div>
        </div>
        <div class="mixing-card" style="margin-top: 12px;">
          <div class="mixing-title">🧪 Mixing</div>
          <div class="mixing-row"><span class="mixing-label">KCL</span><span class="mixing-value">${formatNumber(result.stockCc)} cc (from ${drug.stockConc} mEq/${drug.stockVol} cc stock)</span></div>
          <div class="mixing-row"><span class="mixing-label">IVF</span><span class="mixing-value">${ivfVol} cc</span></div>
          <div class="mixing-row"><span class="mixing-label">Total</span><span class="mixing-value">${formatNumber(totalVol)} cc</span></div>
        </div>
      `;
    } else {
      resultEl.innerHTML = `
        <div class="electrolyte-result">
          <div class="electrolyte-row"><span>Na⁺ Deficit</span><span>${formatNumber(result.deficit)} mEq</span></div>
          <div class="electrolyte-row"><span>Maintenance (wt × 2)</span><span>${formatNumber(result.maintenance)} mEq</span></div>
          <div class="electrolyte-row"><span>Total Replacement</span><span>${formatNumber(result.total)} mEq</span></div>
        </div>
      `;
    }
    return;
  }

  // Bicarb deficit
  if (drug.formulaType === 'bicarbDeficit') {
    const result = calculateBicarbDeficit(state.baseDeficit, state.weight);
    if (!result) {
      resultEl.innerHTML = '';
      return;
    }
    resultEl.innerHTML = `
      <div class="electrolyte-result">
        <div class="electrolyte-row"><span>Full Correction</span><span>${formatNumber(result.full)} mEq</span></div>
        <div class="electrolyte-row"><span>Half Correction</span><span>${formatNumber(result.half)} mEq</span></div>
      </div>
    `;
    return;
  }

  // Standard or Custom drip concentration resolution
  let conc = null;
  if (state.selectedVolume === 'custom' || state.selectedConc === 'custom') {
    const vol = parseFloat(state.presetCustomVol || (drug.concentrations[state.selectedVolume]?.[0]?.totalVol) || 250);
    const amt = parseFloat(state.presetCustomAmt);

    if (!isNaN(vol) && vol > 0 && !isNaN(amt) && amt > 0) {
      let concMcg = 0;
      let concMg = 0;
      let concUnits = 0;

      if (['weightPerMin', 'weightPerHour'].includes(drug.formulaType)) {
        concMcg = (amt * 1000) / vol;
        concMg = amt / vol;
      } else if (['dosePerHour', 'dosePerMin'].includes(drug.formulaType)) {
        concMg = amt / vol;
        concMcg = (amt * 1000) / vol;
      } else if (['heparin', 'unitsPerMin'].includes(drug.formulaType)) {
        concUnits = amt / vol;
      }

      const concText = ['heparin', 'unitsPerMin'].includes(drug.formulaType)
        ? `${formatNumber(concUnits)} U/cc`
        : ['weightPerMin', 'weightPerHour'].includes(drug.formulaType)
          ? `${formatNumber(concMcg)} mcg/cc (${formatNumber(concMg, 3)} mg/cc)`
          : `${formatNumber(concMg, 3)} mg/cc`;

      conc = {
        label: 'Custom',
        concMcgPerCc: concMcg,
        concMgPerCc: concMg,
        concUnitsPerCc: concUnits,
        totalVol: vol,
        drugMg: amt,
        concNote: `Custom Mix (${concText})`
      };

      const summaryEl = document.getElementById('presetCustomConcSummary');
      if (summaryEl) {
        summaryEl.textContent = `Calculated Concentration: ${concText}`;
      }
    } else {
      const summaryEl = document.getElementById('presetCustomConcSummary');
      if (summaryEl) summaryEl.textContent = 'Please enter drug amount and solution volume above.';
    }
  } else {
    const concs = (drug.concentrations[state.selectedVolume])
      ? drug.concentrations[state.selectedVolume]
      : (drug.concentrations ? Object.values(drug.concentrations)[0] : []);
    const concIdx = (concs[state.selectedConc]) ? state.selectedConc : 0;
    conc = concs[concIdx];
  }

  if (!conc) { resultEl.innerHTML = ''; return; }

  if (state.calcMode === 'doseToRate') {
    const dose = parseFloat(state.dose);
    const weight = parseFloat(state.weight);

    // Update dose warning
    const warningEl = document.getElementById('doseWarning');
    const warning = getDoseWarning(drug, state.dose);
    if (warningEl && warning) {
      warningEl.innerHTML = `
        <div class="dose-warning ${warning.type}">
          <span class="dose-warning-icon">${warning.type === 'success' ? '✅' : warning.type === 'danger' ? '🚨' : warning.type === 'warning' ? '⚠️' : 'ℹ️'}</span>
          <span>${warning.message}</span>
        </div>
      `;
    } else if (warningEl) {
      warningEl.innerHTML = '';
    }

    // Update dose range marker
    const markerEl = document.getElementById('doseMarker');
    if (markerEl && drug.doseRange) {
      const pct = getDoseRangePercent(drug, state.dose);
      markerEl.style.left = `${pct}%`;
    }

    const result = calculateDoseToRate(drug, dose, weight, conc);
    if (!result) {
      resultEl.innerHTML = '';
      return;
    }

    // Calculate gtts/min (macro drip: 15 gtts = 1 ml)
    const gttsPerMin = (result.rate * 15) / 60;

    resultEl.innerHTML = `
      <div class="result-card">
        <div class="result-label">Flow Rate</div>
        <div class="result-value">${formatNumber(result.rate)}</div>
        <div class="result-unit">${result.unit}</div>
        <div class="result-details">
          <div class="result-detail">
            <div class="result-detail-label">Macro Drip</div>
            <div class="result-detail-value">${formatNumber(gttsPerMin)} gtts/min</div>
          </div>
          <div class="result-detail">
            <div class="result-detail-label">Concentration</div>
            <div class="result-detail-value">${formatNumber(result.conc)} ${result.concUnit}</div>
          </div>
        </div>
      </div>

      <button class="formula-toggle-btn" onclick="toggleFormulaBreakdown()">
        📐 ${state.showFormulaBreakdown ? 'Hide Computation Formula' : 'Show Computation Formula & Steps'}
      </button>

      <button class="formula-toggle-btn" style="background: var(--white); border-color: var(--orange-500); color: var(--orange-700);" onclick="openDosingTable()">
        📊 Generate Dosing Table & Export to Excel / Google Sheets
      </button>
    `;

    if (state.showFormulaBreakdown) {
      resultEl.innerHTML += generateFormulaBreakdownHTML(drug, state.calcMode, conc, weight, dose, null, result);
    }
  } else {
    const rate = parseFloat(state.rate);
    const weight = parseFloat(state.weight);
    const result = calculateRateToDose(drug, rate, weight, conc);
    if (!result) {
      resultEl.innerHTML = '';
      return;
    }

    resultEl.innerHTML = `
      <div class="result-card">
        <div class="result-label">Current Dose</div>
        <div class="result-value">${formatNumber(result.dose, 4)}</div>
        <div class="result-unit">${result.unit}</div>
        <div class="result-details">
          <div class="result-detail">
            <div class="result-detail-label">Flow Rate</div>
            <div class="result-detail-value">${formatNumber(rate)} cc/hr</div>
          </div>
          <div class="result-detail">
            <div class="result-detail-label">Concentration</div>
            <div class="result-detail-value">${formatNumber(result.conc)} ${result.concUnit}</div>
          </div>
        </div>
      </div>

      <button class="formula-toggle-btn" onclick="toggleFormulaBreakdown()">
        📐 ${state.showFormulaBreakdown ? 'Hide Computation Formula' : 'Show Computation Formula & Steps'}
      </button>

      <button class="formula-toggle-btn" style="background: var(--white); border-color: var(--orange-500); color: var(--orange-700);" onclick="openDosingTable()">
        📊 Generate Dosing Table & Export to Excel / Google Sheets
      </button>
    `;

    // Show dose warning for reverse calc
    const warning = getDoseWarning(drug, result.dose);
    if (warning) {
      resultEl.innerHTML += `
        <div class="dose-warning ${warning.type}" style="margin-top: 12px;">
          <span class="dose-warning-icon">${warning.type === 'success' ? '✅' : warning.type === 'danger' ? '🚨' : warning.type === 'warning' ? '⚠️' : 'ℹ️'}</span>
          <span>${warning.message}</span>
        </div>
      `;
    }

    if (state.showFormulaBreakdown) {
      resultEl.innerHTML += generateFormulaBreakdownHTML(drug, state.calcMode, conc, weight, null, rate, result);
    }
  }
}

function openDosingTable(drugKey) {
  const targetKey = (typeof drugKey === 'string' && DRUGS[drugKey]) ? drugKey : (state.selectedDrug || 'dopamine');
  const drug = DRUGS[targetKey];
  if (!drug) return;

  state.selectedDrug = targetKey;
  const data = generateDosingTableData(drug);
  if (!data || !data.rows || data.rows.length === 0) return;

  const overlay = document.getElementById('dosingTableOverlay');
  const sub = document.getElementById('dosingTableSub');
  const body = document.getElementById('dosingTableBody');

  if (sub) {
    sub.textContent = `${drug.name} (${drug.generic}) — ${data.concLabel} | Weight: ${data.weight ? data.weight + ' kg' : 'Standard'}`;
  }

  let html = `
    <div class="dosing-info-strip">
      <div class="dosing-info-box">
        <div class="dosing-info-label">Medication</div>
        <div class="dosing-info-val">${drug.name} (${drug.generic})</div>
      </div>
      <div class="dosing-info-box">
        <div class="dosing-info-label">Concentration</div>
        <div class="dosing-info-val">${data.concLabel}</div>
      </div>
      <div class="dosing-info-box">
        <div class="dosing-info-label">Patient Weight</div>
        <div class="dosing-info-val">${data.weight ? data.weight + ' kg' : 'N/A'}</div>
      </div>
      <div class="dosing-info-box">
        <div class="dosing-info-label">Dose Range</div>
        <div class="dosing-info-val">${drug.doseRange ? drug.doseRange.min + ' – ' + drug.doseRange.max + ' ' + drug.doseUnit : 'Full Range'}</div>
      </div>
    </div>

    <!-- ── Primary Vertical Column Table ── -->
    <div>
      <h4 style="font-size: 0.95rem; color: var(--orange-700); font-weight: 800; margin-bottom: 12px;">
        📋 Complete Bedside Dosing Column Table (Lowest → Highest Dose)
      </h4>
      <div style="overflow-x: auto; border: 1px solid var(--gray-300); border-radius: var(--radius-md);">
        <table class="dosing-table">
          <thead>
            <tr>
              ${(data.customHeaders || [
                `Column 1: Dose (${drug.doseUnit})`,
                `Column 2: Flow Rate (cc/hr)`,
                `Column 3: Macro Drip (15 gtts/min)`,
                `Column 4: Micro Drip (60 gtts/min)`,
                `Column 5: Hourly Infused Drug`,
                `Column 6: Computation Formula Proof`
              ]).map((h, i) => `
                <th style="${i === 0 ? 'background: var(--orange-500); color: var(--white);' : i === 1 ? 'background: var(--gray-800); color: var(--white);' : ''}">${h}</th>
              `).join('')}
            </tr>
          </thead>
          <tbody>
            ${data.rows.map(r => `
              <tr>
                <td class="dosing-table-highlight" style="font-weight: 800; color: var(--orange-800);">${r.col1 || r.doseFormatted}</td>
                <td style="font-weight: 800; color: var(--orange-600); font-size: 0.95rem;">${r.col2 || (r.rateFormatted + (r.rateFormatted.includes(' ') ? '' : ' cc/hr'))}</td>
                <td>${r.col3 || (r.macroGttsFormatted + (r.macroGttsFormatted.includes(' ') || r.macroGttsFormatted === 'N/A' ? '' : ' gtts/min'))}</td>
                <td>${r.col4 || (r.microGttsFormatted + (r.microGttsFormatted.includes(' ') || r.microGttsFormatted === 'N/A' ? '' : ' gtts/min'))}</td>
                <td>${r.col5 || r.hourlyDrugFormatted}</td>
                <td class="dosing-table-math">${r.col6 || r.formulaProof}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  body.innerHTML = html;
  overlay.classList.add('open');
}

function closeDosingTable() {
  const overlay = document.getElementById('dosingTableOverlay');
  if (overlay) overlay.classList.remove('open');
}

function generateDosingTableData(drug) {
  if (!drug) return null;

  const weight = parseFloat(state.weight) || (drug.weightBased ? 70 : 70);

  if (drug.formulaType === 'tabletCalc') {
    const avail = parseFloat(document.getElementById('basicAvailableDose')?.value) || drug.example?.available || 250;
    const doses = [62.5, 125, 250, 375, 500, 625, 750, 875, 1000, 1250, 1500, 2000];
    const customHeaders = [
      'Column 1: Prescribed Dose (mg)',
      'Column 2: Required Tablets',
      'Column 3: Half-Tab Units',
      'Column 4: Tablet Strength',
      'Column 5: Order Note',
      'Column 6: Computation Formula Proof'
    ];
    const rows = doses.map(d => {
      const tabs = d / avail;
      const whole = Math.floor(tabs);
      const frac = tabs % 1;
      const fracText = frac === 0 ? `${whole} tab(s)` : `${whole > 0 ? whole + ' tab + ' : ''}${formatNumber(frac, 2)} tab`;
      return {
        dose: d,
        doseFormatted: `${d} mg`,
        rate: tabs,
        rateFormatted: `${formatNumber(tabs, 2)} Tabs`,
        macroGttsFormatted: `${formatNumber(tabs * 2, 0)} half-tabs`,
        microGttsFormatted: `${avail} mg/tab`,
        hourlyDrugFormatted: fracText,
        formulaProof: `${d} mg ÷ ${avail} mg/tab = ${formatNumber(tabs, 2)} Tabs`,
        col1: `${d} mg`,
        col2: `${formatNumber(tabs, 2)} Tabs`,
        col3: `${formatNumber(tabs * 2, 0)} half-tabs`,
        col4: `${avail} mg/tab`,
        col5: fracText,
        col6: `${d} mg ÷ ${avail} mg/tab = ${formatNumber(tabs, 2)} Tabs`
      };
    });
    return { drug, concLabel: `Tablet Strength: ${avail} ${availUnit}/tab`, weight: null, customHeaders, rows };
  }

  if (drug.formulaType === 'liquidCalc') {
    const avail = parseFloat(document.getElementById('basicAvailableDose')?.value) || drug.example?.available || 125;
    const availVol = parseFloat(document.getElementById('basicAvailVol')?.value) || drug.example?.availVol || 5;
    const conc = avail / availVol;
    const doses = [50, 100, 125, 150, 200, 250, 300, 375, 500, 750, 1000];
    const customHeaders = [
      'Column 1: Prescribed Dose (mg)',
      'Column 2: Required Volume (mL)',
      'Column 3: Teaspoons (5 mL)',
      'Column 4: Tablespoons (15 mL)',
      'Column 5: Stock Concentration',
      'Column 6: Computation Formula Proof'
    ];
    const rows = doses.map(d => {
      const volReq = (d / avail) * availVol;
      return {
        dose: d,
        doseFormatted: `${d} mg`,
        rate: volReq,
        rateFormatted: `${formatNumber(volReq, 2)} mL`,
        macroGttsFormatted: `${formatNumber(volReq / 5, 1)} tsp`,
        microGttsFormatted: `${formatNumber(volReq / 15, 1)} tbsp`,
        hourlyDrugFormatted: `${formatNumber(conc, 2)} mg/mL`,
        formulaProof: `(${d} mg ÷ ${avail} mg) × ${availVol} mL = ${formatNumber(volReq, 2)} mL`,
        col1: `${d} mg`,
        col2: `${formatNumber(volReq, 2)} mL`,
        col3: `${formatNumber(volReq / 5, 1)} tsp`,
        col4: `${formatNumber(volReq / 15, 1)} tbsp`,
        col5: `${formatNumber(conc, 2)} mg/mL`,
        col6: `(${d} mg ÷ ${avail} mg) × ${availVol} mL = ${formatNumber(volReq, 2)} mL`
      };
    });
    return { drug, concLabel: `Stock: ${avail} mg / ${availVol} mL (${formatNumber(conc, 2)} mg/mL)`, weight: null, customHeaders, rows };
  }

  if (drug.formulaType === 'injectionCalc') {
    const avail = parseFloat(document.getElementById('basicAvailableDose')?.value) || drug.example?.available || 1000;
    const availVol = parseFloat(document.getElementById('basicAvailVol')?.value) || drug.example?.availVol || 10;
    const conc = avail / availVol;
    const doses = [100, 200, 250, 400, 500, 750, 1000, 1250, 1500, 2000];
    const customHeaders = [
      'Column 1: Prescribed Dose (mg)',
      'Column 2: Injectable Volume (mL)',
      'Column 3: Solution Conc (mg/mL)',
      'Column 4: Reconstituted Vial',
      'Column 5: Target Dose',
      'Column 6: Computation Formula Proof'
    ];
    const rows = doses.map(d => {
      const volReq = (d / avail) * availVol;
      return {
        dose: d,
        doseFormatted: `${d} mg`,
        rate: volReq,
        rateFormatted: `${formatNumber(volReq, 2)} mL`,
        macroGttsFormatted: `${formatNumber(conc, 2)} mg/mL`,
        microGttsFormatted: `Vial ${avail}mg/${availVol}mL`,
        hourlyDrugFormatted: `${d} mg Dose`,
        formulaProof: `(${d} mg ÷ ${avail} mg) × ${availVol} mL = ${formatNumber(volReq, 2)} mL`,
        col1: `${d} mg`,
        col2: `${formatNumber(volReq, 2)} mL`,
        col3: `${formatNumber(conc, 2)} mg/mL`,
        col4: `Vial ${avail}mg/${availVol}mL`,
        col5: `${d} mg Dose`,
        col6: `(${d} mg ÷ ${avail} mg) × ${availVol} mL = ${formatNumber(volReq, 2)} mL`
      };
    });
    return { drug, concLabel: `Vial: ${avail} mg in ${availVol} mL (${formatNumber(conc, 2)} mg/mL)`, weight: null, customHeaders, rows };
  }

  if (drug.formulaType === 'ivFlowRateCalc') {
    const vol = parseFloat(document.getElementById('basicTotalVol')?.value) || drug.example?.volume || 1000;
    const hoursList = [0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10, 12, 16, 24];
    const customHeaders = [
      'Column 1: Infusion Duration',
      'Column 2: Pump Flow Rate (cc/hr)',
      'Column 3: Macro Drip (15 gtt/min)',
      'Column 4: Micro Drip (60 gtt/min)',
      'Column 5: Total Infusion Volume',
      'Column 6: Computation Formula Proof'
    ];
    const rows = hoursList.map(h => {
      const rate = vol / h;
      const macro15 = (rate * 15) / 60;
      const micro60 = rate;
      return {
        dose: h,
        doseFormatted: `${h} ${h === 1 ? 'hour' : 'hours'}`,
        rate: rate,
        rateFormatted: `${formatNumber(rate, 2)} cc/hr`,
        macroGttsFormatted: `${formatNumber(macro15, 1)} gtts/min`,
        microGttsFormatted: `${formatNumber(micro60, 1)} gtts/min`,
        hourlyDrugFormatted: `${vol} mL Total`,
        formulaProof: `${vol} mL ÷ ${h} hrs = ${formatNumber(rate, 2)} mL/hr`,
        col1: `${h} ${h === 1 ? 'hour' : 'hours'}`,
        col2: `${formatNumber(rate, 2)} cc/hr`,
        col3: `${formatNumber(macro15, 1)} gtts/min`,
        col4: `${formatNumber(micro60, 1)} gtts/min`,
        col5: `${vol} mL Total`,
        col6: `${vol} mL ÷ ${h} hrs = ${formatNumber(rate, 2)} mL/hr`
      };
    });
    return { drug, concLabel: `Total Infusion: ${vol} mL`, weight: null, customHeaders, rows };
  }

  if (drug.formulaType === 'dropRateCalc') {
    const vol = parseFloat(document.getElementById('basicTotalVol')?.value) || drug.example?.volume || 500;
    const dropFactor = parseFloat(document.getElementById('basicDropFactor')?.value) || drug.example?.dropFactor || 20;
    const hoursList = [0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10, 12, 16, 24];
    const customHeaders = [
      'Column 1: Infusion Duration',
      'Column 2: Pump Rate (cc/hr)',
      'Column 3: Drop Rate (gtt/min)',
      'Column 4: Tubing Drop Factor',
      'Column 5: Total Infusion Volume',
      'Column 6: Computation Formula Proof'
    ];
    const rows = hoursList.map(h => {
      const mins = h * 60;
      const gttMin = (vol * dropFactor) / mins;
      const rate = vol / h;
      return {
        dose: h,
        doseFormatted: `${h} hrs (${mins} min)`,
        rate: rate,
        rateFormatted: `${formatNumber(rate, 2)} cc/hr`,
        macroGttsFormatted: `${formatNumber(gttMin, 1)} gtts/min`,
        microGttsFormatted: `${dropFactor} gtt/mL`,
        hourlyDrugFormatted: `${vol} mL Total`,
        formulaProof: `(${vol} mL × ${dropFactor}) ÷ ${mins} min = ${formatNumber(gttMin, 1)} gtt/min`,
        col1: `${h} hrs (${mins} min)`,
        col2: `${formatNumber(rate, 2)} cc/hr`,
        col3: `${formatNumber(gttMin, 1)} gtts/min`,
        col4: `${dropFactor} gtt/mL`,
        col5: `${vol} mL Total`,
        col6: `(${vol} mL × ${dropFactor}) ÷ ${mins} min = ${formatNumber(gttMin, 1)} gtt/min`
      };
    });
    return { drug, concLabel: `Volume: ${vol} mL | Drop Factor: ${dropFactor} gtt/mL`, weight: null, customHeaders, rows };
  }

  if (drug.formulaType === 'weightDoseCalc') {
    const dosePerKg = parseFloat(document.getElementById('basicDosePerKg')?.value) || drug.example?.dosePerKg || 15;
    const weights = [5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120];
    const customHeaders = [
      'Column 1: Patient Weight (kg)',
      'Column 2: Total Required Dose (mg)',
      'Column 3: Gram Equivalent (g)',
      'Column 4: Dose/kg Specification',
      'Column 5: Regimen Note',
      'Column 6: Computation Formula Proof'
    ];
    const rows = weights.map(w => {
      const tot = dosePerKg * w;
      return {
        dose: w,
        doseFormatted: `${w} kg`,
        rate: tot,
        rateFormatted: `${formatNumber(tot, 2)} mg`,
        macroGttsFormatted: `${formatNumber(tot / 1000, 3)} g`,
        microGttsFormatted: `${dosePerKg} mg/kg`,
        hourlyDrugFormatted: `Single: ${formatNumber(tot, 2)} mg`,
        formulaProof: `${dosePerKg} mg/kg × ${w} kg = ${formatNumber(tot, 2)} mg`,
        col1: `${w} kg`,
        col2: `${formatNumber(tot, 2)} mg`,
        col3: `${formatNumber(tot / 1000, 3)} g`,
        col4: `${dosePerKg} mg/kg`,
        col5: `Single: ${formatNumber(tot, 2)} mg`,
        col6: `${dosePerKg} mg/kg × ${w} kg = ${formatNumber(tot, 2)} mg`
      };
    });
    return { drug, concLabel: `Prescribed: ${dosePerKg} mg/kg`, weight: null, customHeaders, rows };
  }

  if (drug.formulaType === 'protocol') {
    const rows = (drug.protocols || []).map((p, idx) => ({
      dose: idx + 1,
      doseFormatted: p.name,
      rate: parseFloat(p.dose) || 100,
      rateFormatted: `${p.dose}`,
      macroGttsFormatted: 'N/A',
      microGttsFormatted: 'N/A',
      hourlyDrugFormatted: `Diluent: ${p.diluent}`,
      formulaProof: `Duration: ${p.duration}`
    }));
    return { drug, concLabel: 'Protocol Guidelines', weight: null, rows };
  }

  if (['electrolyteDeficit', 'electrolyteDeficitNa', 'bicarbDeficit'].includes(drug.formulaType)) {
    const rates = [10, 20, 30, 40, 50, 60, 80, 100];
    const rows = rates.map(r => ({
      dose: r,
      doseFormatted: `${r} mEq/hr`,
      rate: r,
      rateFormatted: `${r} cc/hr`,
      macroGttsFormatted: formatNumber((r * 15) / 60, 2),
      microGttsFormatted: formatNumber(r, 2),
      hourlyDrugFormatted: `${r} mEq/hr`,
      formulaProof: `Infusion at ${r} cc/hr (max 20 mEq/hr peripheral)`
    }));
    return { drug, concLabel: 'Electrolyte Replacement Protocol', weight, rows };
  }

  if (drug.formulaType === 'customDrip') {
    const vol = parseFloat(state.presetCustomVol) || 250;
    const amt = parseFloat(state.presetCustomAmt) || 100;
    const concMcg = (amt * 1000) / vol;
    const isWeight = state.customIsWeightBased !== false;
    const doseUnit = state.customDoseUnit || (isWeight ? 'mcg/kg/min' : 'mg/hr');

    const rows = [];
    for (let d = 1; d <= 15; d++) {
      const rateVal = isWeight ? (d * weight * 60) / concMcg : d / (amt / vol);
      rows.push({
        dose: d,
        doseFormatted: `${d} ${doseUnit}`,
        rate: rateVal,
        rateFormatted: formatNumber(rateVal, 2),
        macroGttsFormatted: formatNumber((rateVal * 15) / 60, 2),
        microGttsFormatted: formatNumber(rateVal, 2),
        hourlyDrugFormatted: isWeight ? `${formatNumber(d * weight * 60)} mcg/hr` : `${d} mg/hr`,
        formulaProof: isWeight
          ? `(${d} × ${weight} × 60) ÷ ${formatNumber(concMcg)} = ${formatNumber(rateVal, 2)} cc/hr`
          : `${d} ÷ ${formatNumber(amt / vol, 2)} = ${formatNumber(rateVal, 2)} cc/hr`
      });
    }
    return { drug, concLabel: `Custom (${amt} in ${vol} cc)`, weight, rows };
  }

  let conc = null;
  if (state.selectedVolume === 'custom' || state.selectedConc === 'custom') {
    const vol = parseFloat(state.presetCustomVol || 250);
    const amt = parseFloat(state.presetCustomAmt);
    if (!isNaN(vol) && vol > 0 && !isNaN(amt) && amt > 0) {
      const concMcg = (amt * 1000) / vol;
      const concMg = amt / vol;
      conc = { label: 'Custom', concMcgPerCc: concMcg, concMgPerCc: concMg, totalVol: vol, drugMg: amt, concNote: `Custom Mix (${formatNumber(concMcg)} mcg/cc)` };
    }
  }

  if (!conc && drug.concentrations) {
    const availableVols = Object.keys(drug.concentrations);
    const volKey = (drug.concentrations[state.selectedVolume]) ? state.selectedVolume : availableVols[0];
    const concs = drug.concentrations[volKey] || Object.values(drug.concentrations)[0] || [];
    let idx = typeof state.selectedConc === 'number' ? state.selectedConc : parseInt(state.selectedConc, 10);
    if (isNaN(idx) || idx < 0 || idx >= concs.length) idx = 0;
    conc = concs[idx];
  }

  if (!conc) {
    conc = { label: 'Standard Mix', concMcgPerCc: 1000, concMgPerCc: 1, totalVol: 250, concNote: 'Standard Concentration' };
  }

  const concVal = conc.concMcgPerCc || (conc.concMgPerCc ? conc.concMgPerCc * 1000 : 1000) || (conc.concUnitsPerCc || 1);
  const concLabel = conc.concNote || `${conc.label || 'Standard'} (${formatNumber(concVal)} ${conc.concUnitsPerCc ? 'U/cc' : 'mcg/cc'})`;

  let minDose = drug.doseRange?.min || 0.01;
  let maxDose = drug.doseRange?.max || 3.0;

  if (drug.formulaType === 'dosePerHour') {
    minDose = drug.doseRange?.min || 1;
    maxDose = drug.doseRange?.max || 50;
  } else if (drug.formulaType === 'heparin') {
    minDose = drug.doseRange?.min || 10;
    maxDose = drug.doseRange?.max || 25;
  }

  // Generate complete dose array without skipping any numbers
  const doseList = [];
  if (minDose >= 1 && maxDose <= 50 && Number.isInteger(minDose) && Number.isInteger(maxDose)) {
    // Integer sequence 1, 2, 3, ..., 20 (no numbers skipped!)
    for (let d = minDose; d <= maxDose; d++) {
      doseList.push(d);
    }
  } else if (drug.formulaType === 'unitsPerMin') {
    // Fixed-dose vasopressor — standard titration steps only
    [0.01, 0.02, 0.03, 0.04, 0.06].forEach(p => {
      if (p >= minDose && p <= maxDose) doseList.push(p);
    });
  } else if (maxDose <= 3) {
    // Fine-grained decimal steps for Levophed / Epinephrine
    const presets = [0.01, 0.05, 0.1, 0.15, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.25, 1.5, 1.75, 2.0, 2.25, 2.5, 2.75, 3.0];
    presets.forEach(p => {
      if (p >= minDose && p <= maxDose) doseList.push(p);
    });
  } else {
    // 15 linear steps
    const stepsCount = 15;
    const stepSize = (maxDose - minDose) / (stepsCount - 1);
    for (let i = 0; i < stepsCount; i++) {
      let d = minDose + (i * stepSize);
      d = Math.round(d * 10) / 10;
      doseList.push(d);
    }
  }

  const rows = [];
  doseList.forEach(d => {
    const calcResult = calculateDoseToRate(drug, d, weight, conc);
    if (!calcResult) return;

    const rateVal = calcResult.rate;
    const macroGtts = (rateVal * 15) / 60;
    const microGtts = rateVal;

    let hourlyDrugText = '';
    let proofText = '';

    if (drug.formulaType === 'weightPerMin') {
      const num = d * weight * 60;
      hourlyDrugText = `${formatNumber(num)} mcg/hr (${formatNumber(num / 1000, 2)} mg/hr)`;
      proofText = `(${d} × ${weight} × 60) ÷ ${formatNumber(concVal)} = ${formatNumber(rateVal, 2)} cc/hr`;
    } else if (drug.formulaType === 'weightPerHour') {
      const num = d * weight;
      hourlyDrugText = `${formatNumber(num)} mcg/hr`;
      proofText = `(${d} × ${weight}) ÷ ${formatNumber(concVal)} = ${formatNumber(rateVal, 2)} cc/hr`;
    } else if (['dosePerHour', 'dosePerMin'].includes(drug.formulaType)) {
      const mgPerCc = conc.concMgPerCc || (concVal / 1000);
      const isMin = drug.formulaType === 'dosePerMin';
      const hourlyMg = isMin ? d * 60 : d;
      hourlyDrugText = `${formatNumber(hourlyMg)} mg/hr`;
      proofText = isMin
        ? `(${d} × 60) ÷ ${formatNumber(mgPerCc, 3)} = ${formatNumber(rateVal, 2)} cc/hr`
        : `${d} ÷ ${formatNumber(mgPerCc, 3)} = ${formatNumber(rateVal, 2)} cc/hr`;
    } else if (drug.formulaType === 'heparin') {
      const isWeight = state.heparinMode === 'unitsPerKgPerHr';
      const hourlyUnits = isWeight ? d * weight : d;
      hourlyDrugText = `${formatNumber(hourlyUnits)} Units/hr`;
      proofText = isWeight
        ? `(${d} × ${weight}) ÷ ${formatNumber(concVal)} = ${formatNumber(rateVal, 2)} cc/hr`
        : `${d} ÷ ${formatNumber(concVal)} = ${formatNumber(rateVal, 2)} cc/hr`;
    } else if (drug.formulaType === 'unitsPerMin') {
      const hourlyUnits = d * 60;
      hourlyDrugText = `${formatNumber(hourlyUnits, 2)} units/hr`;
      proofText = `(${d} × 60) ÷ ${formatNumber(concVal, 3)} = ${formatNumber(rateVal, 2)} cc/hr`;
    }

    rows.push({
      dose: d,
      doseFormatted: `${d} ${drug.doseUnit}`,
      rate: rateVal,
      rateFormatted: formatNumber(rateVal, 2),
      macroGttsFormatted: formatNumber(macroGtts, 2),
      microGttsFormatted: formatNumber(microGtts, 2),
      hourlyDrugFormatted: hourlyDrugText,
      formulaProof: proofText
    });
  });

  return { drug, concLabel, weight, rows };
}

function exportDosingTableCSV() {
  const drug = DRUGS[state.selectedDrug];
  if (!drug) return;

  const data = generateDosingTableData(drug);
  if (!data || !data.rows) return;

  // UTF-8 BOM so Excel opens special characters (* and /) cleanly
  let csv = "\uFEFF";
  csv += `Al ICU Calculator — Bedside Dosing Table\n`;
  csv += `Medication: ${drug.name} (${drug.generic})\n`;
  csv += `Concentration: ${data.concLabel}\n`;
  csv += `Patient Weight: ${data.weight ? data.weight + ' kg' : 'Standard'}\n\n`;

  const headers = data.customHeaders || [
    `Dose (${drug.doseUnit})`,
    `Flow Rate (cc/hr)`,
    `Macro Drip (15 gtts/min)`,
    `Micro Drip (60 gtts/min)`,
    `Hourly Infused Drug`,
    `Computation Formula Proof`
  ];

  csv += headers.map(h => `"${h.replace(/"/g, '""')}"`).join(',') + '\n';

  data.rows.forEach(r => {
    const col1 = r.col1 || r.doseFormatted;
    const col2 = r.col2 || r.rateFormatted;
    const col3 = r.col3 || r.macroGttsFormatted;
    const col4 = r.col4 || r.microGttsFormatted;
    const col5 = r.col5 || r.hourlyDrugFormatted;
    const col6 = (r.col6 || r.formulaProof || '').replace(/×/g, '*').replace(/÷/g, '/');
    csv += `"${col1}","${col2}","${col3}","${col4}","${col5}","${col6}"\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${drug.name.replace(/\s+/g, '_')}_Dosing_Table_${data.weight || 'std'}kg.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function copyDosingTableTSV() {
  const drug = DRUGS[state.selectedDrug];
  if (!drug) return;

  const data = generateDosingTableData(drug);
  if (!data || !data.rows) return;

  const headers = data.customHeaders || [
    `Dose (${drug.doseUnit})`,
    `Flow Rate (cc/hr)`,
    `Macro Drip (15 gtts/min)`,
    `Micro Drip (60 gtts/min)`,
    `Hourly Infused Drug`,
    `Computation Formula Proof`
  ];

  let tsv = headers.join('\t') + '\n';

  data.rows.forEach(r => {
    const col1 = r.col1 || r.doseFormatted;
    const col2 = r.col2 || r.rateFormatted;
    const col3 = r.col3 || r.macroGttsFormatted;
    const col4 = r.col4 || r.microGttsFormatted;
    const col5 = r.col5 || r.hourlyDrugFormatted;
    const col6 = r.col6 || r.formulaProof;
    tsv += `${col1}\t${col2}\t${col3}\t${col4}\t${col5}\t${col6}\n`;
  });

  if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    navigator.clipboard.writeText(tsv).then(() => {
      alert('✅ Dosing Table copied to clipboard! You can now paste directly into Google Sheets or Microsoft Excel.');
    }).catch(err => {
      alert('Failed to copy to clipboard: ' + err);
    });
  } else {
    alert('✅ Dosing Table TSV data ready for spreadsheet paste.');
  }
}

function printDosingTable() {
  const drug = DRUGS[state.selectedDrug];
  if (!drug) return;

  const data = generateDosingTableData(drug);
  if (!data || !data.rows) return;

  const headers = data.customHeaders || [
    `Dose (${drug.doseUnit})`,
    `Flow Rate (cc/hr)`,
    `Macro Drip (15 gtts/min)`,
    `Micro Drip (60 gtts/min)`,
    `Hourly Infused Drug`,
    `Computation Formula Proof`
  ];

  const rowsHtml = data.rows.map(r => `
    <tr>
      <td>${r.col1 || r.doseFormatted}</td>
      <td>${r.col2 || (r.rateFormatted + (r.rateFormatted.includes(' ') ? '' : ' cc/hr'))}</td>
      <td>${r.col3 || (r.macroGttsFormatted + (r.macroGttsFormatted.includes(' ') || r.macroGttsFormatted === 'N/A' ? '' : ' gtts/min'))}</td>
      <td>${r.col4 || (r.microGttsFormatted + (r.microGttsFormatted.includes(' ') || r.microGttsFormatted === 'N/A' ? '' : ' gtts/min'))}</td>
      <td>${r.col5 || r.hourlyDrugFormatted}</td>
      <td>${r.col6 || r.formulaProof}</td>
    </tr>
  `).join('');

  const printWindow = window.open('', '_blank', 'width=900,height=700');
  if (!printWindow) {
    alert('Please allow pop-ups to print the dosing table.');
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${drug.name} Dosing Table</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 24px; color: #111; }
        h1 { font-size: 18px; margin-bottom: 4px; }
        .sub { font-size: 12px; color: #555; margin-bottom: 16px; }
        table { width: 100%; border-collapse: collapse; font-size: 12px; }
        th, td { border: 1px solid #ccc; padding: 6px 8px; text-align: left; }
        th { background: #f97316; color: #fff; }
        tr:nth-child(even) { background: #f9f9f9; }
      </style>
    </head>
    <body>
      <h1>Al ICU Calculator — Bedside Dosing Table</h1>
      <div class="sub">${drug.name} (${drug.generic}) — ${data.concLabel} | Weight: ${data.weight ? data.weight + ' kg' : 'Standard'}</div>
      <table>
        <thead>
          <tr>
            ${headers.map(h => `<th>${h}</th>`).join('')}
          </tr>
        </thead>
        <tbody>${rowsHtml}</tbody>
      </table>
    </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

function toggleFormulaBreakdown() {
  state.showFormulaBreakdown = !state.showFormulaBreakdown;
  const drug = DRUGS[state.selectedDrug];
  if (drug) recalculate(drug);
}

function generateFormulaBreakdownHTML(drug, calcMode, conc, weight, dose, rate, result) {
  let html = '';
  const isDoseToRate = calcMode === 'doseToRate';

  let equationText = '';
  let steps = [];
  let finalValText = '';

  if (['weightPerMin', 'weightPerHour'].includes(drug.formulaType)) {
    const isMin = drug.formulaType === 'weightPerMin';
    const timeFactor = isMin ? 60 : 1;
    const concVal = conc.concMcgPerCc || (conc.concMgPerCc * 1000);
    const drugMcg = conc.drugMg ? conc.drugMg * 1000 : null;

    if (isDoseToRate) {
      equationText = isMin
        ? `Rate (cc/hr) = (Dose × Weight × 60) ÷ Concentration (mcg/cc)`
        : `Rate (cc/hr) = (Dose × Weight) ÷ Concentration (mcg/cc)`;

      steps.push({
        num: 'Step 1: Concentration Resolution',
        desc: conc.concNote || `Solution Mixture: ${conc.drugMg || 'Custom'} mg in ${conc.totalVol} cc`,
        math: conc.totalVol && drugMcg
          ? `Conc = ${formatNumber(drugMcg)} mcg ÷ ${conc.totalVol} cc = ${formatNumber(concVal)} mcg/cc`
          : `Conc = ${formatNumber(concVal)} mcg/cc`
      });

      const numVal = dose * weight * timeFactor;
      steps.push({
        num: 'Step 2: Substitute Clinical Values',
        desc: `Dose = ${dose} ${drug.doseUnit}, Weight = ${weight} kg${isMin ? ', Time Factor = 60' : ''}`,
        math: isMin
          ? `Numerator = ${dose} × ${weight} × 60 = ${formatNumber(numVal)} mcg/hr`
          : `Numerator = ${dose} × ${weight} = ${formatNumber(numVal)} mcg/hr`
      });

      const rateVal = numVal / concVal;
      steps.push({
        num: 'Step 3: Solve Flow Rate',
        desc: `Divide hourly dose by concentration`,
        math: `${formatNumber(numVal)} ÷ ${formatNumber(concVal)} = ${formatNumber(rateVal, 2)} cc/hr`
      });

      const gttsVal = (rateVal * 15) / 60;
      steps.push({
        num: 'Step 4: Macro Drip Conversion (15 gtts/mL)',
        desc: `gtts/min = (cc/hr × 15) ÷ 60`,
        math: `(${formatNumber(rateVal, 2)} × 15) ÷ 60 = ${formatNumber(gttsVal, 2)} gtts/min`
      });

      finalValText = `${formatNumber(rateVal, 2)} cc/hr (${formatNumber(gttsVal, 2)} gtts/min)`;
    } else {
      equationText = isMin
        ? `Dose (mcg/kg/min) = (Rate × Concentration) ÷ (Weight × 60)`
        : `Dose (mcg/kg/hr) = (Rate × Concentration) ÷ Weight`;

      steps.push({
        num: 'Step 1: Concentration Resolution',
        desc: conc.concNote || `Concentration = ${formatNumber(concVal)} mcg/cc`,
        math: `Conc = ${formatNumber(concVal)} mcg/cc`
      });

      const totalMcgPerHr = rate * concVal;
      steps.push({
        num: 'Step 2: Hourly Infused Drug',
        desc: `Rate = ${rate} cc/hr × ${formatNumber(concVal)} mcg/cc`,
        math: `${rate} × ${formatNumber(concVal)} = ${formatNumber(totalMcgPerHr)} mcg/hr`
      });

      const denVal = weight * timeFactor;
      const doseVal = totalMcgPerHr / denVal;
      steps.push({
        num: 'Step 3: Divide by Body Weight & Time',
        desc: isMin ? `Denominator = ${weight} kg × 60 min = ${denVal}` : `Denominator = ${weight} kg`,
        math: `${formatNumber(totalMcgPerHr)} ÷ ${denVal} = ${formatNumber(doseVal, 4)} ${drug.doseUnit}`
      });

      finalValText = `${formatNumber(doseVal, 4)} ${drug.doseUnit}`;
    }
  } else if (['dosePerHour', 'dosePerMin'].includes(drug.formulaType)) {
    const isMin = drug.formulaType === 'dosePerMin';
    const concVal = conc.concMgPerCc || (conc.concMcgPerCc / 1000);

    if (isDoseToRate) {
      equationText = isMin
        ? `Rate (cc/hr) = (Dose (mg/min) × 60) ÷ Concentration (mg/cc)`
        : `Rate (cc/hr) = Dose (mg/hr) ÷ Concentration (mg/cc)`;

      steps.push({
        num: 'Step 1: Concentration Resolution',
        desc: conc.concNote || `Concentration in mg/cc`,
        math: `Conc = ${formatNumber(concVal, 3)} mg/cc`
      });

      const mgPerHr = isMin ? dose * 60 : dose;
      steps.push({
        num: 'Step 2: Calculate Hourly Dose',
        desc: isMin ? `Dose = ${dose} mg/min × 60 min = ${mgPerHr} mg/hr` : `Hourly Dose = ${dose} mg/hr`,
        math: `${mgPerHr} mg/hr`
      });

      const rateVal = mgPerHr / concVal;
      steps.push({
        num: 'Step 3: Solve Flow Rate',
        desc: `Rate = Hourly Dose ÷ Concentration`,
        math: `${mgPerHr} ÷ ${formatNumber(concVal, 3)} = ${formatNumber(rateVal, 2)} cc/hr`
      });

      finalValText = `${formatNumber(rateVal, 2)} cc/hr`;
    } else {
      equationText = isMin
        ? `Dose (mg/min) = (Rate (cc/hr) × Concentration (mg/cc)) ÷ 60`
        : `Dose (mg/hr) = Rate (cc/hr) × Concentration (mg/cc)`;

      steps.push({
        num: 'Step 1: Concentration Resolution',
        desc: `Concentration = ${formatNumber(concVal, 3)} mg/cc`,
        math: `Conc = ${formatNumber(concVal, 3)} mg/cc`
      });

      const totalMgPerHr = rate * concVal;
      const doseVal = isMin ? totalMgPerHr / 60 : totalMgPerHr;

      steps.push({
        num: 'Step 2: Solve Delivered Dose',
        desc: isMin ? `(${rate} × ${formatNumber(concVal, 3)}) ÷ 60` : `${rate} × ${formatNumber(concVal, 3)}`,
        math: `${formatNumber(doseVal, 3)} ${drug.doseUnit}`
      });

      finalValText = `${formatNumber(doseVal, 3)} ${drug.doseUnit}`;
    }
  } else if (drug.formulaType === 'heparin') {
    const isWeightBased = state.heparinMode === 'unitsPerKgPerHr';
    const concVal = conc.concUnitsPerCc || (conc.drugMg ? (conc.drugMg * 1000) / conc.totalVol : 100);

    if (isDoseToRate) {
      equationText = isWeightBased
        ? `Rate (cc/hr) = (Dose (U/kg/hr) × Weight (kg)) ÷ Concentration (U/cc)`
        : `Rate (cc/hr) = Dose (U/hr) ÷ Concentration (U/cc)`;

      steps.push({
        num: 'Step 1: Concentration Resolution',
        desc: conc.concNote || `Heparin Concentration`,
        math: `Conc = ${formatNumber(concVal)} Units/cc`
      });

      const totalUnitsPerHr = isWeightBased ? dose * weight : dose;
      steps.push({
        num: 'Step 2: Total Hourly Units',
        desc: isWeightBased ? `${dose} U/kg/hr × ${weight} kg = ${totalUnitsPerHr} U/hr` : `Hourly Units = ${dose} U/hr`,
        math: `${totalUnitsPerHr} Units/hr`
      });

      const rateVal = totalUnitsPerHr / concVal;
      steps.push({
        num: 'Step 3: Solve Flow Rate',
        desc: `Rate = Hourly Units ÷ Concentration`,
        math: `${totalUnitsPerHr} ÷ ${formatNumber(concVal)} = ${formatNumber(rateVal, 2)} cc/hr`
      });

      finalValText = `${formatNumber(rateVal, 2)} cc/hr`;
    } else {
      equationText = isWeightBased
        ? `Dose (U/kg/hr) = (Rate (cc/hr) × Conc (U/cc)) ÷ Weight (kg)`
        : `Dose (U/hr) = Rate (cc/hr) × Conc (U/cc)`;

      const totalUnitsPerHr = rate * concVal;
      const doseVal = isWeightBased ? totalUnitsPerHr / weight : totalUnitsPerHr;

      steps.push({
        num: 'Step 1: Hourly Infused Units',
        desc: `${rate} cc/hr × ${formatNumber(concVal)} U/cc`,
        math: `${totalUnitsPerHr} Units/hr`
      });

      steps.push({
        num: 'Step 2: Solve Delivered Dose',
        desc: isWeightBased ? `${totalUnitsPerHr} ÷ ${weight} kg` : `Total Units`,
        math: `${formatNumber(doseVal, 2)} ${isWeightBased ? 'Units/kg/hr' : 'Units/hr'}`
      });

      finalValText = `${formatNumber(doseVal, 2)} ${isWeightBased ? 'Units/kg/hr' : 'Units/hr'}`;
    }
  } else if (drug.formulaType === 'unitsPerMin') {
    const concVal = conc.concUnitsPerCc || 0.2;

    if (isDoseToRate) {
      equationText = `Rate (cc/hr) = (Dose (units/min) × 60) ÷ Concentration (units/cc)`;

      steps.push({
        num: 'Step 1: Concentration Resolution',
        desc: conc.concNote || `Concentration in units/cc`,
        math: `Conc = ${formatNumber(concVal, 3)} units/cc`
      });

      const unitsPerHr = formatNumber(dose * 60, 2);
      steps.push({
        num: 'Step 2: Calculate Hourly Dose',
        desc: `Dose = ${dose} units/min × 60 min = ${unitsPerHr} units/hr`,
        math: `${unitsPerHr} units/hr`
      });

      const rateVal = (dose * 60) / concVal;
      steps.push({
        num: 'Step 3: Solve Flow Rate',
        desc: `Rate = Hourly Dose ÷ Concentration`,
        math: `${unitsPerHr} ÷ ${formatNumber(concVal, 3)} = ${formatNumber(rateVal, 2)} cc/hr`
      });

      finalValText = `${formatNumber(rateVal, 2)} cc/hr`;
    } else {
      equationText = `Dose (units/min) = (Rate (cc/hr) × Concentration (units/cc)) ÷ 60`;

      steps.push({
        num: 'Step 1: Concentration Resolution',
        desc: `Concentration = ${formatNumber(concVal, 3)} units/cc`,
        math: `Conc = ${formatNumber(concVal, 3)} units/cc`
      });

      const totalUnitsPerHr = rate * concVal;
      const doseVal = totalUnitsPerHr / 60;
      steps.push({
        num: 'Step 2: Solve Delivered Dose',
        desc: `(${rate} × ${formatNumber(concVal, 3)}) ÷ 60`,
        math: `${formatNumber(doseVal, 3)} ${drug.doseUnit}`
      });

      finalValText = `${formatNumber(doseVal, 3)} ${drug.doseUnit}`;
    }
  }

  html += `
    <div class="formula-card">
      <div class="formula-card-header">
        <div class="formula-card-title">📐 Step-by-Step Computation Formula</div>
        <button type="button" class="search-clear visible" onclick="toggleFormulaBreakdown()" title="Close breakdown" style="position:static;">✕</button>
      </div>

      <div class="formula-equation-box">
        ${equationText}
      </div>

      <div class="formula-step-list">
        ${steps.map(s => `
          <div class="formula-step-item">
            <div class="formula-step-num">${s.num}</div>
            <div class="formula-step-desc">${s.desc}</div>
            <div class="formula-step-math">${s.math}</div>
          </div>
        `).join('')}
      </div>

      <div class="formula-final-box">
        <span>Calculated Result:</span>
        <span class="formula-final-val">${finalValText}</span>
      </div>
    </div>
  `;

  return html;
}

function setCalcMode(mode) {
  state.calcMode = mode;
  state.dose = '';
  state.rate = '';
  const drug = DRUGS[state.selectedDrug];
  if (drug) renderCalculatorPanel(drug);
}

function setVolume(vol) {
  state.selectedVolume = vol;
  state.selectedConc = 0;
  const drug = DRUGS[state.selectedDrug];
  if (drug) renderCalculatorPanel(drug);
}

function setConc(idx) {
  state.selectedConc = idx;
  const drug = DRUGS[state.selectedDrug];
  if (drug) renderCalculatorPanel(drug);
}

function setHeparinMode(mode) {
  state.heparinMode = mode;
  const drug = DRUGS[state.selectedDrug];
  if (drug) renderCalculatorPanel(drug);
}

function setPatientType(type) {
  state.patientType = type;
  const drug = DRUGS[state.selectedDrug];
  if (drug) renderCalculatorPanel(drug);
}

// ── Quick Reference Panel ──
function openQuickRef() {
  document.getElementById('quickRefOverlay').classList.add('open');
  document.getElementById('quickRefPanel').classList.add('open');
}

function closeQuickRef() {
  document.getElementById('quickRefOverlay').classList.remove('open');
  document.getElementById('quickRefPanel').classList.remove('open');
}

function renderQuickRef() {
  const body = document.getElementById('quickRefBody');
  body.innerHTML = `
    <!-- Drug Calculations Made Easy Reference Section -->
    <div class="ref-section">
      <div class="ref-section-title">Drug Calculations Made Easy</div>
      <div style="font-size: 0.78rem; color: var(--gray-600); margin-bottom: 8px;">
        Core clinical bedside formulas with instant interactive calculators:
      </div>
      <table class="ref-table">
        <tr><th>Formula</th><th>Core Equation</th><th>Launch</th></tr>
        <tr>
          <td><strong>1. Tablet Calculation</strong></td>
          <td>Prescribed ÷ Available</td>
          <td><button type="button" class="preset-chip-btn" onclick="closeQuickRef(); openCalculator('tabletCalc');">Open</button></td>
        </tr>
        <tr>
          <td><strong>2. Liquid Calculation</strong></td>
          <td>(Prescribed ÷ Available) × Vol</td>
          <td><button type="button" class="preset-chip-btn" onclick="closeQuickRef(); openCalculator('liquidCalc');">Open</button></td>
        </tr>
        <tr>
          <td><strong>3. Injection Calculation</strong></td>
          <td>(Prescribed ÷ Available) × Diluent Vol</td>
          <td><button type="button" class="preset-chip-btn" onclick="closeQuickRef(); openCalculator('injectionCalc');">Open</button></td>
        </tr>
        <tr>
          <td><strong>4. IV Flow Rate</strong></td>
          <td>Total Volume (mL) ÷ Time (hours)</td>
          <td><button type="button" class="preset-chip-btn" onclick="closeQuickRef(); openCalculator('ivFlowRate');">Open</button></td>
        </tr>
        <tr>
          <td><strong>5. Drops Per Minute</strong></td>
          <td>(Volume × Drop Factor) ÷ Time (min)</td>
          <td><button type="button" class="preset-chip-btn" onclick="closeQuickRef(); openCalculator('dropRate');">Open</button></td>
        </tr>
        <tr>
          <td><strong>6. Weight-Based Dosing</strong></td>
          <td>Dose/kg × Patient Weight (kg)</td>
          <td><button type="button" class="preset-chip-btn" onclick="closeQuickRef(); openCalculator('weightDoseBasic');">Open</button></td>
        </tr>
      </table>
    </div>

    <!-- Volume Conversions -->
    <div class="ref-section">
      <div class="ref-section-title">Volume Conversions</div>
      <table class="ref-table">
        <tr><th>From</th><th>To</th></tr>
        <tr><td>1 gtt</td><td>0.06 ml</td></tr>
        <tr><td>15 gtts</td><td>1 ml</td></tr>
        <tr><td>1 tsp</td><td>5 ml</td></tr>
        <tr><td>1 tbsp</td><td>15 ml</td></tr>
        <tr><td>1 oz</td><td>30 ml</td></tr>
        <tr><td>1 cup</td><td>240 ml</td></tr>
        <tr><td>1 pint</td><td>500 ml</td></tr>
        <tr><td>1 dr</td><td>0.125 oz</td></tr>
        <tr><td>1000 ml</td><td>1 quart</td></tr>
      </table>
    </div>

    <!-- Weight Converter -->
    <div class="ref-section">
      <div class="ref-section-title">Weight Conversion</div>
      <div class="converter-widget">
        <div class="converter-row">
          <input type="number" class="converter-input" id="convKg" placeholder="0" inputmode="decimal">
          <span class="converter-label">kg</span>
        </div>
        <div style="text-align:center;"><span class="converter-arrow">⇅</span></div>
        <div class="converter-row">
          <input type="number" class="converter-input" id="convLb" placeholder="0" inputmode="decimal">
          <span class="converter-label">lb</span>
        </div>
      </div>
      <div style="font-size:0.75rem; color:var(--gray-400); text-align:center;">1 kg = 2.2 lb</div>
    </div>

    <!-- Temperature Converter -->
    <div class="ref-section">
      <div class="ref-section-title">Temperature Conversion</div>
      <div class="converter-widget">
        <div class="converter-row">
          <input type="number" class="converter-input" id="convC" placeholder="0" inputmode="decimal">
          <span class="converter-label">°C</span>
        </div>
        <div style="text-align:center;"><span class="converter-arrow">⇅</span></div>
        <div class="converter-row">
          <input type="number" class="converter-input" id="convF" placeholder="0" inputmode="decimal">
          <span class="converter-label">°F</span>
        </div>
      </div>
      <div style="font-size:0.75rem; color:var(--gray-400); text-align:center;">°C = (°F − 32) × 5/9</div>
    </div>

    <!-- CBG Converter -->
    <div class="ref-section">
      <div class="ref-section-title">Blood Glucose Conversion</div>
      <div class="converter-widget">
        <div class="converter-row">
          <input type="number" class="converter-input" id="convMgdl" placeholder="0" inputmode="decimal">
          <span class="converter-label">mg/dL</span>
        </div>
        <div style="text-align:center;"><span class="converter-arrow">⇅</span></div>
        <div class="converter-row">
          <input type="number" class="converter-input" id="convMmol" placeholder="0" inputmode="decimal">
          <span class="converter-label">mmol/L</span>
        </div>
      </div>
      <div style="font-size:0.75rem; color:var(--gray-400); text-align:center;">mmol/L = mg/dL × 0.0555</div>
    </div>

    <!-- CVP Converter -->
    <div class="ref-section">
      <div class="ref-section-title">CVP Conversion</div>
      <div class="converter-widget">
        <div class="converter-row">
          <input type="number" class="converter-input" id="convMmhg" placeholder="0" inputmode="decimal">
          <span class="converter-label">mmHg</span>
        </div>
        <div style="text-align:center;"><span class="converter-arrow">⇅</span></div>
        <div class="converter-row">
          <input type="number" class="converter-input" id="convCmh2o" placeholder="0" inputmode="decimal">
          <span class="converter-label">cmH₂O</span>
        </div>
      </div>
      <div style="font-size:0.75rem; color:var(--gray-400); text-align:center;">Normal CVP: 6–12 cmH₂O. cmH₂O = mmHg × 1.36</div>
    </div>

    <!-- MAP Calculator -->
    <div class="ref-section">
      <div class="ref-section-title">MAP Calculator</div>
      <div class="converter-widget">
        <div class="converter-row">
          <input type="number" class="converter-input" id="mapSys" placeholder="Systolic" inputmode="numeric">
          <span class="converter-label">sys</span>
        </div>
        <div class="converter-row">
          <input type="number" class="converter-input" id="mapDia" placeholder="Diastolic" inputmode="numeric">
          <span class="converter-label">dia</span>
        </div>
        <div class="converter-row" style="background: var(--orange-50); border-radius: var(--radius-sm); padding: 8px 12px;">
          <span id="mapResult" style="font-size:1.1rem; font-weight:700; color:var(--orange-600);">— mmHg</span>
          <span class="converter-label">MAP</span>
        </div>
      </div>
      <div style="font-size:0.75rem; color:var(--gray-400); text-align:center;">MAP = (2 × Diastolic + Systolic) ÷ 3. Normal: 70–100 mmHg</div>
    </div>

    <!-- Pedia BP -->
    <div class="ref-section">
      <div class="ref-section-title">Pediatric Normal Systolic BP</div>
      <div class="converter-widget">
        <div class="converter-row">
          <input type="number" class="converter-input" id="pediaAge" placeholder="Age" inputmode="numeric">
          <span class="converter-label">years</span>
        </div>
        <div class="converter-row" style="background: var(--orange-50); border-radius: var(--radius-sm); padding: 8px 12px;">
          <span id="pediaBpResult" style="font-size:1.1rem; font-weight:700; color:var(--orange-600);">— mmHg</span>
          <span class="converter-label">SBP</span>
        </div>
      </div>
      <div style="font-size:0.75rem; color:var(--gray-400); text-align:center;">Normal SBP = Age × 2 + 70</div>
    </div>

    <!-- Metric System -->
    <div class="ref-section">
      <div class="ref-section-title">Metric System</div>
      <table class="ref-table">
        <tr><td>1 gram</td><td>1,000 mg</td></tr>
        <tr><td>1,000 g</td><td>1 kg</td></tr>
        <tr><td>1 mg</td><td>1,000 mcg</td></tr>
        <tr><td>0.001 mg</td><td>1 mcg</td></tr>
        <tr><td>1 Liter</td><td>1,000 mL</td></tr>
        <tr><td>1 meter</td><td>100 cm = 1,000 mm</td></tr>
        <tr><td>2.5 cm</td><td>1 inch</td></tr>
      </table>
    </div>

    <!-- Weight Table -->
    <div class="ref-section">
      <div class="ref-section-title">Weight / Grain Conversion</div>
      <table class="ref-table">
        <tr><th>Grams</th><th>mg</th><th>Grains</th></tr>
        <tr><td>1 g</td><td>1000 mg</td><td>15 gr</td></tr>
        <tr><td>0.6 g</td><td>600 mg</td><td>10 gr</td></tr>
        <tr><td>0.5 g</td><td>500 mg</td><td>7.5 gr</td></tr>
        <tr><td>0.3 g</td><td>300 mg</td><td>5 gr</td></tr>
        <tr><td>0.06 g</td><td>60 mg</td><td>1 gr</td></tr>
      </table>
    </div>

    <!-- Swan-Ganz -->
    <div class="ref-section">
      <div class="ref-section-title">Swan-Ganz Normal Values</div>
      <table class="swan-ganz-table">
        <tr><th>Chamber</th><th>Systolic</th><th>Diastolic</th></tr>
        <tr><td>RA</td><td>2–6</td><td>2–8</td></tr>
        <tr><td>RV</td><td>20–30</td><td>0–8</td></tr>
        <tr><td>PA</td><td>20–30</td><td>8–15</td></tr>
        <tr><td colspan="2">PCWP</td><td>6–12</td></tr>
      </table>
    </div>

    <!-- Pupil Scale -->
    <div class="ref-section">
      <div class="ref-section-title">Pupil Scale (mm)</div>
      <div class="pupil-scale">
        ${[1,2,3,4,5,6,7,8].map(s => `
          <div class="pupil-item">
            <div class="pupil-dot" style="width:${s * 4}px; height:${s * 4}px;"></div>
            <span class="pupil-label">${s}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  // Attach converter listeners
  setTimeout(attachConverterListeners, 50);
}

function attachConverterListeners() {
  // Weight: kg ↔ lb
  const convKg = document.getElementById('convKg');
  const convLb = document.getElementById('convLb');
  if (convKg && convLb) {
    convKg.addEventListener('input', () => {
      const v = parseFloat(convKg.value);
      convLb.value = isNaN(v) ? '' : formatNumber(v * 2.2);
    });
    convLb.addEventListener('input', () => {
      const v = parseFloat(convLb.value);
      convKg.value = isNaN(v) ? '' : formatNumber(v / 2.2);
    });
  }

  // Temperature: °C ↔ °F
  const convC = document.getElementById('convC');
  const convF = document.getElementById('convF');
  if (convC && convF) {
    convC.addEventListener('input', () => {
      const v = parseFloat(convC.value);
      convF.value = isNaN(v) ? '' : formatNumber(v * 9/5 + 32, 1);
    });
    convF.addEventListener('input', () => {
      const v = parseFloat(convF.value);
      convC.value = isNaN(v) ? '' : formatNumber((v - 32) * 5/9, 1);
    });
  }

  // CBG: mg/dL ↔ mmol/L
  const convMgdl = document.getElementById('convMgdl');
  const convMmol = document.getElementById('convMmol');
  if (convMgdl && convMmol) {
    convMgdl.addEventListener('input', () => {
      const v = parseFloat(convMgdl.value);
      convMmol.value = isNaN(v) ? '' : formatNumber(v * 0.0555);
    });
    convMmol.addEventListener('input', () => {
      const v = parseFloat(convMmol.value);
      convMgdl.value = isNaN(v) ? '' : formatNumber(v / 0.0555);
    });
  }

  // CVP: mmHg ↔ cmH2O
  const convMmhg = document.getElementById('convMmhg');
  const convCmh2o = document.getElementById('convCmh2o');
  if (convMmhg && convCmh2o) {
    convMmhg.addEventListener('input', () => {
      const v = parseFloat(convMmhg.value);
      convCmh2o.value = isNaN(v) ? '' : formatNumber(v * 1.36);
    });
    convCmh2o.addEventListener('input', () => {
      const v = parseFloat(convCmh2o.value);
      convMmhg.value = isNaN(v) ? '' : formatNumber(v / 1.36);
    });
  }

  // MAP Calculator
  const mapSys = document.getElementById('mapSys');
  const mapDia = document.getElementById('mapDia');
  const mapResult = document.getElementById('mapResult');
  if (mapSys && mapDia && mapResult) {
    const calcMap = () => {
      const s = parseFloat(mapSys.value);
      const d = parseFloat(mapDia.value);
      if (isNaN(s) || isNaN(d)) { mapResult.textContent = '— mmHg'; return; }
      const map = (2 * d + s) / 3;
      mapResult.textContent = `${formatNumber(map, 0)} mmHg`;
    };
    mapSys.addEventListener('input', calcMap);
    mapDia.addEventListener('input', calcMap);
  }

  // Pedia BP
  const pediaAge = document.getElementById('pediaAge');
  const pediaBpResult = document.getElementById('pediaBpResult');
  if (pediaAge && pediaBpResult) {
    pediaAge.addEventListener('input', () => {
      const age = parseFloat(pediaAge.value);
      if (isNaN(age)) { pediaBpResult.textContent = '— mmHg'; return; }
      const sbp = age * 2 + 70;
      pediaBpResult.textContent = `${formatNumber(sbp, 0)} mmHg`;
    });
  }
}

// ── Custom Drip Calculation ──
function recalculateCustomDrip() {
  const amount = parseFloat(state.customDrugAmount);
  const vol = parseFloat(state.customTotalVol);
  const unit = state.customDrugUnit || 'mg';
  const doseUnit = state.customDoseUnit || 'mcg/kg/min';
  const weight = parseFloat(state.weight);
  const dose = parseFloat(state.dose);
  const rate = parseFloat(state.rate);
  const isWeightBased = doseUnit.includes('/kg/');

  const resultEl = document.getElementById('calcResult');
  const concDisp = document.getElementById('customConcDisplay');

  // Show/hide weight input depending on doseUnit
  const weightGrp = document.getElementById('customWeightGroup');
  if (weightGrp) weightGrp.style.display = isWeightBased ? 'block' : 'none';

  if (isNaN(amount) || isNaN(vol) || amount <= 0 || vol <= 0) {
    if (concDisp) concDisp.textContent = '';
    if (resultEl) resultEl.innerHTML = '';
    return;
  }

  // Convert amount to mcg for internal calculation if mass, or keep units if units
  let totalMcg;
  if (unit === 'g') totalMcg = amount * 1000000;
  else if (unit === 'mg') totalMcg = amount * 1000;
  else if (unit === 'mcg') totalMcg = amount;
  else if (unit === 'units') totalMcg = amount;

  const concPerCc = totalMcg / vol; // mcg/mL or units/mL

  if (concDisp) {
    if (unit === 'units') {
      concDisp.textContent = `Concentration: ${formatNumber(concPerCc)} units/mL`;
    } else {
      const concMg = (totalMcg / 1000) / vol;
      concDisp.textContent = `Concentration: ${formatNumber(concPerCc)} mcg/mL (${formatNumber(concMg, 3)} mg/mL)`;
    }
  }

  if (state.calcMode === 'doseToRate') {
    if (isNaN(dose) || dose <= 0) { if (resultEl) resultEl.innerHTML = ''; return; }
    if (isWeightBased && (isNaN(weight) || weight <= 0)) { if (resultEl) resultEl.innerHTML = ''; return; }

    let requiredMcgPerHr = 0;
    if (doseUnit === 'mcg/kg/min') requiredMcgPerHr = dose * weight * 60;
    else if (doseUnit === 'mcg/kg/hr') requiredMcgPerHr = dose * weight;
    else if (doseUnit === 'mg/kg/min') requiredMcgPerHr = dose * 1000 * weight * 60;
    else if (doseUnit === 'mg/kg/hr') requiredMcgPerHr = dose * 1000 * weight;
    else if (doseUnit === 'mcg/min') requiredMcgPerHr = dose * 60;
    else if (doseUnit === 'mcg/hr') requiredMcgPerHr = dose;
    else if (doseUnit === 'mg/min') requiredMcgPerHr = dose * 1000 * 60;
    else if (doseUnit === 'mg/hr') requiredMcgPerHr = dose * 1000;
    else if (doseUnit === 'units/hr') requiredMcgPerHr = dose;
    else if (doseUnit === 'units/kg/hr') requiredMcgPerHr = dose * weight;

    const calcRate = requiredMcgPerHr / concPerCc;
    const gtts15 = (calcRate * 15) / 60;
    const gtts20 = (calcRate * 20) / 60;

    resultEl.innerHTML = `
      <div class="result-card">
        <div class="result-label">Calculated Flow Rate</div>
        <div class="result-value">${formatNumber(calcRate)}</div>
        <div class="result-unit">cc/hr (mL/hr)</div>
        <div class="result-details">
          <div class="result-detail">
            <div class="result-detail-label">Macro (15gtt)</div>
            <div class="result-detail-value">${formatNumber(gtts15)} gtts/min</div>
          </div>
          <div class="result-detail">
            <div class="result-detail-label">Macro (20gtt)</div>
            <div class="result-detail-value">${formatNumber(gtts20)} gtts/min</div>
          </div>
          <div class="result-detail">
            <div class="result-detail-label">Micro (60gtt)</div>
            <div class="result-detail-value">${formatNumber(calcRate)} ugtts/min</div>
          </div>
        </div>
      </div>
    `;
  } else {
    if (isNaN(rate) || rate <= 0) { if (resultEl) resultEl.innerHTML = ''; return; }
    if (isWeightBased && (isNaN(weight) || weight <= 0)) { if (resultEl) resultEl.innerHTML = ''; return; }

    const deliveredMcgPerHr = rate * concPerCc;
    let deliveredDose = 0;

    if (doseUnit === 'mcg/kg/min') deliveredDose = deliveredMcgPerHr / (weight * 60);
    else if (doseUnit === 'mcg/kg/hr') deliveredDose = deliveredMcgPerHr / weight;
    else if (doseUnit === 'mg/kg/min') deliveredDose = (deliveredMcgPerHr / 1000) / (weight * 60);
    else if (doseUnit === 'mg/kg/hr') deliveredDose = (deliveredMcgPerHr / 1000) / weight;
    else if (doseUnit === 'mcg/min') deliveredDose = deliveredMcgPerHr / 60;
    else if (doseUnit === 'mcg/hr') deliveredDose = deliveredMcgPerHr;
    else if (doseUnit === 'mg/min') deliveredDose = (deliveredMcgPerHr / 1000) / 60;
    else if (doseUnit === 'mg/hr') deliveredDose = deliveredMcgPerHr / 1000;
    else if (doseUnit === 'units/hr') deliveredDose = deliveredMcgPerHr;
    else if (doseUnit === 'units/kg/hr') deliveredDose = deliveredMcgPerHr / weight;

    resultEl.innerHTML = `
      <div class="result-card">
        <div class="result-label">Delivered Dose</div>
        <div class="result-value">${formatNumber(deliveredDose, 4)}</div>
        <div class="result-unit">${doseUnit}</div>
        <div class="result-details">
          <div class="result-detail">
            <div class="result-detail-label">Flow Rate</div>
            <div class="result-detail-value">${formatNumber(rate)} cc/hr</div>
          </div>
          <div class="result-detail">
            <div class="result-detail-label">Concentration</div>
            <div class="result-detail-value">${formatNumber(concPerCc)} ${unit === 'units' ? 'U' : 'mcg'}/cc</div>
          </div>
        </div>
      </div>
    `;
  }
}

// ── Handheld Math Calculator Logic ──
const mathCalcState = {
  display: '0',
  history: '',
  prevVal: null,
  op: null,
  newInput: true,
};

function openMathCalc() {
  document.getElementById('mathCalcOverlay').classList.add('open');
}

function closeMathCalc() {
  document.getElementById('mathCalcOverlay').classList.remove('open');
}

function mathCalcInput(val) {
  const outputEl = document.getElementById('mathCalcOutput');
  const historyEl = document.getElementById('mathCalcHistory');

  if (val >= '0' && val <= '9') {
    if (mathCalcState.newInput || mathCalcState.display === '0') {
      mathCalcState.display = val;
      mathCalcState.newInput = false;
    } else {
      mathCalcState.display += val;
    }
  } else if (val === '.') {
    if (mathCalcState.newInput) {
      mathCalcState.display = '0.';
      mathCalcState.newInput = false;
    } else if (!mathCalcState.display.includes('.')) {
      mathCalcState.display += '.';
    }
  } else if (val === 'C') {
    mathCalcState.display = '0';
    mathCalcState.history = '';
    mathCalcState.prevVal = null;
    mathCalcState.op = null;
    mathCalcState.newInput = true;
  } else if (val === 'back') {
    if (!mathCalcState.newInput && mathCalcState.display.length > 0) {
      mathCalcState.display = mathCalcState.display.slice(0, -1);
      if (mathCalcState.display === '' || mathCalcState.display === '-') {
        mathCalcState.display = '0';
        mathCalcState.newInput = true;
      }
    }
  } else if (val === 'pm') {
    if (mathCalcState.display !== '0') {
      if (mathCalcState.display.startsWith('-')) {
        mathCalcState.display = mathCalcState.display.substring(1);
      } else {
        mathCalcState.display = '-' + mathCalcState.display;
      }
    }
  } else if (val === '%') {
    const cur = parseFloat(mathCalcState.display);
    if (!isNaN(cur)) {
      mathCalcState.display = (cur / 100).toString();
      mathCalcState.newInput = true;
    }
  } else if (['+', '-', '*', '/'].includes(val)) {
    const cur = parseFloat(mathCalcState.display);
    if (mathCalcState.prevVal !== null && mathCalcState.op && !mathCalcState.newInput) {
      const res = evalMathOp(mathCalcState.prevVal, cur, mathCalcState.op);
      mathCalcState.display = res.toString();
      mathCalcState.prevVal = res;
    } else {
      mathCalcState.prevVal = cur;
    }
    mathCalcState.op = val;
    const symbolMap = { '+': '+', '-': '−', '*': '×', '/': '÷' };
    mathCalcState.history = `${mathCalcState.prevVal} ${symbolMap[val]}`;
    mathCalcState.newInput = true;
  } else if (val === '=') {
    if (mathCalcState.prevVal !== null && mathCalcState.op) {
      const cur = parseFloat(mathCalcState.display);
      const symbolMap = { '+': '+', '-': '−', '*': '×', '/': '÷' };
      mathCalcState.history = `${mathCalcState.prevVal} ${symbolMap[mathCalcState.op]} ${cur} =`;
      const res = evalMathOp(mathCalcState.prevVal, cur, mathCalcState.op);
      mathCalcState.display = res.toString();
      mathCalcState.prevVal = null;
      mathCalcState.op = null;
      mathCalcState.newInput = true;
    }
  }

  if (outputEl) outputEl.textContent = mathCalcState.display;
  if (historyEl) historyEl.textContent = mathCalcState.history;
}

function evalMathOp(a, b, op) {
  switch (op) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/': return b !== 0 ? a / b : 'Error';
    default: return b;
  }
}

// ── Search ──
let searchRafId = null;
function handleSearch(e) {
  state.searchQuery = e.target.value;
  const clearBtn = document.querySelector('.search-clear');
  if (clearBtn) clearBtn.classList.toggle('visible', state.searchQuery.length > 0);
  
  if (searchRafId) cancelAnimationFrame(searchRafId);
  searchRafId = requestAnimationFrame(() => {
    renderDrugGrid();
  });
}

function clearSearch() {
  state.searchQuery = '';
  document.getElementById('searchInput').value = '';
  document.querySelector('.search-clear').classList.remove('visible');
  renderDrugGrid();
}

// ── Liability Disclaimer (shown every time a drug is selected) ──
function agreeDisclaimer() {
  const overlay = document.getElementById('disclaimerOverlay');
  if (overlay) overlay.classList.remove('open');
}

function showDisclaimer() {
  const overlay = document.getElementById('disclaimerOverlay');
  if (overlay) overlay.classList.add('open');
}

// ── Initialization ──
function init() {
  renderCategoryPills();
  renderDrugGrid();
  renderQuickRef();

  // Search input
  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.addEventListener('input', handleSearch);

  // Close overlays on backdrop click
  document.getElementById('calcOverlay').addEventListener('click', closeCalculator);
  document.getElementById('quickRefOverlay').addEventListener('click', closeQuickRef);
  const mathOverlay = document.getElementById('mathCalcOverlay');
  if (mathOverlay) {
    mathOverlay.addEventListener('click', (e) => {
      if (e.target === mathOverlay) closeMathCalc();
    });
  }

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    const isMathOpen = document.getElementById('mathCalcOverlay')?.classList.contains('open');

    if (e.key === 'Escape') {
      closeCalculator();
      closeQuickRef();
      closeMathCalc();
      if (typeof closeChatbot === 'function') closeChatbot();
    } else if (isMathOpen) {
      if (e.key >= '0' && e.key <= '9') mathCalcInput(e.key);
      else if (e.key === '.' || e.key === ',') mathCalcInput('.');
      else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') mathCalcInput(e.key);
      else if (e.key === 'Enter' || e.key === '=') { e.preventDefault(); mathCalcInput('='); }
      else if (e.key === 'Backspace') mathCalcInput('back');
      else if (e.key === 'c' || e.key === 'C') mathCalcInput('C');
      else if (e.key === '%') mathCalcInput('%');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  init();
  try {
    const saved = localStorage.getItem('icu_user_rating');
    if (saved) {
      submitAppRating(parseInt(saved, 10));
    }
  } catch (e) {}
});

// ── Interactive User Rating Engine ──
function submitAppRating(stars) {
  const picker = document.getElementById('starPicker');
  const msg = document.getElementById('ratingStatusMsg');
  if (!picker || !msg) return;

  const starBtns = picker.querySelectorAll('.star-btn');
  starBtns.forEach((btn, index) => {
    if (index < stars) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  try {
    localStorage.setItem('icu_user_rating', stars.toString());
  } catch (e) {}

  msg.innerHTML = `<span style="color: #22c55e; font-weight:700;">Thank you! You rated ${stars}/5 Stars ★</span>`;
}

// ── Drug Calculations Made Easy Modal Handlers ──
function openBasicFormulasModal() {
  showDisclaimer();
  const overlay = document.getElementById('basicFormulasOverlay');
  if (overlay) overlay.classList.add('open');
}

function closeBasicFormulasModal() {
  const overlay = document.getElementById('basicFormulasOverlay');
  if (overlay) overlay.classList.remove('open');
}
