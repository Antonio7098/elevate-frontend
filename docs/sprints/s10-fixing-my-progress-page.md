Sprint ##: Frontend - "My Progress" Page Implementation & Styling
Date Range: [Start Date] - [End Date]
Primary Focus: Frontend - MyProgressPage.tsx & Data Visualization Components
Overview: This sprint focuses on building out the user-facing "My Progress" page. The goal is to implement the multi-level, data-rich interface where users can view their learning statistics at an overall, folder, and question set level, with a heavy emphasis on data visualization (charts, progress bars) as per the user-provided wireframes (image_15b295.png).

Reference Design:

Layout & Style: Based on the three-view wireframe (image_15b295.png). This will require a dynamic, multi-column layout and several new, reusable data visualization components.

Styling Method: Continue using CSS Modules and the established global theme variables (theme.css) for a clean, white, and sharp aesthetic.

I. Planned Tasks & To-Do List
[ ] Task 1: Refactor MyProgressPage.tsx Data Fetching & State

[ ] Sub-task 1.1: In MyProgressPage.tsx, review the data fetching logic. The page should fetch the overall stats (from GET /api/reviews/stats or similar) and the user's top-level folders (from GET /api/folders) on initial component mount to display the default "Overall Progress" view.

[ ] Sub-task 1.2: The existing logic for fetching folder-specific and set-specific stats should only be triggered after a user makes a selection.

[ ] Sub-task 1.3: Consolidate state management to clearly handle the data for all three potential views (Overall, Folder details, Set details).

[ ] Task 2: Implement the Overall Progress View (Default View)

[ ] Sub-task 2.1: In the JSX of MyProgressPage.tsx, create the layout for the Overall Progress View (leftmost wireframe). This view should be displayed by default, before any specific folder or set is selected.

[ ] Sub-task 2.2: This view should contain:

A MasteryLineChart component displaying the user's overall masteryHistory (from the overall stats API call).

A "Sets missed" / "Due Today" summary component.

A UUESegmentedProgressBar component displaying the user's average U-U-E scores.

A grid/list of CircularProgress components, one for each top-level Folder, showing its currentMasteryScore. Each of these must be a clickable <Link> that navigates to the folder-specific view (e.g., /my-progress/folders/:folderId).

[ ] Task 3: Build Reusable Data Visualization Components

[ ] Sub-task 3.1: Create (if not already existing) src/components/stats/MasteryLineChart.tsx. It should accept data and a title as props and render a clean line chart using a 'monotone' interpolation.

[ ] Sub-task 3.2: Create src/components/stats/CircularProgress.tsx. It should accept a percentage (0-100) and render a circular SVG progress indicator.

[ ] Sub-task 3.3: Create src/components/stats/SegmentedProgressBar.tsx. It should accept understandScore, useScore, and exploreScore as props and render a horizontal bar with three distinct colored segments representing the U-U-E mastery breakdown.

[ ] Task 4: Implement Folder & Question Set Drill-Down Views

[ ] Sub-task 4.1: In MyProgressPage.tsx, add logic to conditionally render the detailed stats view when a folderId or setId is selected (or when the route changes to /my-progress/folders/:folderId or /my-progress/sets/:setId).

[ ] Sub-task 4.2: When rendering the Folder-Specific View (middle wireframe), reuse the MasteryLineChart, SegmentedProgressBar (for the folder's aggregate U-U-E scores), and CircularProgress (for the sets within that folder).

[ ] Sub-task 4.3: When rendering the Question Set-Specific View (rightmost wireframe), reuse the MasteryLineChart and SegmentedProgressBar. Create a new QuestionStatItem.tsx to display the simple Question Name - Score (e.g., 2/3) format.

[ ] Sub-task 4.4: Implement clear Breadcrumb navigation or "Back" buttons to allow users to easily navigate back from a set view to its folder view, and from a folder view back to the overall progress view.

[ ] Task 5: Final Styling & Polish

[ ] Sub-task 5.1: Ensure all new components and the overall MyProgressPage layout are styled consistently with your "clean and white" wireframe aesthetic using CSS Modules.

[ ] Sub-task 5.2: Confirm the page and its charts are responsive and legible on both desktop and mobile views.

II. Agent's Implementation Summary & Notes
Instructions for AI Agent (Cascade): For each planned task you complete from Section I, please provide a summary below, including notes on key files modified and any challenges or decisions made.

(Agent will fill this section out as it completes the tasks...)

III. Overall Sprint Summary & Review (To be filled out by Antonio)
(You'll fill this out after the agent's work is done and you've reviewed it.)