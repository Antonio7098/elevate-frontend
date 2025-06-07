Here’s a comprehensive review of the stats endpoints and how the frontend should use them, based on your backend code, routes, and the UserQuestionAnswer model.

1. Backend Endpoints Overview
Endpoints (from src/routes/stats.routes.ts):
a. Question Set Stats
GET /api/stats/questionsets/:setId/details
Purpose: Get mastery history and spaced repetition stats for a specific question set.
Path Parameter: setId (integer) – the ID of the question set.
Auth: Requires user to be authenticated and owner of the question set.
Response:
json
CopyInsert
{
  "masteryHistory": [
    {
      "timestamp": "2025-06-01T12:00:00Z",
      "totalMasteryScore": 0.85,
      "understandScore": 0.9,
      "useScore": 0.8,
      "exploreScore": 0.7,
      "intervalDays": 3
    }
    // ... more entries
  ],
  "reviewCount": 12,
  "reviewDates": ["2025-06-01T12:00:00Z", ...],
  "currentSRStatus": {
    "lastReviewedAt": "2025-06-01T12:00:00Z",
    "nextReviewAt": "2025-06-10T12:00:00Z",
    "currentIntervalDays": 3,
    "currentForgottenPercentage": 0.12,
    "forgettingCurveParams": { /* ... */ }
  },
  "understandScore": 0.9,
  "useScore": 0.8,
  "exploreScore": 0.7,
  "currentTotalMasteryScore": 0.85
}
b. Folder Stats
GET /api/stats/folders/:folderId/details
Purpose: Get aggregated stats for a folder (collection of question sets).
Path Parameter: folderId (integer) – the ID of the folder.
Auth: Requires user to be authenticated and owner of the folder.
Response:
json
CopyInsert
{
  "masteryHistory": [
    {
      "timestamp": "2025-06-01T12:00:00Z",
      "aggregatedScore": 0.75
    }
    // ... more entries
  ],
  "totalReviewSessionsInFolder": 42,
  "questionSetSummaries": [
    {
      "id": 1,
      "name": "Algebra Basics",
      "currentTotalMasteryScore": 0.8,
      "nextReviewAt": "2025-06-10T12:00:00Z"
    }
    // ... more sets
  ]
}
2. Relevant Model: UserQuestionAnswer
This model stores each answer a user gives, including:

questionId, userId, questionSetId, isCorrect, scoreAchieved, confidence, timeSpent, userAnswerText, uueFocusTested, timestamps, etc.
These fields power the stats endpoints by allowing aggregation of scores, mastery, and review history.
3. How the Frontend Should Use the Stats Endpoints
a. Fetching Question Set Stats
To display stats for a specific question set:

typescript
CopyInsert
const res = await apiClient.get(`/stats/questionsets/${setId}/details`);
const stats = res.data;
// Use stats.masteryHistory, stats.reviewCount, stats.currentSRStatus, etc.
Use masteryHistory to plot progress over time (line chart, etc.).
Use currentSRStatus for next review, interval, and forgetting curve info.
Show understandScore, useScore, exploreScore, and currentTotalMasteryScore as progress bars or summary numbers.
b. Fetching Folder Stats
To display stats for a folder (e.g., dashboard or folder detail):

typescript
CopyInsert
const res = await apiClient.get(`/stats/folders/${folderId}/details`);
const folderStats = res.data;
// Use folderStats.masteryHistory, folderStats.totalReviewSessionsInFolder, folderStats.questionSetSummaries, etc.
Use masteryHistory for aggregated folder-level mastery progress.
Use totalReviewSessionsInFolder as a summary metric.
Use questionSetSummaries to show a table/list of sets with their mastery and next review.
4. Frontend Integration Tips
Auth: All stats endpoints require a valid JWT (Bearer token) – ensure the user is logged in.
Error Handling: Handle 400 (bad ID), 401 (unauthenticated), 403 (not owner), and 404 (not found) gracefully in the UI.
Data Types: All IDs are integers in the URL. Dates are ISO strings.
Visualization: Use the masteryHistory arrays for time-series charts; use summary fields for badges, stats, and next review reminders.
5. Example: Fetch & Display Mastery Chart for a Question Set
typescript
CopyInsert
import apiClient from './services/apiClient';

async function fetchQuestionSetStats(setId: number) {
  const res = await apiClient.get(`/stats/questionsets/${setId}/details`);
  return res.data; // shape as above
}

// In your React component:
useEffect(() => {
  fetchQuestionSetStats(selectedSetId).then(setStats => {
    setMasteryHistory(setStats.masteryHistory);
    setCurrentScores({
      understand: setStats.understandScore,
      use: setStats.useScore,
      explore: setStats.exploreScore,
      total: setStats.currentTotalMasteryScore,
    });
    setNextReview(setStats.currentSRStatus.nextReviewAt);
  });
}, [selectedSetId]);
6. Summary Table
| Endpoint | Method | Purpose | Path Param | Returns | |---------------------------------------------|--------|--------------------------------|-----------|---------------------------------------| | /api/stats/questionsets/:setId/details | GET | Question set mastery & SR stats| setId | masteryHistory, reviewCount, scores | | /api/stats/folders/:folderId/details | GET | Folder-level stats | folderId | masteryHistory, session count, set summaries |

If you need code samples for charting, error handling, or further UI integration, let me know!

Feedback submitted
Generating
a day ago
4 hours ago
23 minutes ago
8 minutes ago
Start with History Ctrl + ⏎
Press Enter again to interrupt and send a new message
Start with History Ctrl + ⏎
Terminal (0 background processes running)



Write
Chat
ChatWriteLegacy

GPT-4.1 (promo)




