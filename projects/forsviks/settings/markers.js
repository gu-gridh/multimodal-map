import white from "@/assets/marker-white.svg";
import gold from "@/assets/marker-gold.svg";
import red from "@/assets/marker-red.svg";
import blue from "@/assets/marker-blue.svg";

export const markerTypes = {
  all: { label: "Allt material", value: null },
  image: { icon: red, label: "Foton", value: "image", color: "#c16440" },
  panorama: { icon: gold, label: "Panoraman", value: "panorama", color: "#faaf50" },
  pointcloud: { icon: white, label: "3D-modeller", value: "pointcloud", color: "white" },
  texturedmodel: { icon: white, label: "textured_model", value: "textured_model", color: "white" },
};
