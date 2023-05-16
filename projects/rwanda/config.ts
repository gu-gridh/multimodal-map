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
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet.",
  projection: "EPSG:3857",
  center: [30.0636, -1.9520],
  zoom: 15,
  timeRange: [1600, new Date().getFullYear()],
};
