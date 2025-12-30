import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from 'react';
import { useAuth } from './AuthContext';
import type { ThemeConfig } from '../types';

interface ThemeContextType {
  themeConfig: ThemeConfig | null;
  updateThemeConfig: (config: ThemeConfig) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [themeConfig, setThemeConfig] = useState<ThemeConfig | null>(null);

  // Appliquer les variables CSS au :root
  const applyTheme = (config: ThemeConfig) => {
    const root = document.documentElement;
    
    if (config.primaryColor) {
      root.style.setProperty('--color-pink-candy', config.primaryColor);
      // Calculer une version plus claire/foncée pour les dégradés si nécessaire
      root.style.setProperty('--color-pink-deep', config.primaryColor);
    }
    
    if (config.backgroundColor) {
      root.style.setProperty('--color-pink-milk', config.backgroundColor);
      root.style.setProperty('--color-clean-beige', config.backgroundColor);
    }
    
    if (config.fontFamily) {
      root.style.setProperty('--font-family', config.fontFamily);
      document.body.style.fontFamily = config.fontFamily;
    }
  };

  // Initialiser le thème depuis le profil utilisateur
  useEffect(() => {
    if (user && user.themeConfig) {
      const config = user.themeConfig;
      setThemeConfig(config);
      applyTheme(config);
    }
  }, [user]);

  const updateThemeConfig = (config: ThemeConfig) => {
    setThemeConfig(config);
    applyTheme(config);
  };

  const value = useMemo(() => ({
    themeConfig,
    updateThemeConfig
  }), [themeConfig]);

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
