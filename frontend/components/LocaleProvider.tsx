"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { translations, type Locale, type Messages } from "../lib/i18n";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  messages: Messages;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("PL");

  useEffect(() => {
    document.documentElement.lang = locale.toLowerCase();
  }, [locale]);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      messages: translations[locale]
    }),
    [locale]
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return ctx;
}
