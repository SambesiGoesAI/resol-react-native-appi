# Redesign Plan for 'Uutiset' Tab (News Tab)

## Objective
Redesign the 'Uutiset' tab to display news items in sleek, modern cards with the following features:
- Thumbnail image on the right side of each card
- News title and news text displayed prominently
- News text initially truncated to 3 lines with ellipsis and "Lue lisää" (Read more) link if longer
- Clicking "Lue lisää" expands the card to show full news text
- When expanded, show "Näytä vähemmän" (Read less) link to collapse the text back

---

## Step 1: Card Layout Design
- Use a card container with a clean, modern style (e.g., subtle shadow, rounded corners, padding)
- Layout:
  - Left side: Vertical stack of news title (bold, larger font) and news text
  - Right side: Thumbnail image with fixed size, aligned vertically center
- Ensure responsive design for different screen sizes

---

## Step 2: News Text Truncation
- Limit the news text display to 3 lines initially
- Use CSS line-clamp or equivalent technique to truncate text with ellipsis
- If the news text length exceeds 3 lines, show "Lue lisää" link below the truncated text
- If text is 3 lines or less, do not show "Lue lisää"

---

## Step 3: Expand/Collapse Behavior
- When user taps "Lue lisää":
  - Expand the card to show the full news text without truncation
  - Replace "Lue lisää" with "Näytä vähemmän" (best Finnish translation for "Read less")
- When user taps "Näytä vähemmän":
  - Collapse the news text back to 3 lines truncated view
  - Replace "Näytä vähemmän" with "Lue lisää"

---

## Step 4: Accessibility and Internationalization (I18N)
- Use semantic HTML or accessible components for the card and links
- Ensure "Lue lisää" and "Näytä vähemmän" texts are translatable strings in the app's i18n system
- Use best Finnish translation practices:
  - "Lue lisää" for "Read more"
  - "Näytä vähemmän" for "Read less"
- Provide appropriate aria attributes for expanded/collapsed states

---

## Step 5: State Management
- Maintain expanded/collapsed state per news card (e.g., using React state keyed by news item ID)
- Ensure smooth UI transitions when expanding/collapsing text

---

## Step 6: Testing
- Test with news items of varying text lengths (less than 3 lines, exactly 3 lines, more than 3 lines)
- Test expand/collapse toggling behavior
- Test on different screen sizes and orientations
- Test accessibility features (screen readers, keyboard navigation)

---

## Step 7: Performance Considerations
- Optimize image loading for thumbnails (e.g., lazy loading, appropriate sizes)
- Avoid unnecessary re-renders when toggling expand/collapse state

---

## Step 8: Documentation and Code Comments
- Document the new card component and its props
- Comment on the truncation and toggle logic for maintainability

---

# Summary
This plan ensures a modern, user-friendly news tab with clear visual hierarchy, intuitive expand/collapse functionality, and proper localization for Finnish users.