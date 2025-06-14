# Sprint ##: Frontend - AI Credit & Payment Integration

**Signed off:** DO NOT PROCEED WITH THE SPRINT UNLESS SIGNED OFF
**Date Range:** [Start Date] - [End Date]
**Primary Focus:** Frontend - Subscription UI & Stripe Checkout Flow
**Overview:** This sprint focuses on building the frontend components and logic required to display AI credit usage and allow users to subscribe to a paid plan via Stripe.

---

## I. Planned Tasks & To-Do List

- [ ] **Task 1: Project Setup & Dependencies**
    - [ ] **Sub-task 1.1 (Dependencies):** Install the Stripe React libraries: `npm install @stripe/react-stripe-js @stripe/stripe-js`.
    - [ ] **Sub-task 1.2 (Environment Variable):** Add your Stripe **Publishable Key** to the frontend's environment file (e.g., `.env`): `VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...`.
    - [ ] **Sub-task 1.3 (Stripe Provider):** In `App.tsx`, wrap the application with the `<Elements>` provider from `@stripe/react-stripe-js`, initialized with your publishable key.

- [ ] **Task 2: UI for Credit Display & Management**
    - [ ] **Sub-task 2.1:** Update the `AuthContext` to store the user's `aiCredits` balance, which is now returned from the login endpoint.
    - [ ] **Sub-task 2.2:** Add a UI element in a persistent location (like the `Sidebar.tsx` or a user menu) to display the current "AI Credits: [X]".

- [ ] **Task 3: Implement Pricing/Upgrade UI & Checkout Flow**
    - [ ] **Sub-task 3.1:** Create a simple `PricingPage.tsx` or an "Upgrade" section in the UI that details the plan(s) and includes a "Subscribe" button.
    - [ ] **Sub-task 3.2:** Implement the `onClick` handler for the "Subscribe" button. This function will:
        1.  Call a new `paymentService.createCheckoutSession()` function that makes a `POST` request to your backend.
        2.  Receive the `sessionId` from the backend response.
        3.  Use the `useStripe` hook to call `stripe.redirectToCheckout({ sessionId })`, sending the user to Stripe's secure payment page.

- [ ] **Task 4: Handle Post-Payment Redirection & Errors**
    - [ ] **Sub-task 4.1:** Create simple pages/routes for `/payment/success` and `/payment/cancel` to handle the user's return from Stripe.
    - [ ] **Sub-task 4.2:** Implement robust error handling for API calls. When a `402 Payment Required` error is received from the backend (because the user is out of credits), display a user-friendly modal that explains the issue and links to the `PricingPage`.

---

## II. Agent's Implementation Summary & Notes

**(Agent will fill this section out as work is completed)**

---

## III. Overall Sprint Summary & Review (To be filled out by Antonio)

**(This section to be filled out upon sprint completion)**