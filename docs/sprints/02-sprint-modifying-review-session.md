# Sprint ##: Frontend - Implement "Today's Tasks" & Mixed Review Session

**Date Range:** [Start Date] - [End Date]
**Primary Focus:** Frontend - `ReviewSessionPage.tsx`
**Overview:** This sprint focuses on refactoring the `ReviewSessionPage.tsx` to handle two distinct entry points:
1.  The **"Today's Tasks"** session, which is a curated list of individual questions from multiple Question Sets.
2.  An **"Ad-Hoc Quiz"** session, which is for a single, specific Question Set.

The component must correctly fetch/receive the appropriate questions and submit the session results to the refactored backend `POST /api/reviews` endpoint.

---

## I. Planned Tasks & To-Do List

- [x] **Task 1: Implement Dynamic Question Loading Logic**
    - [x] *Sub-task 1.1:* Modify `ReviewSessionPage.tsx` to first check `location.state` (from `react-router-dom`) for a passed `questions` array and a `sessionTitle`.
    - [x] *Sub-task 1.2:* **If `location.state.questions` exists:** Use this array directly for the review session and set the page title accordingly (e.g., "Today's Review"). This is the "Today's Tasks" flow.
    - [x] *Sub-task 1.3:* **If `location.state.questions` does NOT exist:** Fall back to the existing behavior. Use `useParams` to get the `setId` from the URL (e.g., `/quiz/set/:setId`) and fetch the intelligently ordered questions for that single set by calling the backend endpoint (e.g., `GET /api/reviews/question-set/:setId`). This is the "Ad-Hoc Quiz" flow.

- [x] **Task 2: Implement AI Answer Evaluation Flow (Verify/Refine)**
    - [x] *Sub-task 2.1:* When the user submits an answer, the `evaluateUserAnswer` service function is called, making a `POST` request to `/api/ai/evaluate-answer`.
    - [x] *Sub-task 2.2:* After receiving the evaluation from the AI (feedback, score, etc.), this information is displayed in the UI.
    - [x] *Sub-task 2.3:* The outcome of each answered question (`questionId`, `scoreAchieved`, `userAnswerText`, etc.) is stored in the `sessionOutcomes` state array.

    > Implementation notes: The review session page already integrates the AI evaluation service, displays feedback and score, and tracks outcomes. Error handling and loading states are present. Further UI polish can be added later if needed.

---

**Task 3 is starting now: Refactor "Complete Session" logic and API call to match the new backend contract.**

- [x] **Task 3: Refactor "Complete Session" Logic & API Call**
    - [x] *Sub-task 3.1:* The `handleCompleteSession` function now makes a `POST` request to the refactored `/api/reviews` endpoint.
    - [x] *Sub-task 3.2:* The payload no longer includes a top-level `questionSetId` and instead contains `sessionStartTime`, `sessionDurationSeconds`, and the `outcomes` array (with all answer results).
    - [x] *Sub-task 3.3:* On successful response, a session summary is displayed and a "Back to Dashboard" button is provided.
    - [x] *Sub-task 3.4:* Robust error handling is implemented for the submission process.

    > Implementation notes: The review session page now fully matches the backend contract for session completion, including error handling and user feedback. The UI for session summary and navigation is in place.

---

**Task 4 is starting next: Update Dashboard Integration for Today's Tasks.**

- [ ] **Task 4: Update Dashboard Integration**
    - [ ] *Sub-task 4.1:* The "Begin Today's Tasks" button on `DashboardPage.tsx` should now fetch data from `GET /api/todays-tasks`.
    *Sub-task 4.2:* Upon getting the `criticalQuestions` and `coreQuestions` from the API, it should combine them into a single `sessionQuestions` array and navigate to the review page (e.g., `/review/today`), passing this array and a title in the route state.

---

## II. Agent's Implementation Summary & Notes

### Progress Update (2025-06-07)

- [x] **Route and Navigation for Today's Tasks Review Session**
    - Added `/review/:folderId/:setId` route to `AppRoutes.tsx`.
    - Updated `TodaysTasksWidget` to navigate to this route with the correct IDs.
    - Clicking a set in Today's Tasks now routes to the review session page for that set.

- [x] **Task 1: Implement Dynamic Question Loading Logic**
    - `ReviewSessionPage.tsx` now checks `location.state.questions` and `sessionTitle` for "Today's Tasks" review sessions. If present, it uses these directly; if not, it falls back to fetching questions by `setId` for the ad-hoc quiz flow. This enables the page to support both curated multi-set and single-set review sessions seamlessly.

- [ ] **Task 2–4:** Pending, to be started after Task 1 logic is in place.

---

## III. Overall Sprint Summary & Review (To be filled out by Antonio)

**(You'll fill this out after the agent's work is done and you've reviewed it.)**