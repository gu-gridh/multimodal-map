import type { RwandaProject } from "./types";

export default <RwandaProject>{
  title: "READING THE SIGNS",
  urls: {
    baseURL: "https://diana.dh.gu.se/api/rwanda",
    place: "geojson/place",
    language: "language",
    name: "name",
  },
  moreinfo: "Learn more...",
  about:
    "Renaming and transformative processes in urban Rwanda",
  projection: "EPSG:3857",
  center: [30.0636, -1.9520],
  zoom: 15,
  timeRange: [1600, new Date().getFullYear()],
};
