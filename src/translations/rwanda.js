import { createI18n } from 'vue-i18n';

const messages = {
    en: {
      instructions: "User guide",
      aboutinstructions: "This portal is a part of the research project Reading the signs. The map visualizes some of the data of the project: it shows names of streets, buildings, and areas. It also contains photos of signs and buildings, in addition to texts about them.",
      close: "Close",
      video: "Video tutorial",
      alldatasets: "All datasets",
      reset: "Reset all filters",
      features: "Features",
      f1title: "An interactive map",
      f1description: "Explore the map and the registered data by clicking and dragging to pan the view, or scroll to zoom in and out. Adjust the size of the data summary on the right by dragging the red handle.",
      f2title: "Filter by type of place or source",
      f2description:"Use the controls on the left side to filter down the result to a particular type of place (areas, streets or buildings) or source of evidence. The latter include images, interviews, and documents.",
      f3title: "Filter by languages or time periods",
      f3description:"Use the two dropdown menus to filter the available data by language or time period",
      f4title: "Search by name of place",
      f4description:"The search bar at the bottom of the controls allows you to search for particular places based on their name",
      f5title: "Powerful Search",
      f5description:"You can use the search bar to search for a particular surface or inscription using room, name or tag. The inscription search lets you search both for structured data such as title, genre and tags, but also transcriptions and translations of the texts and descriptions of figures.",
      f6title: "Analytical Tools",
      f6description:"Click on a surface or inscription to enter the analytical tool where you can explore all the documentation and asscoiated data. This includes high resolution orthophotos, topographical visualisations, interactive 3D data, RTI photography, and the possibility to explore the spatial context of the surface through a 3D scan of the cathedral interiors.",
      all:"All"
    },

    sv: {
      instructions: "User guide",
      aboutinstructions: "This portal makes available a scientifc documentation of the inscriptions of Saint Sophia Cathedral in Kyiv. The data collection has been carried out using a number of overlapping and complementary techniques to ensure an as trustworty source material as possible. To explore this rich and varied material, the portal presents several different features.",
      close: "Close",
      video: "Video tutorial",
      alldatasets: "All datasets",
      reset: "Reset all filters",
      features: "Features",
      f1title: "Multimodal exploration",
      f1description: "Use the centrally placed widget at the top of the screen to switch betwen an interactive plan of the cathedral, a gallery of the documented Surfaces or a gallery of the individual Inscriptions.",
      f2title: "Filter by Genre and Keywords",
      f2description:"Use the tags at the top of the Surfaces- and Inscriptions galleries to filter down the result to a particular genre or keyword. you can combine several tags to narrow down the result",
      f3title: "Filter by Language or Type of Inscription",
      f3description:"To the left you have controls to filter down the result to inscriptions in a particular language, or filter by type of inscription (Text, Figure or Composite).",
      f4title: "Interactive Plan",
      f4description:"The interactive plan shows the position of all the documented surfaces rendered on top of a plan of the cathedral. The colours indicate the amount of annotated inscriptions for each surface, ranging from yellow to bright red. Switch beteeen Ground Floor and Second Floor with the widget at the bottom of the page. Zoom in by scrolling or double-clicking, and click-and-drag to pan the view.",
      f5title: "Powerful Search",
      f5description:"You can use the search bar to search for a particular surface or inscription using room, name or tag. The inscription search lets you search both for structured data such as title, genre and tags, but also transcriptions and translations of the texts and descriptions of figures.",
      f6title: "Analytical Tools",
      f6description:"Click on a surface or inscription to enter the analytical tool where you can explore all the documentation and asscoiated data. This includes high resolution orthophotos, topographical visualisations, interactive 3D data, RTI photography, and the possibility to explore the spatial context of the surface through a 3D scan of the cathedral interiors.",
      all:"All"
    },
};  

const i18n = createI18n({
  locale: 'en', 
  messages,
  warnHtmlMessage: false,
  warnHtmlInMessage: "off"
});

export default i18n;
