import type { RephotographyProject } from "./types";

export default <RephotographyProject>{
  title: "Streets of Rwanda",
  urls: {
    baseURL: "https://diana.dh.gu.se/api/rwanda",
    place: "geojson/place",
    language: "language",
    name: "name",
  },
  moreinfo: "Learn more...",
  about:
    "A transdisciplinary project based on collaborative research focusing  on the glacial environment in northwest Svalbard. The core of the project is using field based visualizations and research analysis.",
  projection: "EPSG:3857",
  center: [30.0636, -1.9567],
  zoom: 15,
  timeRange: [1600, new Date().getFullYear()],
};
