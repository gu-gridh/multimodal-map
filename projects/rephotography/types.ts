import type { Project } from "@/types/project";
import type { Geometry } from "ol/geom";

export type RephotographyProject = Project & {
  timeRange: [number, number];
};

export type Image = {
  published: boolean;
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

export type Rephotography = {
  published: boolean;
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
  uuid: string;
  title: string;
  description: string;
  date: string;
  link: string;
  place: number;
  creator: number;
  focus: number;
  tag: number[];
};

export type VideoDeep = Omit<Video, "creator" | "place" | "focus" | "tag"> & {
  place: Place;
  creator: Person;
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
