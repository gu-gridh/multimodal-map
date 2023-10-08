import { createI18n } from 'vue-i18n';

const messages = {
    en: {
      etruscantitle: "Etruscan \n Chamber \n Tombs",
      etruscanabout: "The portal is published by GRIDH at the universitt of Gothenburg in close collaboration with the Swedish Institute in Rome.",
      documentation: "Documentation by category",
      timeperiod: "Time period",
      tombtype: "Type of tomb",
      tomb: "Tomb",
      map: "map",
      gallery: "gallery",
      infobutton: "About the portal",
      languagebutton: "In italiano",
      moreinfo: "More Info",
      threedmodel: "3D Model",
      threedmodels: "3D models",
      tombshown: "Tombs shown",
      tombshidden: "Tombs hidden",
      photographs: "Photographs",
      plans: "Plans",
      type: "Type",
      period: "Period",
      chambers: "Chambers",
      aboutportalmain:"This portal collects and visualises datasets concerning etruscan chamber tombs. The first dataset, encompassing the necropoli around San Giovenale, originated from the thesis 'The Chamber Tombs of San Giovenale and the Funerary Landscapes of South Etruria' by Dr. Fredrik Tobin. It is our hope that the portal, which makes available descriptions, images, plans and 3d models, will function as a resource both for researchers and students.",
      aboutportal: "The portal was realised by Gothenburg Research Infrastructure in Digital Humanities (GRIDH) at University of Gothenburg in collaboration with the Swedish Institute in Rome. The project was developed by Associate Professor Jonathan Westin (project lead, UI), together with M.A Tristan Bridge (frontend programming) and Dr. Matteo Tomasini (backend programming). Dr. Fredrik Tobin – whose thesis served as foundation for the project – provided the content for the San Giovanele tombs and aided the project with expertise. The project was overseen by Dr. Ulf Hansson, Director of the Swedish Institute in Rome. Please contact jonathan.westin@lir.gu.se if you have any questions or want to contribute with data.",
      explore: "Explore",  
    },

    it: {
      etruscantitle: "Tombe \n Etrusche \n A Camera",
      etruscanabout: "Il portale è pubblicato da GRIDH presso l'Università di Goteborg con la collaborazione dell'Istituto Svedese di Studi Classici a Roma.",
      documentation: "Documentazione per Categoria",
      timeperiod: "Periodo di tempo",
      tombtype: "Tipo di tomba",
      tomb: "Tomba",
      map: "mappa",
      gallery: "galleria",
      infobutton: "About the portal",
      languagebutton: "In english",
      moreinfo: "More Info",
      threedmodel: "Modello 3D",
      threedmodels: "Modelli 3D",
      tombshown: "Tombe mostrate",
      tombshidden: "Tombe nascoste",
      photographs: "Fotografie",
      plans: "Piani",
      type: "Tipo",
      period: "Periodo",
      chambers: "Camere",
      aboutportalmain:"Questo portale raccoglie e visualizza dataset riguardanti le tombe a camera etrusche. Il primo set di dati, che comprende la necropoli attorno a San Giovenale, ha avuto origine dalla tesi 'The Chamber Tombs of San Giovenale and the Funerary Landscapes of South Etruria' del Dr. Fredrik Tobin. La nostra speranza è che il portale, che rende disponibili descrizioni, immagini, piante e modelli 3d, funzionerà come una risorsa sia per i ricercatori che per gli studenti.",
      aboutportal: "Il portale è stato realizzato dalla Gothenburg Research Infrastructure in Digital Humanities (GRIDH) dell'Università di Göteborg in collaborazione con l'Istituto Svedese di Roma. Il progetto è stato sviluppato dal professore associato Jonathan Westin (responsabile del progetto, UI), insieme a M.A Tristan Bridge (programmazione frontend) e al Dr. Matteo Tomasini (programmazione backend). Il dottor Fredrik Tobin – la cui tesi è servita da base per il progetto – ha fornito il contenuto per le tombe di San Giovanele e ha collaborato al progetto con competenza. Il progetto è stato supervisionato dal Dr. Ulf Hansson, Direttore dell'Istituto Svedese di Roma. Si prega di contattare jonathan.westin@lir.gu.se se avete domande o volete contribuire con i dati.",
      explore: "Esplorare",    
    },
};  

const i18n = createI18n({
  locale: 'en', 
  messages,
});

export default i18n;
