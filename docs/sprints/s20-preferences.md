# Sprint ##: Frontend - AI & Learning Preferences Page

**Date Range:** [Start Date] - [End Date]
**Primary Focus:** Frontend - Settings & User Preferences UI
**Overview:** This sprint focuses on building the "AI & Learning Preferences" page within the Settings section of the application. The goal is to create an interactive UI where users can define their learning styles and preferences, based on the provided prototype. This involves creating reusable components and connecting them to a new backend endpoint to save the user's choices.

---

## I. Planned Tasks & To-Do List

*Instructions for the agent: This sprint requires creating several new UI components. All styling should use CSS Modules and align with the established clean, light theme.*

- [ ] **Task 1: Backend API Verification (Prerequisite)**
    - [ ] **Sub-task 1.1:** Confirm that the backend has endpoints ready for fetching and updating user preferences, which will be stored in the `UserMemory` model.
        * `GET /api/user/memory`
        * `PUT /api/user/memory`

- [ ] **Task 2: Frontend Service & Type Definitions**
    - [ ] **Sub-task 2.1:** Create or update a service file (e.g., `src/services/userService.ts`) with functions to `getUserPreferences()` and `updateUserPreferences(preferences)`.
    - [ ] **Sub-task 2.2:** In your types folder, define the `UserPreferences` type to match the data structure (e.g., `{ approach: string, explanation: string, interaction: string }`).

- [ ] **Task 3: Create Reusable `PreferenceCard.tsx` Component**
    - [ ] **Sub-task 3.1:** Create a new component file at `src/components/settings/PreferenceCard.tsx`.
    - [ ] **Sub-task 3.2:** The component will accept props like `title`, `description`, `icon`, `value`, `isSelected`, and `onClick`.
    - [ ] **Sub-task 3.3:** Style the card using its own CSS Module to match the prototype's clean design (white background, border, shadow, rounded corners).
    - [ ] **Sub-task 3.4:** The styling should change dynamically based on the `isSelected` prop (e.g., adding a purple border and a light purple background).

- [ ] **Task 4: Build the `PreferencesPage.tsx`**
    - [ ] **Sub-task 4.1:** Create the new page component at `src/pages/PreferencesPage.tsx` and add a corresponding route (e.g., `/settings/preferences`).
    - [ ] **Sub-task 4.2:** On page load, use a `useEffect` hook to fetch the user's current preferences using `getUserPreferences()` and set them in local state. Also manage loading and error states.
    - [ ] **Sub-task 4.3:** Structure the JSX to match the prototype: a main title/header, followed by sections for "Learning Approach," "Explanation Style," and "AI Interaction Style."
    - [ ] **Sub-task 4.4:** In each section, map over the preference options and render a `<PreferenceCard />` for each one.
    - [ ] **Sub-task 4.5:** Manage the state of the selected options. Clicking a card in a group should select it and deselect others in the same group.
    - [ ] **Sub-task 4.6:** Implement the "Save Preferences" button. Its `onClick` handler should call the `updateUserPreferences()` service function with the current state of selections.

---

## II. Agent's Implementation Summary & Notes

*Instructions for AI Agent (Cascade): For each planned task you complete from Section I, please provide a summary below, including notes on key files modified and any challenges or decisions made.*

**(Agent will fill this section out as work is completed)**

---

## III. Overall Sprint Summary & Review (To be filled out by Antonio)

**(This section to be filled out upon sprint completion)**

---
**Signed off:** DO NOT PROCEED WITH THE SPRINT UNLESS SIGNED OFF

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Elevate - AI & Learning Preferences</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #f8fafc; /* slate-50 */
        }
        /* Style for the selected card */
        .preference-card[data-selected="true"] {
            border-color: #8B5CF6; /* A vibrant purple */
            box-shadow: 0 0 0 2px #8B5CF6;
            background-color: #f5f3ff;
        }
        .preference-card {
            transition: all 0.2s ease-in-out;
        }
        .preference-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }
    </style>
</head>
<body class="text-slate-800">

    <!-- This is a simulation of the page within your AuthenticatedLayout -->
    <div class="flex h-screen">

        <!-- FAKE SIDEBAR for context -->
        <div class="flex flex-col w-64 bg-white border-r border-slate-200 p-4 shrink-0">
            <h1 class="text-2xl font-bold text-slate-800 px-4 mb-8">Elevate</h1>
             <nav class="flex flex-col space-y-1">
                 <a href="#" class="flex items-center gap-3 p-3 rounded-lg text-slate-600 hover:bg-slate-100"><span>Dashboard</span></a>
                 <a href="#" class="flex items-center gap-3 p-3 rounded-lg text-slate-600 hover:bg-slate-100"><span>Folders</span></a>
                 <a href="#" class="flex items-center gap-3 p-3 rounded-lg text-slate-600 hover:bg-slate-100"><span>AI Chat</span></a>
                 <a href="#" class="flex items-center gap-3 p-3 rounded-lg text-slate-600 hover:bg-slate-100"><span>My Progress</span></a>
             </nav>
             <div class="mt-auto">
                 <a href="#" class="flex items-center gap-3 p-3 rounded-lg bg-indigo-50 text-indigo-600 font-semibold"><span>Settings</span></a>
             </div>
        </div>
        <!-- END FAKE SIDEBAR -->

        <!-- MAIN CONTENT AREA -->
        <main class="flex-1 p-6 lg:p-10 overflow-y-auto">
            <div class="max-w-4xl mx-auto">
                
                <!-- Header -->
                <div class="mb-10">
                    <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">AI & Learning Preferences</h1>
                    <p class="mt-2 text-lg text-slate-600">Tune how Elevate's AI assists you. Your selections here will personalize question generation, explanations, and chat interactions to match your unique learning style.</p>
                </div>
                
                <form id="preferences-form" class="space-y-12">
                    
                    <!-- Preference Section 1: Learning Approach -->
                    <div>
                        <h2 class="text-xl font-bold text-slate-800">Learning Approach</h2>
                        <p class="mt-1 text-slate-500">How do you prefer to tackle new, complex topics?</p>
                        <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6" data-preference-group="approach">
                            <!-- Card 1 -->
                            <div class="preference-card bg-white p-6 rounded-xl border-2 border-slate-200 cursor-pointer" data-value="Global-Overview">
                                <div class="flex items-center gap-4">
                                    <div class="bg-slate-100 p-3 rounded-lg text-slate-600"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 1v4m0 0h-4m4 0l-5-5"></path></svg></div>
                                    <h3 class="text-lg font-semibold">Global Overview</h3>
                                </div>
                                <p class="mt-3 text-slate-600 text-sm">I like to see the big picture and get a summary first, before diving into the specific details.</p>
                            </div>
                            <!-- Card 2 -->
                            <div class="preference-card bg-white p-6 rounded-xl border-2 border-slate-200 cursor-pointer" data-value="Sequential-Steps">
                                 <div class="flex items-center gap-4">
                                    <div class="bg-slate-100 p-3 rounded-lg text-slate-600"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg></div>
                                    <h3 class="text-lg font-semibold">Sequential Steps</h3>
                                </div>
                                <p class="mt-3 text-slate-600 text-sm">I prefer information presented in a logical, step-by-step, linear manner, building from one point to the next.</p>
                            </div>
                        </div>
                    </div>

                    <!-- Preference Section 2: Explanation Style -->
                    <div>
                        <h2 class="text-xl font-bold text-slate-800">Explanation Style</h2>
                        <p class="mt-1 text-slate-500">What kind of explanations help you understand best?</p>
                        <div class="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-preference-group="explanation">
                            <!-- Card 1 -->
                            <div class="preference-card bg-white p-6 rounded-xl border-2 border-slate-200 cursor-pointer" data-value="Analogy-Driven">
                                <h3 class="text-lg font-semibold">By Analogy</h3>
                                <p class="mt-2 text-slate-600 text-sm">Explain new topics to me by comparing them to familiar, real-world concepts.</p>
                            </div>
                            <!-- Card 2 -->
                            <div class="preference-card bg-white p-6 rounded-xl border-2 border-slate-200 cursor-pointer" data-value="Practical-Examples">
                                <h3 class="text-lg font-semibold">By Example</h3>
                                <p class="mt-2 text-slate-600 text-sm">Show me how concepts work with concrete examples and case studies.</p>
                            </div>
                             <!-- Card 3 -->
                            <div class="preference-card bg-white p-6 rounded-xl border-2 border-slate-200 cursor-pointer" data-value="Textual-Detailed">
                                <h3 class="text-lg font-semibold">By Detail</h3>
                                <p class="mt-2 text-slate-600 text-sm">I prefer thorough, in-depth written explanations with all the background info.</p>
                            </div>
                        </div>
                    </div>

                     <!-- Preference Section 3: Interaction Style -->
                    <div>
                        <h2 class="text-xl font-bold text-slate-800">AI Interaction Style</h2>
                        <p class="mt-1 text-slate-500">How should your AI co-pilot interact with you during a chat or note walkthrough?</p>
                        <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6" data-preference-group="interaction">
                            <!-- Card 1 -->
                            <div class="preference-card bg-white p-6 rounded-xl border-2 border-slate-200 cursor-pointer" data-value="Direct-Exposition">
                                <h3 class="text-lg font-semibold">As a Teacher</h3>
                                <p class="mt-2 text-slate-600 text-sm">Tell me what I need to know directly and clearly. Provide expert explanations.</p>
                            </div>
                            <!-- Card 2 -->
                            <div class="preference-card bg-white p-6 rounded-xl border-2 border-slate-200 cursor-pointer" data-value="Socratic-Questioning">
                                <h3 class="text-lg font-semibold">As a Guide</h3>
                                <p class="mt-2 text-slate-600 text-sm">Guide me with questions and prompts so I can discover the concepts myself.</p>
                            </div>
                        </div>
                    </div>

                    <!-- Save Button -->
                    <div class="pt-6 border-t border-slate-200 text-right">
                        <button type="submit" class="bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors">
                            Save Preferences
                        </button>
                    </div>
                </form>

            </div>
        </main>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const form = document.getElementById('preferences-form');
            const preferenceGroups = form.querySelectorAll('[data-preference-group]');

            // Function to handle card selection within a group
            const handleSelection = (groupElement, selectedCard) => {
                const groupCards = groupElement.querySelectorAll('.preference-card');
                groupCards.forEach(card => {
                    card.setAttribute('data-selected', 'false');
                    card.classList.remove('border-indigo-600', 'bg-indigo-50');
                });
                selectedCard.setAttribute('data-selected', 'true');
                selectedCard.classList.add('border-indigo-600', 'bg-indigo-50');
            };

            // Set up click listeners for each group
            preferenceGroups.forEach(group => {
                const cards = group.querySelectorAll('.preference-card');
                cards.forEach(card => {
                    card.addEventListener('click', () => {
                        handleSelection(group, card);
                    });
                });
                // Set initial selection for demonstration
                if (cards.length > 0) {
                     handleSelection(group, cards[0]);
                }
            });

            // Handle form submission
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const preferences = {};
                preferenceGroups.forEach(group => {
                    const groupName = group.getAttribute('data-preference-group');
                    const selected = group.querySelector('.preference-card[data-selected="true"]');
                    if (groupName && selected) {
                        preferences[groupName] = selected.getAttribute('data-value');
                    }
                });
                console.log('Saving Preferences:', preferences);
                // In a real app, you would send this 'preferences' object to your backend API.
                // For now, just show a confirmation.
                alert('Preferences saved! (Check console for data)');
            });
        });
    </script>
</body>
</html>