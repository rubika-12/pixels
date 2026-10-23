import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../data/translations';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Theme state with localStorage persistence
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('storeorsell_theme');
      if (savedTheme) return savedTheme;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  // Language state: 'en' | 'ta'
  const [lang, setLang] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('storeorsell_lang') || 'en';
    }
    return 'en';
  });

  // Toast notification state
  const [toast, setToast] = useState(null);

  // Auto-pilot demo trigger signal
  const [demoTriggerSignal, setDemoTriggerSignal] = useState(null);

  // Sync theme to HTML root element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('storeorsell_theme', theme);
  }, [theme]);

  // Sync lang to localStorage
  useEffect(() => {
    localStorage.setItem('storeorsell_lang', lang);
  }, [lang]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleLang = () => {
    setLang(prev => (prev === 'en' ? 'ta' : 'en'));
  };

  // Translation helper
  const t = (key) => {
    return translations[lang]?.[key] || translations['en']?.[key] || key;
  };

  // Toast dispatcher
  const showToast = (message, type = 'success') => {
    setToast({ id: Date.now(), message, type });
    setTimeout(() => {
      setToast(null);
    }, 3800);
  };

  // Trigger auto-pilot demo
  const triggerJudgesDemo = (presetId = 'preset-tomato-hold') => {
    setDemoTriggerSignal({ id: Date.now(), presetId });
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        lang,
        setLang,
        toggleLang,
        t,
        toast,
        showToast,
        demoTriggerSignal,
        triggerJudgesDemo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
