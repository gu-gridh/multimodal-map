import { markerTypes } from "./markers";

export default {
  title: "Forsviks bruk",
  titleLines: ["Forsviks", "bruk"],
  markerTypes,
  projection: "EPSG:3857",
  center: [14.4355, 58.579],
  zoom: 17.0,
  minZoom: 17,
  maxZoom: 20,
  about: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  layers: {
    plan: { title: "Historisk plan", url: "https://dh.gu.se/tiles/forsvik_old/{z}/{x}/{y}.png", attribution: "" },
    drone: { title: "Nutida karta", url: "https://dh.gu.se/tiles/forsvik_modern/{z}/{x}/{y}.png", attribution: "© OpenStreetMap" },
  },
};
