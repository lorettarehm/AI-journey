
import React, { createContext, useState, useContext, useEffect } from 'react';

type Theme = 'light' | 'dark';
type ColorScheme = 'purple' | 'blue' | 'green' | 'orange' | 'pink' | 'custom';

interface ThemeContextType {
  theme: Theme;
  colorScheme: ColorScheme;
  customColor: string;
  setTheme: (theme: Theme) => void;
  setColorScheme: (scheme: ColorScheme) => void;
  setCustomColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  colorScheme: 'purple',
  customColor: '#9b87f5',
  setTheme: () => {},
  setColorScheme: () => {},
  setCustomColor: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('light');
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>('purple');
  const [customColor, setCustomColorState] = useState<string>('#9b87f5');

  useEffect(() => {
    // Load theme preferences from localStorage if available
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const savedColorScheme = localStorage.getItem('colorScheme') as ColorScheme | null;
    const savedCustomColor = localStorage.getItem('customColor') as string | null;
    
    if (savedTheme) setThemeState(savedTheme);
    if (savedColorScheme) setColorSchemeState(savedColorScheme);
    if (savedCustomColor) setCustomColorState(savedCustomColor);
    
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
      'color-pink',
      'color-custom'
    );
    
    // Add the new color scheme class
    document.documentElement.classList.add(`color-${newColorScheme}`);

    // Update CSS variables for custom color if selected
    if (newColorScheme === 'custom') {
      updateCustomColorVariables(customColor);
    }
  };

  const setCustomColor = (newColor: string) => {
    setCustomColorState(newColor);
    localStorage.setItem('customColor', newColor);
    
    if (colorScheme === 'custom') {
      updateCustomColorVariables(newColor);
    }
  };

  const updateCustomColorVariables = (color: string) => {
    document.documentElement.style.setProperty('--custom-color', color);
    
    // Convert hex to HSL for tailwind CSS variables
    const r = parseInt(color.slice(1, 3), 16) / 255;
    const g = parseInt(color.slice(3, 5), 16) / 255;
    const b = parseInt(color.slice(5, 7), 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default: h = 0;
      }
      h /= 6;
    }

    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);

    document.documentElement.style.setProperty('--primary', `${h} ${s}% ${l}%`);
    document.documentElement.style.setProperty('--accent', `${h} ${s}% ${l}%`);
    document.documentElement.style.setProperty('--ring', `${h} ${s}% ${l}%`);
  };

  // Apply theme and color scheme on mount and when changed
  useEffect(() => {
    setTheme(theme);
    setColorScheme(colorScheme);
    if (colorScheme === 'custom') {
      setCustomColor(customColor);
    }
  }, [theme, colorScheme, customColor]);

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      colorScheme, 
      customColor, 
      setTheme, 
      setColorScheme,
      setCustomColor 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
