import axios from "axios";
import type { ListResponse, MapResponse } from "@/types/diana";

export const MARITIMEENCOUNTERS_BASE = "https://maritime-encounters.dh.gu.se/api/";

export class MaritimeEncountersClient {
  project: string;

  constructor(project: string) {
    this.project = project;
  }

  async list<T>(type: string, params?: object): Promise<ListResponse<T>> {
    const response = await axios.get<ListResponse<T>>(
      MARITIMEENCOUNTERS_BASE + `${this.project}/${type}/`,
      { params }
    );
    return response.data;
  }

  async listAll<T>(
    type: string,
    params?: Record<any, any>,
    limit = 500
  ): Promise<T[]> {
    params = { ...params, limit };
    const response = await axios.get<ListResponse<T>>(
      MARITIMEENCOUNTERS_BASE + `${this.project}/${type}/`,
      { params }
    );
    return response.data.results;
  }

  async map<T>(type: string, params?: object): Promise<MapResponse<T>> {
    const response = await axios.get<MapResponse<T>>(
      MARITIMEENCOUNTERS_BASE + `${this.project}/${type}/`,
      { params }
    );
    return response.data;
  }

  async get<T>(type: string, id: string | number, params?: object): Promise<T> {
    const response = await axios.get<T>(
      MARITIMEENCOUNTERS_BASE + `${this.project}/${type}/${id}/`,
      { params }
    );
    return response.data;
  }
}
