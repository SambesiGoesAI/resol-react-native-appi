# Step-by-Step Plan to Implement News Rendering Functionality in 'Uutiset' Tab

## Objective
Implement the functionality to render news items in the 'Uutiset' tab using mockup data, following the redesign plan in `UutisetTabRedesignPlan.md`. The architecture should be designed to allow smooth future integration with Supabase for fetching news data (image, title, text).

---

## Step 1: Define News Data Model
- Create a TypeScript interface or type for news items with fields:
  - `id`: unique identifier
  - `title`: string
  - `text`: string
  - `thumbnailUrl`: string (URL for the thumbnail image)
- This model will be used both for mock data and future Supabase data.

---

## Step 2: Prepare Mock Data
- Create a mock data file or constant array of news items following the data model.
- Include diverse news items with varying text lengths (short, exactly 3 lines, longer than 3 lines).
- Use placeholder images or local assets for thumbnails. If image is not available use text 'Alpo tiedottaa'.

---

## Step 3: Create News Card Component
- Build a reusable `NewsCard` component that:
  - Accepts a news item as a prop
  - Implements the card layout as per redesign plan:
    - Title and text on left
    - Thumbnail image on right. If image is not available use text 'Alpo tiedottaa'.
  - Handles text truncation and expand/collapse behavior internally
  - Shows "Lue lisää" / "Näytä vähemmän" toggle links 
  - Manages its own expanded/collapsed state or receives it from parent

---

## Step 4: Implement Text Truncation and Toggle Logic
- Use CSS line-clamp or equivalent for truncation to 3 lines
- Detect if text exceeds 3 lines to conditionally show toggle link
- On toggle link press, expand or collapse text accordingly
- Ensure smooth UI transitions

---

## Step 5: Integrate NewsCard in UutisetScreen
- Import mock data and map over it to render a list of `NewsCard` components
- Manage expanded/collapsed states per card if not handled internally
- Ensure proper key usage for list rendering

---

## Step 6: Architecture for Future Supabase Integration
- Abstract data fetching logic into a separate service or hook (e.g., `useNews`)
- Initially, `useNews` returns mock data
- Design `useNews` to be easily replaceable with Supabase query logic later
- Keep UI components unaware of data source details

---



---

## Step 7: Testing
- Test rendering with mock data of varying lengths
- Test expand/collapse toggle behavior
- Test responsiveness and layout on different screen sizes
- Test accessibility features

---

## Step 8: Documentation
- Document the `NewsCard` component and its props
- Document the mock data structure and `useNews` hook/service
- Comment on the toggle logic and architecture decisions

---

# Summary
This plan ensures a modular, testable, and maintainable implementation of the news rendering functionality in the 'Uutiset' tab using mock data, with a clear path for future Supabase integration.