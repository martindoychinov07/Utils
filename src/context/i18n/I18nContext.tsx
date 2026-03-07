import * as React from "react";

export interface I18nContextType {
  language: string | null;
  setLanguage: (lang: string) => void;
  t: (text: string | undefined | null, lang?: string) => string | undefined;
}

export const I18nContext = React.createContext<I18nContextType>(null!);