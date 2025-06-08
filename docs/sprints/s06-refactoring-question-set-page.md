Sprint 06: Frontend - Question Sets Page UI Refactor
Date Range: [Start Date] - [End Date]
Primary Focus: Frontend - QuestionSetsPage.tsx & QuestionSetsPage.module.css
Overview: This sprint focuses on a complete visual refactor of the "Question Sets" page. The goal is to move from a grid of cards to a clean, white, list-based view based on the user-provided wireframe (image_69b47a.png). All styling will use CSS Modules.

Reference Design:

Layout & Style: Based on wireframe image_6a95d5.png (for folders) and image_69b47a.png (for question sets). This means a light page background, a clear header, and a vertical list of simple items.

Key Info: Each item in the list must display the Question Set name, its next review date ("R"), and its mastery score ("M").

I. Planned Tasks & To-Do List
[ ] Task 1: Refactor QuestionSetsPage Header

[ ] Sub-task 1.1: In QuestionSetsPage.tsx, ensure the header section correctly displays the fetched folder name (e.g., "Maths") as the main title.

[ ] Sub-task 1.2: Arrange the action buttons ("Chat", "New Set", "Back") to the right of the title, as shown in the wireframe. Use CSS Modules with Flexbox (display: flex, justify-content: space-between, align-items: center).

[ ] Sub-task 1.3: Style the action buttons to be simple and clean, consistent with the new aesthetic.

[ ] Task 2: Create Reusable QuestionSetListItem.tsx Component

[ ] Sub-task 2.1: Create a new component at src/components/question-sets/QuestionSetListItem.tsx.

[ ] Sub-task 2.2: The component should accept a questionSet object as a prop, which includes name, nextReviewAt, and currentTotalMasteryScore.

[ ] Sub-task 2.3: In its CSS Module (QuestionSetListItem.module.css):

The main item class (.qsItem) should have a clean white background (var(--color-surface)), sharp corners or a minimal border-radius, and a clear border (1px solid var(--color-border)).

Use display: flex and justify-content: space-between to arrange the content.

Add a subtle box-shadow and hover effect.

[ ] Sub-task 2.4: Inside QuestionSetListItem.tsx, display the content in three main sections:

Left: The questionSet.name (bold, dark font).

Middle (SR Stats):

Display the next review date (e.g., "R: Jun 10") using a helper function to format questionSet.nextReviewAt.

Display the mastery score (e.g., "M: 75%") using questionSet.currentTotalMasteryScore.

Right: An ellipsis ("...") icon button for future actions (Rename, Delete).

[ ] Task 3: Implement List Layout on QuestionSetsPage

[ ] Sub-task 3.1: In QuestionSetsPage.tsx, replace the current grid mapping logic with a new div that will act as a vertical list container.

[ ] Sub-task 3.2: Map over the fetched questionSets state and render a <QuestionSetListItem questionSet={qs} /> component for each one.

[ ] Sub-task 3.3: In QuestionSetsPage.module.css, style the list container to ensure consistent vertical spacing between each QuestionSetListItem.

[ ] Sub-task 3.4: The entire list item (or a primary part of it) should be clickable and navigate the user to the review/quiz session for that set (e.g., /quiz/set/${questionSet.id}).

[ ] Task 4: Final Review & Cleanup

[ ] Sub-task 4.1: Review the completed QuestionSetsPage against the wireframe (image_69b47a.png) for structural and visual alignment.

[ ] Sub-task 4.2: Confirm the page is responsive. The header may stack on mobile, and the list items will take up the full width.

[ ] Sub-task 4.3: Remove any unused CSS from QuestionSetsPage.module.css related to the old grid/card design.

II. Agent's Implementation Summary & Notes
Instructions for AI Agent (Cascade): For each planned task you complete from Section I, please provide a summary below, including notes on key files modified and any challenges or decisions made.

(Agent will fill this section out as it completes the tasks...)

III. Overall Sprint Summary & Review (To be filled out by Antonio)
(You'll fill this out after the agent's work is don