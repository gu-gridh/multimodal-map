import { createI18n } from 'vue-i18n';

const messages = {
    en: {
      documentation: "Documentation by category",
      period: "Time period",
      tomb: "Type of tomb",

    },
    it: {
      documentation: "Documentazione per Categoria",
      period: "Periodo di tempo",
      tomb: "Tipo di tomba",
    },
};  

const i18n = createI18n({
  locale: 'en', 
  messages,
});

export default i18n;
