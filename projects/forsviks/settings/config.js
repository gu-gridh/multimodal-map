import { markers, markerTypes } from "./markers";

export default {
  title: "Forsviks bruk",
  titleLines: ["Forsviks", "bruk"],
  markers,
  markerTypes,
  projection: "EPSG:3857",
  center: [14.434, 58.578],
  zoom: 17,
  about: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  layers: {
    plan: { title: "Plan", url: "", attribution: "" },
    drone: { title: "Drone", url: "", attribution: "" },
  },
};
