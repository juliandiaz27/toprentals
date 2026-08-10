"use client";

import { createContext, useContext } from "react";
import {
  DEFAULT_SITE_LANGUAGE,
  type SiteLanguage,
} from "@/lib/i18n";
import { getUiMessages, type UiMessages } from "@/lib/i18n/ui";

type LanguageContextValue = {
  lang: SiteLanguage;
  ui: UiMessages;
};

const LanguageContext = createContext<LanguageContextValue>({
  lang: DEFAULT_SITE_LANGUAGE,
  ui: getUiMessages(DEFAULT_SITE_LANGUAGE),
});

export function LanguageProvider({
  lang,
  children,
}: {
  lang: SiteLanguage;
  children: React.ReactNode;
}) {
  return (
    <LanguageContext.Provider value={{ lang, ui: getUiMessages(lang) }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  return useContext(LanguageContext);
}
