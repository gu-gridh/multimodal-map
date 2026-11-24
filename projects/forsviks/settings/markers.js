import white from "@/assets/marker-white.svg";
import gold from "@/assets/marker-gold.svg";
import red from "@/assets/marker-red.svg";
import blue from "@/assets/marker-blue.svg";

export const markerTypes = {
  all: { label: "Alla", value: null },
  image: { icon: red, label: "Bilder", value: "image" },
  panorama: { icon: gold, label: "Panorama", value: "panorama" },
  pointcloud: { icon: white, label: "3D", value: "pointcloud" },
  texturedmodel: { icon: white, label: "textured_model", value: "textured_model" },
};
