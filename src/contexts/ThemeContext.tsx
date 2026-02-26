import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from 'react';
import { THEMES, type ThemeColors } from '../constants/themes';

interface ThemeContextType {
  currentThemeId: string;
  applyThemeById: (themeId: string) => void;
  updateThemeConfig: (config: any) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [currentThemeId, setCurrentThemeId] = useState<string>(localStorage.getItem('user_theme') || 'vanilla');

  const getThemeColors = (themeId: string): ThemeColors => {
    const theme = THEMES.find(t => t.id === themeId) || THEMES[0];
    return theme.colors;
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '255, 255, 255';
  };

  const applyTheme = (colors: ThemeColors) => {
    const root = document.documentElement;

    // Variables sémantiques principales
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-primary-rgb', hexToRgb(colors.primary));
    root.style.setProperty('--color-background', colors.background);
    root.style.setProperty('--color-secondary', colors.secondary);
    root.style.setProperty('--color-text', colors.text);
    root.style.setProperty('--color-card-bg', colors.card);
    root.style.setProperty('--color-border', colors.border);

    // Dérivés pour cohérence
    root.style.setProperty('--color-accent', colors.primary);
    root.style.setProperty('--color-text-muted', `${colors.text}99`);

    // Legacy
    root.style.setProperty('--color-pink-candy', colors.primary);
    root.style.setProperty('--color-pink-deep', colors.primary);
    root.style.setProperty('--color-pink-milk', colors.secondary);
    root.style.setProperty('--color-clean-beige', colors.background);
    root.style.setProperty('--color-hello-black', colors.text);
    root.style.setProperty('--color-pink-candy-shadow', `${colors.primary}26`);

    root.style.setProperty('color-scheme', 'light');
    root.classList.remove('dark');
  };

  const applyThemeById = (themeId: string) => {
    setCurrentThemeId(themeId);
    localStorage.setItem('user_theme', themeId);
    const colors = getThemeColors(themeId);
    applyTheme(colors);
  };

  const updateThemeConfig = (config: any) => {
    const colors: ThemeColors = {
      primary: config.primaryColor || config.primary || '#D2B48C',
      background: config.backgroundColor || config.background || '#FDFBF7',
      secondary: config.secondaryColor || config.secondary || '#F5F5DC',
      text: config.text || '#4A3B3E',
      card: config.card || 'rgba(255, 255, 255, 0.9)',
      border: config.border || 'rgba(210, 180, 140, 0.15)'
    };
    applyTheme(colors);
  };

  // Re-appliquer quand le thème change
  useEffect(() => {
    const colors = getThemeColors(currentThemeId);
    applyTheme(colors);
  }, [currentThemeId]);

  const value = useMemo(() => ({
    currentThemeId,
    applyThemeById,
    updateThemeConfig
  }), [currentThemeId]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
