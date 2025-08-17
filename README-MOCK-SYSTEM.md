# Mock System for Blueprint-Centric Frontend

This document explains how to use the mock data and authentication system when the Core API is not running.

## Overview

The mock system provides:
- **Mock Data**: Complete sample data for all blueprint-centric entities
- **Mock Authentication**: Pre-defined users for testing
- **Mock Services**: Service layer that works without backend
- **Visual Indicators**: Shows when mock data is being used

## Quick Start

### 1. Access Mock Login
Navigate to `/mock-login` or click "Mock Login" in the sidebar.

### 2. Choose a Mock User
Available mock users:
- **John Student** (john.student@example.com) - Student role
- **Sarah Instructor** (sarah.instructor@example.com) - Instructor role
- **Admin User** (admin@example.com) - Admin role

**Password for all users**: `password`

### 3. Quick Login
Click "Quick Login" on any user card for instant access.

### 4. Explore the System
Once logged in, you'll have access to:
- Dashboard with mock progress data
- Sample blueprints (JavaScript, React, Algorithms)
- Mock sections, criteria, and questions
- Sample mastery tracking data

## Mock Data Structure

### Blueprints
- **JavaScript Fundamentals** (Beginner)
- **React Development** (Intermediate)  
- **Data Structures & Algorithms** (Advanced)

### Sections
Each blueprint contains multiple sections with:
- Titles and descriptions
- Difficulty levels
- Estimated completion times
- Knowledge primitive mappings

### Mastery Criteria
Criteria are organized by UUE stages:
- **UNDERSTAND**: Basic comprehension
- **USE**: Practical application
- **EXPLORE**: Advanced exploration

### Questions
Sample questions with:
- Multiple choice options
- Explanations
- Difficulty ratings
- Criterion associations

## Mock Authentication

### How It Works
1. Mock users are pre-defined in the system
2. Authentication bypasses Core API calls
3. User data is simulated locally
4. Session persistence uses localStorage

### User Roles
- **Student**: Access to learning content and progress tracking
- **Instructor**: Additional content management capabilities
- **Admin**: Full system access and user management

## Development Features

### Mock Data Indicator
A 🧪 "Mock Data" indicator appears in the top-right corner when using mock data.

### Environment Variables
The system automatically detects when to use mock data based on:
- Core API availability
- `VITE_USE_MOCK_DATA` environment variable

### Data Persistence
Mock data changes are persisted in:
- Browser localStorage
- Session storage
- Component state

## Customizing Mock Data

### Adding New Users
Edit `src/data/mockData.ts`:
```typescript
export const mockUsers = [
  // ... existing users
  {
    id: 'user-004',
    name: 'New User',
    email: 'newuser@example.com',
    role: 'student',
    // ... other properties
  }
];
```

### Adding New Blueprints
```typescript
export const mockBlueprints = [
  // ... existing blueprints
  {
    id: 'bp-004',
    title: 'New Blueprint',
    // ... other properties
  }
];
```

### Modifying Data
All mock data can be customized in the `mockData.ts` file. Changes will be reflected immediately in the UI.

## Testing Scenarios

### 1. User Progress Tracking
- Login as different users
- Check progress indicators
- Verify mastery levels

### 2. Blueprint Navigation
- Browse different blueprints
- Navigate through sections
- View criteria and questions

### 3. Mastery System
- Track UUE stage progression
- Monitor review schedules
- Test achievement system

### 4. Responsive Design
- Test on different screen sizes
- Verify mobile navigation
- Check component layouts

## Troubleshooting

### Mock Data Not Loading
1. Check browser console for errors
2. Verify MockDataProvider is in App.tsx
3. Ensure mock data imports are correct

### Authentication Issues
1. Clear browser localStorage
2. Check mock user credentials
3. Verify auth context setup

### Component Errors
1. Check TypeScript compilation
2. Verify component imports
3. Ensure CSS modules are loaded

## Production Considerations

### Before Deployment
1. Remove mock data providers
2. Disable mock authentication
3. Update service layer to use real API
4. Remove mock data indicators

### Environment Configuration
```bash
# Development (with mock data)
VITE_USE_MOCK_DATA=true

# Production (real API only)
VITE_USE_MOCK_DATA=false
```

## File Structure

```
src/
├── data/
│   └── mockData.ts          # All mock data definitions
├── contexts/
│   └── MockDataContext.tsx  # Mock data provider
├── hooks/
│   └── useMockAuth.ts       # Mock authentication hook
├── components/
│   └── common/
│       └── MockDataIndicator.tsx  # Visual indicator
└── pages/
    └── auth/
        └── MockLoginPage.tsx      # Mock login interface
```

## API Integration

When the Core API is available, the system will:
1. Automatically switch to real API calls
2. Maintain the same component interfaces
3. Use real authentication
4. Display real data

The mock system is designed to be completely transparent and can be easily disabled without affecting the production codebase.





