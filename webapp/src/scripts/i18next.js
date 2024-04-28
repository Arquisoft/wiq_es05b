import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import localeEn from "../locals/en.json"
import localeEs from "../locals/es.json"

i18next
  .use(initReactI18next)
  .init({
  lng: 'en',
  fallbackLng: 'en',
  resources: {
    en: localeEn,
    es: localeEs,
  },
  interpolation: {
    escapeValue: false,
  }
})

export default i18next