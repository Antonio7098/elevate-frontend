# Elevate Frontend

This project is the frontend for Elevate, an intelligent learning platform designed to help users master new subjects through personalized review sessions and AI-powered feedback.

## Overview

The Elevate frontend, built with React and Vite, provides a user-friendly interface for interacting with study materials, managing question sets, and engaging in review sessions. It communicates with the `elevate1-core-api` backend to fetch data, submit answers, and receive evaluations.

## Key Features

### 1. Review Sessions & Scoring

Elevate's core learning loop revolves around review sessions. Users are presented with questions from their chosen question sets based on a spaced repetition algorithm.

-   **Answering Questions:** During a review session, users submit their answers. For each question, the frontend captures the `userAnswer`.
-   **Immediate Feedback (Single Question Evaluation):** After submitting an answer for a single question, the frontend calls the backend's `POST /api/ai/evaluate-answer` endpoint. The backend evaluates the answer (potentially using an AI service) and returns feedback, a raw score, and the `marksAvailable` for that question. The frontend then displays this feedback and the score achieved (e.g., "You scored 3 out of 5 marks").
-   **Session Submission:** At the end of a review session, the frontend submits all the outcomes to the backend's `POST /api/reviews` endpoint. This payload includes an array of `outcomes`, where each outcome contains:
    -   `questionId`: The ID of the question.
    -   `userAnswer`: The answer provided by the user.
    -   `scoreAchieved`: The raw marks the user achieved for that question (e.g., if a question is worth 5 marks and the user got 3, `scoreAchieved` would be 3). This is determined based on the immediate feedback received during the session.
    -   `uueFocus`: The 'Understand', 'Use', or 'Explore' focus associated with the question.
-   **Scoring Logic:**
    -   The `marksAvailable` field on each `Question` (managed by the backend) indicates the total possible marks for that question.
    -   The backend uses the `scoreAchieved` (raw marks) sent by the frontend and the `marksAvailable` for each question to calculate percentage scores for UUE (Understand, Use, Explore) categories and overall session mastery.
    -   This system allows for more granular scoring beyond simple correct/incorrect, especially for questions that might have multiple parts or varying levels of correctness.

### 2. AI-Powered Evaluation

Elevate integrates with an AI service (via the backend) to provide intelligent feedback and scoring for user answers, particularly for open-ended or complex questions.

-   **Backend Integration:** The `elevate1-core-api` handles the direct communication with the AI service. When the frontend calls `POST /api/ai/evaluate-answer`, the backend may forward the evaluation request to the AI.
-   **`marksAvailable` in AI Context:** The `marksAvailable` for a question is passed to the AI service by the backend. This allows the AI to tailor its scoring and feedback relative to the question's total worth.
-   **Frontend Display:** The frontend receives the AI's evaluation (feedback, score, suggested answer) via the backend's response and displays it to the user.

## Environment Variables

Configuration for the frontend is managed via `.env` files (e.g., `.env.development`, `.env.production`).

-   **`VITE_API_BASE_URL`**: The base URL for the `elevate1-core-api` (e.g., `http://localhost:3000/api`).
-   **`VITE_FORCE_AI_EVALUATION`**: (Optional, for development/testing)
    -   Set to `true` to force the frontend's `evaluationService` to attempt AI evaluation calls even if initial health checks for the AI service (or the main API) might suggest it's unavailable. This is useful for testing the AI evaluation flow directly without being blocked by intermediate service status checks.
    -   When `false` or not set, the frontend will typically rely on health checks to determine if the AI evaluation path should be attempted.

## Getting Started

1.  **Prerequisites:** Node.js (version specified in `.nvmrc` or latest LTS) and npm/yarn.
2.  **Installation:**
    ```bash
    npm install
    # or
    # yarn install
    ```
3.  **Environment Configuration:**
    -   Create a `.env.development` file in the root of `elevate-frontend/elevate/`.
    -   Add the necessary environment variables, for example:
        ```env
        VITE_API_BASE_URL=http://localhost:3000/api
        # VITE_FORCE_AI_EVALUATION=true
        ```
4.  **Running the Development Server:**
    ```bash
    npm run dev
    # or
    # yarn dev
    ```
    The application will typically be available at `http://localhost:5173`.

## Building for Production

```bash
npm run build
# or
# yarn build
```
This will create a `dist` folder with the production-ready static assets.
