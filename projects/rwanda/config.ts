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
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  projection: "EPSG:3857",
  center: [30.0636, -1.9520],
  zoom: 15,
  timeRange: [1600, new Date().getFullYear()],
};
