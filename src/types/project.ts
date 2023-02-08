import type { DisplayFunction } from "./map";

interface Project {
  name: string;
  urls: Record<string, string>;
  about: string;
  center: [number, number];
  zoom: number;
  getFeatureDisplayName?: DisplayFunction;
}

export type { Project };
