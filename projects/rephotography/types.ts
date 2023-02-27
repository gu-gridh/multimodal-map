export interface Image {
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
}
