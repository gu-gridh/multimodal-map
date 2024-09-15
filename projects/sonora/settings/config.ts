import type { SonoraProject } from "./types";

export default <SonoraProject>{
  title: "",
  subtitle: "",
  moreinfo: "Learn more...",
  about:
    "",
  projection: "EPSG:3857",
  center: [16, 59.3],
  zoom: 7,
  timeRange: [1600, new Date().getFullYear()],
};
