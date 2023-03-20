import type { RephotographyProject } from "./types";

export default <RephotographyProject>{
  name: "Extended Rephotography",
  urls: {
    baseURL: "https://diana.dh.gu.se/api/rwanda",
    place: "geojson/place",
  },
  about:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras nec nulla imperdiet, sollicitudin diam sit amet, porttitor urna.",
  projection: "EPSG:3857",
  center: [11.4, 79.64],
  zoom: 11,
  timeRange: [1700, new Date().getFullYear()],
};
