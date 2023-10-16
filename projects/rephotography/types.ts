import type { Project } from "@/types/project";
import type { Geometry } from "ol/geom";

export type RephotographyProject = Project & {
  timeRange: [number, number];
};

export type Documentation = Image | Rephotography | Video;
export type DocumentationDeep = ImageDeep | RephotographyDeep | VideoDeep;

export type Image = {
  id: number;
  uuid: string;
  file: string;
  iiif_file: string;
  title: string;
  photographer: number;
  place: number;
  description: string;
  date: string;
  focus: number;
  tag: number[];
};

export type ImageDeep = Omit<
  Image,
  "photographer" | "place" | "focus" | "tag"
> & {
  photographer: Person;
  place: Place;
  focus: Focus;
  tag: Tag[];
};

export type Rephotography = {
  id: number;
  title: string;
  old_image: number;
  new_image: number;
};

export type RephotographyDeep = Omit<
  Rephotography,
  "old_image" | "new_image"
> & {
  old_image: ImageDeep;
  new_image: ImageDeep;
};

export type Video = {
  id: number;
  uuid: string;
  title: string;
  description: string;
  date: string;
  link: string;
  place: number;
  photographer: number;
  focus: number;
  tag: number[];
};

export type VideoDeep = Omit<
  Video,
  "photographer" | "place" | "focus" | "tag"
> & {
  place: Place;
  photographer: Person;
  focus: Focus;
  tag: Tag[];
};

export type Person = {
  id: number;
  name: string;
};

export type Place = {
  id: number;
  geometry: Geometry;
  name: string;
  description: string;
  comment: string;
  tag: Tag[];
};

export type Focus = {
  place: Geometry;
  text: string;
};

export type Tag = {
  text: string;
};

export type Observation = {
  published: boolean;
  title: string;
  creator: number;
  document: number | null;
  place: number;
  description: string;
  date: string;
  focus: number | null;
  tag: number[];
  id: number;
};

