// context/ThemeContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

// DaisyUI themes list
export const daisyThemes = [
  { name: "light", label: "Light", category: "light" },
  { name: "dark", label: "Dark", category: "dark" },
  { name: "cupcake", label: "Cupcake", category: "light" },
  { name: "bumblebee", label: "Bumblebee", category: "light" },
  { name: "emerald", label: "Emerald", category: "light" },
  { name: "corporate", label: "Corporate", category: "light" },
  { name: "synthwave", label: "Synthwave", category: "dark" },
  { name: "retro", label: "Retro", category: "light" },
  { name: "cyberpunk", label: "Cyberpunk", category: "light" },
  { name: "valentine", label: "Valentine", category: "light" },
  { name: "halloween", label: "Halloween", category: "dark" },
  { name: "garden", label: "Garden", category: "light" },
  { name: "forest", label: "Forest", category: "dark" },
  { name: "aqua", label: "Aqua", category: "dark" },
  { name: "lofi", label: "Lo-Fi", category: "light" },
  { name: "pastel", label: "Pastel", category: "light" },
  { name: "fantasy", label: "Fantasy", category: "light" },
  { name: "wireframe", label: "Wireframe", category: "light" },
  { name: "black", label: "Black", category: "dark" },
  { name: "luxury", label: "Luxury", category: "dark" },
  { name: "dracula", label: "Dracula", category: "dark" },
  { name: "cmyk", label: "CMYK", category: "light" },
  { name: "autumn", label: "Autumn", category: "light" },
  { name: "business", label: "Business", category: "dark" },
  { name: "acid", label: "Acid", category: "light" },
  { name: "lemonade", label: "Lemonade", category: "light" },
  { name: "night", label: "Night", category: "dark" },
  { name: "coffee", label: "Coffee", category: "dark" },
  { name: "winter", label: "Winter", category: "light" },
  { name: "dim", label: "Dim", category: "dark" },
  { name: "nord", label: "Nord", category: "light" },
  { name: "sunset", label: "Sunset", category: "dark" },
];

// Legacy theme object for backward compatibility
const legacyTheme = {
  bgColor: "oklch(var(--b1))",
  primaryColor: "oklch(var(--p))",
  secondaryColor: "oklch(var(--s))",
  cardBg: "oklch(var(--b2))",
  textColor: "oklch(var(--bc))",
  textSecondary: "oklch(var(--bc) / 0.6)",
  textPrimary: "oklch(var(--p))",
  textAccent: "oklch(var(--a))",
  borderColor: "oklch(var(--bc) / 0.2)",
  hoverBg: "oklch(var(--bc) / 0.1)",
};

// Apply theme to DOM
const applyTheme = (themeName) => {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', themeName);
  }
};

export function ThemeProvider({ children }) {
  // Initialize from localStorage
  const [currentTheme, setCurrentTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('daisyTheme');
      if (saved) {
        // Apply immediately
        applyTheme(saved);
        return saved;
      }
    }
    return 'dark';
  });

  // Apply theme whenever currentTheme changes
  useEffect(() => {
    applyTheme(currentTheme);
    localStorage.setItem('daisyTheme', currentTheme);
  }, [currentTheme]);

  // Change theme function
  const changeTheme = (themeName) => {
    if (themeName) {
      // Apply immediately to DOM
      applyTheme(themeName);
      localStorage.setItem('daisyTheme', themeName);
      // Update React state
      setCurrentTheme(themeName);
    }
  };

  // Check if current theme is dark
  const isDarkTheme = () => {
    const theme = daisyThemes.find(t => t.name === currentTheme);
    return theme?.category === 'dark';
  };

  // Legacy functions for backward compatibility
  const updateColor = () => {};
  const updateColors = () => {};
  const resetTheme = () => changeTheme('dark');

  const value = {
    // New DaisyUI theme API
    currentTheme,
    changeTheme,
    isDarkTheme,
    themes: daisyThemes,
    
    // Legacy API for backward compatibility
    theme: legacyTheme,
    updateColor,
    updateColors,
    resetTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
