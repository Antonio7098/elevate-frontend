# Sprint ##: Frontend - Advanced Spaced Repetition Controls

**Date Range:** [Start Date] - [End Date]
**Primary Focus:** Frontend - UI for Manual/Auto/Untracked Scheduling
**Overview:** This sprint focuses on building the frontend UI to allow users to control the new, advanced spaced repetition settings for each Question Set. This includes toggling between "Auto", "Manual", and "Untracked" modes and managing multiple scheduled review dates.

---

## I. Planned Tasks & To-Do List

- [ ] **Task 1: Update Frontend Services & Types**
    - [ ] **Sub-task 1.1 (Types):** In `src/types/`, create a `scheduledReview.types.ts` file for the `ScheduledReview` interface (`id`, `reviewDate`, `type`, `status`). Update the `QuestionSet` type to include `trackingMode`, `srStage`, `easeFactor`, `lapses`, and `scheduledReviews: ScheduledReview[]`.
    - [ ] **Sub-task 1.2 (Services):**
        * Create `src/services/scheduledReviewService.ts` with `createManualReview(setId, reviewDate)` and `deleteManualReview(reviewId)`.
        * In `questionSetService.ts`, create a function `updateTrackingMode(setId, mode, optionalNextDate)` that calls `PUT /api/questionsets/:id/tracking`.

- [ ] **Task 2: Create `ScheduleControlModal.tsx` Component**
    - [ ] **Sub-task 2.1:** Create a new modal component for managing a Question Set's review schedule. It will receive the `questionSet` object as a prop.
    - [ ] **Sub-task 2.2 (Tracking Mode Toggle):**
        * The component will render a set of radio buttons or a segmented control for the three `trackingMode` options: "Auto", "Manual", "Untracked".
        * When the user changes this setting, call the `updateTrackingMode` service function.
    - [ ] **Sub-task 2.3 (Manual Scheduling UI):**
        * If the `trackingMode` is "Manual", display a list of all pending `ScheduledReview`s for that set. Allow deletion of "MANUAL" type reviews.
        * Show a date picker and an "Add Manual Review" button that calls `createManualReview`.
    - [ ] **Sub-task 2.4 (Display `AUTO` Reviews):** If the `trackingMode` is "AUTO", display the upcoming automatically scheduled review date(s) in a read-only format.

- [ ] **Task 3: Integrate Schedule Controls into the UI**
    - [ ] **Sub-task 3.1:** Add a "Schedule" or "Settings" icon button to your `QuestionSetListItem.tsx` component.
    - [ ] **Sub-task 3.2:** When this button is clicked, open the new `ScheduleControlModal.tsx`, passing the relevant `questionSet` to it.
    - [ ] **Sub-task 3.3:** Update any part of the UI that previously displayed `questionSet.nextReviewAt`. It should now find the *earliest pending* review from the `questionSet.scheduledReviews` array and display that date.
    - [ ] **Sub-task 3.4:** Ensure that when data is refreshed after a settings change, the UI correctly reflects the new state.

---

## II. Agent's Implementation Summary & Notes
**(Agent will fill this section out as work is completed)**

---

## III. Overall Sprint Summary & Review (To be filled out by Antonio)
**(This section to be filled out upon sprint completion)**

---
**Signed off:** DO NOT PROCEED WITH THE SPRINT UNLESS SIGNED OFF