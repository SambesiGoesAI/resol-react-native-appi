# Pull-to-Refresh Plan for Uutiset Tab

This plan outlines the steps to implement a pull-to-refresh gesture in the 'Uutiset' tab of the app, allowing users to refresh news items by dragging down on the news content.

## Goals
- Enable users to refresh news items manually with a pull-to-refresh gesture.
- Use existing `useNews` hook's `refetch` method to reload news.
- Ensure smooth user experience with loading indicators during refresh.

## Steps

1. **Analyze Current UutisetScreen**
   - Identify where the news content is rendered (currently a `ScrollView`).
   - Understand how news data is fetched and displayed.

2. **Research Pull-to-Refresh Implementation**
   - Use React Native's built-in `RefreshControl` component.
   - Attach `RefreshControl` to the `ScrollView` to enable pull-to-refresh.

3. **Design Integration**
   - Add a `refreshing` state to track refresh status.
   - On pull-to-refresh gesture, call the `refetch` function from `useNews`.
   - Update `refreshing` state based on the refetch promise.

4. **Implement Pull-to-Refresh**
   - Modify `UutisetScreen` to include `RefreshControl` on the news `ScrollView`.
   - Connect the refresh control to trigger news reload.

5. **Testing**
   - Test on physical devices and emulators.
   - Verify that dragging down refreshes news and shows loading indicator.
   - Confirm that news updates correctly after refresh.

6. **Documentation**
   - Update code comments in `UutisetScreen`.
   - Add notes to project documentation about the new feature.

## Notes
- Background sync will continue to update news in the background.
- Pull-to-refresh provides manual control for immediate updates.
- Default sync interval remains unchanged.

---

This plan ensures a user-friendly way to refresh news content in the app's 'Uutiset' tab.