import white from "@/assets/marker-white.svg";
import gold from "@/assets/marker-gold.svg";
import red from "@/assets/marker-red.svg";
import blue from "@/assets/marker-blue.svg";

export const markerTypes = {
  all: { label: "Alla", value: null },
  image: { icon: red, label: "Foto", value: "image", color: "#c16440" },
  panorama: { icon: gold, label: "Panorama", value: "panorama", color: "#faaf50" },
  pointcloud: { icon: white, label: "3D", value: "pointcloud", color: "white" },
  texturedmodel: { icon: white, label: "textured_model", value: "textured_model", color: "white" },
};
