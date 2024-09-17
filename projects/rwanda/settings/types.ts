import type { Project } from "@/types/project";
import type { Geometry } from "ol/geom";

export type RwandaProject = Project & {
  urls: Record<string, string>;
};

export type Image = {
  id: number;
  uuid: string;
  file: string;
  iiif_file: string;
  title: string;
  description: string;
  informants: any;
  place_of_interest: any
};

interface PlaceType {
  id?: number;
  created_at: string;
  updated_at: string;
  published: boolean;
  text: string;
}

interface Informant {
  id?: number;
  created_at: string;
  updated_at: string;
  published: boolean;
  gender: string;
  custom_id: string;
  age: string;
  note: string;
}

interface Language {
  id: number;
  created_at: string;
  updated_at: string;
  published: true;
  name: string;
  abbreviation: string;
}

interface Name {
  id?: number;
  created_at: string;
  updated_at: string;
  published: boolean;
  informants: Array<Informant>;
  languages: Array<Language>;
  referent: number;
  text: string;
  note: string;
}

interface Place {
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

interface Interview {
  id?: number;
  created_at: string;
  updated_at: string;
  published: boolean;
  title: string;
  place_of_interest: number;
  text: string;
  authors: Array<Informant>;
  informants: Array<Informant>;
} 

interface Document {
  id?: number;
  authors: any;
  filename: string;
  informants: Array<Informant>;
  place_of_interest: number;
  published: boolean;
  text: string;
  title: string;
}

export type { Place, PlaceType, Name, Informant, Language, Interview, Document };
