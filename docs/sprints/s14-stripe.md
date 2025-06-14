# Sprint ##: Frontend - Stripe Payment Integration

**Date Range:** [Start Date] - [End Date]
**Primary Focus:** Frontend - Subscription UI & Stripe Checkout Flow
**Overview:** This sprint focuses on building the frontend components and logic required to allow users to subscribe to a paid plan. This involves creating a pricing/upgrade UI, calling the backend to create a Stripe Checkout session, and redirecting the user to Stripe to complete the payment.

---

## I. Planned Tasks & To-Do List

*Instructions for the agent: This sprint requires integrating the Stripe.js React library. Ensure all new components are styled consistently with the application's theme using CSS Modules.*

- [ ] **Task 1: Project Setup & Dependencies**
    - [ ] **Sub-task 1.1 (Dependencies):** Install the necessary Stripe libraries for React: `npm install @stripe/react-stripe-js @stripe/stripe-js`.
    - [ ] **Sub-task 1.2 (Environment Variable):** Add your Stripe **Publishable Key** to the frontend's environment variables file (e.g., `.env.local` or `.env`): `VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...`.
    - [ ] **Sub-task 1.3 (Stripe Provider):** In `App.tsx`, import `Elements` from `@stripe/react-stripe-js` and `loadStripe` from `@stripe/stripe-js`. Wrap your entire application (or at least the authenticated layout) with the `<Elements>` provider, initialized with your publishable key.

- [ ] **Task 2: Create Frontend Service for Payments**
    - [ ] **Sub-task 2.1:** Create a new service file: `src/services/paymentService.ts`.
    - [ ] **Sub-task 2.2:** Implement an `async` function `createCheckoutSession()` that makes an authenticated `POST` request to your Core API's `/api/payments/create-checkout-session` endpoint.
    - [ ] **Sub-task 2.3:** This function should return the `sessionId` from the API response.

- [ ] **Task 3: Implement Subscription/Pricing UI**
    - [ ] **Sub-task 3.1:** Create a new page component, e.g., `src/pages/PricingPage.tsx`, or add an "Upgrade" section to the existing `SettingsPage.tsx` or `ProfilePage.tsx`.
    - [ ] **Sub-task 3.2:** Design a simple UI that displays the details of the "Elevate Pro Plan" (e.g., price, features).
    - [ ] **Sub-task 3.3:** Add a clear Call-to-Action button, e.g., "Upgrade to Pro" or "Subscribe Now."

- [ ] **Task 4: Implement Stripe Checkout Redirection**
    - [ ] **Sub-task 4.1:** In the `PricingPage.tsx` (or wherever your upgrade button is), create a handler function for the button's `onClick` event.
    - [ ] **Sub-task 4.2:** This handler function must be `async` and should:
        1.  Set a loading state.
        2.  Call the `paymentService.createCheckoutSession()` function to get the `sessionId` from your backend.
        3.  Use the `useStripe` hook from `@stripe/react-stripe-js` to get the Stripe instance.
        4.  Call `stripe.redirectToCheckout({ sessionId })`.
        5.  Handle any errors that occur during this process and display a message to the user.

- [ ] **Task 5: Create Post-Payment Pages**
    - [ ] **Sub-task 5.1:** Create a simple `PaymentSuccessPage.tsx` component. It should display a confirmation message like "Your subscription is active! Welcome to Elevate Pro." and a button to navigate back to the dashboard.
    - [ ] **Sub-task 5.2:** Create a `PaymentCancelPage.tsx` component that displays a message like "Your order was canceled. You can try again anytime." with a button to return to the pricing page or dashboard.
    - [ ] **Sub-task 5.3:** Add routes for `/payment/success` and `/payment/cancel` in `AppRoutes.tsx`. These are the URLs you will configure in your backend's Stripe Checkout session creation for the `success_url` and `cancel_url`.

---

## II. Agent's Implementation Summary & Notes

*Instructions for AI Agent (Cascade): For each planned task you complete from Section I, please provide a summary below. If multiple tasks are done in one go, you can summarize them together but reference the task numbers.*

**(Agent will fill this section out as work is completed)**

---

## III. Overall Sprint Summary & Review (To be filled out by Antonio)

**(This section to be filled out upon sprint completion)**