# Sprint ##: Frontend - Auth Enhancements (Google & Verification UI)

**Signed off:** DO NOT PROCEED WITH THE SPRINT UNLESS SIGNED OFF
**Date Range:** [Start Date] - [End Date]
**Primary Focus:** Frontend - UI for Google Sign-In and Email Verification Flow
**Overview:** This sprint focuses on building the frontend components and logic required to support the new backend authentication features. The goal is to provide users with a "Sign in with Google" option and a clear email verification experience.

---

## I. Planned Tasks & To-Do List

- [ ] **Task 1: Google Sign-In Frontend Logic**
    - [ ] **Sub-task 1.1 (Dependencies):** Install a Google Sign-In library for React (e.g., `@react-oauth/google`).
    - [ ] **Sub-task 1.2 (Provider Setup):** Wrap your application in the `GoogleOAuthProvider`, providing the Client ID from your Google Cloud Console.
    - [ ] **Sub-task 1.3 (UI):** Add a "Sign in with Google" button component to the `LoginPage.tsx` and `RegisterPage.tsx`. Style it according to Google's branding guidelines.
    - [ ] **Sub-task 1.4 (Logic):** Implement the `onClick` handler for the button to trigger the Google login flow.
    - [ ] **Sub-task 1.5 (API Call):** On successful sign-in with Google, receive the `credential` (which is the `idToken`). Send this token to your backend's `POST /api/auth/google` endpoint.
    - [ ] **Sub-task 1.6 (State Update):** Handle the response from your backend (your app's own JWT), call the `AuthContext.login()` function, and navigate the user to the dashboard.

- [ ] **Task 2: Email Verification Frontend UI**
    - [ ] **Sub-task 2.1 (Post-Registration Message):** After a user successfully registers using the email/password form, display a clear message on the UI instructing them to check their email to verify their account before logging in.
    - [ ] **Sub-tack 2.2 (Verification Page):** Create a new page component, `VerifyEmailPage.tsx`, for the route `/verify-email`.
    - [ ] **Sub-task 2.3 (Token Handling):** This page will use `useSearchParams` (from `react-router-dom`) to get the `token` from the URL query parameters.
    - [ ] **Sub-task 2.4 (API Call):** On page load, it will make a `POST` request to the backend's `/api/auth/verify-email` endpoint with the token.
    - [ ] **Sub-task 2.5 (User Feedback):** Display a success message ("Your email has been verified! You can now log in.") or an error message ("Invalid or expired verification link.") on this page, with a button to navigate to the login page.

- [ ] **Task 3: Update Auth Flow (Conditional Access - Optional MVP+ feature)**
    - [ ] **Sub-task 3.1 (Optional):** If required, modify the `ProtectedRoute` or `AuthContext` to prevent users with `isVerified: false` from accessing certain key features until their email is verified.

---

## II. Agent's Implementation Summary & Notes

**(Agent will fill this section out as work is completed)**

---

## III. Overall Sprint Summary & Review (To be filled out by Antonio)

**(This section to be filled out upon sprint completion)**