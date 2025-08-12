# Frontend Integration Guide for Elevate Core API

## 🔐 Authentication

**All API endpoints require authentication via JWT Bearer token.**

### Setup
```typescript
// Add to all API requests
const headers = {
  'Authorization': `Bearer ${jwtToken}`,
  'Content-Type': 'application/json'
};
```

### Auth Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login (returns JWT)

---

## 🧠 AI-RAG Learning Blueprints (Primary Service)

**Base Path**: `/api/ai-rag`

### Available Endpoints

#### Learning Blueprints
- `GET /api/ai-rag/learning-blueprints` - Get all blueprints for user
- `GET /api/ai-rag/learning-blueprints/:blueprintId` - Get specific blueprint
- `POST /api/ai-rag/learning-blueprints` - Create new blueprint
- `PUT /api/ai-rag/learning-blueprints/:blueprintId` - Update blueprint
- `DELETE /api/ai-rag/learning-blueprints/:blueprintId` - Delete blueprint

#### Content Generation
- `POST /api/ai-rag/learning-blueprints/:blueprintId/question-sets` - Generate questions
- `POST /api/ai-rag/learning-blueprints/:blueprintId/notes` - Generate notes

#### Chat
- `POST /api/ai-rag/chat/message` - Send chat message

### Frontend Service Implementation
```typescript
// src/services/learningBlueprintService.ts
import apiClient from './apiClient';

export const getLearningBlueprints = async () => {
  const response = await apiClient.get('/api/ai-rag/learning-blueprints');
  return response.data;
};

export const createLearningBlueprint = async (blueprintData: any) => {
  const response = await apiClient.post('/api/ai-rag/learning-blueprints', blueprintData);
  return response.data;
};

export const generateQuestionsFromBlueprint = async (blueprintId: number, options: any) => {
  const response = await apiClient.post(`/api/ai-rag/learning-blueprints/${blueprintId}/question-sets`, options);
  return response.data;
};

export const generateNoteFromBlueprint = async (blueprintId: number, options: any) => {
  const response = await apiClient.post(`/api/ai-rag/learning-blueprints/${blueprintId}/notes`, options);
  return response.data;
};

export const handleChatMessage = async (message: any) => {
  const response = await apiClient.post('/api/ai-rag/chat/message', message);
  return response.data;
};
```

---

## 📁 Alternative Blueprint Routes (Alias)

**Base Path**: `/api/blueprints`

These routes provide the same functionality as AI-RAG routes but through a different path:

- `GET /api/blueprints` - Get all blueprints
- `POST /api/blueprints` - Create blueprint
- `GET /api/blueprints/:id` - Get specific blueprint
- `PUT /api/blueprints/:id` - Update blueprint
- `DELETE /api/blueprints/:id` - Delete blueprint

**Plus additional mindmap features:**
- `GET /api/blueprints/:id/mindmap` - Get blueprint mindmap
- `PUT /api/blueprints/:id/mindmap` - Update blueprint mindmap
- `GET /api/blueprints/:id/mindmap/stats` - Get mindmap statistics
- `DELETE /api/blueprints/:id/mindmap/cache` - Clear mindmap cache

---

## 📁 Folder Management

**Base Path**: `/api/folders`

- `GET /api/folders` - Get all folders
- `POST /api/folders` - Create folder
- `GET /api/folders/:id` - Get specific folder
- `PUT /api/folders/:id` - Update folder
- `DELETE /api/folders/:id` - Delete folder

---

## ❓ Question Sets & Questions

**Base Path**: `/api/folders/:folderId/questionsets`

- `GET /api/folders/:folderId/questionsets` - Get all question sets in folder
- `POST /api/folders/:folderId/questionsets` - Create question set
- `GET /api/folders/:folderId/questionsets/:id` - Get specific question set
- `PUT /api/folders/:folderId/questionsets/:id` - Update question set
- `DELETE /api/folders/:folderId/questionsets/:id` - Delete question set

**Questions within Question Sets:**
- `GET /api/folders/:folderId/questionsets/:setId/questions` - Get all questions
- `POST /api/folders/:folderId/questionsets/:setId/questions` - Create question
- `GET /api/folders/:folderId/questionsets/:setId/questions/:id` - Get specific question
- `PUT /api/folders/:folderId/questionsets/:setId/questions/:id` - Update question
- `DELETE /api/folders/:folderId/questionsets/:setId/questions/:id` - Delete question

---

## 🔄 Spaced Repetition & Reviews

**Base Path**: `/api/reviews`

- `GET /api/reviews/today` - Get questions due for review today
- `POST /api/reviews` - Submit review (updates mastery score)
- `GET /api/reviews/stats` - Get review progress statistics

---

## 📊 Statistics & Analytics

**Base Path**: `/api/stats`

- `GET /api/stats/questionsets/:setId/details` - Question set mastery history
- `GET /api/stats/folders/:folderId/details` - Folder-level statistics

---

## 🧪 Primitives (Knowledge Components)

**Base Path**: `/api/primitives`

- Various endpoints for managing knowledge primitives

**AI Primitives:**
**Base Path**: `/api/ai/primitives`

- AI-powered primitive management

---

## 💎 Premium & Payments

**Base Path**: `/api/premium` and `/api/payments`

- Premium feature management
- Payment processing via Stripe

---

## 🚀 API Client Setup

```typescript
// src/services/apiClient.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 30000, // 30 seconds
});

// Add auth token to all requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwtToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login or refresh token
      localStorage.removeItem('jwtToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

---

## ⚠️ Important Notes

1. **Authentication Required**: All endpoints require valid JWT token
2. **CORS Enabled**: Backend supports cross-origin requests
3. **Error Handling**: Implement proper error handling for network issues
4. **Timeout**: Set reasonable timeouts (30s recommended)
5. **Rate Limiting**: Be mindful of API call frequency

## 🔍 Testing Endpoints

- `GET /ping` - Basic health check (no auth required)
- `GET /health` - Health status (no auth required)
- `GET /api/blueprints/test` - Test blueprint router

---

## 📝 Example Usage

### Creating a Learning Blueprint
```typescript
import { createLearningBlueprint } from '../services/learningBlueprintService';

const newBlueprint = {
  title: "Machine Learning Fundamentals",
  description: "Core concepts of ML and AI",
  content: "Machine learning is a subset of artificial intelligence..."
};

try {
  const result = await createLearningBlueprint(newBlueprint);
  console.log('Blueprint created:', result);
} catch (error) {
  console.error('Failed to create blueprint:', error);
}
```

### Fetching User's Blueprints
```typescript
import { getLearningBlueprints } from '../services/learningBlueprintService';

useEffect(() => {
  const loadBlueprints = async () => {
    try {
      const blueprints = await getLearningBlueprints();
      setBlueprints(blueprints);
    } catch (error) {
      console.error('Failed to load blueprints:', error);
      // Fallback to mock data or show error message
    }
  };
  
  loadBlueprints();
}, []);
```

### Generating Questions from Blueprint
```typescript
import { generateQuestionsFromBlueprint } from '../services/learningBlueprintService';

const generateQuestions = async (blueprintId: number) => {
  const options = {
    questionCount: 10,
    difficulty: 'medium',
    questionTypes: ['multiple-choice', 'true-false']
  };
  
  try {
    const questions = await generateQuestionsFromBlueprint(blueprintId, options);
    setQuestions(questions);
  } catch (error) {
    console.error('Failed to generate questions:', error);
  }
};
```

---

## 🔧 Troubleshooting

### Common Issues

1. **401 Unauthorized**: Check JWT token validity and expiration
2. **404 Not Found**: Verify endpoint URL and route configuration
3. **500 Internal Server Error**: Check server logs and API implementation
4. **CORS Issues**: Ensure backend CORS is properly configured
5. **Timeout Errors**: Increase timeout value or check network connectivity

### Debug Tips

- Use browser DevTools Network tab to inspect requests
- Check server console logs for detailed error information
- Verify JWT token format: `Bearer <token>`
- Test endpoints with tools like Postman or curl first
- Ensure all required fields are provided in request bodies

---

This guide should provide your frontend team with everything they need to successfully integrate with the Elevate Core API backend!
