# Frontend Integration Guide: Dashboard Service

This document explains how the frontend should interact with the Dashboard API to fetch user dashboard data.

---

## API Endpoint

- **URL:** `/api/dashboard`
- **Method:** `GET`
- **Authentication:** Bearer token (JWT) required in the `Authorization` header.

### Example Request

```http
GET /api/dashboard HTTP/1.1
Host: <your-backend-domain>
Authorization: Bearer <user-jwt-token>
Content-Type: application/json
```

## Authentication

- The endpoint is protected. You **must** include a valid JWT as a Bearer token in the `Authorization` header.
- If the token is missing or invalid, the API will return a `401 Unauthorized` error.

## Response Structure

A successful response (`200 OK`) returns a JSON object with the following structure:

```json
{
  "dueToday": [
    {
      "id": 1,
      "name": "Due Today Set",
      "folderId": 10,
      "nextReviewAt": "2025-06-06T00:00:00.000Z",
      "questionCount": 5
    },
    // ...more sets due today
  ],
  "recentProgress": [
    {
      "id": 2,
      "name": "Recently Reviewed Set",
      "folderId": 10,
      "currentTotalMasteryScore": 75,
      "understandScore": 80,
      "useScore": 70,
      "exploreScore": 75,
      "lastReviewedAt": "2025-06-05T00:00:00.000Z",
      "questionCount": 3
    },
    // ...up to 5 most recent sets
  ],
  "overallStats": {
    "totalSets": 8,
    "averageMastery": 67.5,
    "setsDueCount": 2
  }
}
```

### Field Descriptions
- **dueToday**: Array of question sets that are due for review today.
- **recentProgress**: Up to 5 most recently reviewed question sets, with mastery scores and review dates.
- **overallStats**:
  - `totalSets`: Total number of question sets owned by the user.
  - `averageMastery`: Average mastery score across all sets (float, 2 decimals).
  - `setsDueCount`: Number of sets due for review today.

## Error Responses

- `401 Unauthorized`: Missing or invalid token.
- `500 Internal Server Error`: Unexpected server error.

## Example (using fetch in JS)

```js
const token = 'USER_JWT_TOKEN';
fetch('/api/dashboard', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
  .then(res => res.json())
  .then(data => {
    // Access data.dueToday, data.recentProgress, data.overallStats
    console.log(data);
  })
  .catch(err => {
    // Handle errors
    console.error(err);
  });
```

---

## Notes
- The frontend should handle empty arrays and zero stats gracefully (e.g., if the user has no sets).
- All dates are in ISO 8601 format (UTC).
- For testing, you may use the test token (`test123`) for the user with ID 1, as configured in the backend test suite.

---

For further details, see the backend service and test files:
- `src/services/dashboard.service.ts`
- `src/routes/dashboard.routes.ts`
- `test/dashboard.test.ts`
