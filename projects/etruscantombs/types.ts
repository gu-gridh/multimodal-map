import type { Project } from "@/types/project";
import type { Geometry } from "ol/geom";

export type EtruscanProject = Project;

export type Image = {
  id: number;
  uuid: string;
  file: string;
  iiif_file: string;
  title: string;
  creator: number;
  place: number;
  description: string;
  date: string;
  focus: number;
  tag: number[];
};

export type ImageDeep = Omit<Image, "creator" | "place" | "focus" | "tag"> & {
  creator: Person;
  place: Place;
  focus: Focus;
  tag: Tag[];
};

export type Person = {
  id: number;
  name: string;
};

// export type Place = {
//   id: number;
//   geometry: Geometry;
//   description: string;
//   comment: string;
//   tag: Tag[];
// };

export type Focus = {
  place: Geometry;
  text: string;
};

export type Tag = {
  text: string;
};

export interface Name {
  id?: number;
  created_at: string;
  updated_at: string;
  published: boolean;
  referent: number;
  text: string;
  note: string;
}

export interface PlaceType {
  id?: number;
  created_at: string;
  updated_at: string;
  published: boolean;
  text: string;
}

export interface Place {
  id?: number;
  comment: string | null;
  corrected: boolean;
  description: string;
  published: boolean;
  is_existing: boolean;
  is_iconic: boolean;
  is_private: boolean;
  names: Array<Name>;
  type: PlaceType;
  properties: any;
  geometry: any
}
