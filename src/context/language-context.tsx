'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import idTranslations from '@/translations/id.json';
import enTranslations from '@/translations/en.json';

type Locale = 'id' | 'en';

type LanguageContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  tError: (key: string) => string; // Specific function for error messages
};

const translations: Record<Locale, any> = {
  id: idTranslations,
  en: enTranslations,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>('id');

  useEffect(() => {
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'en') {
      setLocale('en');
    }
  }, []);

  const t = useCallback((key: string): string => {
    return translations[locale]?.[key] || key;
  }, [locale]);
  
  // This function tries to find a translation for an error key.
  // If not found in the 'errors' block, it checks the main block.
  // If still not found, it returns the original error message.
  const tError = useCallback((key: string): string => {
      const errorTranslations = translations[locale]?.errors;
      return errorTranslations?.[key] || translations[locale]?.[key] || key;
  }, [locale]);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, tError }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
