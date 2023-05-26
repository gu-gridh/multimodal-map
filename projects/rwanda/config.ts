import type { RwandaProject } from "./types";

export default <RwandaProject>{
  title: "Streets of Rwanda",
  urls: {
    baseURL: "https://diana.dh.gu.se/api/rwanda",
    place: "geojson/place",
    language: "language",
    name: "name",
  },
  moreinfo: "Learn more...",
  about:
    "How recent renaming of streets and the use of the exogenous language English in Rwanda affects citizens who move and navigate in the also physically reconstructed urban space.",
  projection: "EPSG:3857",
  center: [30.0636, -1.9520],
  zoom: 15,
  timeRange: [1600, new Date().getFullYear()],
};
