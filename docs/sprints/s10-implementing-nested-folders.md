# Sprint ##: Frontend - Nested Folders UI & Drill-Down Logic

**Date Range:** [Start Date] - [End Date]
**Primary Focus:** Frontend - `FoldersPage.tsx` & Hierarchical Navigation
**Overview:** This sprint focuses on refactoring the `FoldersPage` to support nested folders using an intuitive "drill-down" navigation model. Instead of a full tree view, users will see the contents of one folder at a time and navigate through the hierarchy. This will involve creating a dynamic page component, breadcrumb navigation, and updating the folder creation flow.

**Reference Documentation:** "Frontend Integration Guide for Nested Folders"

---

## I. Planned Tasks & To-Do List

- [x] **Task 1: Update Frontend Services & Routing**
    - [x] **Sub-task 1.1 (Services):** In `src/services/folderService.ts`, ensure the `getFolders()` function correctly fetches the full nested tree structure from the backend. The `createFolder(folderData)` function must accept an optional `parentId`.
    - [x] **Sub-task 1.2 (Routing):** In `AppRoutes.tsx`, ensure you have routes that can handle both the root folder view and a specific folder view. A single dynamic route is ideal:
        * `/folders` (for the root)
        * `/folders/:folderId` (for a specific folder)
        * These can be handled by a single component path: `<Route path="/folders/:folderId?" element={<FoldersPage />} />`.

- [x] **Task 2: Implement Dynamic Logic in `FoldersPage.tsx`**
    - [x] **Sub-task 2.1 (Data Fetching):** On component mount, `FoldersPage.tsx` should fetch the *entire* folder tree once and store it in state.
    - [x] **Sub-task 2.2 (Dynamic Content Display):**
        * Use `useParams` from `react-router-dom` to get the optional `:folderId`.
        * If no `folderId` is present in the URL, display only the top-level folders (where `parentId` is `null`).
        * If a `folderId` *is* present, find that folder in your fetched tree data and display its immediate `children` (sub-folders) and any associated `QuestionSet`s.
    - [x] **Sub-task 2.3 (State Management):** Manage state for the full folder tree, the currently displayed folder's details, its sub-folders, and its question sets.

- [x] **Task 3: Build Navigation & Display Components**
    - [x] **Sub-task 3.1 (Breadcrumbs):** Create a reusable `Breadcrumbs.tsx` component.
        * It should receive the current folder object as a prop.
        * It needs to dynamically build the navigation path (e.g., "My Folders > Maths > Algebra") by traversing up the parent-child relationships from the fetched data.
        * Each part of the breadcrumb should be a `<Link>` to the appropriate `/folders/:id` route.
    - [x] **Sub-task 3.2 (Folder List Item):** Create or use a `FolderListItem.tsx` component to display a single folder in the list. When clicked, it should navigate to `/folders/${folder.id}`.
    - [x] **Sub-task 3.3 (Question Set List Item):** Create or use a `QuestionSetListItem.tsx` component to display a single question set within a folder. When clicked, it should navigate to `/quiz/set/${questionSet.id}` or a similar route.

- [x] **Task 4: Update "Create Folder" Modal**
    - [x] **Sub-task 4.1:** The "Create Folder" modal still needs a "Parent Folder" dropdown.
    - [x] **Sub-task 4.2:** This dropdown should be populated with a flattened list of all existing folders.
    - [x] **Sub-task 4.3:** **Crucially**, when the `FoldersPage` is displaying a specific folder (e.g., you are at `/folders/123`), the "Parent Folder" dropdown in the modal should **default to the currently viewed folder**. An option for "-- No Parent (Root Folder) --" should still be available.
    - [x] **Sub-task 4.4:** On form submission, the correct `parentId` (or `null`) must be sent to the `createFolder` service function.

- [ ] **Task 5: Final Review & Cleanup**
    - [ ] **Sub-task 5.1:** Review the completed `FoldersPage` to ensure the drill-down navigation is smooth and intuitive.
    - [ ] **Sub-task 5.2:** Test creating folders at the root level and as sub-folders.
    - [ ] **Sub-task 5.3:** Remove any unused code or CSS related to the old flat grid layout or a full recursive tree view.

---

## II. Agent's Implementation Summary & Notes

### Task 1: Update Frontend Services & Routing
- Updated `folder.ts` types to include `parentId` and `children` fields
- Verified existing routing setup in `AppRoutes.tsx` already supports nested folders
- Updated folder service functions to handle parentId in create and update operations

### Task 2: Implement Dynamic Logic in FoldersPage.tsx
- Added state management for current folder and full folder tree
- Implemented folder tree traversal to find current folder and its children
- Added logic to display either root folders or children of current folder
- Added navigation handling for folder deletion

### Task 3: Build Navigation & Display Components
- Created Breadcrumbs component for hierarchical navigation
- Verified FolderListItem component already supports navigation
- Added styles for breadcrumbs and improved folder list layout

### Task 4: Update "Create Folder" Modal
- Added parent folder selection dropdown
- Implemented logic to prevent circular references
- Added default parent folder selection based on current view
- Updated form handling to include parentId in create/update operations

### Implementation Details

1. **Folder Types**
```typescript
export interface Folder {
  id: string;
  name: string;
  description?: string;
  parentId: string | null;
  children: Folder[];
  questionSetCount?: number;
  masteryScore?: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
}
```

2. **Breadcrumb Navigation**
```typescript
const Breadcrumbs = ({ folders, currentFolder }: { folders: Folder[], currentFolder: Folder | null }) => {
  const breadcrumbs: Folder[] = [];
  let current = currentFolder;

  while (current) {
    breadcrumbs.unshift(current);
    current = folders.find(f => f.id === current?.parentId) || null;
  }

  return (
    <div className={styles.breadcrumbs}>
      <Link to="/folders">My Folders</Link>
      {breadcrumbs.map((folder) => (
        <div key={folder.id} className={styles.breadcrumbItem}>
          <FiChevronRight className={styles.breadcrumbSeparator} />
          <Link to={`/folders/${folder.id}`}>{folder.name}</Link>
        </div>
      ))}
    </div>
  );
};
```

3. **Parent Folder Selection**
```typescript
<select
  id="folder-parent"
  name="parentId"
  value={editFolderId ? editFolderData.parentId || '' : newFolder.parentId || ''}
  onChange={editFolderId ? handleEditChange : (e) => setNewFolder({ ...newFolder, parentId: e.target.value || null })}
  className={styles.formSelect}
>
  <option value="">-- No Parent (Root Folder) --</option>
  {folders.map(folder => (
    <option 
      key={folder.id} 
      value={folder.id}
      disabled={editFolderId === folder.id || folder.children?.some(f => f.id === editFolderId)}
    >
      {folder.name}
    </option>
  ))}
</select>
```

4. **Folder Display Logic**
```typescript
const displayFolders = currentFolder 
  ? currentFolder.children 
  : folders.filter(f => !f.parentId);
```

---

## III. Overall Sprint Summary & Review (To be filled out by Antonio)

**(This section to be filled out upon sprint completion)**

V. Frontend Integration Guide for Nested Folders

This section provides instructions for the frontend on how to use the new nested folders structure.

### API Endpoints

- **GET /api/folders**
  - **Description:** Retrieves all folders for the authenticated user, returned as a nested tree structure.
  - **Response Format:**
    ```json
    [
      {
        "id": 1,
        "name": "Root Folder",
        "parentId": null,
        "children": [
          {
            "id": 2,
            "name": "Child Folder",
            "parentId": 1,
            "children": []
          }
        ]
      }
    ]
    ```
  - **Usage:** Use this endpoint to display the folder hierarchy in the UI.

- **POST /api/folders**
  - **Description:** Creates a new folder. Optionally, specify a `parentId` to create a nested folder.
  - **Request Body:**
    ```json
    {
      "name": "New Folder",
      "parentId": 1  // Optional; omit to create a root folder
    }
    ```
  - **Response:** Returns the created folder object.

- **PUT /api/folders/:id**
  - **Description:** Updates a folder, including moving it to a new parent.
  - **Request Body:**
    ```json
    {
      "name": "Updated Folder",
      "parentId": 2  // Optional; omit to keep the current parent
    }
    ```
  - **Response:** Returns the updated folder object.

- **DELETE /api/folders/:id**
  - **Description:** Deletes a folder. If the folder has children, they will be orphaned (parentId set to null).

### Frontend Implementation Tips

1. **Displaying the Folder Tree:**
   - Use a recursive component to render the nested folder structure.
   - Example (pseudo-code):
     ```jsx
     function FolderTree({ folders }) {
       return (
         <ul>
           {folders.map(folder => (
             <li key={folder.id}>
               {folder.name}
               {folder.children.length > 0 && <FolderTree folders={folder.children} />}
             </li>
           ))}
         </ul>
       );
     }
     ```

2. **Creating Nested Folders:**
   - When creating a folder, include the `parentId` in the request body to nest it under another folder.
   - Example:
     ```javascript
     const createFolder = async (name, parentId) => {
       const response = await fetch('/api/folders', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ name, parentId })
       });
       return response.json();
     };
     ```

3. **Moving Folders:**
   - Use the `PUT /api/folders/:id` endpoint to update a folder's `parentId` and move it within the hierarchy.
   - Example:
     ```javascript
     const moveFolder = async (folderId, newParentId) => {
       const response = await fetch(`/api/folders/${folderId}`, {
         method: 'PUT',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ parentId: newParentId })
       });
       return response.json();
     };
     ```

4. **Handling Orphaned Folders:**
   - If a folder is deleted, its children become orphaned. Ensure the UI handles this gracefully, possibly by prompting the user to reassign or delete orphaned folders.

### Example Workflow

1. Fetch the folder tree using `GET /api/folders`.
2. Display the folder hierarchy using a recursive component.
3. Allow users to create new folders, specifying a `parentId` to nest them.
4. Enable moving folders by updating their `parentId` via `PUT /api/folders/:id`.
5. Handle folder deletion, ensuring orphaned folders are managed appropriately.

By following these guidelines, the frontend can effectively utilize the new nested folders structure, providing a seamless user experience for managing folder hierarchies.