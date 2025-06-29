# Logout Dialog Fix Plan for AsetuksetScreen

## Issue Description
When the "Kirjaudu ulos" button is pressed in the "Asetukset" tab, a confirmation dialog appears with options "Peruuta" (Cancel) and "Kirjaudu ulos" (Log out). However, if the user presses "Peruuta", the logout still proceeds due to a timeout fallback mechanism triggering the logout prematurely.

## Current Flow
- User presses "Kirjaudu ulos" button.
- `handleLogout` function shows an Alert dialog with "Peruuta" and "Kirjaudu ulos" buttons.
- A 100ms timeout fallback is set to call `performLogout` if the Alert does not show.
- If "Peruuta" is pressed, a flag `alertShown` is set to true and the timeout is cleared.
- If "Kirjaudu ulos" is pressed, `performLogout` is called.
- The timeout fallback triggers `performLogout` if the user does not respond within 100ms.

## Root Cause
The 100ms timeout is too short, causing `performLogout` to be called before the user can respond to the dialog, resulting in logout even if "Peruuta" is pressed.

## Proposed Fix
- Remove the timeout fallback entirely.
- Rely solely on the Alert dialog for user confirmation.
- Ensure `performLogout` is only called when the user explicitly presses "Kirjaudu ulos".

## Benefits
- Prevents premature logout.
- Simplifies the logout confirmation logic.
- Provides a better user experience by respecting user choice.

## Implementation Steps
1. Remove the timeout and related `alertShown` flag from `handleLogout`.
2. Keep the Alert dialog with "Peruuta" and "Kirjaudu ulos" buttons.
3. Call `performLogout` only on "Kirjaudu ulos" button press.

## Diagram

```mermaid
flowchart TD
  A[User presses "Kirjaudu ulos"] --> B[handleLogout called]
  B --> C[Show Alert dialog with "Peruuta" and "Kirjaudu ulos"]
  C --> D{User presses button?}
  D -->|Peruuta| E[Cancel logout, do nothing]
  D -->|Kirjaudu ulos| F[Call performLogout]
```

---

This plan awaits your approval before implementation.