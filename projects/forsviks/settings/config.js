import { markers, markerTypes } from "./markers";

export default {
  title: "Forsviks bruk",
  titleLines: ["Forsviks", "bruk"],
  markers,
  markerTypes,
  projection: "EPSG:3857",
  center: [14.4393, 58.5798],
  zoom: 17,
  minZoom: 17,
  maxZoom: 22,
  about: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  layers: {
    plan: { title: "Plan", url: "https://dh.gu.se/tiles/forsvik/{z}/{x}/{y}.png", attribution: "" },
    drone: { title: "Drone", url: "", attribution: "" },
  },
};
