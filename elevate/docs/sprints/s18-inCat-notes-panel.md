# Sprint ##: Frontend - Notes Page Layout with Insight Catalyst Sidebar

**Date Range:** [Start Date] - [End Date]
**Primary Focus:** Frontend - `NotePage.tsx` UI & Logic
**Overview:** This sprint focuses on refactoring the `NotePage` to a three-column layout. The goal is to display a new "Insight Catalysts" panel to the left of the main note editor, and the existing "Chat" panel to the right. Both side panels must be toggleable, allowing the central note editor to expand and fill the available space for a focused writing experience.

---

## I. Planned Tasks & To-Do List

*Instructions for the agent: This sprint involves significant layout changes and state management. All styling should use CSS Modules and align with the established application theme.*

- [ ] **Task 1: Backend API Verification (Prerequisite)**
    - [ ] **Sub-task 1.1:** Confirm that the backend Core API has a working endpoint to fetch all `InsightCatalyst` records for a given note: `GET /api/notes/:noteId/insight-catalysts`.
    - [ ] **Sub-task 1.2:** Ensure the response from this endpoint provides all necessary data (`id`, `type`, `text`, `explanation`, `imageUrl`, etc.).

- [ ] **Task 2: Frontend Service & State Management**
    - [ ] **Sub-task 2.1:** In `src/services/insightCatalystService.ts` (create if needed), implement a function `getCatalystsForNote(noteId)` that calls the API endpoint from Task 1.
    - [ ] **Sub-task 2.2:** In `NotePage.tsx`, add new state variables to manage the visibility of the side panels:
        * `const [isCatalystPanelOpen, setIsCatalystPanelOpen] = useState(true);`
        * `const [isChatPanelOpen, setIsChatPanelOpen] = useState(false);` (Assuming chat is closed by default).
    - [ ] **Sub-task 2.3:** Add state to hold the fetched Insight Catalyst data: `const [catalysts, setCatalysts] = useState<InsightCatalyst[]>([]);`

- [ ] **Task 3: Create the `InsightCatalystSidebar.tsx` Component**
    - [ ] **Sub-task 3.1:** Create a new component file at `src/components/notes/InsightCatalystSidebar.tsx`.
    - [ ] **Sub-task 3.2:** This component should accept an array of `catalysts` as a prop.
    - [ ] **Sub-task 3.3:** The UI should have a clear header ("Insight Catalysts") and a "Create New" button that triggers the flow for adding a new catalyst.
    - [ ] **Sub-task 3.4:** Map over the `catalysts` prop and render a small card for each one, displaying its `type` (e.g., "Analogy") and a snippet of its `text`. Each card should be clickable to view/edit the full detail.

- [ ] **Task 4: Refactor `NotePage.tsx` Layout**
    - [ ] **Sub-task 4.1:** Rebuild the root JSX of `NotePage.tsx` to be a three-column layout using CSS Grid (`display: grid`). The grid template should be dynamic based on the open/closed state of the sidebars.
        * Example: When both are open: `grid-template-columns: 1fr 2fr 1fr;`
        * When only chat is open: `grid-template-columns: 3fr 1fr;`
        * When both are closed: `grid-template-columns: 1fr;`
    - [ ] **Sub-task 4.2:** Conditionally render `<InsightCatalystSidebar />` and the existing `<ChatSidebar />` based on `isCatalystPanelOpen` and `isChatPanelOpen`.
    - [ ] **Sub-task 4.3:** Add toggle buttons to the UI (e.g., in a header bar above the note editor) that control the `isCatalystPanelOpen` and `isChatPanelOpen` state variables.

- [ ] **Task 5: Integrate Data**
    - [ ] **Sub-task 5.1:** In `NotePage.tsx`, use a `useEffect` hook (or `useQuery`) to call `getCatalystsForNote()` when the page loads with a `noteId`.
    - [ ] **Sub-task 5.2:** Pass the fetched catalyst data as a prop to the `<InsightCatalystSidebar />` component.

---

## II. Agent's Implementation Summary & Notes

*Instructions for AI Agent (Cascade): For each planned task you complete from Section I, please provide a summary below, including notes on key files modified and any challenges or decisions made.*

**(Agent will fill this section out as work is completed)**

---

## III. Overall Sprint Summary & Review (To be filled out by Antonio)

**(This section to be filled out upon sprint completion)**