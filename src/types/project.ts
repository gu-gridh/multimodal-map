import type { DisplayFunction } from "./diana";

interface Project {
  name: string;
  urls: Record<string, string>;
  about: string;
  projection: string;
  center: [number, number] | number[];
  zoom: number;
  getFeatureDisplayName?: DisplayFunction;
}

export type { Project };
