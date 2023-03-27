import type { DisplayFunction } from "./diana";

interface Project {
  title: string;
  subtitle?: string;
  moreinfo?: string;
  urls?: Record<string, string>;
  about: string;
  projection: string;
  center: [number, number] | number[];
  zoom: number;
  getFeatureDisplayName?: DisplayFunction;
}

export type { Project };
