"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

type Language = "en" | "bn" | "hi" | "ti" | "tu" | "pu";
type Namespace = "common" | "blog" | "navigation" | "settings"; // extend if you have more

type Translations = {
  [namespace in Namespace]?: Record<string, any>;
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  loadNamespace: (ns: Namespace) => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const loadedNamespaces: { [lang in Language]?: Set<Namespace> } = {};
const loadingPromises: { [key: string]: Promise<void> | undefined } = {};

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  const [translations, setTranslations] = useState<Translations>({});

  useEffect(() => {
    const savedLang = localStorage.getItem("language") as Language;
    if (savedLang) {
      setLanguage(savedLang);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
    setTranslations({}); // reset loaded translations
    loadedNamespaces[lang] = new Set();
  };

  const loadNamespace = async (ns: Namespace) => {
    if (loadedNamespaces[language]?.has(ns)) return;

    const key = `${language}-${ns}`;
    if (loadingPromises[key]) {
      await loadingPromises[key];
      return;
    }

    loadingPromises[key] = fetch(`/locales/${language}/${ns}.json`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`Failed to load ${ns}`);
        const data = await res.json();

        setTranslations((prev) => ({
          ...prev,
          [ns]: data,
        }));

        if (!loadedNamespaces[language]) {
          loadedNamespaces[language] = new Set();
        }
        loadedNamespaces[language]!.add(ns);
      })
      .catch((err) => {
        console.error(`Error loading ${ns} namespace for ${language}`, err);
      })
      .finally(() => {
        delete loadingPromises[key];
      });

    await loadingPromises[key];
  };

  const t = (key: string): string => {
    const [namespace, ...rest] = key.split(".");
    const ns = namespace as Namespace;
    const nsData = translations[ns];
    if (!nsData) return key;

    let result: any = nsData;
    for (const part of rest) {
      result = result?.[part];
    }

    return result ?? key;
  };

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage: handleSetLanguage,
        t,
        loadNamespace,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useTranslation must be used within I18nProvider");
  }
  return context;
}

export function useLoadNamespace(ns: Namespace) {
  const { loadNamespace } = useTranslation();

  useEffect(() => {
    loadNamespace(ns);
  }, [ns, loadNamespace]);
}
