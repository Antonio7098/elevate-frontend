Sprint ##: Frontend - Statistics Page Implementation
Date Range: June 7, 2025 - [End Date]
Primary Focus: Frontend - StatsPage.tsx
Overview: This sprint focuses on building the user-facing "Stats Page." The goal is to create a dynamic interface where users can select a Folder or a specific Question Set and view detailed visualizations of their learning progress, including mastery over time, practice frequency, and spaced repetition data. The styling must be consistent with the established light-themed, CSS Modules aesthetic.

Reference Documentation: "Frontend Integration Guide: Dashboard Service" (which details the GET /api/stats/... endpoints).

I. Planned Tasks & To-Do List
[x] Task 1: Foundational Setup for StatsPage.tsx

[x] Sub-task 1.1: Create the new page component at src/pages/StatsPage.tsx.

[x] Sub-task 1.2: Add a protected route for /stats in AppRoutes.tsx that renders StatsPage.tsx within the AuthenticatedLayout.

[x] Sub-task 1.3: Create a new service file, src/services/statsService.ts, and define the necessary TypeScript types for the API responses (QuestionSetStats, FolderStats, etc.) based on the integration guide.

[x] Sub-task 1.4: Implement getQuestionSetStats(setId) and getFolderStats(folderId) functions in statsService.ts that call the respective backend endpoints (/api/stats/questionsets/:setId/details and /api/stats/folders/:folderId/details).

[ ] Task 2: Implement UI for Folder & Question Set Selection

[ ] Sub-task 2.1: In StatsPage.tsx, add state management (useState) to track the selectedFolderId and selectedSetId.

[ ] Sub-task 2.2: Add a "Select Folder" dropdown. On page load, populate this dropdown by fetching data from the existing GET /api/folders endpoint.

[ ] Sub-task 2.3: When a folder is selected, dynamically populate a second "Select Question Set" dropdown by fetching data from GET /api/folders/:folderId/questionsets.

[x] Sub-task 2.4: When a folder is selected, trigger the fetch for that folder's stats via statsService.getFolderStats(). When a question set is selected, trigger the fetch for that set's stats via statsService.getQuestionSetStats().
      - *Note: Basic text-based display of stats is implemented. Chart/widget components are next.*

[ ] Task 3: Build Reusable Chart & Stats Components

[x] Sub-task 3.1: Install a charting library (e.g., Recharts, Chart.js with react-chartjs-2).

[x] Sub-task 3.2: Create src/components/stats/MasteryOverTimeChart.tsx. This component should accept masteryHistory data as a prop and render a clean line chart (X-axis: timestamp, Y-axis: score). It should be reusable for both Folder and Question Set data.

[x] Sub-task 3.3: Create src/components/stats/UUEScoresWidget.tsx. This component accepts understandScore, useScore, and exploreScore as props and displays them, for example, using labeled progress bars.
[x] Sub-task 3.4: Create src/components/stats/SRStatusWidget.tsx. This component accepts currentSRStatus data (lastReviewedAt, nextReviewAt, currentIntervalDays, currentForgottenPercentage) and displays it in a clear, readable format.

### Task 3: Implement Chart and Widget Components (Est: 3 days)
- **Overall Status:** Complete

[x] Task 4: Implement Main StatsPage Display Logic - *Complete*

[ ] Sub-task 4.1: The StatsPage should have a main title and the selection dropdowns at the top.

[ ] Sub-task 4.2: Conditionally render the stats displays based on user selection:

If only a folder is selected, show the MasteryOverTimeChart for the folder's masteryHistory and a list/table of its questionSetSummaries.

If a specific question set is selected, show its MasteryOverTimeChart, the UUEScoresWidget, and the SRStatusWidget.

[x] Sub-task 4.3: Ensure proper loading and error states are handled for the API calls and that a clear "Please select a folder or set to view statistics" message is shown initially.

[x] Sub-task 4.4: Integrate the `MasteryOverTimeChart` for both folder and set statistics within their respective conditional rendering blocks.

[x] Sub-task 4.5: Integrate the `UUEScoresWidget` and `SRStatusWidget` for question set statistics within its conditional rendering block.

[x] Sub-task 4.6: Create and apply CSS Module classes (`statsDisplayArea`, `folderStatsContainer`, `setStatsContainer`) in `StatsPage.module.css` and `StatsPage.tsx` to structure the layout of the statistics display section.

[x] Task 5: Styling and Final Touches - *Complete*

[x] Sub-task 5.1: Style all new components (StatsPage, charts, widgets) using CSS Modules to match the clean, light-themed, boxed-widget aesthetic from the dashboard.

[x] Sub-task 5.2: Ensure the page and its charts are responsive and legible on both desktop and mobile views.

II. Agent's Implementation Summary & Notes
Instructions for AI Agent (Cascade): For each planned task you complete from Section I, please provide a summary below, including notes on key files modified and any challenges or decisions made.

**Task 1 Complete:**
- Created `StatsPage.tsx` scaffold and ensured route protection via `AppRoutes.tsx`.
- Created `statsService.ts` and defined all required types in `stats.types.ts` per the integration guide in `docs/stats-integration-guide.md`.
- Implemented `getQuestionSetStats(setId)` and `getFolderStats(folderId)` using the correct `/api/stats/questionsets/:setId/details` and `/api/stats/folders/:folderId/details` endpoints, matching backend response structure and sample usage.
- Implementation is fully aligned with backend API contract and ready for UI integration.

**Next:** Proceed to Task 2 (UI for Folder & Question Set Selection) and ensure all data fetching and state logic uses the correct types and endpoints as described in the integration guide.

III. Overall Sprint Summary & Review (To be filled out by Antonio)
(You'll fill this out after the agent's work is done and you've reviewed it.)