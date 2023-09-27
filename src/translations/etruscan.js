import { createI18n } from 'vue-i18n';

const messages = {
    en: {
      etruscantitle: "Etruscan Chamber Tombs",
      etruscanabout: "The portal is published by GRIDH at the universitt of Gothenburg in close collaboration with the Swedish Institute in Rome.",
      documentation: "Documentation by category",
      timeperiod: "Time period",
      tombtype: "Type of tomb",
      tomb: "Tomb",
      map: "map",
      gallery: "gallery",
      infobutton: "About the portal",
      languagebutton: "Italiano",
      moreinfo: "More Info",
      threedmodel: "3D Model",
      type: "Type",
      period: "Period",
      chambers: "Chambers",
  
    },
    it: {
      etruscantitle: "Tombe Etrusche A Camera",
      etruscanabout: "Il portale è pubblicato da GRIDH presso l'Università di Goteborg con la collaborazione dell'Istituto Svedese di Studi Classici a Roma.",
      documentation: "Documentazione per Categoria",
      timeperiod: "Periodo di tempo",
      tombtype: "Tipo di tomba",
      tomb: "Tomba",
      map: "mappa",
      gallery: "galleria",
      infobutton: "About the portal",
      languagebutton: "English",
      moreinfo: "More Info",
      threedmodel: "Modello 3D",
      type: "Tipo",
      period: "Periodo",
      chambers: "Camere",
          },
};  

const i18n = createI18n({
  locale: 'en', 
  messages,
});

export default i18n;
