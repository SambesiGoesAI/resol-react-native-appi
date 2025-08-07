# Instructions to Change Tab Order in Navigation

1. Open the file where the tab navigator is defined, likely `src/navigation/TabNavigator.tsx`.

2. Locate the array or object that defines the tabs and their order. It may look like a list of tab screens or routes.

3. Change the order of the tabs to the following sequence (left to right):
   - 'ohjeet'
   - 'Alpo'
   - 'Uutiset'
   - 'Huoltopyyntö'

4. Ensure that each tab's component, label, and icon remain correctly associated with the tab name.

5. Save the changes.

6. Test the app to verify that the tabs appear in the new order and navigation between them works correctly.

7. If any other parts of the codebase rely on the tab order (e.g., tab indices), update those references accordingly.

---

This plan assumes the tabs are defined in a straightforward order in the navigator configuration. If the order is controlled dynamically or through other means, adjust the instructions accordingly.