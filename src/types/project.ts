import type { DisplayFunction } from "./map";

interface Project {
  name: string;
  urls: Record<string, string>;
  about: string;
  getFeatureDisplayName?: DisplayFunction;
}

export type { Project };
