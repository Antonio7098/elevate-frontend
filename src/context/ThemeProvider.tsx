import { ThemeContext } from './ThemeContext';
import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Theme } from './ThemeContext';

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Check localStorage or system preference for initial theme
  const getInitialTheme = (): Theme => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme');
      if (stored === 'parchment' || stored === 'slate') return stored;
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'slate' : 'parchment';
    }
    return 'parchment';
  };

  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  // Update <body> data-theme and persist
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Toggle
  const setTheme = (t: Theme) => setThemeState(t);
  const toggleTheme = () => setThemeState(t => (t === 'parchment' ? 'slate' : 'parchment'));

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
