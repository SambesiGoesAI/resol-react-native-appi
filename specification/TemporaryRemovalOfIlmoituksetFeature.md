# Specification for Temporary Removal of "Ilmoitukset" Feature in src/screens/OhjeetScreen.tsx

## Objective
Temporarily remove the "Ilmoitukset" (Notifications) feature from the OhjeetScreen component without making code changes now. This feature will be restored later.

## Details

### 1. UI Elements to Remove Temporarily
- The "Ilmoitukset" label text displayed in the settings section.
- The Switch component that toggles notifications on and off.

### 2. State Management
- The React state variable `notifications` and its setter `setNotifications` control the switch's value and changes.
- These state variables will be unused during the temporary removal.

### 3. Location in Code
- The relevant UI elements are located inside the View with style `styles.section` and `styles.settingRow` around lines 72-81 in `src/screens/OhjeetScreen.tsx`.
- The state variables are declared at the top of the component (lines 12-13).

### 4. Impact
- The "Ilmoitukset" switch will not be visible or interactable by users.
- No notification settings will be adjustable during this period.

### 5. Restoration
- When the feature is to be restored, re-add the UI elements and state variables as they currently exist.
- Ensure the switch functionality and state management are fully re-enabled.


This approach ensures the feature is cleanly removed from the user interface temporarily while preserving the ability to restore it later without loss of functionality.