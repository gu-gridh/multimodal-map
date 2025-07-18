import { createI18n } from 'vue-i18n';

const messages = {
    en: {
      portaltitle: "Saint \nSophia's\nInscriptions",
      documentation: "Documentation by category",
      timeperiod: "Time period",
      alignment: "Alignment",
      condition: "Condition",
      tag: "Tag",
      tags: "Tags",
      panel: "Surface",
      panels: "Surfaces",
      Surface: "Surface",
      panelsshown: "Surfaces shown",
      panelshidden: "Surfaces hidden",
      annotationsshown: "Annotations shown",
      annotationshidden: "Annotations hidden",
      typeofdata: "Type of data",
      typeofinscription: "Type of inscription",
      dataset: "Dataset",
      searchtitle: "Search for a surface or inscription",
      searchsurfacesplaceholder: "Search for a surface",
      searchinscriptionsplaceholder: "Search for an inscription",
      inscriptions: "Inscriptions",
      alllanguages: "All languages",
      text: "Text",
      texts: "Textual",
      figure: "Figure",
      figures: "Pictorial",
      language: "Language",
      composite: "Composite",
      composites: "Composites",
      room: "Room",
      plan: "Plan",
      plans: "Plans",
      groundfloor: "Ground floor",
      secondfloor: "Second floor",
      languages: "Languages",
      map: "map",
      gallery: "gallery",
      infobutton: "About the portal",
      languagebutton: "Українською",
      moreinfo: "More Info",
      threedmodel: "3D Model",
      threedmodels: "3D models",
      photographs: "Photographs",
      plans: "Plans",
      type: "Type",
      period: "Period",
      aboutportalmain:"Carved into the walls of Saint Sophia Cathedral there are more than 7,000 inscriptions. They span a thousand years and constitute a source of knowledge about cultural exchange, about language, migration, trade, and diversity in Europe.",
      aboutportal: "This research infrastructure, which lets researchers and the public explore the inscriptions, is the result of a close collaboration between National Conservation Area “St. Sophia of Kyiv”, the National Museum of the History of Ukraine, and the University of Gothenburg, Sweden.",
      learnmore: "Learn more",
      explore: "Explore",
      explore: "Explore",  
      documents: "Documents",
      sortbytype: "Sort by: TYPE",
      sortbyyear: "Sort by: YEAR",
      size: "Size",
      published: "Published",
      editplace: "Edit place",
      nophoto: "No photographs available",
      drawings: "Drawings",
      showall: "Show all",
      exploreData: "Explore documentation",
      instructions: "User guide",
      aboutinstructions: "This portal makes available a scientific documentation of the inscriptions of Saint Sophia Cathedral in Kyiv. The data collection has been carried out using a number of overlapping and complementary techniques to ensure an as trustworthy source material as possible. To explore this rich and varied material, the portal presents several different features.",
      close: "Close",
      video: "Video tutorial",
      alldatasets: "All datasets",
      reset: "Reset all filters",
      features: "Features",
      f1title: "Multimodal exploration",
      f1description: "Use the centrally placed widget at the top of the screen to switch between an interactive plan of the cathedral, a gallery of the documented Surfaces or a gallery of the individual inscriptions.",
      f2title: "Interactive Plan",
      f2description:"The interactive plan shows the position of all the documented surfaces rendered on top of a plan of the cathedral. The colours indicate the number of annotated inscriptions for each surface, ranging from yellow to bright red. Switch between Ground Floor and Second Floor with the widget at the bottom of the page. Zoom in by scrolling or double-clicking, and click-and-drag to pan the view.",
      f3title: "Filter by metadata",
      f3description:"To the left you have controls to filter down the result to inscriptions of a particular type (textual, pictorial or composite), by genre and description or by writing system and language.",
      f4title: "Search interface",
      f4description:"You can use the search bar to search for a particular surface or group of surface using name or room. You can also search for a particular inscription or group of inscriptions by searching for their name, surface or room number.",
      f5title: "Finetune the result",
      f5description:"Use the tags at the bottom right of the surfaces and inscriptions galleries to further filter down and narrow the result.",
      f6title: "Analytical Tools",
      f6description:"Click on a surface or inscription to enter the analytical tool where you can explore all the documentation and associated data. This includes high resolution orthophotos, topographical visualisations, interactive 3D data, RTI photography, and the possibility to explore the spatial context of the surface through a 3D scan of the cathedral interiors.",
      textualgraffiti:"Textual",
      pictorialgraffiti:"Pictorial",
      monograms:"Monograms",
      writingsystem:"Writing system",
      textualgenre:"Textual genre",
      namedentity:"Named entity",
      material:"Material",
      medium:"Medium",
      versionnumb:"Version 1.3.0",
      overview:"Overview",
      immersive:"Immersive",
      numberofinscriptions:"Number of inscriptions",
      pictorialdescription:"Pictorial description",
      "categories": {
        "all": "All types",
        "drawings": "Drawings",
        "pictorialgraffiti": "Pictorial Graffiti",
        "textualgraffiti": "Textual Graffiti",
        "models": "3D models"
      },
    },

    uk: {
      portaltitle: "Написи \nСвятої \nСофії",
      documentation: "Documentation by category",
      timeperiod: "Time period",
      alignment: "Bирівнювання",
      condition: "Стан",
      tag: "Тег",
      tags: "Теги",
      panel: "Поверхня",
      panels: "Поверхні",
      Surface: "Поверхня",
      searchtitle: "Пошук поверхні або напису",
      searchsurfacesplaceholder: "Пошук поверхні",
      searchinscriptionsplaceholder: "Пошук напису",
      panelsshown: "Показ поверхні",
      panelshidden: "Приховані поверхні",
      annotationsshown: "Показані анотації",
      annotationshidden: "Приховані анотації",
      typeofdata: "Type of data",
      typeofinscription: "Вид напису",
      dataset: "Dataset",
      inscriptions: "Hаписи",
      alllanguages: "Всі мови",
      text: "Текст",
      texts: "Тексти",
      figure: "Mалюнок",
      figures: "Цифри",
      language: "Мова напису",
      composite: "Суміш",
      composites: "Суміші",
      room: "Кімната",
      plan: "План",
      plans: "Плани",
      groundfloor: "Перший поверх",
      secondfloor: "Другий поверх",
      languages: "Мови",
      map: "map",
      gallery: "gallery",
      infobutton: "Про портал",
      languagebutton: "In English",
      moreinfo: "Більше інформації",
      threedmodel: "3D Model",
      threedmodels: "3D models",
      photographs: "Photographs",
      plans: "Плани",
      type: "Type",
      period: "Period",
      aboutportalmain:"На стінах Софійського собору вирізьблено понад 7 000 написів. Вони охоплюють тисячолітню історію і є джерелом знань про культурний обмін, про мову, міграцію, торгівлю та розмаїття в Європі.",
      aboutportal: "Ця дослідницька інфраструктура, яка дозволяє науковцям і громадськості вивчати написи, є результатом тісної співпраці Національного заповідника «Софія Київська», Національного музею історії України та Гетеборзького університету у Швеції.",
      learnmore: "Вивчайте більше",
      explore: "Досліджуйте",  
      documents: "Documents",
      sortbytype: "Sort by: TYPE",
      sortbyyear: "Sort by: YEAR",
      size: "Size",
      published: "Published",
      editplace: "Edit place",
      nophoto: "No photographs available",
      drawings: "Drawings",
      showall: "Show all",
      exploreData: "Вивчіть документацію",
      instructions: "Інструкції",
      aboutinstructions: "На цьому порталі доступна наукова документація щодо написів Софійського собору в Києві. Дані зібрані з використанням низки методів, що перетинаються та доповнюють один одного, щоб представити максимально надійний вихідний матеріал. Щоб дослідити цей багатий і різноманітний матеріал, портал пропонує кілька різних функцій.",
      close: "Закрити",
      video: "Відеоурок",
      alldatasets: "All datasets",
      reset: "Скинути всі фільтри",
      features: "Features",
      f1title: "Мультимодальне дослідження",
      f1description: "Використовуйте центральний віджет у верхній частині екрана, щоб переключатися між інтерактивним планом собору, галереєю задокументованих поверхонь або галереєю окремих написів.",
      f2title: "Інтерактивний план",
      f2description:"Інтерактивний план представляє розташування всіх задокументованих поверхонь, зображених поверх плану собору. Кольори від жовтого до яскраво-червоного вказують на кількість анотованих написів для кожної поверхні. Перемикайтеся між першим і другим поверхами за допомогою віджета внизу сторінки. Збільшуйте масштаб обертанням колеса мишки або подвійним клацанням, а потім клацніть і перетягніть, щоб отримати панорамний перегляд.",
      f3title: "Фільтр за метаданими",
      f3description:"Ліворуч розміщені елементи керування, які допоможуть відфільтрувати результат за написами певного типу (текстовими, графічними чи комбінованими), за жанром і описом або за системою письма та мовою.",
      f4title: "Шукати поверхню",
      f4description:"Ви можете використовувати панель пошуку для пошуку певної поверхні або групи поверхонь за назвою або кімнатою. Ви також можете шукати певний напис або групу написів, шукаючи їх назву, поверхню або номер кімнати.",
      f5title: "Уточніть результат",
      f5description:"Використовуйте теги в нижній правій частині галерей поверхонь і написів, щоб додатково відфільтрувати та звузити результат.",
      f6title: "Аналітичні інструменти",
      f6description:"Клацніть на поверхні або написі, щоб увійти в аналітичний інструмент, завдяки якому можна переглянути всю документацію та пов’язані дані. Це включає ортофотографії високої роздільної здатності, топографічні візуалізації, інтерактивні 3D-дані, фотографії у форматі RTI і можливість досліджувати просторовий контекст поверхні за допомогою 3D-сканування інтер’єрів собору",
      textualgraffiti:"Текстове",
      pictorialgraffiti:"Живописні",
      monograms:"Вензелі",
      writingsystem:"система письма",
      textualgenre:"Текстовий жанр",
      namedentity:"Іменована сутність",
      material:"Матеріал",
      medium:"Середній",
      versionnumb:"Версія 1.3.0",
      overview:"Оглядова",
      immersive:"Занурювальний",
      numberofinscriptions:"Кількість написів",
      pictorialdescription:"Картинний опис",
      "categories": {
        "all": "Всі види",
        "drawings": "Drawings",
        "models": "3D models"
      },
    },
};  

const i18n = createI18n({
  locale: 'en', 
  messages,
});

export default i18n;
