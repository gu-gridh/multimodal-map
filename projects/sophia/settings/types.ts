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

export type Panel = {
  id?: number;
  published: boolean;
  title: string;
  geometry: {
    type: string;
    coordinates: number[];
  };
  documentation: string;
  tags: any[];
  room?: string;
};

export type PanelMetadata = {
  id?: number;
  published: boolean;
  title: string;
  number_of_inscriptions: number;
  number_of_languages: number;
  list_of_languages: any[];
  tags: any[];
};

export type Inscription = {
  id: number;
  published: boolean;
  title: string;
  alt_title: string;
  language: Language;
  geometry: {
    type: string;
    coordinates: number[];
  };
  type_of_inscription: InscriptionType;
  tags: any[];
  author?: Array<{ id: number, firstname: string, lastname: string }>;
};

export type Language = {
  id: number,
  text: string,
  text_urk: string,
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
  place: Panel;
  focus: Focus;
  tag: Tag[];
  author?: Author;
};

export type Tag = {
  text: string;
};

export type Person = {
  id: number;
  name: string;
};

export type Focus = {
  place: Geometry;
  text: string;
};