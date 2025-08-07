# Keyboard-Aware Scroll-to-Bottom Implementation for Chat Screen

This document provides step-by-step instructions for implementing keyboard-aware scroll-to-bottom behavior in the chat screen of the React Native app.

---

## Background

The chat screen currently uses a `KeyboardAvoidingView` to prevent the keyboard from overlapping the input field. However, the chat messages list does not automatically scroll to the bottom when the keyboard appears, causing the latest messages and input to be hidden behind the keyboard.

---

## Goal

Ensure that when the virtual keyboard is shown, the chat messages list scrolls to the bottom so that the latest messages and input field remain visible above the keyboard.

---

## Implementation Steps

### 1. Modify `AlpoScreen.tsx`

- Import and use the `useState` hook to track keyboard visibility (already done).
- Add keyboard event listeners (`keyboardDidShow` and `keyboardDidHide`) to update the `keyboardVisible` state (already done).
- Pass the `keyboardVisible` state as a new prop to the `ChatContainer` component.

Example snippet:

```tsx
<ChatContainer
  messages={chatState.messages}
  isLoading={chatState.isLoading}
  error={chatState.error}
  onRetry={handleRetry}
  keyboardVisible={keyboardVisible}  // New prop
/>
```

---

### 2. Modify `ChatContainer.tsx`

- Update the `ChatContainerProps` interface to accept an optional `keyboardVisible` boolean prop.

```tsx
interface ChatContainerProps {
  messages: ChatMessageType[];
  isLoading: boolean;
  error: string | null;
  onRetry?: () => void;
  keyboardVisible?: boolean;  // New optional prop
}
```

- Add a `useEffect` hook that listens for changes to the `keyboardVisible` prop.
- When `keyboardVisible` becomes `true`, call `scrollToEnd` on the `FlatList` reference to scroll the chat to the bottom.

Example snippet:

```tsx
useEffect(() => {
  if (keyboardVisible && uniqueMessages.length > 0) {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }
}, [keyboardVisible, uniqueMessages.length]);
```

---

### 3. Verify `KeyboardAvoidingView` Configuration

- Ensure the `KeyboardAvoidingView` in `AlpoScreen.tsx` has the correct `behavior` and `keyboardVerticalOffset` props set to avoid overlap with headers/navigation bars.

Example:

```tsx
<KeyboardAvoidingView
  style={styles.container}
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
>
  {/* ChatContainer and ChatInput */}
</KeyboardAvoidingView>
```

---

## Summary

By passing the keyboard visibility state down to the chat container and triggering a scroll to the bottom when the keyboard appears, the chat UI will keep the latest messages and input visible, improving user experience.

---

## Additional Notes

- Adjust the `keyboardVerticalOffset` value if you have custom headers or navigation bars with different heights.
- The `setTimeout` delay of 100ms helps ensure the keyboard animation completes before scrolling.
- Test on both iOS and Android devices/emulators for consistent behavior.

---

This completes the instructions for implementing keyboard-aware scroll-to-bottom behavior in the chat screen.