import axios from "axios";

export const SOPHIA_BASE = "https://saintsophia.dh.gu.se/api/";

export class SophiaClient {
  constructor(project) {
    this.project = project;
  }

  async list(type, params) {
    const response = await axios.get(`${SOPHIA_BASE}${this.project}/${type}/`, {
      params,
    });
    return response.data;
  }

  async listAll(type, params = {}, limit = 500) {
    params = { ...params, limit };
    const response = await axios.get(`${SOPHIA_BASE}${this.project}/${type}/`, {
      params,
    });
    return response.data.results;
  }

  async map(type, params) {
    const response = await axios.get(`${SOPHIA_BASE}${this.project}/${type}/`, {
      params,
    });
    return response.data;
  }

  async get(type, id, params) {
    const response = await axios.get(
      `${SOPHIA_BASE}${this.project}/${type}/${id}/`,
      { params }
    );
    return response.data;
  }
}
