import type Feature from "ol/Feature";
import type { FeatureCollection, Geometry } from "geojson";

export type DisplayFunction = (f: Feature) => string;
export type TextSearchFunction = (query: string) => Promise<Array<any>>;

export type Paginated = {
  count: number;
  next: string | null;
  previous: string | null;
};

export type ListResponse<T> = Paginated & {
  results: T[];
};

export type MapResponse<P> = Paginated & FeatureCollection<Geometry, P>;
