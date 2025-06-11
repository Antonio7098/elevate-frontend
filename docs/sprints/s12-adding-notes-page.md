# Sprint ##: Frontend - Notes Feature UI & Integration
**Signed off:** Antonio 
**Date Range:** [Start Date] - [End Date]
**Primary Focus:** Frontend - Notes Feature (Display & Editor)
**Overview:** This sprint focuses on building the frontend UI for the "Notes" feature. The goal is to display notes as cards within the Folder view, and create a dedicated page that uses **React Quill** for viewing notes in a "read mode" and editing them. This will be connected to the backend's `notes` API endpoints.

**Reference Documentation:** "Frontend Integration Guide for Notes"

---

## I. Planned Tasks & To-Do List

- [ ] **Task 1: Project Setup & Service Layer**
    - [ ] **Sub-task 1.1:** Install the React Quill library and its TypeScript types:
        ```bash
        npm install react-quill
        npm install --save-dev @types/react-quill
        ```
    - [ ] **Sub-task 1.2:** Create a new service file, `src/services/noteService.ts`.
    - [ ] **Sub-task 1.3:** Implement the functions to interact with the notes API:
        * `getNotesForFolder(folderId: string)` -> `GET /api/notes?folderId={folderId}`
        * `getNoteById(noteId: string)` -> `GET /api/notes/:noteId`
        * `createNote(noteData: CreateNoteData)` -> `POST /api/notes`
        * `updateNote(noteId: string, noteData: UpdateNoteData)` -> `PUT /api/notes/:noteId`
        * `deleteNote(noteId: string)` -> `DELETE /api/notes/:noteId`
    - [ ] **Sub-task 1.4:** Create `src/types/note.types.ts` and define the `Note`, `CreateNoteData`, and `UpdateNoteData` interfaces based on the API guide.

- [ ] **Task 2: Create `NoteCard.tsx` Component**
    - [ ] **Sub-task 2.1:** Create a new component file at `src/components/notes/NoteCard.tsx`.
    - [ ] **Sub-task 2.2:** The component will accept a `note` object as a prop.
    - [ ] **Sub-task 2.3:** The card should be a `<Link>` component that navigates to the note viewing/editing page (e.g., `/notes/:noteId`).
    - [ ] **Sub-task 2.4:** Inside the card, display:
        * A note icon (e.g., `FiEdit`).
        * The `note.title`.
        * A 1-2 line preview of the note content using `note.plainText`.
    - [ ] **Sub-task 2.5:** Style this component using its own CSS Module to match the clean, white aesthetic of your other list items/cards.

- [ ] **Task 3: Integrate Note Cards into Folder View Page**
    - [ ] **Sub-task 3.1:** In `QuestionSetsPage.tsx` (or whatever it's now called, e.g., `FolderContentPage.tsx`), add logic to fetch the notes for the current `folderId` using `noteService.getNotesForFolder()`.
    - [ ] **Sub-task 3.2:** Add a new section with a header (e.g., `<h2>Notes</h2>`).
    - [ ] **Sub-task 3.3:** Below the header, map over the fetched notes and render a `<NoteCard />` for each one.
    - [ ] **Sub-task 3.4:** Handle the case where there are no notes in the folder yet (display an "empty state" message).

- [ ] **Task 4: Build Note Viewing & Editing Page**
    - [ ] **Sub-task 4.1:** Create a new page component at `src/pages/NotePage.tsx`.
    - [ ] **Sub-task 4.2:** Add a protected route for `/notes/:noteId` in `AppRoutes.tsx`.
    - [ ] **Sub-task 4.3:** On page load, use the `:noteId` param to fetch the full note data (including the `content` JSON) using `noteService.getNoteById()`.
    - [ ] **Sub-task 4.4:** Implement state management for `isEditMode: boolean` (defaulting to `false`).
    - [ ] **Sub-task 4.5:** **Read Mode:**
        * By default (`isEditMode` is false), display the note's `title` as a heading.
        * Render the `ReactQuill` component in **read-only mode**, passing the fetched `content` JSON to its `value` prop.
        * Display an "Edit Note" button.
    - [ ] **Sub-task 4.6:** **Edit Mode:**
        * When the "Edit Note" button is clicked, set `isEditMode` to `true`.
        * The note `title` should now render in an `<input>` field.
        * The `ReactQuill` component should now be in its default (editable) mode.
        * A "Save Changes" and a "Cancel" button should appear.
    - [ ] **Sub-task 4.7:** The "Save Changes" button should call `noteService.updateNote()` with the `noteId` and the updated title and content. On success, it should set `isEditMode` back to `false`.

---

## II. Agent's Implementation Summary & Notes

*Instructions for AI Agent (Cascade): For each planned task you complete from Section I, please provide a summary below. If multiple tasks are done in one go, you can summarize them together but reference the task numbers.*

**(Agent will fill this section out as work is completed)**

---

## III. Overall Sprint Summary & Review (To be filled out by Antonio)

**(This section to be filled out upon sprint completion)**