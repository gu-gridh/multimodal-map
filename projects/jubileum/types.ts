import type { Project } from "@/types/project";
import type { Geometry } from "ol/geom";

export type JubileumProject = Project;

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
