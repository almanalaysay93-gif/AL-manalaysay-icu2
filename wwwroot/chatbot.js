/* ============================================================
   AI Critical Care Pharmacy Assistant (Chatbot Engine)
   Knowledge Base sourced from:
   - Comprehensive Critical Care Pharmacy Data
   - Vasopressin ICU Computation & Dosing Reference Guide
   - Bedside ICU Pharmacotherapy Protocol Database
   ============================================================ */

const PHARMACY_KB = {
  // ── Complete Drug Monographs ──
  monographs: {
    heparin: {
      name: 'Heparin (Unfractionated)',
      class: 'Parenteral Anticoagulant (Indirect Thrombin & Factor Xa Inhibitor)',
      mechanism: 'Binds to Antithrombin III (ATIII), causing a conformational change that accelerates ATIII inactivation of Thrombin (Factor IIa) and Factor Xa by 1,000-fold.',
      dosing: 'ACS / VTE Loading: 60–80 units/kg IV bolus (max 4,000–5,000 units). Continuous Infusion: 12–18 units/kg/h, titrated against institutional nomogram to target aPTT (1.5–2.5x control) or Anti-Xa (0.3–0.7 IU/mL).',
      pharmacokinetics: 'Onset: Immediate IV. Half-life: 1–2 hours (dose-dependent). Clearance via reticuloendothelial system and hepatic metabolism.',
      adverseEffects: 'Bleeding, Heparin-Induced Thrombocytopenia (HIT), osteopenia (chronic use), hyperkalemia (aldosterone suppression).',
      warnings: '⚠️ Heparin-Induced Thrombocytopenia (HIT Type II): Immune-mediated PF4-heparin antibody activation causing severe thrombocytopenia (>50% drop) and life-threatening arterial/venous thrombosis. Immediately discontinue all heparin and start Argatroban or Bivalirudin. Reversal Agent: Protamine Sulfate (1 mg protamine neutralizes ~100 units heparin; max 50 mg slow IV).'
    },
    dopamine: {
      name: 'Dopamine',
      class: 'Inotropic & Vasopressor Catecholamine',
      mechanism: 'Dose-dependent agonist: Low (1–5 mcg/kg/min) = D1 renal/splanchnic vasodilation; Mid (5–10) = β1 cardiac inotropy/chronotropy; High (>10) = α1 peripheral vasoconstriction.',
      dosing: 'Renal: 1–5 mcg/kg/min. Inotropic: 5–10 mcg/kg/min. Pressor: 10–20 mcg/kg/min. (Weight-based weightPerMin).',
      pharmacokinetics: 'Onset: <5 min. Half-life: <2 min. Metabolized by MAO and COMT.',
      adverseEffects: 'Tachyarrhythmias, sinus tachycardia, myocardial ischemia, peripheral gangrene at pressor doses.',
      warnings: '⚠️ Higher tachyarrhythmia and mortality rate compared to Norepinephrine in septic shock. Second-line agent reserved for symptomatic bradycardia with low arrhythmia risk.'
    },
    dobutamine: {
      name: 'Dobutamine',
      class: 'Inotropic Sympathomimetic (Predominant β1 Agonist)',
      mechanism: 'Direct β1-adrenergic agonist that increases myocardial cAMP, enhancing contractility (inotropy) and stroke volume with mild β2-mediated vasodilation.',
      dosing: 'Continuous Infusion: 2.5–20 mcg/kg/min. (Weight-based weightPerMin).',
      pharmacokinetics: 'Onset: 1–2 min. Half-life: 10–15 min. Hepatic methylation and glucuronidation.',
      adverseEffects: 'Tachycardia, ventricular ectopy/arrhythmias, hypotension (β2 vasodilation if hypovolemic), angina.',
      warnings: '⚠️ First-line inotrope in cardiogenic shock or persistent septic shock hypoperfusion with adequate blood pressure. Ensure intravascular volume repletion before initiating.'
    },
    norepinephrine: {
      name: 'Norepinephrine (Levophed)',
      class: 'Potent α1 & β1 Adrenergic Vasopressor',
      mechanism: 'Potent α1 agonist causing intense arterial and venous vasoconstriction (increases SVR & MAP), with moderate β1 cardiac inotropic support.',
      dosing: 'Continuous Infusion: 0.01–3.0 mcg/kg/min. Standard 50cc Prep: 4 mg/50cc (80 mcg/cc) → 0.05 mcg/kg/min in 70kg = 2.6 mL/hr.',
      pharmacokinetics: 'Onset: 1–2 min. Half-life: 1–2 min. Rapid enzymatic inactivation by COMT & MAO.',
      adverseEffects: 'Severe peripheral/splanchnic ischemia, extravasation tissue necrosis, reflex bradycardia, anxiety.',
      warnings: '⚠️ First-line vasopressor for septic and distributive shock. Administer via CENTRAL LINE. Central line extravasation antidote: Phentolamine 5–10 mg diluted in 10 mL NS local infiltration.'
    },
    epinephrine: {
      name: 'Epinephrine (Adrenaline)',
      class: 'Potent Non-selective α1, α2, β1, β2 Adrenergic Agonist',
      mechanism: 'Low doses (0.01–0.05 mcg/kg/min) = β1/β2 agonist (cardiac output & bronchodilation); High doses (>0.05) = α1 vasoconstriction.',
      dosing: 'Anaphylaxis IM: 0.3–0.5 mg IM (1:1,000). ACLS Cardiac Arrest: 1 mg IV q3-5min (1:10,000). Continuous Pressor: 0.01–0.5 mcg/kg/min.',
      pharmacokinetics: 'Onset: Immediate IV / 5–10 min IM. Half-life: 3–5 min.',
      adverseEffects: 'Tachyarrhythmias, myocardial ischemia, elevated serum lactate (β2 stimulation of glycolysis), hyperglycemia, anxiety.',
      warnings: '⚠️ First-line for Anaphylaxis & ACLS. Third-line pressor in septic shock. High doses cause profound splanchnic vasoconstriction.'
    },
    vasopressin: {
      name: 'Vasopressin (Argipressin / ADH)',
      class: 'Direct V1 & V2 Receptor Agonist (Non-adrenergic Vasopressor)',
      mechanism: 'Stimulates vascular smooth muscle V1 receptors (vasoconstriction) and renal collecting duct V2 receptors (water reabsorption).',
      dosing: 'Septic Shock Fixed Dose: 0.03 units/min (1.8 units/hr). Range: 0.01–0.04 units/min. NOT weight-based!',
      pharmacokinetics: 'Onset: 5–15 min. Half-life: 10–20 min. Cleaved by tissue peptidases.',
      adverseEffects: 'Peripheral/mesenteric ischemia, hyponatremia (V2 action), bradycardia, chest pain.',
      warnings: '⚠️ Administer via CENTRAL VENOUS LINE. Standard prep: 20 units / 100 mL (0.2 u/mL) → 0.03 u/min = 9.0 mL/hr.'
    },
    isoket: {
      name: 'Isoket (Isosorbide Dinitrate)',
      class: 'Nitrate Vasodilator (Venous & Coronary Arterial Dilator)',
      mechanism: 'Releases nitric oxide in vascular smooth muscle, increasing cGMP to cause venodilation (reduces preload) and coronary vasodilation.',
      dosing: 'Continuous Infusion: 1–10 mg/hr (non-weight based). Standard 100cc Prep: 10 mg/100cc (0.1 mg/cc) → 2 mg/hr = 20 mL/hr.',
      pharmacokinetics: 'Onset: 2–5 min. Half-life: 1 hour. Active metabolite isosorbide-5-mononitrate.',
      adverseEffects: 'Hypotension, throbbing headache, reflex tachycardia, methemoglobinemia, nitrate tolerance.',
      warnings: '⚠️ Contraindicated with PDE-5 inhibitors (Sildenafil, Tadalafil) due to fatal hypotension.'
    },
    ntg: {
      name: 'NTG (Nitroglycerin / Glyceryl Trinitrate)',
      class: 'Direct Nitrate Vasodilator',
      mechanism: 'Venous dilator at low doses (reduces preload/LVEDP); arterial & coronary dilator at higher doses (reduces afterload & relieves ischemia).',
      dosing: 'Continuous Infusion: 0.5–10 mg/hr (5–200 mcg/min). IV Push Bolus: 0.1 mg/cc (1 mg + 9 cc PNSS).',
      pharmacokinetics: 'Onset: 1–2 min. Duration: 3–5 min. Elimination half-life: 1–4 min.',
      adverseEffects: 'Headache, hypotension, reflex tachycardia, methemoglobinemia, tolerance after 24–48h continuous use.',
      warnings: '⚠️ Requires non-PVC glass or polyethylene tubing to prevent drug absorption. Absolute contraindication with PDE-5 inhibitors.'
    },
    nicardipine: {
      name: 'Nicardipine',
      class: 'Dihydropyridine Calcium Channel Blocker (Arterial Vasodilator)',
      mechanism: 'Selectively blocks L-type calcium channels in vascular smooth muscle, producing potent arterial vasodilation with minimal cardiac inotropic effect.',
      dosing: 'Continuous Infusion: Start 5 mg/hr, increase by 2.5 mg/hr q5-15min to max 15 mg/hr. Maintenance: 3 mg/hr.',
      pharmacokinetics: 'Onset: 5–15 min. Half-life: 15–30 min. Extensive hepatic metabolism (CYP3A4).',
      adverseEffects: 'Hypotension, reflex tachycardia, flushing, headache, peripheral edema, phlebitis at peripheral site.',
      warnings: '⚠️ Change peripheral IV line site q12h to prevent thrombophlebitis. Preferred in neurocritical care (ischemic/hemorrhagic stroke & SAH).'
    },
    cordarone: {
      name: 'Cordarone (Amiodarone HCl)',
      class: 'Class III Antiarrhythmic Agent (Multi-channel Blocker)',
      mechanism: 'Blocks K+ channels (prolongs action potential duration/QT interval), Na+ channels, Ca2+ channels, and non-competitively blocks α/β receptors.',
      dosing: 'VF / Pulseless VT ACLS: 300 mg IV push, optional 150 mg second dose. VT with Pulse Loading: 150 mg over 10 min. Continuous Infusion: 1 mg/min x 6 hr (360 mg), then 0.5 mg/min x 18 hr (540 mg).',
      pharmacokinetics: 'Extensive tissue distribution (Vd ~60 L/kg). Half-life: 40–55 days! Hepatic CYP3A4/2C8 metabolism.',
      adverseEffects: 'Hypotension, bradycardia, AV block, QT prolongation / Torsades, pulmonary toxicity, thyroid dysfunction, phlebitis.',
      warnings: '⚠️ INCOMPATIBLE with Furosemide, Heparin, Bicarbonate at Y-site (precipitates!). Requires volumetric pump & in-line 0.22 micron filter for >2 hrs.'
    },
    esmolol: {
      name: 'Esmolol',
      class: 'Ultra-Short Acting Selective β1-Adrenergic Blocker',
      mechanism: 'Competitively blocks β1-adrenergic receptors in cardiac tissue, decreasing heart rate, AV nodal conduction, and myocardial oxygen demand.',
      dosing: 'Loading Dose: 500 mcg/kg over 1 min. Maintenance Infusion: 50–300 mcg/kg/min (0.05–0.3 mg/kg/min).',
      pharmacokinetics: 'Onset: 2–10 min. Elimination half-life: 9 minutes! Rapidly hydrolyzed by red blood cell esterases.',
      adverseEffects: 'Hypotension, bradycardia, heart block, bronchospasm, heart failure decompensation.',
      warnings: '⚠️ Ultra-short half-life allows rapid offset within 10–30 min of stopping infusion. Incompatible with Furosemide and Bicarbonate.'
    },
    precedex: {
      name: 'Precedex (Dexmedetomidine)',
      class: 'Selective Central α2-Adrenergic Receptor Agonist',
      mechanism: 'Stimulates central presynaptic α2 receptors in the locus coeruleus, inhibiting norepinephrine release to produce sedation without respiratory depression.',
      dosing: 'Loading Dose: 1 mcg/kg over 10 min (frequently omitted to avoid bradycardia/hypotension). Maintenance Infusion: 0.2–1.5 mcg/kg/h.',
      pharmacokinetics: 'Onset: 15–30 min. Distribution t1/2: 6 min. Elimination t1/2: 2–3 hrs. Hepatic glucuronidation.',
      adverseEffects: 'Bradycardia, sinus arrest, hypotension, transient hypertension (with rapid load), dry mouth.',
      warnings: '⚠️ Does NOT cause respiratory depression (ideal for non-intubated patients or extubation weaning). Recommended over benzodiazepines by SCCM PADIS.'
    },
    streptokinase: {
      name: 'Streptokinase',
      class: 'Fibrinolytic / Thrombolytic Agent',
      mechanism: 'Complexes with plasminogen to form an active complex that converts uncomplexed plasminogen into plasmin, dissolving fibrin clots.',
      dosing: 'Acute MI: 1,500,000 IU in 100 cc PNSS over 30–60 min. Intracoronary: 250,000–500,000 IU over 30–60 min. DVT / PE: 250,000 IU load over 30 min, then 100,000 IU/hr x 24–72 hr.',
      pharmacokinetics: 'Half-life: 20 minutes. Cleared by circulating antistreptococcal antibodies and hepatic clearance.',
      adverseEffects: 'Severe internal/intracranial hemorrhage, fever, allergic reactions, anaphylaxis, hypotension.',
      warnings: '⚠️ Antigenic (bacterial protein from Beta-hemolytic Streptococcus). Avoid re-administration within 6 months to 5 years due to neutralizing antibodies and anaphylaxis risk.'
    },
    lidocaine: {
      name: 'Lidocaine',
      class: 'Class IB Antiarrhythmic & Local Anesthetic',
      mechanism: 'Blocks fast voltage-gated Na+ channels in ischemic cardiac Purkinje fibers and ventricular myocardium, shortening action potential duration.',
      dosing: 'Ventricular Arrhythmias / Cardiac Arrest: 1–1.5 mg/kg IV push (repeat 0.5–0.75 mg/kg q5-10min, max 3 mg/kg). Continuous Infusion: 1–4 mg/min (20–50 mcg/kg/min).',
      pharmacokinetics: 'Onset: 45–90 sec. Half-life: 1.5–2 hours. Deethylated in liver by CYP1A2/3A4 to active MEGX metabolite.',
      adverseEffects: 'Dizziness, paresthesias, confusion, slurred speech, muscle twitching, seizures, respiratory arrest, bradycardia.',
      warnings: '⚠️ Toxicity signs (Lidocaine toxicity / LAST): Circumoral numbness, metallic taste, visual changes → progressing to seizures and cardiac arrest. Hepatic impairment increases toxicity.'
    },
    mgso4: {
      name: 'MgSO4 (Magnesium Sulfate)',
      class: 'Electrolyte Replacement & Anticonvulsant / Antiarrhythmic',
      mechanism: 'Cofactor in Na+/K+-ATPase pump, L-type Ca2+ channel blocker, and NMDA receptor blocker. Stabilizes excitable cardiac and neuronal membranes.',
      dosing: 'Torsades de Pointes ACLS: 1–2 g IV push diluted in 10 mL D5W/NS over 15 min. Eclampsia / Preeclampsia: 4–6 g IV loading over 20 min, then 1–2 g/hr continuous infusion. Severe Asthma: 2 g IV over 20 min.',
      pharmacokinetics: 'Onset: Immediate IV. Duration: 30 minutes. Excreted exclusively by kidneys.',
      adverseEffects: 'Flushing, diaphoresis, hypotension, hyporeflexia (loss of patellar reflexes at 8–10 mEq/L), respiratory depression (>12 mEq/L), cardiac arrest (>15 mEq/L).',
      warnings: '⚠️ Monitor patellar tendon reflexes, respiratory rate (>16/min), and urine output (>30 mL/hr). Antidote for Magnesium Toxicity: Calcium Gluconate 1 g IV push over 3–5 minutes.'
    },
    potassium: {
      name: 'K+ Replacement (Potassium Chloride)',
      class: 'Essential Intracellular Electrolyte Replacement',
      mechanism: 'Restores intracellular K+ gradient critical for cardiac action potential repolarization, resting membrane potential, and neuromuscular conduction.',
      dosing: 'Peripheral Line Max: 10 mEq/hr (concentration max 40 mEq/L). Central Line Max: 20 mEq/hr (continuous cardiac monitoring required). 10 mEq KCl raises serum K+ by ~0.1 mEq/L.',
      pharmacokinetics: 'Excreted 90% by kidneys. Renal failure leads to rapid toxic hyperkalemia.',
      adverseEffects: 'Severe peripheral burning/phlebitis, hyperkalemia, muscle weakness, fatal cardiac arrhythmias (PEA, VF, asystole).',
      warnings: '⚠️ NEVER GIVE AS AN UNDILUTED IV PUSH (FATAL!). Always infuse using a calibrated IV pump. Check renal function and concurrent Magnesium level (hypomagnesemia makes hypokalemia refractory).'
    },
    sodium: {
      name: 'Na+ Replacement (Hypertonic 3% NaCl)',
      class: 'Hypertonic Electrolyte Replacement & Osmotic Agent',
      mechanism: 'Creates an osmotic gradient across the blood-brain barrier, drawing free water from cerebral parenchyma into vascular space to reduce ICP.',
      dosing: 'Symptomatic Hyponatremia / Raised ICP: 3% NaCl 100–150 mL IV over 10–20 min (repeat x1-2 if severe symptoms persist). Goal: raise serum Na+ by 4–6 mEq/L acutely.',
      pharmacokinetics: 'Immediate intravascular volume expansion and cerebral dehydration.',
      adverseEffects: 'Central Pontine Myelinolysis (Osmotic Demyelination Syndrome), fluid overload, pulmonary edema, hyperchloremic metabolic acidosis.',
      warnings: '⚠️ Central Pontine Myelinolysis (ODS): Never exceed serum Na+ correction of >8–10 mEq/L in 24 hours! Monitor serum sodium q2-4h during active 3% NaCl infusion.'
    },
    nahco3: {
      name: 'NaHCO3 (Sodium Bicarbonate 8.4%)',
      class: 'Systemic Alkalinizing Agent & Electrolyte Restorer',
      mechanism: 'Dissociates into Sodium and Bicarbonate ions, buffering excess Hydrogen ions to raise plasma pH and drive K+ into cells.',
      dosing: 'Hyperkalemia / Severe Acidosis (pH <7.1): 50 mEq (1 ampule 50 mL of 8.4%) IV push over 2–5 min. Sodium Channel Blocker Overdose (Tricyclic Antidepressants / Cocaine): 1–2 mEq/kg IV push until QRS narrows.',
      pharmacokinetics: 'Onset: 15 minutes. Duration: 1–2 hours. Excreted renally as CO2 and water.',
      adverseEffects: 'Hypernatremia, hypokalemia, metabolic alkalosis, paradoxical intracellular acidosis (CO2 accumulation), tetany.',
      warnings: '⚠️ INCOMPATIBLE with Catecholamines (Norepinephrine, Epinephrine), Amiodarone, Milrinone, and Calcium salts (forms insoluble Calcium Carbonate precipitate).'
    },
    propofol: {
      name: 'Propofol',
      class: 'Short-acting lipophilic alkylphenol IV hypnotic agent',
      mechanism: 'Positive allosteric modulator of GABAA receptor chloride channels, causing neural hyperpolarization. Mild NMDA inhibition.',
      dosing: 'ICU Sedation: Start 5 mcg/kg/min (0.3 mg/kg/h), titrate by 5–10 mcg/kg/min q5-10min. Usual maintenance: 5–50 mcg/kg/min. RSI Bolus: 0.5–1.5 mg/kg.',
      pharmacokinetics: 'Onset: 30–60 sec. Distribution half-life: 2–4 min. Terminal elimination half-life: 3–12 hrs. Rapid hepatic glucuronidation.',
      adverseEffects: 'Hypotension, venodilation, myocardial depression, respiratory depression, hypertriglyceridemia.',
      warnings: '⚠️ Propofol Infusion Syndrome (PRIS): High-dose (>50 mcg/kg/min) or >48 hrs risks refractory metabolic acidosis, hyperkalemia, rhabdomyolysis, hepatomegaly, renal failure, and cardiac arrest. 1% lipid emulsion provides 1.1 kcal/mL. Change IV tubing q12h due to lipid bacterial growth risk.',
      compatibilities: 'Incompatible with Furosemide at Y-site.'
    },
    fentanyl: {
      name: 'Fentanyl',
      class: 'Potent synthetic phenylpiperidine derivative (Selective μ-opioid agonist)',
      mechanism: 'Binds μ-opioid receptors, inhibiting presynaptic voltage-gated Ca²⁺ channels (reducing substance P/glutamate) and opening postsynaptic K⁺ channels.',
      dosing: 'RSI / Acute Pain: 1–2 mcg/kg (50–100 mcg) slow IV push over 1–2 min. Continuous ICU Infusion: 0.7–10 mcg/kg/h (25–200 mcg/h).',
      pharmacokinetics: 'Onset: 1–2 min. Peak: 7–15 min. Duration: 30–60 min. Hepatic CYP3A4 to inactive norfentanyl. Preferred in acute kidney injury.',
      adverseEffects: 'Hypoventilation, respiratory depression, constipation, ileus, bradycardia, rigid chest syndrome.',
      warnings: '⚠️ Rigid Chest Syndrome: Rapid IV push impairs chest wall compliance & ventilation; treat with prompt neuromuscular blockade or naloxone. CYP3A4 inhibitors increase fentanyl levels.'
    },
    midazolam: {
      name: 'Midazolam',
      class: 'Short-acting imidazobenzodiazepine derivative',
      mechanism: 'Binds stereospecific GABAA receptor sites, increasing GABA affinity and chloride channel opening frequency.',
      dosing: 'Acute Agitation / Sedation Loading: 0.02–0.1 mg/kg (1–4 mg) over 2 min q10-15min. Continuous Infusion: 0.02–0.1 mg/kg/h (1–7 mg/h).',
      pharmacokinetics: 'Onset: 1–5 min. Elimination half-life: 1.5–3.5 hrs. Metabolized by CYP3A4 to active 1-hydroxymidazolam.',
      adverseEffects: 'Respiratory depression, hypotension, paradoxical agitation, delirium, prolonged emergence.',
      warnings: '⚠️ Accumulates substantially in renal impairment, hepatic dysfunction, and low cardiac output. Linked to longer mechanical ventilation and delirium compared to propofol/dexmedetomidine.'
    },
    ketamine: {
      name: 'Ketamine',
      class: 'Arylcyclohexylamine derivative (NMDA receptor antagonist / Dissociative anesthetic)',
      mechanism: 'Non-competitive NMDA receptor blocker. Also engages opioid receptors, monoamines, and voltage-gated Na⁺/Ca²⁺ channels.',
      dosing: 'RSI Induction: 1–2 mg/kg IV push over 60 sec. Sub-dissociative Analgesia Infusion: 0.1–0.5 mg/kg/h (2–10 mcg/kg/min). Status Asthmaticus: 0.5–2 mg/kg/h.',
      pharmacokinetics: 'Distribution t1/2: 2–4 min. Elimination t1/2: 2–3 hrs. Hepatic CYP2B6/3A4 to active norketamine.',
      adverseEffects: 'Emergence delirium, hallucinations, elevated ICP/IOP, hypersalivation, transient hypertension/tachycardia.',
      warnings: '⚠️ Indirectly stimulates sympathetic drive (useful in shock), but can exert direct myocardial depression if endogenous catecholamines are depleted. Attenuate emergence with small benzodiazepine or propofol doses.'
    },
    milrinone: {
      name: 'Milrinone',
      class: 'Bipyridine derivative (Phosphodiesterase-3 inhibitor / Inodilator)',
      mechanism: 'Inhibits PDE-3, elevating intracellular cAMP in myocardium (increases contractility/lusitropy) and vascular smooth muscle (vasodilation).',
      dosing: 'Continuous Infusion: 0.375–0.75 mcg/kg/min. Loading dose (50 mcg/kg over 10 min) is usually omitted to prevent severe hypotension.',
      pharmacokinetics: 'Onset: 5–15 min. Half-life: 2.3 hrs in normal renal function. 80–90% excreted unchanged in urine.',
      adverseEffects: 'Hypotension, reflex tachycardia, ventricular arrhythmias, hypokalemia, thrombocytopenia.',
      warnings: '⚠️ Requires significant dose reduction in renal impairment (t1/2 extends to 6–10 hrs). Incompatible with Furosemide (causes physical precipitation). Works independently of β-receptors (effective during β-blocker therapy).'
    },
    nitroprusside: {
      name: 'Sodium Nitroprusside',
      class: 'Direct arterial & venous vasodilator (Nitric oxide donor)',
      mechanism: 'Releases nitric oxide on contact with RBCs, activating guanylyl cyclase to increase cGMP and relax vascular smooth muscle.',
      dosing: 'Continuous Infusion: 0.25–0.5 mcg/kg/min initially, titrate q5min up to max 10 mcg/kg/min (do not exceed 10 mcg/kg/min for >10 min).',
      pharmacokinetics: 'Onset: Immediate (<1 min). Duration: 1–2 min after stopping infusion. Converted to cyanide then thiocyanate by rhodanese.',
      adverseEffects: 'Precipitous hypotension, reflex tachycardia, coronary steal, methemoglobinemia, cyanide & thiocyanate toxicity.',
      warnings: '⚠️ Cyanide Toxicity: Manifests as cellular hypoxia, lactic acidosis, and cardiac arrest (treat with Hydroxocobalamin or Sodium Thiosulfate). Thiocyanate toxicity causes hyperreflexia, tinnitus, and seizures. Protect solution from light.'
    },
    phenylephrine: {
      name: 'Phenylephrine',
      class: 'Pure direct-acting α1-adrenergic agonist vasopressor',
      mechanism: 'Selectively stimulates postsynaptic α1-adrenergic receptors, causing potent arterial vasoconstriction and increased SVR.',
      dosing: 'IV Bolus: 50–200 mcg q2-5min. Continuous Infusion: 0.5–5.0 mcg/kg/min (40–180 mcg/min).',
      pharmacokinetics: 'Onset: Immediate. Duration: 15–20 min. Metabolized by monoamine oxidase (MAO) in liver/GI tract.',
      adverseEffects: 'Reflex bradycardia, decreased cardiac output/stroke volume (due to increased afterload), severe peripheral & splanchnic ischemia.',
      warnings: '⚠️ Lacks β1 inotropic effect. Useful in sepsis with severe tachyarrhythmias or neurogenic shock. Contraindicated with MAO inhibitors.'
    },
    labetalol: {
      name: 'Labetalol',
      class: 'Combined α1, β1, and β2 adrenergic receptor antagonist (1:7 IV ratio)',
      mechanism: 'Blockade of α1 causes peripheral vasodilation; blockade of β1 prevents reflex tachycardia and reduces myocardial contractility.',
      dosing: 'IV Push: 10–20 mg over 2 min, repeat double doses (20, 40, 80 mg) q10min up to max 300 mg. Continuous Infusion: 0.5–2 mg/min (30–120 mg/h).',
      pharmacokinetics: 'Onset: 2–5 min. Peak: 5–15 min. Duration: 2–4 hrs. Hepatic glucuronide conjugation.',
      adverseEffects: 'Bradycardia, AV block, bronchospasm, heart failure exacerbation, orthostatic hypotension.',
      warnings: '⚠️ First-line in acute aortic dissection (reduces dP/dt and BP). Contraindicated in severe bradycardia, 2nd/3rd degree AV block, cardiogenic shock, and severe asthma.'
    },
    rocuronium: {
      name: 'Rocuronium',
      class: 'Aminosteroid non-depolarizing neuromuscular blocking agent',
      mechanism: 'Competitive antagonist at postsynaptic nicotinic acetylcholine (NM) receptors at the neuromuscular junction.',
      dosing: 'RSI Induction: 0.6–1.2 mg/kg IV push. Continuous Infusion: 8–12 mcg/kg/min (0.5–0.7 mg/kg/h) target 1–2 twitches on TOF.',
      pharmacokinetics: 'Intubating conditions in 45–60 sec at 1.2 mg/kg. Duration: 30–60 min. 70% biliary elimination, 30% renal.',
      adverseEffects: 'Prolonged paralysis, critical illness myopathy (especially with steroids).',
      warnings: '⚠️ Must only be administered with deep sedation & analgesia! Reversed rapidly with Sugammadex.'
    },
    sugammadex: {
      name: 'Sugammadex',
      class: 'Selective relaxant binding agent (Modified γ-cyclodextrin)',
      mechanism: 'Encapsulates rocuronium or vecuronium molecules 1:1 in plasma, creating a concentration gradient that clears blockade.',
      dosing: 'Moderate Block (2+ TOF twitches): 2 mg/kg IV. Deep Block (1–2 post-tetanic counts): 4 mg/kg IV. Immediate RSI Reversal (after 1.2 mg/kg rocuronium): 16 mg/kg IV.',
      pharmacokinetics: 'Restores TOF >0.9 within 2 minutes. Excreted unchanged in urine (t1/2 ~2 hrs).',
      adverseEffects: 'Bradycardia, hypotension, anaphylaxis (0.3%), mild PT/aPTT prolongation.',
      warnings: '⚠️ Not recommended in CrCl <30 mL/min. Reduces hormonal contraceptive efficacy for 7 days (requires non-hormonal backup).'
    },
    furosemide: {
      name: 'Furosemide',
      class: 'Short-acting sulfonamide loop diuretic',
      mechanism: 'Inhibits luminal Na⁺/K⁺/2Cl⁻ cotransporter (NKCC2) in thick ascending limb of loop of Henle.',
      dosing: 'IV Push: 20–80 mg slow IV over 1–2 min (max 200 mg in severe renal failure). Continuous Infusion: 20–40 mg load, then 5–40 mg/h.',
      pharmacokinetics: 'Onset: 5–10 min. Peak: 30 min. Duration: 2–3 hrs. Protein binding 91–99%. Hepatic & tubular secretion.',
      adverseEffects: 'Hypokalemia, hypomagnesemia, hyponatremia, hypochloremic metabolic alkalosis, azotemia, ototoxicity.',
      warnings: '⚠️ Ototoxicity risk with rapid IV push (>4 mg/min). Highly alkaline formulation (pH 8.5–9.5); INCOMPATIBLE with acidic drugs (Amiodarone, Dobutamine, Midazolam, Esmolol, Milrinone).'
    },
    nac: {
      name: 'N-Acetylcysteine (NAC)',
      class: 'Sulfhydryl donor / Glutathione precursor & Antioxidant',
      mechanism: 'Restores hepatic glutathione stores to detoxify NAPQI metabolite in acetaminophen toxicity. Scavenges free radicals in liver failure.',
      dosing: 'IV 3-Bag Protocol (300 mg/kg total over 21h): Bag 1: 150 mg/kg in 250 mL D5W over 1h; Bag 2: 50 mg/kg in 500 mL D5W over 4h; Bag 3: 100 mg/kg in 1000 mL D5W over 16h.',
      pharmacokinetics: 'Rapidly deacetylated in liver to L-cysteine. Elimination t1/2: 5.6 hrs.',
      adverseEffects: 'Non-IgE anaphylactoid reaction (flushing, urticaria, bronchospasm, hypotension), nausea.',
      warnings: '⚠️ If anaphylactoid reaction occurs during loading bag, pause infusion, treat with antihistamines, and restart at slower rate once resolved.'
    }
  },

  // ── Y-Site Physical Compatibility Matrix ──
  ySiteMatrix: {
    furosemide: {
      amiodarone: '❌ INCOMPATIBLE (Forms immediate precipitate due to alkaline vs acidic pH mismatch)',
      dobutamine: '❌ INCOMPATIBLE',
      midazolam: '❌ INCOMPATIBLE',
      milrinone: '❌ INCOMPATIBLE',
      esmolol: '❌ INCOMPATIBLE',
      norepinephrine: '✅ COMPATIBLE',
      epinephrine: '✅ COMPATIBLE',
      vasopressin: '✅ COMPATIBLE',
      heparin: '✅ COMPATIBLE',
      sodiumBicarbonate: '✅ COMPATIBLE',
      calciumGluconate: '✅ COMPATIBLE'
    },
    amiodarone: {
      furosemide: '❌ INCOMPATIBLE',
      sodiumBicarbonate: '❌ INCOMPATIBLE',
      calciumGluconate: '❌ INCOMPATIBLE',
      heparin: '❌ INCOMPATIBLE',
      norepinephrine: '✅ COMPATIBLE',
      epinephrine: '✅ COMPATIBLE',
      vasopressin: '✅ COMPATIBLE',
      milrinone: '✅ COMPATIBLE',
      propofol: '✅ COMPATIBLE'
    },
    norepinephrine: {
      sodiumBicarbonate: '❌ INCOMPATIBLE (Alkaline bicarbonate inactivates catecholamines)',
      furosemide: '✅ COMPATIBLE',
      amiodarone: '✅ COMPATIBLE',
      epinephrine: '✅ COMPATIBLE',
      vasopressin: '✅ COMPATIBLE',
      milrinone: '✅ COMPATIBLE',
      calciumGluconate: '✅ COMPATIBLE',
      heparin: '✅ COMPATIBLE',
      propofol: '✅ COMPATIBLE'
    },
    epinephrine: {
      sodiumBicarbonate: '❌ INCOMPATIBLE',
      furosemide: '✅ COMPATIBLE',
      amiodarone: '✅ COMPATIBLE',
      norepinephrine: '✅ COMPATIBLE',
      vasopressin: '✅ COMPATIBLE',
      milrinone: '✅ COMPATIBLE',
      calciumGluconate: '✅ COMPATIBLE',
      heparin: '✅ COMPATIBLE',
      propofol: '✅ COMPATIBLE'
    },
    vasopressin: {
      furosemide: '✅ COMPATIBLE',
      amiodarone: '✅ COMPATIBLE',
      norepinephrine: '✅ COMPATIBLE',
      epinephrine: '✅ COMPATIBLE',
      milrinone: '✅ COMPATIBLE',
      sodiumBicarbonate: '✅ COMPATIBLE',
      calciumGluconate: '✅ COMPATIBLE',
      heparin: '✅ COMPATIBLE',
      propofol: '✅ COMPATIBLE'
    },
    sodiumBicarbonate: {
      norepinephrine: '❌ INCOMPATIBLE (Catecholamine oxidation & inactivation)',
      epinephrine: '❌ INCOMPATIBLE',
      amiodarone: '❌ INCOMPATIBLE',
      milrinone: '❌ INCOMPATIBLE',
      calciumGluconate: '❌ INCOMPATIBLE (Forms insoluble Calcium Carbonate precipitate)',
      furosemide: '✅ COMPATIBLE',
      vasopressin: '✅ COMPATIBLE',
      heparin: '✅ COMPATIBLE'
    }
  },

  // ── Practice Guidelines ──
  guidelines: {
    sepsis: `### 🛡️ Surviving Sepsis Campaign Guidelines (Vasopressors & Inotropes)
* **First-Line Vasopressor**: **Norepinephrine** is the primary agent to maintain MAP ≥ 65 mmHg.
* **Second-Line Adjunct**: **Vasopressin** at a fixed, non-titrated dose of **0.03 units/min** (9.0 mL/hr of 20u/100mL) to reduce norepinephrine requirements.
* **Third-Line Agent**: **Epinephrine** added if MAP goal is unmet.
* **Inotropic Support**: Add **Dobutamine** if persistent hypoperfusion occurs despite adequate intravascular volume and vasopressor support.
* **Steroids**: Hydrocortisone 200 mg/day IV reserved for refractory septic shock.`,

    padis: `### 🧠 SCCM PADIS Guidelines (Pain, Agitation, Delirium, Immobility, Sleep)
* **Analgesia-First Approach**: Always assess and manage pain (Fentanyl or Ketamine) before initiating sedatives.
* **Sedative Preference**: **Propofol** or **Dexmedetomidine (Precedex)** are recommended over benzodiazepines (Midazolam).
* **Benefits**: Non-benzodiazepines significantly shorten mechanical ventilation duration, decrease ICU stay, and reduce delirium incidence.
* **Target Sedation**: Target light sedation depth (RASS -2 to 0) unless clinical indications (RSI, severe ARDS, raised ICP) demand deep sedation.`,

    ards: `### 🫁 ARDS Neuromuscular Blockade Guidelines
* **Continuous NMB Protocol**: Routine continuous paralysis is NOT recommended for all ARDS.
* **Indication**: Reserved for early, severe ARDS (PaO₂/FiO₂ < 150) with severe ventilator dyssynchrony or refractory hypoxemia.
* **Agent & Duration**: Non-depolarizing blocker (**Rocuronium**) limited to ≤48 hours to prevent Critical Illness Myopathy.
* **Prerequisite**: Strict deep sedation and analgesia MUST be established prior to NMB.`,

    glycemic: `### 🩸 ICU Glycemic Control Guidelines
* **Blood Glucose Target**: Maintain blood glucose between **140 – 180 mg/dL** (7.8 – 10.0 mmol/L) using continuous insulin infusion.
* **Avoid Tight Control**: Strict normoglycemia (80–110 mg/dL) increases severe hypoglycemia risk and overall mortality (NICE-SUGAR trial).`
  }
};

// Helper function to build interactive options HTML
function buildOptionsGrid(title, options) {
  let html = `<div class="chat-options-container">
    <div class="chat-options-title">${title}</div>
    <div class="chat-options-grid">`;
  options.forEach(opt => {
    html += `<button class="chat-option-btn" onclick="askSuggestedQuestion('${opt.query}')">${opt.label}</button>`;
  });
  html += `</div></div>`;
  return html;
}

// Interactive Options Menu Generator for Vague/Unrecognized Queries
function generateOptionsMenu(userQuery) {
  const isVagueOrGreeting = !userQuery || ['hi', 'hello', 'hey', 'help', 'options', 'menu', 'dose', 'drug', 'drugs', 'query', 'info', 'what'].includes(userQuery);

  let headerText = isVagueOrGreeting 
    ? `### 🩺 How can I assist you with Critical Care Pharmacy today?`
    : `### 🔍 Option Suggestions for "${userQuery}"\nI couldn't find an exact match for your prompt. Please select one of the clinical options below:`;

  const drugOptions = [
    { label: '🩸 Heparin Protocol & HIT', query: 'Tell me about Heparin dosing, HIT, and Protamine reversal' },
    { label: '💧 Vasopressin Protocol', query: 'What is the standard fixed dose for Vasopressin?' },
    { label: '💉 Dopamine Pressor', query: 'Tell me about Dopamine dosing and indications' },
    { label: '🫀 Dobutamine Inotrope', query: 'Tell me about Dobutamine inotrope dosing' },
    { label: '⚡ Norepinephrine (Levophed)', query: 'Norepinephrine vasopressor dosing and extravasation' },
    { label: '💉 Epinephrine Protocol', query: 'Epinephrine anaphylaxis and pressor dosing' },
    { label: '🫀 Cordarone (Amiodarone)', query: 'Amiodarone ACLS dosing and Y-site incompatibility' },
    { label: '💤 Precedex (Dexmedetomidine)', query: 'Precedex ICU sedation protocol' },
    { label: '⚡ Esmolol Beta-Blocker', query: 'Esmolol infusion dosing and half-life' },
    { label: '🫁 Streptokinase Thrombolytic', query: 'Streptokinase thrombolytic protocol' },
    { label: '🧪 Propofol & PRIS', query: 'Tell me about Propofol Infusion Syndrome (PRIS)' },
    { label: '💉 Fentanyl & Chest Rigidity', query: 'Tell me about Fentanyl and Rigid Chest Syndrome' },
    { label: '💤 Midazolam Monograph', query: 'Midazolam monograph and sedation loading' },
    { label: '🌀 Ketamine Analgesia', query: 'Ketamine induction and sub-dissociative infusion' },
    { label: '🫀 Milrinone Inodilator', query: 'Milrinone inodilator dosing and renal adjustment' },
    { label: '⚡ Nitroprusside Toxicity', query: 'Sodium Nitroprusside cyanide toxicity' },
    { label: '🧊 Rocuronium & RSI', query: 'Rocuronium RSI dosing and paralysis protocol' },
    { label: '🔄 Sugammadex Reversal', query: 'How do I dose Sugammadex for Rocuronium reversal?' },
    { label: '💧 Furosemide Diuretic', query: 'Furosemide loop diuretic dosing and ototoxicity' },
    { label: '🛡️ N-Acetylcysteine (NAC)', query: 'N-Acetylcysteine 3-bag protocol' },
    { label: '💊 MgSO4 Magnesium', query: 'Magnesium Sulfate Torsades and Eclampsia protocol' },
    { label: '⚡ K+ Potassium Protocol', query: 'Potassium replacement IV rate limits' },
    { label: '💧 Na+ Hypertonic 3%', query: 'Hypertonic 3% NaCl hyponatremia and ODS warning' },
    { label: '🧪 NaHCO3 Bicarbonate', query: 'Sodium Bicarbonate IV push indications' }
  ];

  const compatOptions = [
    { label: '❌ Furosemide + Amiodarone', query: 'Is Furosemide compatible with Amiodarone at Y-site?' },
    { label: '❌ Bicarbonate + Pressors', query: 'Is Sodium Bicarbonate compatible with Norepinephrine?' },
    { label: '❌ Bicarbonate + Calcium', query: 'Is Sodium Bicarbonate compatible with Calcium Gluconate?' },
    { label: '🧪 Full Y-Site Matrix', query: 'Y-site physical line compatibility summary' }
  ];

  const guidelineOptions = [
    { label: '🛡️ Surviving Sepsis Pressors', query: 'What are the Surviving Sepsis Campaign pressor guidelines?' },
    { label: '🧠 SCCM PADIS Sedation', query: 'What are the SCCM PADIS guidelines for ICU sedation?' },
    { label: '🫁 ARDS Neuromuscular Blockade', query: 'ARDS neuromuscular blockade guidelines' },
    { label: '🩸 ICU Glycemic Target', query: 'ICU glycemic control target guidelines' }
  ];

  let response = headerText + '\n\n';
  response += buildOptionsGrid('💊 Extended Drug Monographs', drugOptions);
  response += buildOptionsGrid('❌ Y-Site Line Compatibility', compatOptions);
  response += buildOptionsGrid('📋 Clinical Practice Guidelines', guidelineOptions);

  return response;
}

// ── NLP Query Matcher ──
function processPharmacyQuery(input) {
  const query = input.toLowerCase().trim();
  
  if (!query) {
    return generateOptionsMenu('');
  }

  // 1. Compatibility queries
  if (query.includes('compatible') || query.includes('y-site') || query.includes('mix') || query.includes('co-infus') || query.includes('incompatib')) {
    if (query.includes('furosemide') && (query.includes('amiodarone') || query.includes('cordarone'))) {
      return `### ❌ Y-Site Compatibility: Furosemide + Amiodarone
* **Result**: **INCOMPATIBLE**
* **Mechanism**: Furosemide requires an alkaline vehicle (pH 8.5–9.5). Amiodarone is acidic (pH 3.8–4.5). Mixing them causes immediate neutralization, converting furosemide into its non-ionized free acid form which forms visible crystalline micro-precipitates.
* **Clinical Action**: Administer through separate dedicated IV lines or flush thoroughly with PNSS between injections.`;
    }
    if (query.includes('bicarbonate') && (query.includes('norepinephrine') || query.includes('epinephrine') || query.includes('levophed'))) {
      return `### ❌ Y-Site Compatibility: Sodium Bicarbonate + Catecholamines
* **Result**: **INCOMPATIBLE**
* **Mechanism**: Alkaline Sodium Bicarbonate rapidly oxidizes and inactivates catecholamines (Norepinephrine, Epinephrine, Dopamine).
* **Clinical Action**: Use separate IV lines; never co-infuse bicarbonate in the same lumen as pressors.`;
    }
    if (query.includes('bicarbonate') && (query.includes('calcium'))) {
      return `### ❌ Y-Site Compatibility: Sodium Bicarbonate + Calcium Gluconate / Chloride
* **Result**: **INCOMPATIBLE**
* **Mechanism**: Forms insoluble **Calcium Carbonate** white precipitate.
* **Clinical Action**: Always flush lines between calcium and bicarbonate infusions.`;
    }
    return `### 🧪 Y-Site Physical Line Compatibility Summary
* **Furosemide (Alkaline)**: Incompatible with acidic infusions (*Amiodarone, Dobutamine, Midazolam, Milrinone, Esmolol*). Compatible with *Norepinephrine, Epinephrine, Vasopressin, Heparin*.
* **Sodium Bicarbonate**: Incompatible with *Norepinephrine, Epinephrine, Amiodarone, Milrinone, Calcium Gluconate*.
* **Vasopressin**: Compatible at Y-site with *Norepinephrine, Epinephrine, Furosemide, Milrinone, Amiodarone, Heparin, Propofol*.
* **Propofol (1% Lipid)**: Incompatible with *Furosemide*. Compatible with *Norepinephrine, Epinephrine, Vasopressin, Milrinone, Fentanyl*.`;
  }

  // 2. Specific Drug Monograph Search
  if (query.includes('heparin') || query.includes('aptt') || query.includes('anti-xa') || query.includes('hit') || query.includes('protamine')) {
    const mono = PHARMACY_KB.monographs.heparin;
    return `### 🩸 ${mono.name} Monograph & Protocol
* **Pharmacologic Class**: ${mono.class}
* **Mechanism of Action**: ${mono.mechanism}
* **ICU Dosing**: **${mono.dosing}**
* **Pharmacokinetics**: ${mono.pharmacokinetics}
* **Adverse Effects**: ${mono.adverseEffects}
* **Critical Warning & Reversal**: ${mono.warnings}`;
  }

  if (query.includes('dopamine') || query.includes('intropin')) {
    const mono = PHARMACY_KB.monographs.dopamine;
    return `### 💉 ${mono.name} Monograph & Protocol
* **Pharmacologic Class**: ${mono.class}
* **Mechanism of Action**: ${mono.mechanism}
* **Dosing Ranges**: **${mono.dosing}**
* **Pharmacokinetics**: ${mono.pharmacokinetics}
* **Adverse Effects**: ${mono.adverseEffects}
* **Clinical Warning**: ${mono.warnings}`;
  }

  if (query.includes('dobutamine') || query.includes('dobutrex')) {
    const mono = PHARMACY_KB.monographs.dobutamine;
    return `### 🫀 ${mono.name} Inotrope Monograph
* **Pharmacologic Class**: ${mono.class}
* **Mechanism of Action**: ${mono.mechanism}
* **Dosing**: **${mono.dosing}**
* **Pharmacokinetics**: ${mono.pharmacokinetics}
* **Adverse Effects**: ${mono.adverseEffects}
* **Clinical Warning**: ${mono.warnings}`;
  }

  if (query.includes('norepinephrine') || query.includes('levophed') || query.includes('noradrenalin')) {
    const mono = PHARMACY_KB.monographs.norepinephrine;
    return `### ⚡ ${mono.name} Vasopressor Monograph
* **Pharmacologic Class**: ${mono.class}
* **Mechanism of Action**: ${mono.mechanism}
* **ICU Dosing**: **${mono.dosing}**
* **Pharmacokinetics**: ${mono.pharmacokinetics}
* **Adverse Effects**: ${mono.adverseEffects}
* **Safety & Central Line Warning**: ${mono.warnings}`;
  }

  if (query.includes('epinephrine') || query.includes('adrenaline') || query.includes('anaphylaxis')) {
    const mono = PHARMACY_KB.monographs.epinephrine;
    return `### 💉 ${mono.name} Monograph & Protocol
* **Pharmacologic Class**: ${mono.class}
* **Mechanism of Action**: ${mono.mechanism}
* **Dosing Protocols**: **${mono.dosing}**
* **Pharmacokinetics**: ${mono.pharmacokinetics}
* **Adverse Effects**: ${mono.adverseEffects}
* **Clinical Considerations**: ${mono.warnings}`;
  }

  if (query.includes('vasopressin') || query.includes('argipressin') || query.includes('adh')) {
    const mono = PHARMACY_KB.monographs.vasopressin;
    return `### 💧 ${mono.name} Monograph & ICU Protocol
* **Pharmacologic Class**: ${mono.class}
* **Mechanism of Action**: ${mono.mechanism}
* **ICU Dosing (Fixed)**: **${mono.dosing}**
* **Standard Preparation**: 20 units / 100 mL (0.2 u/mL) → **0.03 units/min = 9.0 mL/hr**
* **Fluid-Restricted Prep**: 40 units / 100 mL (0.4 u/mL) → **0.03 units/min = 4.5 mL/hr**
* **Safety & Line Requirement**: ${mono.warnings}`;
  }

  if (query.includes('isoket') || query.includes('isosorbide dinitrate')) {
    const mono = PHARMACY_KB.monographs.isoket;
    return `### 🫀 ${mono.name} Monograph
* **Pharmacologic Class**: ${mono.class}
* **Mechanism**: ${mono.mechanism}
* **Dosing**: ${mono.dosing}
* **Pharmacokinetics**: ${mono.pharmacokinetics}
* **Adverse Effects**: ${mono.adverseEffects}
* **Warning**: ${mono.warnings}`;
  }

  if (query.includes('ntg') || query.includes('nitroglycerin') || query.includes('glyceryl trinitrate')) {
    const mono = PHARMACY_KB.monographs.ntg;
    return `### 🫀 ${mono.name} Vasodilator Monograph
* **Pharmacologic Class**: ${mono.class}
* **Mechanism**: ${mono.mechanism}
* **Dosing**: ${mono.dosing}
* **Pharmacokinetics**: ${mono.pharmacokinetics}
* **Adverse Effects**: ${mono.adverseEffects}
* **Tubing & Line Warning**: ${mono.warnings}`;
  }

  if (query.includes('nicardipine') || query.includes('cardene')) {
    const mono = PHARMACY_KB.monographs.nicardipine;
    return `### 🩸 ${mono.name} Vasodilator Monograph
* **Pharmacologic Class**: ${mono.class}
* **Mechanism**: ${mono.mechanism}
* **Dosing**: ${mono.dosing}
* **Pharmacokinetics**: ${mono.pharmacokinetics}
* **Adverse Effects**: ${mono.adverseEffects}
* **Site Warning**: ${mono.warnings}`;
  }

  if (query.includes('cordarone') || query.includes('amiodarone')) {
    const mono = PHARMACY_KB.monographs.cordarone;
    return `### 🫀 ${mono.name} Antiarrhythmic Monograph
* **Pharmacologic Class**: ${mono.class}
* **Mechanism**: ${mono.mechanism}
* **Dosing Protocols**: ${mono.dosing}
* **Pharmacokinetics**: ${mono.pharmacokinetics}
* **Adverse Effects**: ${mono.adverseEffects}
* **Filter & Y-Site Warning**: ${mono.warnings}`;
  }

  if (query.includes('esmolol') || query.includes('brevibloc')) {
    const mono = PHARMACY_KB.monographs.esmolol;
    return `### ⚡ ${mono.name} Beta-Blocker Monograph
* **Pharmacologic Class**: ${mono.class}
* **Mechanism**: ${mono.mechanism}
* **Dosing**: ${mono.dosing}
* **Pharmacokinetics**: ${mono.pharmacokinetics}
* **Adverse Effects**: ${mono.adverseEffects}
* **Warning**: ${mono.warnings}`;
  }

  if (query.includes('precedex') || query.includes('dexmedetomidine')) {
    const mono = PHARMACY_KB.monographs.precedex;
    return `### 💤 ${mono.name} Sedation Monograph
* **Pharmacologic Class**: ${mono.class}
* **Mechanism**: ${mono.mechanism}
* **ICU Sedation Dosing**: ${mono.dosing}
* **Pharmacokinetics**: ${mono.pharmacokinetics}
* **Adverse Effects**: ${mono.adverseEffects}
* **PADIS Advantage**: ${mono.warnings}`;
  }

  if (query.includes('streptokinase') || query.includes('thrombolytic') || query.includes('clot buster')) {
    const mono = PHARMACY_KB.monographs.streptokinase;
    return `### 🫁 ${mono.name} Thrombolytic Monograph
* **Pharmacologic Class**: ${mono.class}
* **Mechanism**: ${mono.mechanism}
* **Dosing Protocols**: ${mono.dosing}
* **Pharmacokinetics**: ${mono.pharmacokinetics}
* **Adverse Effects**: ${mono.adverseEffects}
* **Antibody & Allergic Warning**: ${mono.warnings}`;
  }

  if (query.includes('lidocaine') || query.includes('xylocaine') || query.includes('last')) {
    const mono = PHARMACY_KB.monographs.lidocaine;
    return `### ⚡ ${mono.name} Antiarrhythmic Monograph
* **Pharmacologic Class**: ${mono.class}
* **Mechanism**: ${mono.mechanism}
* **Dosing**: ${mono.dosing}
* **Pharmacokinetics**: ${mono.pharmacokinetics}
* **Adverse Effects**: ${mono.adverseEffects}
* **Toxicity (LAST) Warning**: ${mono.warnings}`;
  }

  if (query.includes('mgso4') || query.includes('magnesium') || query.includes('torsades') || query.includes('eclampsia')) {
    const mono = PHARMACY_KB.monographs.mgso4;
    return `### 💊 ${mono.name} Monograph & Protocol
* **Pharmacologic Class**: ${mono.class}
* **Mechanism**: ${mono.mechanism}
* **Dosing**: ${mono.dosing}
* **Pharmacokinetics**: ${mono.pharmacokinetics}
* **Adverse Effects**: ${mono.adverseEffects}
* **Toxicity Antidote Warning**: ${mono.warnings}`;
  }

  if (query.includes('potassium') || query.includes('k+') || query.includes('kcl') || query.includes('hypokalemia')) {
    const mono = PHARMACY_KB.monographs.potassium;
    return `### ⚡ ${mono.name} Replacement Protocol
* **Pharmacologic Class**: ${mono.class}
* **Mechanism**: ${mono.mechanism}
* **IV Infusion Rate Limits**: ${mono.dosing}
* **Pharmacokinetics**: ${mono.pharmacokinetics}
* **Adverse Effects**: ${mono.adverseEffects}
* **Fatal IV Push Warning**: ${mono.warnings}`;
  }

  if (query.includes('sodium') || query.includes('na+') || query.includes('hypertonic') || query.includes('3%') || query.includes('ods')) {
    const mono = PHARMACY_KB.monographs.sodium;
    return `### 💧 ${mono.name} Hypertonic Saline Monograph
* **Pharmacologic Class**: ${mono.class}
* **Mechanism**: ${mono.mechanism}
* **Dosing**: ${mono.dosing}
* **Pharmacokinetics**: ${mono.pharmacokinetics}
* **Adverse Effects**: ${mono.adverseEffects}
* **Central Pontine Myelinolysis (ODS) Warning**: ${mono.warnings}`;
  }

  if (query.includes('bicarbonate') || query.includes('nahco3') || query.includes('bicarb')) {
    const mono = PHARMACY_KB.monographs.nahco3;
    return `### 🧪 ${mono.name} Systemic Alkalinizer Monograph
* **Pharmacologic Class**: ${mono.class}
* **Mechanism**: ${mono.mechanism}
* **Dosing**: ${mono.dosing}
* **Pharmacokinetics**: ${mono.pharmacokinetics}
* **Adverse Effects**: ${mono.adverseEffects}
* **Y-Site Precipitation Warning**: ${mono.warnings}`;
  }

  if (query.includes('propofol') || query.includes('diprivan') || query.includes('pris')) {
    const mono = PHARMACY_KB.monographs.propofol;
    return `### 🧪 ${mono.name} Extended Monograph
* **Mechanism**: ${mono.mechanism}
* **ICU Sedation Dosing**: ${mono.dosing}
* **Pharmacokinetics**: ${mono.pharmacokinetics}
* **Adverse Effects**: ${mono.adverseEffects}
* **Critical Warning**: ${mono.warnings}`;
  }

  if (query.includes('fentanyl') || query.includes('rigid chest')) {
    const mono = PHARMACY_KB.monographs.fentanyl;
    return `### 💉 ${mono.name} Extended Monograph
* **Mechanism**: ${mono.mechanism}
* **ICU Dosing**: ${mono.dosing}
* **Pharmacokinetics**: ${mono.pharmacokinetics}
* **Adverse Effects & Rigidity Warning**: ${mono.warnings}`;
  }

  if (query.includes('midazolam') || query.includes('dormicum')) {
    const mono = PHARMACY_KB.monographs.midazolam;
    return `### 💤 ${mono.name} Monograph
* **Mechanism**: ${mono.mechanism}
* **ICU Dosing**: ${mono.dosing}
* **Pharmacokinetics**: ${mono.pharmacokinetics}
* **Guideline Warning**: ${mono.warnings}`;
  }

  if (query.includes('ketamine') || query.includes('ketalar')) {
    const mono = PHARMACY_KB.monographs.ketamine;
    return `### 🌀 ${mono.name} Monograph
* **Mechanism**: ${mono.mechanism}
* **Dosing (RSI & Analgesia)**: ${mono.dosing}
* **Pharmacokinetics**: ${mono.pharmacokinetics}
* **Clinical Considerations**: ${mono.warnings}`;
  }

  if (query.includes('milrinone') || query.includes('primacor')) {
    const mono = PHARMACY_KB.monographs.milrinone;
    return `### 🫀 ${mono.name} Inodilator Monograph
* **Mechanism**: ${mono.mechanism}
* **Dosing**: ${mono.dosing}
* **Pharmacokinetics**: ${mono.pharmacokinetics}
* **Adverse Effects & Line Compatibility**: ${mono.warnings}`;
  }

  if (query.includes('nitroprusside') || query.includes('cyanide') || query.includes('nipride')) {
    const mono = PHARMACY_KB.monographs.nitroprusside;
    return `### ⚡ ${mono.name} Monograph
* **Mechanism**: ${mono.mechanism}
* **Dosing**: ${mono.dosing}
* **Toxicity Warnings**: ${mono.warnings}`;
  }

  if (query.includes('phenylephrine') || query.includes('neo-synephrine')) {
    const mono = PHARMACY_KB.monographs.phenylephrine;
    return `### 💉 ${mono.name} Vasopressor Monograph
* **Mechanism**: ${mono.mechanism}
* **Dosing**: ${mono.dosing}
* **Hemodynamic Profile**: ${mono.warnings}`;
  }

  if (query.includes('labetalol') || query.includes('trandate')) {
    const mono = PHARMACY_KB.monographs.labetalol;
    return `### 🩸 ${mono.name} Antihypertensive Monograph
* **Mechanism**: ${mono.mechanism}
* **Dosing**: ${mono.dosing}
* **Clinical Indications**: ${mono.warnings}`;
  }

  if (query.includes('rocuronium') || query.includes('zemuron') || query.includes('paralysis') || query.includes('rsi')) {
    const mono = PHARMACY_KB.monographs.rocuronium;
    return `### 🧊 ${mono.name} Neuromuscular Blocker Monograph
* **Mechanism**: ${mono.mechanism}
* **Dosing**: ${mono.dosing}
* **Reversal**: ${mono.warnings}`;
  }

  if (query.includes('sugammadex') || query.includes('bridion')) {
    const mono = PHARMACY_KB.monographs.sugammadex;
    return `### 🔄 ${mono.name} Reversal Agent Monograph
* **Mechanism**: ${mono.mechanism}
* **Dosing by Blockade Depth**: ${mono.dosing}
* **Pharmacokinetics & Warnings**: ${mono.warnings}`;
  }

  if (query.includes('furosemide') || query.includes('lasix') || query.includes('ototoxicity')) {
    const mono = PHARMACY_KB.monographs.furosemide;
    return `### 💧 ${mono.name} Loop Diuretic Monograph
* **Mechanism**: ${mono.mechanism}
* **Dosing**: ${mono.dosing}
* **Incompatibilities & Ototoxicity Warning**: ${mono.warnings}`;
  }

  if (query.includes('nac') || query.includes('acetylcysteine') || query.includes('paracetamol') || query.includes('acetaminophen')) {
    const mono = PHARMACY_KB.monographs.nac;
    return `### 🛡️ ${mono.name} Antidote Monograph
* **Mechanism**: ${mono.mechanism}
* **IV 3-Bag Protocol**: ${mono.dosing}
* **Anaphylactoid Reaction Warning**: ${mono.warnings}`;
  }

  // 3. Guideline Queries
  if (query.includes('sepsis') || query.includes('shock') || query.includes('surviving')) {
    return PHARMACY_KB.guidelines.sepsis;
  }

  if (query.includes('padis') || query.includes('sedation') || query.includes('rass') || query.includes('delirium')) {
    return PHARMACY_KB.guidelines.padis;
  }

  if (query.includes('ards') || query.includes('ventilator') || query.includes('dyssynchrony')) {
    return PHARMACY_KB.guidelines.ards;
  }

  if (query.includes('glucose') || query.includes('glycemic') || query.includes('insulin') || query.includes('sugar')) {
    return PHARMACY_KB.guidelines.glycemic;
  }

  // Unrecognized or vague prompt fallback -> Options Menu!
  return generateOptionsMenu(input);
}

// ── Chatbot UI Controller ──
function initPharmacyChatbot() {
  const modal = document.getElementById('chatbotModal');
  const overlay = document.getElementById('chatbotOverlay');
  const chatInput = document.getElementById('chatbotInput');

  if (chatInput) {
    chatInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendChatMessage();
      }
    });
  }

  if (overlay) {
    overlay.addEventListener('click', closeChatbot);
  }
}

function openChatbot() {
  const modal = document.getElementById('chatbotModal');
  const overlay = document.getElementById('chatbotOverlay');
  if (modal) modal.classList.add('open');
  if (overlay) overlay.classList.add('open');
  
  // Focus input
  setTimeout(() => {
    const chatInput = document.getElementById('chatbotInput');
    if (chatInput) chatInput.focus();
  }, 150);
}

function closeChatbot() {
  const modal = document.getElementById('chatbotModal');
  const overlay = document.getElementById('chatbotOverlay');
  if (modal) modal.classList.remove('open');
  if (overlay) overlay.classList.remove('open');
}

function toggleChatbot() {
  const modal = document.getElementById('chatbotModal');
  if (modal && modal.classList.contains('open')) {
    closeChatbot();
  } else {
    openChatbot();
  }
}

function sendChatMessage() {
  const inputEl = document.getElementById('chatbotInput');
  if (!inputEl) return;
  const text = inputEl.value.trim();
  if (!text) return;

  // Append User Message
  appendChatMessage(text, 'user');
  inputEl.value = '';

  // Show Typing Indicator
  showTypingIndicator();

  // Process & Append Bot Response
  setTimeout(() => {
    removeTypingIndicator();
    const responseHtml = formatMarkdownResponse(processPharmacyQuery(text));
    appendChatMessage(responseHtml, 'bot');
  }, 400);
}

function askSuggestedQuestion(text) {
  const inputEl = document.getElementById('chatbotInput');
  if (inputEl) {
    inputEl.value = text;
    sendChatMessage();
  }
}

function appendChatMessage(content, sender) {
  const messagesEl = document.getElementById('chatbotMessages');
  if (!messagesEl) return;

  const msgDiv = document.createElement('div');
  msgDiv.className = `chat-bubble ${sender}-bubble`;

  if (sender === 'user') {
    msgDiv.textContent = content;
  } else {
    msgDiv.innerHTML = content;
  }

  messagesEl.appendChild(msgDiv);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function showTypingIndicator() {
  const messagesEl = document.getElementById('chatbotMessages');
  if (!messagesEl) return;

  const indicator = document.createElement('div');
  indicator.id = 'chatbotTypingIndicator';
  indicator.className = 'chat-bubble bot-bubble typing-dots';
  indicator.innerHTML = '<span>.</span><span>.</span><span>.</span>';
  messagesEl.appendChild(indicator);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function removeTypingIndicator() {
  const indicator = document.getElementById('chatbotTypingIndicator');
  if (indicator) indicator.remove();
}

function formatMarkdownResponse(markdown) {
  // Simple custom renderer for markdown headers, bolding, lists, and code/table formatting
  let html = markdown
    .replace(/^### (.*$)/gim, '<h4 class="chat-h4">$1</h4>')
    .replace(/^## (.*$)/gim, '<h3 class="chat-h3">$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^\* (.*$)/gim, '<li class="chat-li">$1</li>')
    .replace(/\n\n/g, '<br><br>');

  // Wrap lists
  html = html.replace(/(<li class="chat-li">.*<\/li>)/gms, '<ul class="chat-ul">$1</ul>');
  return html;
}

document.addEventListener('DOMContentLoaded', initPharmacyChatbot);
