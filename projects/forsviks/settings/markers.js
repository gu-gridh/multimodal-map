import white from "@/assets/marker-white.svg";
import gold from "@/assets/marker-gold.svg";
import red from "@/assets/marker-red.svg";

export const markerTypes = {
  white: { icon: white },
  gold: { icon: gold },
  red: { icon: red }
};

export const markers = [
  { id: "sample-01", name: "Sample 01", type: "white", coordinates: [14.4318, 58.5791] },
  { id: "sample-02", name: "Sample 02", type: "gold", coordinates: [14.4331, 58.5793] },
  { id: "sample-03", name: "Sample 03", type: "red", coordinates: [14.4345, 58.5791] }
];
