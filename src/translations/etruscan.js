import { createI18n } from 'vue-i18n';

const messages = {
    en: {
      etruscantitle: "Etruscan Chamber Tombs",
      etruscanabout: "The portal is published by GRIDH at the universitt of Gothenburg in close collaboration with the Swedish Institute in Rome.",
      documentation: "Documentation by category",
      period: "Time period",
      tomb: "Type of tomb",
      map: "map",
      gallery: "gallery",
      infobutton: "About the portal",
      languagebutton: "Italiano",
  
    },
    it: {
      etruscantitle: "Tombe Etrusche A Camera",
      etruscanabout: "Il portale è pubblicato da GRIDH presso l'Università di Goteborg con la collaborazione dell'Istituto Svedese di Studi Classici a Roma.",
      documentation: "Documentazione per Categoria",
      period: "Periodo di tempo",
      tomb: "Tipo di tomba",
      map: "mappa",
      gallery: "galleria",
      infobutton: "About the portal",
      languagebutton: "English",
          },
};  

const i18n = createI18n({
  locale: 'en', 
  messages,
});

export default i18n;
