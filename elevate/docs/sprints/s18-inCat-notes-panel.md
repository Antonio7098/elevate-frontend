# Sprint ##: Frontend - Advanced Notes Workspace

**Date Range:** [Start Date] - [End Date]
**Primary Focus:** Frontend - `NotePage.tsx` Layout & Insight Catalyst Integration
**Overview:** This sprint focuses on building the advanced "Notes Workspace". The goal is to implement a three-column layout featuring a central BlockNote editor, a new "Insight Catalysts" side panel, and the existing "Chat" side panel. Both side panels must be toggleable, allowing the main note editor to expand for a focused experience. We will also add a toggle to render catalysts either inline or in the side panel.

---

## I. Planned Tasks & To-Do List

*Instructions for the agent: This sprint involves significant layout changes and state management. The backend is assumed to have an endpoint `GET /api/notes/:noteId/insight-catalysts` ready.*

- [ ] **Task 1: Project Setup & State Management**
    - [ ] **Sub-task 1.1:** Ensure BlockNote libraries (`@blocknote/core`, `@blocknote/react`) are installed.
    - [ ] **Sub-task 1.2:** In `NotePage.tsx`, implement state variables to manage the UI:
        * `const [isCatalystPanelOpen, setIsCatalystPanelOpen] = useState(true);`
        * `const [isChatPanelOpen, setIsChatPanelOpen] = useState(false);`
        * `const [showCatalystsInline, setShowCatalystsInline] = useState(false);`
    - [ ] **Sub-task 1.3:** Create or verify the existence of a service function `getCatalystsForNote(noteId)` in `src/services/insightCatalystService.ts`.

- [ ] **Task 2: Implement Dynamic Three-Column Layout**
    - [ ] **Sub-task 2.1:** In `NotePage.module.css`, create a CSS Grid layout for the main page container. The `grid-template-columns` property should be dynamic based on the open/closed state of the side panels.
        * *Example:* `grid-template-columns: 280px 1fr 320px;` when both are open.
        * *Example:* `grid-template-columns: 1fr 320px;` when only chat is open.
        * *Example:* `grid-template-columns: 1fr;` when both are closed.
    - [ ] **Sub-task 2.2:** In `NotePage.tsx`, apply conditional CSS classes to the grid container to change its layout based on `isCatalystPanelOpen` and `isChatPanelOpen`.

- [ ] **Task 3: Build the `InsightCatalystSidebar.tsx` Component**
    - [ ] **Sub-task 3.1:** Create a new component at `src/components/notes/InsightCatalystSidebar.tsx`.
    - [ ] **Sub-task 3.2:** The component will accept an array of `catalysts` as a prop. On load, it should fetch this data using the service function.
    - [ ] **Sub-task 3.3:** The UI should have a header ("Insight Catalysts") and a "Create New" button.
    - [ ] **Sub-task 3.4:** It will render a list of all Insight Catalysts associated with the current note. Each item should display the catalyst's type and text.

- [ ] **Task 4: Refactor the Note Editor & Viewer**
    - [ ] **Sub-task 4.1:** The main `NoteEditor.tsx` component will now receive a filtered list of blocks to render.
    - [ ] **Sub-task 4.2:** **Implement the Inline/Panel Toggle Logic:**
        * Create a toggle switch in the UI (e.g., in the header above the editor) that controls the `showCatalystsInline` state.
        * In `NotePage.tsx`, before passing the note's `content` (the `Block[]` array) to the `NoteEditor` or `NoteViewer`, apply a filter:
            * If `showCatalystsInline` is `true`, pass the full content array.
            * If `showCatalystsInline` is `false`, filter the array to **remove** all blocks of type "insightCatalyst". This will cause them to only appear in the sidebar.
    - [ ] **Sub-task 4.3:** Ensure the custom "Insight Catalyst" block is correctly defined for the BlockNote editor, so it can be rendered when `showCatalystsInline` is true.

- [ ] **Task 5: Final Integration & Polish**
    - [ ] **Sub-task 5.1:** Place the `<InsightCatalystSidebar />`, the `<NoteEditor />` (or `<NoteViewer />`), and the `<ChatSidebar />` into the three-column grid in `NotePage.tsx`.
    - [ ] **Sub-task 5.2:** Add UI controls (e.g., icon buttons in a header bar) to toggle `isCatalystPanelOpen` and `isChatPanelOpen`.
    - [ ] **Sub-task 5.3:** Test the entire flow: toggling sidebars, toggling inline catalysts, and ensuring the layout correctly adapts.
    - [ ] **Sub-task 5.4:** Ensure the design is responsive. On smaller screens, the sidebars should likely become drawers or be hidden by default.

---

## II. Agent's Implementation Summary & Notes

*Instructions for AI Agent (Cascade): For each planned task you complete from Section I, please provide a summary below, including notes on key files modified and any challenges or decisions made.*

**(Agent will fill this section out as work is completed)**

---

## III. Overall Sprint Summary & Review (To be filled out by Antonio)

**(This section to be filled out upon sprint completion)**