import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Types
export type Theme = 'light' | 'dark';
interface ThemeContextProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

// Context
const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

// Provider
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Check localStorage or system preference for initial theme
  const getInitialTheme = (): Theme => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme');
      if (stored === 'light' || stored === 'dark') return stored;
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'light';
    }
    return 'light';
  };

  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  // Update <body> data-theme and persist
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Toggle
  const setTheme = (t: Theme) => setThemeState(t);
  const toggleTheme = () => setThemeState(t => (t === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook
export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
