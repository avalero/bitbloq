import * as html from "./html";
import enCountries from "./countries_en.json";
import esCountries from "./countries_es.json";
import enMessages from "./en.json";
import esMessages from "./es.json";

const messages = {
  en: {
    ...enMessages,
    countries: enCountries,
    "cookies-policy": html.enCookiesPolicy,
    "general-conditions": html.enGeneralConditions
  },
  es: {
    ...esMessages,
    countries: esCountries,
    "cookies-policy": html.esCookiesPolicy,
    "general-conditions": html.esGeneralConditions
  }
};

export default messages;
