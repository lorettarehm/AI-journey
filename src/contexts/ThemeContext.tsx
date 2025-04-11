
import React, { createContext, useState, useContext, useEffect } from 'react';

type Theme = 'light' | 'dark';
type ColorScheme = 'purple' | 'blue' | 'green' | 'orange' | 'pink';

interface ThemeContextType {
  theme: Theme;
  colorScheme: ColorScheme;
  setTheme: (theme: Theme) => void;
  setColorScheme: (scheme: ColorScheme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  colorScheme: 'purple',
  setTheme: () => {},
  setColorScheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('light');
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>('purple');

  useEffect(() => {
    // Load theme preferences from localStorage if available
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const savedColorScheme = localStorage.getItem('colorScheme') as ColorScheme | null;
    
    if (savedTheme) setThemeState(savedTheme);
    if (savedColorScheme) setColorSchemeState(savedColorScheme);
    
    // Check system preference if no saved theme
    if (!savedTheme) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setThemeState(prefersDark ? 'dark' : 'light');
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const setColorScheme = (newColorScheme: ColorScheme) => {
    setColorSchemeState(newColorScheme);
    localStorage.setItem('colorScheme', newColorScheme);
    
    // Remove any existing color scheme classes
    document.documentElement.classList.remove(
      'color-purple', 
      'color-blue', 
      'color-green', 
      'color-orange', 
      'color-pink'
    );
    
    // Add the new color scheme class
    document.documentElement.classList.add(`color-${newColorScheme}`);
  };

  // Apply theme and color scheme on mount and when changed
  useEffect(() => {
    setTheme(theme);
    setColorScheme(colorScheme);
  }, [theme, colorScheme]);

  return (
    <ThemeContext.Provider value={{ theme, colorScheme, setTheme, setColorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
