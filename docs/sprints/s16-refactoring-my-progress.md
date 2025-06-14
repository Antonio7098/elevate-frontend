# Sprint ##: Frontend - "My Progress" Page Redesign & Implementation

**Signed off:** Antonio
**Date Range:** [Start Date] - [End Date]
**Primary Focus:** Backend & Frontend - "My Progress" Page with Pinned Items & Carousel
**Overview:** This sprint focuses on a complete redesign and implementation of the "My Progress" page based on the new wireframe (`image_d8ef2d.png`). This involves adding a "pinning" feature to Folders and Question Sets, which requires backend schema and API changes. The frontend will be rebuilt to display a main area for pinned items (as mastery graphs) and a horizontally scrolling carousel for all other items.

**Reference Design:**
C:\ANTONIO\Coding\elevate\elevate-frontend\docs\images\2025-06-13 092456-my-progress-wire.png

---

## I. Planned Tasks & To-Do List

- [x] **Task 2: Refactor Frontend Data Fetching & State (`MyProgressPage.tsx`)**
    - [x] *Sub-task 2.1:* Update the data fetching logic. On page load, it should fetch **all** folders and question sets for the user. The API response for these items must now include the new `isPinned` flag.
    - [x] *Sub-task 2.2:* In `MyProgressPage.tsx`, refactor the state management. Instead of just fetching stats for a selected item, you will need state to hold two separate arrays derived from the initial fetch: `pinnedItems` and `unpinnedItems`.
    - [x] *Sub-task 2.3:* Create service functions in `statsService.ts` or similar to call the new `PUT` endpoints for pinning/unpinning items.

- [x] **Task 3: Build New UI Components**
    - [x] *Sub-task 3.1:* Create or reuse a `MasteryLineChart.tsx` component that accepts `masteryHistory` data.
    - [x] *Sub-task 3.2:* Create or reuse a `CircularProgress.tsx` component that accepts a mastery percentage.
    - [x] *Sub-task 3.3:* Create or reuse a `SegmentedProgressBar.tsx` for visualizing U-U-E scores.
    - [x] *Sub-task 3.4:* Create a new `CarouselItemCard.tsx` component. This card will display an item in the bottom carousel, showing its `CircularProgress` and `SegmentedProgressBar`. It must also contain a "Pin" button.

- [x] **Task 4: Implement "My Progress" Page Layout**
    - [x] *Sub-task 4.1:* Rebuild the JSX of `MyProgressPage.tsx` to match the wireframe:
        * A "This week's progress" summary box at the top.
        * A grid for the "Pinned Items" section below that.
        * A horizontally scrolling container for the "All Folders & Sets" carousel at the bottom.
    - [x] **Sub-task 4.2 (Pinned Grid):**
        * Map over the `pinnedItems` state array.
        * For each pinned item, render a `MasteryLineChart` inside a styled widget box. Add an "Unpin" button to this box.
    - [x] **Sub-task 4.3 (Horizontal Carousel):**
        * Create a container `div`. In its CSS Module, style it with `display: flex; overflow-x: auto;` to enable horizontal scrolling.
        * Map over the `unpinnedItems` state array and render a `<CarouselItemCard />` for each item.

- [x] **Task 5: Implement "Pin/Unpin" Interaction**
    - [x] *Sub-task 5.1:* Wire up the "Pin" button on each `CarouselItemCard`. Its `onClick` handler should call the pinning service function. On success, optimistically update the state by moving the item from the `unpinnedItems` array to the `pinnedItems` array.
    - [x] *Sub-task 5.2:* Wire up the "Unpin" button on each pinned mastery graph. Its `onClick` should do the reverse.

---

## II. Agent's Implementation Summary & Notes

**Task 2 Completed:**
- Refactored `MyProgressPage.tsx` to fetch all folders and question sets, including the `isPinned` flag.
- State is now split into `pinnedItems` and `unpinnedItems` arrays, derived from the fetched data.
- Added service functions for pinning/unpinning folders and question sets, matching the backend API.
- Types for `Folder` and `QuestionSet` updated to include `isPinned`.

**Task 3 Completed:**
- Verified and reused existing `MasteryLineChart`, `CircularProgress`, and `SegmentedProgressBar` components.
- Created new `CarouselItemCard` component with:
  - Clean, modern design with hover and focus states
  - Integration of CircularProgress for mastery display
  - UUESegmentedProgressBar for detailed scores
  - Pin/Unpin button functionality

**Task 4 Completed:**
- Implemented complete layout for MyProgressPage:
  - Weekly progress summary box with stats display
  - Responsive pinned items grid with mastery charts
  - Smooth horizontal scrolling carousel
- Added comprehensive CSS styling:
  - Modern, clean design language
  - Responsive layouts for all screen sizes
  - Interactive hover and focus states
  - Smooth animations and transitions

**Task 5 Completed:**
- Implemented pin/unpin functionality with:
  - Optimistic UI updates for instant feedback
  - Error handling with UI state reversion
  - Loading states during API calls
  - Backend integration with proper error handling

**Additional Improvements:**
- Added loading and error states throughout the UI
- Implemented keyboard navigation for accessibility
- Added proper ARIA labels and roles
- Optimized performance with proper React hooks usage
- Added smooth animations for pin/unpin actions

---

## III. Overall Sprint Summary & Review (To be filled out by Antonio)

**(This section to be filled out upon sprint completion)**

## Instructions for endpoint usage
1. Pin/Unpin a Folder
Endpoint:
PUT /api/folders/:folderId/pin
Headers:
Authorization: Bearer <your JWT token>
Content-Type: application/json
Body:
{
  "isPinned": true   // or false to unpin
}
Example (using fetch):
async function pinFolder(folderId, isPinned, authToken) {
  const response = await fetch(`/api/folders/${folderId}/pin`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ isPinned })
  });
  if (!response.ok) throw new Error('Failed to pin/unpin folder');
  return response.json();
}
2. Pin/Unpin a Question Set
Endpoint:
PUT /api/folders/:folderId/questionsets/:setId/pin
Headers:
Authorization: Bearer <your JWT token>
Content-Type: application/json
Body:
{
  "isPinned": true   // or false to unpin
}
Example (using fetch):
async function pinQuestionSet(folderId, setId, isPinned, authToken) {
  const response = await fetch(`/api/folders/${folderId}/questionsets/${setId}/pin`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ isPinned })
  });
  if (!response.ok) throw new Error('Failed to pin/unpin question set');
  return response.json();
}
3. Response
On success, you'll get the updated folder or question set object, including the new isPinned value.
Example response:
{
  "id": 123,
  "name": "My Folder",
  "isPinned": true,
  // ...other fields
}
4. Frontend Usage Tips
Show a pin/unpin button in your UI for folders and question sets.
When clicked, call the appropriate function above.
Update your UI based on the returned isPinned value.