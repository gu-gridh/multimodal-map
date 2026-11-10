import { markers, markerTypes } from "./markers";

export default {
  title: "Forsviks bruk",
  titleLines: ["Forsviks", "bruk"],
  markers,
  markerTypes,
  projection: "EPSG:3857",
  center: [14.4355, 58.579],
  zoom: 18.1,
  minZoom: 17,
  maxZoom: 20,
  about: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  layers: {
    plan: { title: "Plan", url: "https://dh.gu.se/tiles/forsvik/{z}/{x}/{y}.png", attribution: "" },
    drone: { title: "Drone", url: "", attribution: "" },
  },
};
