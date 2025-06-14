# Elevate - Project To-Do List

---

## **Backend**

### Update Models

- [] **Question Model**
    - [X] Remove `isCorrect: boolean`
    - [X] Add `selfMark: boolean`
    - [X] Add `autoMark: boolean`
    - [X] Add `aiGenerated: boolean`
    - [X] Add `inCat: boolean | string`
- [X] **QuestionSet Model**
    - [X] Add `source: string`
    - [X] Add `notes: string[]`
    - [X] Add `instructions: string`
    - [X] Add `isTracked: boolean`
- [X] **Nested Folders**
    - [X] Implement parent/child relationships in the `Folder` model.
- [X] **Notes Model**
    - [X] Create a new Prisma model for storing user notes, linked to Folders or Question Sets.
- [X] **Notes Endpoints**
    - [X] Create full CRUD API endpoints for the new `Notes` model.
- [X] **Insight Catalyst in Note**
    - [X] Implement the `InsightCatalyst` model and link it to specific sections of a Note.
- [ ] **UserMemory Model**
    - [ ] Design and implement a model to track information about the user and their preferences to give the chatbot context.
- [ ] **Worksheet Model**
    - [ ] Design and implement a model for worksheets.

---

## **Frontend**

- [ ] **Add Question Set Page**
    - [ ] Implement the advanced "Create New Set" page with both AI generation and manual question entry paths.
- [ ] **Clean Up Folders and Question Set Page**
    - [ ] Refactor the UI for these pages to match the latest "clean and white" list-based wireframes.
- [ ] **Finalize "My Progress" Page**
    - [ ] Build out the multi-level stats page with charts and graphs as per the wireframe.
- [ ] **Chat Page**
    - [ ] Fully integrate the chat UI with the backend, including passing folder/set context.
- [ ] **Push Date Forward Utility**
    - [ ] Create a development/testing utility to simulate time passing for spaced repetition.
- [ ] **Settings Page**
    - [ ] Build out the user settings page.
- [ ] **Styling Consistency**
    - [ ] Ensure all components are consistent with the established design system.
- [ ] **Nested Folders UI**
    - [ ] Implement UI for creating, viewing, and navigating nested folders.
- [ ] **Notes Feature**
    - [ ] Integrate a rich text editor like ReactQuill.
    - [ ] Create a view to display notes alongside a chat box

---

## **Settings**

- [ ] **"Mark as you go" feature**
    - [ ] Implement frontend toggle in settings.
    - [ ] Implement backend logic to respect this setting during reviews.
    - [ ] Personalisation options

---

## **Other**

- [ ] **Signup Flow Enhancements**
    - [ ] Implement email verification for new accounts.
    - [ ] Add Google Sign-In as an authentication option.
        - [ ] Set up credentials on Google Cloud Platform.
        - [ ] Implement the backend logic (`POST /api/auth/google`).
        - [ ] Implement the frontend button and flow.
- [ ] **Payment Integration**
    - [ ] Integrate a payment provider (e.g., Stripe) to handle subscriptions or purchases.

---

## **AI API**

- [ ] **Set up Agent for Note Walkthroughs**
    - [ ] Design and implement the specific prompts and logic for the interactive note walkthrough feature.
- [ ] **Update Generate Questions Endpoint**
    - [ ] Enhance the `/generate-questions` endpoint to accept and use `instructions` from the `QuestionSet` model.
- [ ] **Generate Notes Endpoint**
    - [ ] Create a new endpoint that takes source text and generates structured notes.
- [ ] **Worksheet Generation**
    - [ ] Create an endpoint for generating worksheets based on a topic or folder.
- [ ] **Testing redit usage and costs**

---

## **Personalization**

- [X] **Research Long Term Memory for Agent**
- [X] **Research Learning Types**


---

## **Feedback Form**

- [ ] **Style and implement feedback form**

---


## **Landing Page**

- [ ] **Finish up Styling**
    - [ ] Complete the CSS to match the final design aesthetic.
- [ ] **Add Correct Information**
    - [ ] Replace all placeholder text with final, polished marketing copy.
- [ ] **"Why it works" Section**
    - [ ] Ensure this section is well-written and clearly explains the learning science behind Elevate.

---

## Branding
- [ ] **Name**
- [ ] **Logo**
---

## **Setup & Legal**

- [ ] **Set up Business**
    - [ ] Formalize the business structure (e.g., sole trader, limited company in the UK).
- [ ] **Data Protection**
    - [ ] Finalize Privacy Policy, Terms of Service, and ensure UK GDPR compliance, including ICO registration.

---

## **Hosting & Deployment**

- [ ] **Choose & Deploy Services**
    - [ ] Deploy the frontend (e.g., Netlify), Core API (e.g., Render), and Database (e.g., Supabase).
- [ ] **App Stores (Future)**
    - [ ] Plan for Apple App Store and Google Play Store submission processes.

---

## **Marketing**

- [ ] **Set up Social Media**
    - [ ] Create and brand social media accounts for pre-launch and launch activities.

---

## **Convert to React Native**

- [ ] **Plan and execute conversion of web app to React Native**

---

## **Extra / Future Vision**

- [ ] **Calendar View**
    - [ ] A view to see when sets are due and to manually schedule reviews.
- [ ] **"Learns how you learn" Algorithm**
    - [ ] Implement the advanced personalized forgetting curve adaptation in the SR algorithm.
- [ ] **Elevate Student/Professional/Teacher Version**
    - [ ] A potential future version with features like assignment tracking, meeting notes, etc...
- [ ] **Math and Code Sheets**
    - [ ] Implement specialized interfaces for math (LaTeX support) and coding.
- [ ] **Mind Maps**
- [ ] **Mind Palace Images**
- [ ] **Better Progress Page with Pinning**