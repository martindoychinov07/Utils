import * as React from "react";
import {I18nContext} from "./I18nContext";

export function useI18n() {
  return React.useContext(I18nContext);
}