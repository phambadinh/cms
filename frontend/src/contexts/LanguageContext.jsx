import { createContext, useContext, useEffect, useMemo, useState } from "react";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => localStorage.getItem("cms_language") || "vi");
  const [theme, setTheme] = useState(() => localStorage.getItem("cms_theme") || "light");

  useEffect(() => {
    localStorage.setItem("cms_language", language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem("cms_theme", theme);
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    theme,
    setTheme,
    isVietnamese: language === "vi",
  }), [language, theme]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage phải được dùng bên trong LanguageProvider");
  }
  return context;
}
