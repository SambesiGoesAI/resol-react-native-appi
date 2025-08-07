# AI Implementation Specification: Keyboard-Aware Back Arrow

## Task Overview
**Objective:** Add a back arrow to the AlpoScreen header that appears only when the keyboard is visible and dismisses the keyboard when pressed.

**Target File:** `src/screens/AlpoScreen.tsx`  
**Estimated Time:** 25 minutes  
**Priority:** Medium  
**Dependencies:** None

---

## Requirements

### Functional Requirements
1. **Arrow Visibility:** Back arrow appears ONLY when keyboard is shown
2. **Arrow Hiding:** Back arrow disappears when keyboard is hidden
3. **Arrow Action:** Pressing the arrow dismisses the keyboard
4. **Automatic Behavior:** Keyboard dismissal automatically hides the arrow
5. **No Navigation:** Arrow does NOT navigate to other screens

### Visual Requirements
1. **Icon:** Use `arrow-back` from Ionicons
2. **Size:** 24px
3. **Color:** White (#FFFFFF) to match existing header style
4. **Position:** Header left position
5. **Padding:** Adequate touch target (minimum 44px)

### Technical Requirements
1. **React Native:** Use Keyboard API for show/hide detection
2. **Navigation:** Use useNavigation hook for header updates
3. **State Management:** Local component state only
4. **Performance:** Proper cleanup of keyboard listeners
5. **TypeScript:** Maintain existing type safety

---

## Implementation Details

### Step 1: Add Required Imports
Add these imports to the existing imports in `AlpoScreen.tsx`:
```typescript
import { useState, useEffect, useLayoutEffect } from 'react';
import { Keyboard, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
```

### Step 2: Add State Management
Inside the AlpoScreen component, add:
```typescript
const navigation = useNavigation();
const [keyboardVisible, setKeyboardVisible] = useState(false);
```

### Step 3: Implement Keyboard Listeners
Add this useEffect hook:
```typescript
useEffect(() => {
  const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
    setKeyboardVisible(true);
  });
  
  const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
    setKeyboardVisible(false);
  });

  return () => {
    keyboardDidShowListener?.remove();
    keyboardDidHideListener?.remove();
  };
}, []);
```

### Step 4: Create Back Press Handler
Add this function inside the component:
```typescript
const handleBackPress = () => {
  Keyboard.dismiss();
};
```

### Step 5: Implement Header Updates
Add this useLayoutEffect hook:
```typescript
useLayoutEffect(() => {
  navigation.setOptions({
    headerLeft: keyboardVisible ? () => (
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={handleBackPress}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    ) : undefined,
  });
}, [navigation, keyboardVisible]);
```

### Step 6: Add Styles
Add this to the existing StyleSheet.create():
```typescript
backButton: {
  paddingLeft: 16,
  paddingRight: 8,
  paddingVertical: 8,
},
```

---

## File Modifications

### Primary File: `src/screens/AlpoScreen.tsx`

#### Current Structure (to maintain):
- Existing imports
- AlpoScreenProps interface
- Component export
- Existing styles
- Current component logic

#### Additions Required:
- New imports (Step 1)
- State variables (Step 2)
- Keyboard listeners (Step 3)
- Back press handler (Step 4)
- Header update logic (Step 5)
- New style (Step 6)

#### What NOT to change:
- Existing component functionality
- Current render method
- User prop handling
- ChatContainer integration

---

## Testing Checklist

### Functional Testing:
- [ ] Arrow is hidden when screen loads
- [ ] Arrow appears when keyboard is shown
- [ ] Arrow disappears when keyboard is hidden
- [ ] Pressing arrow dismisses keyboard
- [ ] Arrow disappears after keyboard dismissal
- [ ] No navigation occurs when arrow is pressed
- [ ] Multiple keyboard show/hide cycles work correctly

### Visual Testing:
- [ ] Arrow icon renders correctly
- [ ] Arrow is properly positioned in header
- [ ] Arrow color matches header theme
- [ ] Touch target is adequate (not too small)
- [ ] No visual glitches during transitions

### Technical Testing:
- [ ] No memory leaks from keyboard listeners
- [ ] TypeScript compilation succeeds
- [ ] No console errors or warnings
- [ ] Performance is smooth during keyboard transitions

---

## Success Criteria

### Must Have:
1. ✅ Arrow appears only when keyboard is visible
2. ✅ Arrow dismisses keyboard when pressed
3. ✅ Arrow disappears when keyboard is hidden
4. ✅ No navigation side effects
5. ✅ Proper cleanup of listeners

### Should Have:
1. ✅ Smooth transitions
2. ✅ Consistent styling with app theme
3. ✅ Adequate touch targets
4. ✅ No performance issues

### Nice to Have:
1. ✅ Subtle animation transitions
2. ✅ Proper accessibility support

---

## Error Handling

### Potential Issues:
1. **Keyboard listeners not cleaning up:** Ensure proper cleanup in useEffect return
2. **Navigation hook issues:** Verify useNavigation is properly imported
3. **Style conflicts:** Check existing header styles don't conflict
4. **TypeScript errors:** Ensure all types are properly defined

### Debugging Tips:
1. Test keyboard show/hide with console.log first
2. Verify navigation.setOptions is working
3. Check that Ionicons is properly imported
4. Test on both iOS and Android if possible

---

## Integration Notes

### Existing Code Compatibility:
- This feature is completely additive
- No existing functionality is modified
- All current AlpoScreen behavior preserved
- ChatContainer integration remains unchanged

### Future Considerations:
- Could be extended to other screens with text input
- Pattern could be extracted to a custom hook
- Could add animation transitions for smoother UX

---

## Final Implementation Verification

After implementation, the behavior should be:
1. **Screen loads:** No back arrow visible
2. **User taps input field:** Keyboard appears, back arrow appears
3. **User taps back arrow:** Keyboard dismisses, back arrow disappears
4. **User taps input again:** Keyboard appears, back arrow appears again
5. **User taps outside input:** Keyboard dismisses, back arrow disappears

This creates a clean, intuitive UX where the back arrow serves as a dedicated keyboard dismissal control.