import type { RephotographyProject } from "./types";

export default <RephotographyProject>{
  title: "Göteborgs Jubileum",
  subtitle: "1923",
  urls: {
    baseURL: "https://diana.dh.gu.se/api/rwanda",
    place: "geojson/place",
  },
  about:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras nec nulla imperdiet, sollicitudin diam sit amet, porttitor urna.",
  projection: "EPSG:3857",
  center: [11.974550, 57.70],
  zoom: 15,
  timeRange: [1600, new Date().getFullYear()],
};
