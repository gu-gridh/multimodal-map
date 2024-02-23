import type { Project } from "@/types/project";
import type { Geometry } from "ol/geom";

export type InscriptionsProject = Project;

export type Image = {
  id: number;
  uuid: string;
  file: string;
  iiif_file: string;
  title: string;
  published: boolean;
  panel: Panel;
  inscription: Inscription;
  type_of_image: { text: string }[];
};

export interface Panel {
  id?: number;
  published: boolean;
  title: string;
  geometry: {
    type: string;
    coordinates: number[];
  };
  documentation: string;
  tags: any[];
};

export type Inscription = {
  id: number;
  published: boolean;
  title: string;
  alt_title: string;
  geometry: {
    type: string;
    coordinates: number[];
  };
  type_of_inscription: InscriptionType;
  tags: any[];
  author?: Array<{ id: number, firstname: string, lastname: string }>;
};

export type Observation = {
  id: number,
  title: string,
  author: number,
  observation: string,
  date: string,
  type: string,
};

export type Document = {
  title: string,
  size: number,
  type: Array<{ text: string }>;
  upload: string,
  date: string,
  type_names: string[];
};

export type InscriptionType = {
  id: number;
  text: string;
};

export type Technique = {
  id: number;
  text: string;
};

export type PreviewImage = {
  id: number;
  file: string;
  iiif_file: string;
};

export type Pointcloud = {
  id?: number;
  title: string;
  points_optimized: string;
  points_full_resolution: string;
  description: string;
  date: string;
  technique: Technique;
  preview_image: PreviewImage; 
  author?: Array<{ id: number, firstname: string, lastname: string }>;
};

export type Mesh = {
  id?: number;
  title: string;
  date: string;
  triangles_optimized: string;
  triangles_full_resolution: string;
  technique: Technique;
  preview_image: PreviewImage; 
  author?: Array<{ id: number, firstname: string, lastname: string }>;
};

interface Author {
  firstname: string;
  lastname: string;
}

export type ImageDeep = Omit<Image, "creator" | "place" | "focus" | "tag"> & {
  creator: Person;
  place: Place;
  focus: Focus;
  tag: Tag[];
  author?: Author;
};

export type Person = {
  id: number;
  name: string;
};

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

// export interface Panel {
//   id?: number;
//   comment: string | null;
//   corrected: boolean;
//   description: string;
//   published: boolean;
//   is_existing: boolean;
//   is_iconic: boolean;
//   is_private: boolean;
//   names: Array<Name>;
//   type: PlaceType;
//   properties: any;
//   geometry: any
// }
