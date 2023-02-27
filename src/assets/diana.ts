import axios from "axios";
import type { ListResponse, MapResponse } from "@/types/diana";

export const DIANA_BASE = "https://diana.dh.gu.se/api/";

export class DianaClient {
  project: string;

  constructor(project: string) {
    this.project = project;
  }

  async list<T>(type: string, params?: object): Promise<ListResponse<T>> {
    const response = await axios.get<ListResponse<T>>(
      DIANA_BASE + `${this.project}/${type}`,
      { params }
    );
    return response.data;
  }

  async map<T>(type: string, params?: object): Promise<MapResponse<T>> {
    const response = await axios.get<MapResponse<T>>(
      DIANA_BASE + `${this.project}/${type}`,
      { params }
    );
    return response.data;
  }

  async get<T>(type: string, id: string | number): Promise<T> {
    const response = await axios.get<T>(
      DIANA_BASE + `${this.project}/${type}/${id}`
    );
    return response.data;
  }
}
