Theming Guide: CSS Modules & React Context
This guide provides a complete, copy-and-paste implementation for creating a consistent theming system with a light/dark mode toggle using CSS Custom Properties (CSS Variables) and React Context.

This approach avoids utility frameworks like Tailwind CSS and gives you a robust system for managing design tokens in a modular CSS environment.

Step 1: Create the Global Theme File
Create a new file at src/styles/theme.css. This file will be the single source of truth for all your design tokens (colors, fonts, spacing, etc.).

src/styles/theme.css

/*
 * ELEVATE THEME - GLOBAL DESIGN TOKENS
 * This file defines all CSS Custom Properties (Variables) for the application.
 * It is the single source of truth for theming.
*/

:root {
  /* ======================================== */
  /* LIGHT THEME (DEFAULT)           */
  /* ======================================== */

  /* Color Palette */
  --color-primary: #4f46e5; /* Indigo 600 */
  --color-primary-hover: #4338ca; /* Indigo 700 */
  --color-secondary: #10b981; /* Emerald 500 */
  --color-danger: #ef4444; /* Red 500 */
  
  --color-text-base: #1f2937; /* Gray 800 */
  --color-text-muted: #6b7280; /* Gray 500 */
  --color-text-on-primary: #ffffff; /* White */

  --color-background: #f9fafb; /* Gray 50 (Page background) */
  --color-surface: #ffffff;    /* White (Card/Panel background) */
  --color-border: #e5e7eb;    /* Gray 200 */

  /* Typography */
  --font-family-sans: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing (based on a 4px grid) */
  --spacing-1: 0.25rem;  /* 4px */
  --spacing-2: 0.5rem;   /* 8px */
  --spacing-3: 0.75rem;  /* 12px */
  --spacing-4: 1rem;     /* 16px */
  --spacing-6: 1.5rem;   /* 24px */
  --spacing-8: 2rem;     /* 32px */
  --spacing-12: 3rem;    /* 48px */

  /* Borders & Shadows */
  --border-radius-md: 0.375rem; /* 6px */
  --border-radius-lg: 0.5rem;   /* 8px */
  --border-radius-xl: 0.75rem;  /* 12px */
  --box-shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --box-shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --box-shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}

[data-theme='dark'] {
  /* ======================================== */
  /* DARK THEME VALUES            */
  /* ======================================== */

  /* Redefine ONLY the colors that need to change */
  --color-primary: #6366f1; /* Indigo 500 (lighter for dark mode) */
  --color-primary-hover: #4f46e5; /* Indigo 600 */
  --color-secondary: #34d399; /* Emerald 400 */
  --color-danger: #f87171; /* Red 400 */
  
  --color-text-base: #e5e7eb; /* Gray 200 */
  --color-text-muted: #9ca3af; /* Gray 400 */
  --color-text-on-primary: #ffffff; /* White */

  --color-background: #111827; /* Gray 900 (Page background) */
  --color-surface: #1f2937;    /* Gray 800 (Card/Panel background) */
  --color-border: #374151;    /* Gray 700 */
}

Step 2: Import the Theme File
In your main application entry point (likely src/main.tsx), import the theme file so it applies globally.

src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './styles/theme.css'; // <-- IMPORT YOUR THEME FILE HERE

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

Step 3: Create the Theme Context
Create a new file at src/context/ThemeContext.tsx. This will manage the theme state, save the user's preference, and apply the data-theme attribute to your <html> tag.

src/context/ThemeContext.tsx

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // 1. Get preference from localStorage
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    if (storedTheme) {
      return storedTheme;
    }
    // 2. Fallback to user's OS preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    // This effect runs whenever the theme state changes
    const root = document.documentElement; // The <html> tag

    // Remove the old theme class and add the new one
    root.classList.remove(theme === 'light' ? 'dark' : 'light');
    root.classList.add(theme);

    // Also set the data-theme attribute
    root.setAttribute('data-theme', theme);

    // Save the new theme to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

Step 4: Wrap Your App in the ThemeProvider
In your App.tsx file, wrap your AuthProvider and BrowserRouter with the new ThemeProvider.

src/App.tsx

import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext'; // <-- IMPORT
import AppRoutes from './routes/AppRoutes';
// ... other imports

function App() {
  return (
    <ThemeProvider> {/* <-- WRAP WITH THEME PROVIDER */}
      <BrowserRouter>
        <AuthProvider>
          {/* You might not need this div anymore if bg is handled by theme.css */}
          <div className="min-h-screen bg-background text-text-base"> {/* Example using CSS vars in a utility class context (advanced) or just let body handle it */}
            <AppRoutes />
          </div>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

(Note: You'll also want a global CSS rule like body { background-color: var(--color-background); color: var(--color-text-base); } in index.css to set the base page styles from your theme variables).

Step 5: Create a Toggle Component
Create a simple button to toggle the theme. You can place this in your sidebar, a header, or a settings page.

src/components/ThemeToggle.tsx

import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi'; // npm install react-icons

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md transition-colors hover:bg-slate-700" // Example styling
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? 
        <FiMoon className="h-5 w-5 text-slate-300" /> : 
        <FiSun className="h-5 w-5 text-yellow-400" />
      }
    </button>
  );
};

export default ThemeToggle;

With these pieces in place, you now have a fully functional, persistent light/dark mode theme system that can be consistently applied across all your modular CSS files.