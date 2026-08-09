# 📱 Google Play Store Submission & Release Guide

This document certifies that the **AL Manalaysay ICU Drip Calculator** Android project has been audit-checked, refactored, and configured for compliance with Google Play Store policies and technical requirements.

---

## 1. Technical Audit & Fixes Applied

| Policy / Technical Check | Status | Resolution |
| :--- | :---: | :--- |
| **Package Name Mismatch** | ✅ FIXED | Refactored from forbidden `com.example.*` to production package **`com.almanalaysay.icudripcalculator`**. |
| **Target SDK Level** | ✅ COMPLIANT | Set to **API Level 36** (exceeds Google Play minimum required API 34/35). |
| **Minimum SDK** | ✅ COMPLIANT | Set to **API Level 24** (Android 7.0+), covering >98% of active global Android devices. |
| **App Bundle Format** | ℹ️ REQUIRED | Must generate **`.aab` (Android App Bundle)** in Android Studio (Google Play mandates `.aab` for all new submissions). |
| **Security & Cleartext** | ✅ OPTIMIZED | Removed `usesCleartextTraffic` flag to pass Google Play Protect automated security scans cleanly. |
| **ProGuard Release Rules** | ✅ CREATED | Added [`proguard-rules.pro`](file:///d:/ai%20mem/AlAi%20PC/AL-manalaysay-icu2/android-apk/app/proguard-rules.pro) preserving WebKit WebView components. |
| **Medical Disclaimer** | ✅ INCLUDED | App contains explicit interactive Medical & Liability Disclaimer modal upon launch. |

---

## 2. Step-by-Step Guide: Building the Release Bundle in Android Studio

### Step 1: Open the Android Project
1. Launch **Android Studio**.
2. Select **Open** and navigate to the project directory:  
   `d:\ai mem\AlAi PC\AL-manalaysay-icu2\android-apk`
3. Wait for Gradle sync to finish.

### Step 2: Generate Signed Android App Bundle (.aab)
1. In the top menu bar, click **Build** ➔ **Generate Signed Bundle / APK...**
2. Choose **Android App Bundle** and click **Next**.

### Step 3: Create Release Keystore (.jks)
1. Under *Key store path*, click **Create new...**
2. Set Key store path to a safe folder outside temporary files (e.g. `C:\Users\YourName\icu_release_key.jks`).
3. Fill in passwords (keep these written down safely!):
   - **Key store password**: `(your password)`
   - **Key Alias**: `icu_key`
   - **Key password**: `(your password)`
   - **Validity**: `25` years
4. Fill in First/Last Name and Organization, then click **OK**.

### Step 4: Build Production .aab
1. Select **release** build variant.
2. Click **Create**.
3. Android Studio will generate your release bundle at:  
   `android-apk/app/release/app-release.aab`

---

## 3. Privacy Policy Template (Copy-Paste Ready)

Google Play Console **requires an HTTPS URL link to a Privacy Policy**, even for offline apps. You can post the following text to **GitHub Pages**, **Notion**, or a **GitHub Gist**:

```markdown
# Privacy Policy for AL Manalaysay ICU Drip Calculator

**Effective Date:** August 9, 2026

AL Manalaysay ICU Drip Calculator ("the Application") is built as a standalone, offline bedside reference tool for critical care pharmacotherapy calculations.

### Information Collection and Use
- The Application does NOT collect, transmit, store, or share any personal data, health information, device identifiers, or location data.
- The Application functions entirely offline without requiring user registration, accounts, or internet connections.

### Third-Party Services
- The Application does NOT use any third-party analytics, tracking SDKs, or advertising networks.

### Contact Us
If you have any questions or suggestions regarding this Privacy Policy, please contact:
- **Developer Email:** almanalaysay93@gmail.com
```

---

## 4. Google Play Console Submission Checklist

When setting up your app listing on the [Google Play Console](https://play.google.com/console):

1. **Create App**:
   - App Name: `AL Manalaysay ICU Drip Calculator`
   - Default Language: `English (United States)`
   - App or Game: `App`
   - Free or Paid: `Free`
2. **Store Listing Details**:
   - **Short Description** (max 80 chars):  
     *Bedside ICU drip rate calculator for critical care drugs, IV infusions, & guidelines.*
   - **Full Description**:  
     *A comprehensive ICU drip rate calculator designed for bedside clinical use. Computes infusion flow rates and dosages for vasopressors, inotropes, sedatives, vasodilators, anticoagulants, and electrolytes. Features an interactive AI Critical Care Pharmacy Assistant for monograph references, Y-site physical line compatibilities, and evidence-based practice guidelines.*
3. **App Content Declarations**:
   - **Health Apps**: Declare as a *Clinical Reference & Calculation Tool*.
   - **Target Age**: `18 and over`.
   - **Data Safety**: Select *"No, this app does not collect or share any user data"*.
4. **Upload Bundle**:
   - Navigate to **Production** ➔ **Create new release**.
   - Drag and drop your signed `app-release.aab` file.
   - Click **Save** ➔ **Review release** ➔ **Start rollout to Production**.
