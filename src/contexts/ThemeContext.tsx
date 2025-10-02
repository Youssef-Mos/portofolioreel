// contexts/ThemeContext.tsx
"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';

type ThemeColor = 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'pink';

interface ThemeContextType {
  darkMode: boolean;
  themeColor: ThemeColor;
  toggleDarkMode: () => void;
  setThemeColor: (color: ThemeColor) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);
  const [themeColor, setThemeColorState] = useState<ThemeColor>('blue');

  // Hydrate depuis localStorage côté client (sans jamais retirer le Provider)
  useEffect(() => {
    try {
      const savedDarkMode = localStorage.getItem('darkMode') === 'true';
      const savedColor = (localStorage.getItem('themeColor') as ThemeColor) || 'blue';
      setDarkMode(savedDarkMode);
      setThemeColorState(savedColor);

      if (savedDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      document.documentElement.setAttribute('data-theme', savedColor);
    } catch {}
  }, []);

  const toggleDarkMode = () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    try {
      localStorage.setItem('darkMode', String(newValue));
    } catch {}
    if (newValue) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const setThemeColor = (color: ThemeColor) => {
    setThemeColorState(color);
    try {
      localStorage.setItem('themeColor', color);
    } catch {}
    document.documentElement.setAttribute('data-theme', color);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, themeColor, toggleDarkMode, setThemeColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
