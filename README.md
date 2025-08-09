# Elevate Frontend

A React-based frontend application for the Elevate learning platform.

## Development Setup

### Authentication

The application includes a mock authentication system for development purposes. By default, it will use mock authentication when running in development mode.

#### Real Backend Authentication (Default)

The application now uses real backend authentication by default. To connect to your backend server:

1. Ensure your backend server is running on `http://localhost:3000`
2. The backend should have the following endpoints:
   - `POST /api/auth/login` - User login
   - `POST /api/auth/register` - User registration
   - `GET /api/auth/verify-token` - Token verification
   - `GET /api/dashboard` - Dashboard data
   - `GET /api/folders` - Folder data

#### Mock Authentication (Development Only)

To use mock authentication for development/testing:

1. Set the environment variable `VITE_USE_MOCK_AUTH=true`
2. Use the test accounts:
   - `test@example.com` / `password123`
   - `admin@example.com` / `admin123`

#### Environment Variables

- `VITE_USE_MOCK_AUTH` - Set to `true` to use mock auth instead of real backend
- `DEV` - Automatically set to `true` in development mode by Vite

### Running the Application

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Features

- User authentication and registration
- Dashboard with progress tracking
- Question sets and learning materials
- Chat interface for AI assistance
- Notes and content management
- Statistics and progress analytics

## Project Structure

- `src/services/` - API services and authentication
- `src/pages/` - Page components
- `src/components/` - Reusable UI components
- `src/context/` - React context providers
- `src/types/` - TypeScript type definitions
