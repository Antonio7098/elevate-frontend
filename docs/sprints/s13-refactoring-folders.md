# Sprint ##: Frontend - Advanced Folder View & Aggregate Pages
**Signed off:** Antonio
**Date Range:** [Start Date] - [End Date]
**Primary Focus:** Frontend & Backend - Folder Content Display and Aggregate Views
**Overview:** This sprint focuses on rebuilding the `FoldersPage` to align with a new, more sophisticated design. This involves creating distinct sections for sub-folders, question sets, and notes. It also includes building new "View All" pages that recursively aggregate content from a folder and all its sub-folders, which will require new backend endpoints.

**Reference Design:**
* **Folder Content Layout:** Based on wireframe `image_069cb5.png`.
* **Aggregate View Layout:** Based on wireframe `image_069179.png`.

---

## I. Planned Tasks & To-Do List

- [ ] **Task 2: Refactor `FoldersPage` Layout & Data Fetching**
    - [ ] **Sub-task 2.1:** In `FoldersPage.tsx`, update the data fetching logic. On load, it should fetch the content for the current `folderId`:
        * Sub-folders (via `GET /api/folders?parentId=:folderId` or by filtering the full tree).
        * Question Sets directly within this folder (via `GET /api/folders/:folderId/questionsets`).
        * Notes directly within this folder (via `GET /api/folders/:folderId/notes`).
    - [ ] **Sub-task 2.2:** Rebuild the JSX to display three distinct sections with headings: "Sub-Folders," "Question Sets," and "Notes."
    - [ ] **Sub-task 2.3:** Use CSS Modules to style each section. Create visually distinct list items or cards for folders vs. question sets vs. notes.
    - [ ] **Sub-task 2.4:** Ensure the page header is updated to include the "View Questions," "View Notes," and "Add +" buttons as per the wireframe.

- [ ] **Task 3: Implement New UI Controls on `FoldersPage`**
    - [ ] **Sub-task 3.1:** Implement the "Add +" button. When clicked, it should show a small popover or dropdown menu with options: "New Folder," "New Question Set," "New Note."
    - [ ] **Sub-task 3.2:** Wire these options to their respective actions (e.g., opening the "Create Folder" modal, navigating to the "Create Question Set" page).
    - [ ] **Sub-task 3.3:** The "View Questions" button should navigate to a new route, e.g., `/folders/:folderId/all-questions`.
    - [ ] **Sub-task 3.4:** The "View Notes" button should navigate to a new route, e.g., `/folders/:folderId/all-notes`.

- [ ] **Task 4: Build Aggregate View Pages**
    - [ ] **Sub-task 4.1:** Create a new reusable page component, e.g., `AllContentPage.tsx`.
    - [ ] **Sub-task 4.2:** Add the new routes (`/folders/:folderId/all-questions` and `/folders/:folderId/all-notes`) to `AppRoutes.tsx`, both rendering `AllContentPage.tsx`.
    - [ ] **Sub-task 4.3:** The `AllContentPage` component will determine whether to fetch questions or notes based on the URL. It will call the new recursive backend endpoints from Task 1.
    - [ ] **Sub-task 4.4:** Implement the UI to display the aggregated content, grouped by their original parent folder/set with clear headings, as shown in the `image_069179.png` wireframe.

- [ ] **Task 5: Final Review & Testing**
    - [ ] **Sub-task 5.1:** Manually test the entire flow: navigating into folders, viewing the separated content, using the "Add +" menu, and clicking through to the new aggregate "View All" pages.
    - [ ] **Sub-task 5.2:** Ensure all new pages and layouts are responsive.

---

## II. Agent's Implementation Summary & Notes

*Instructions for AI Agent (Cascade): For each planned task you complete from Section I, please provide a summary below, including notes on key files modified and any challenges or decisions made.*

**(Agent will fill this section out as work is completed)**

---

## III. Overall Sprint Summary & Review (To be filled out by Antonio)

**(This section to be filled out upon sprint completion)**

Frontend Integration Guide: Recursive Folder Endpoints
1. Getting All Questions in a Folder Tree
Endpoint
GET /api/folders/:folderId/all-questions
Authentication
Required: Include the auth token in the request header
Header format: Authorization: Bearer <your-auth-token>
Response Structure
interface FolderWithQuestions {
  id: number;
  name: string;
  questions: {
    id: number;
    text: string;
    answer: string | null;
    questionType: string;
    currentMasteryScore: number | null;
    options: string[];
    lastAnswerCorrect: boolean | null;
    timesAnsweredCorrectly: number;
    timesAnsweredIncorrectly: number;
    totalMarksAvailable: number;
    markingCriteria: any | null;
    difficultyScore: number | null;
    conceptTags: string[];
    imageUrls: string[];
    selfMark: boolean;
    autoMark: boolean;
    aiGenerated: boolean;
    inCat: string | null;
    questionSetId: number;
    questionSetName: string;
  }[];
  subfolders: FolderWithQuestions[]; // Recursive structure
}
Example Usage with Axios
async function getAllQuestionsInFolder(folderId: number) {
  try {
    const response = await axios.get(`/api/folders/${folderId}/all-questions`, {
      headers: {
        'Authorization': `Bearer ${yourAuthToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching folder questions:', error);
    throw error;
  }
}
2. Getting All Notes in a Folder Tree
Endpoint
GET /api/folders/:folderId/all-notes
Authentication
Required: Include the auth token in the request header
Header format: Authorization: Bearer <your-auth-token>
Response Structure
interface FolderWithNotes {
  id: number;
  name: string;
  notes: {
    id: number;
    title: string;
    content: any;
    plainText?: string;
    createdAt: Date;
    updatedAt: Date;
    questionSetId?: number;
    questionSetName?: string;
  }[];
  subfolders: FolderWithNotes[]; // Recursive structure
}
Example Usage with Axios
async function getAllNotesInFolder(folderId: number) {
  try {
    const response = await axios.get(`/api/folders/${folderId}/all-notes`, {
      headers: {
        'Authorization': `Bearer ${yourAuthToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching folder notes:', error);
    throw error;
  }
}
3. Error Handling
The endpoints may return the following error responses:
// 401 Unauthorized
{
  "message": "No token, authorization denied"
}

// 404 Not Found
{
  "error": "Folder not found or access denied"
}

// 500 Internal Server Error
{
  "error": "Internal server error"
}
4. Example React Component
Here's an example of how to use these endpoints in a React component:
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface FolderTreeProps {
  folderId: number;
  type: 'questions' | 'notes';
}

const FolderTree: React.FC<FolderTreeProps> = ({ folderId, type }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const endpoint = type === 'questions' 
          ? `/api/folders/${folderId}/all-questions`
          : `/api/folders/${folderId}/all-notes`;
        
        const response = await axios.get(endpoint, {
          headers: {
            'Authorization': `Bearer ${yourAuthToken}`
          }
        });
        
        setData(response.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [folderId, type]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No data found</div>;

  return (
    <div>
      <h2>{data.name}</h2>
      {type === 'questions' ? (
        <div>
          {data.questions.map((question: any) => (
            <div key={question.id}>
              <h3>{question.text}</h3>
              <p>Question Set: {question.questionSetName}</p>
            </div>
          ))}
        </div>
      ) : (
        <div>
          {data.notes.map((note: any) => (
            <div key={note.id}>
              <h3>{note.title}</h3>
              <p>Content: {note.plainText}</p>
            </div>
          ))}
        </div>
      )}
      {data.subfolders.map((subfolder: any) => (
        <FolderTree 
          key={subfolder.id} 
          folderId={subfolder.id} 
          type={type} 
        />
      ))}
    </div>
  );
};

export default FolderTree;
5. Best Practices
Caching: Consider implementing caching for frequently accessed folder trees to improve performance.
Pagination: For large folder trees, consider implementing pagination or lazy loading.
Error Boundaries: Use React Error Boundaries to handle errors gracefully.
Loading States: Always show loading states while data is being fetched.
Type Safety: Use TypeScript interfaces to ensure type safety.
Authentication: Always include the auth token in requests.
Error Handling: Implement proper error handling and user feedback.