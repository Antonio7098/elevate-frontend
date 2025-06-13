# Sprint ##: Frontend - "Parchment" & "Slate" Theme Implementation

**Date Range:** [Start Date] - [End Date]
**Primary Focus:** Frontend - Theming System Refactor
**Overview:** This sprint focuses on a complete refactor of the application's theming system. The goal is to replace the old light/dark mode with two new, distinct themes: "Parchment" (warm, academic, light) and "Slate" (modern, focused, dark). This will be achieved by redefining the global CSS Custom Properties and updating the theme context and toggle component.

---

## I. Planned Tasks & To-Do List

- [ ] **Task 1: Refactor Global Theme File (`src/styles/theme.css`)**
    - [ ] **Sub-task 1.1:** Open the main theme file.
    - [ ] **Sub-task 1.2 (Parchment Theme):** Redefine the variables inside the main `:root` selector to match the "Parchment" theme. This will be the default theme.
        * `--color-background`: A warm, off-white/light beige (`#FDF6E3`).
        * `--color-surface`: A slightly different off-white for cards.
        * `--color-text-base`: A dark, rich sepia or charcoal brown (`#5D4037`).
        * `--color-primary`: A deep burgundy or forest green for the main accent.
        * `--font-family-serif`: A classic serif font (e.g., 'Lora', 'Merriweather') for headings.
        * `--font-family-sans`: A clean sans-serif (e.g., 'Inter') for body text.
    - [ ] **Sub-task 1.3 (Slate Theme):** Create a new selector `[data-theme='slate']`. Inside this selector, redefine the same CSS variables with the "Slate" theme values.
        * `--color-background`: A deep, textured charcoal or near-black (`#1A202C`).
        * `--color-surface`: A slightly lighter dark gray for cards (`#1f2937`).
        * `--color-text-base`: A soft off-white (`#E2E8F0`).
        * `--color-primary`: The vibrant brand purple.
        * `--font-family-serif`: Should be the same as `--font-family-sans` for the Slate theme to maintain a modern, consistent look.

- [ ] **Task 2: Update `ThemeContext.tsx`**
    - [ ] **Sub-task 2.1:** In the `ThemeContext`, change the state management from handling `'light'/'dark'` to handling **`'parchment'/'slate'`**.
    - [ ] **Sub-task 2.2:** Update the `useEffect` hook to apply the attribute `document.documentElement.setAttribute('data-theme', theme);`. This will correctly apply the `[data-theme='slate']` styles when the theme is "slate". The default `:root` styles will apply for "parchment".
    - [ ] **Sub-task 2.3:** Update the `toggleTheme` function to switch between `'parchment'` and `'slate'`.

- [ ] **Task 3: Update `ThemeToggle.tsx` Component**
    - [ ] **Sub-task 3.1:** Update the theme toggle button's UI. Instead of a sun/moon icon, it should now clearly indicate a switch between "Parchment" and "Slate" themes. This could be done with text labels or new, more abstract icons.

- [ ] **Task 4: Review and Refactor Component Stylesheets**
    - [ ] **Sub-task 4.1:** Go through all existing CSS Modules (e.g., `DashboardPage.module.css`, `Sidebar.module.css`, `FolderCard.module.css`).
    - [ ] **Sub-task 4.2:** Ensure that all styles use the global CSS variables from `theme.css` (e.g., `background-color: var(--color-surface);`, `color: var(--color-text-base);`). Remove any remaining hardcoded colors.
    - [ ] **Sub-task 4.3 (Typography):** For components that contain headings (like `.title` classes), ensure their `font-family` is correctly set to `var(--font-family-serif)` or `var(--font-family-sans)` as appropriate for the theme's design. This is key for the "Parchment" theme's look.

- [ ] **Task 5: Final Testing**
    - [ ] **Sub-task 5.1:** Thoroughly test the application in both "Parchment" and "Slate" modes.
    - [ ] **Sub-task 5.2:** Verify that all components, text, and backgrounds switch correctly and maintain high readability and contrast in both themes. Check for any elements that were missed and are still using old, hardcoded styles.

---

## II. Agent's Implementation Summary & Notes

*Instructions for AI Agent (Cascade): For each planned task you complete from Section I, please provide a summary below, including notes on key files modified and any challenges or decisions made.*

**(Agent will fill this section out as work is completed)**

---

## III. Overall Sprint Summary & Review (To be filled out by Antonio)

**(This section to be filled out upon sprint completion)**