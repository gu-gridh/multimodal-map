/**
 * Client for the new iconographia-backend (Django REST Framework).
 * Replaces the legacy digarv PHP endpoints (list.php, search.php, map.php...).
 */
import axios from "axios";

export const API_BASE = "https://iconographia2.dh.gu.se/api";
  //import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export class IconographiaClient {
  /** GET /api/<type>/ with DRF params (search, filters, page, size...). */
  async list(type, params = {}) {
    const response = await axios.get(`${API_BASE}/${type}/`, { params });
    return response.data;
  }

  /** GET /api/<type>/<id>/ */
  async get(type, id) {
    const response = await axios.get(`${API_BASE}/${type}/${id}/`);
    return response.data;
  }

  /** GET /api/<type>/map/ -> GeoJSON FeatureCollection with per-place counts.
      Accepts the same filter params as list(). */
  async map(type, params = {}) {
    const response = await axios.get(`${API_BASE}/${type}/map/`, { params });
    return response.data;
  }

  /** GET /api/<type>/values/?field=<field> -> [{value, count}, ...] */
  async values(type, field, params = {}) {
    const response = await axios.get(`${API_BASE}/${type}/values/`, {
      params: { ...params, field },
    });
    return response.data;
  }
}

/* --- Image URL helpers (carried over from the legacy iconographia.config.js) */

/** Museum object photos are pyramid TIFFs served over IIIF. */
export const objectImageIIIF = (fileName) =>
  `https://img.dh.gu.se/art/pyr/${fileName.replace(".jpg", ".tif")}/info.json`;

export const objectImageThumb = (fileName) =>
  `https://img.dh.gu.se/art/pyr/${fileName.replace(
    ".jpg",
    ".tif"
  )}/full/300,/0/default.jpg`;

/** Iconographic Registry cards are plain JPEG scans. */
export const irImageUrl = (fileName) =>
  `https://data.dh.gu.se/iconographic/${fileName.replace(".tif", ".jpg")}`;

export const irImageThumb = (fileName) =>
  `https://data.dh.gu.se/iconographic/thumbs/${fileName.replace(
    ".tif",
    ".jpg"
  )}`;

/* --- Label helpers (carried over from the legacy assets/iconographia.js) --- */

/** foo -> Foo */
export const titleCase = (str) =>
  str && str[0].toUpperCase() + str.slice(1);

/** Format a title from the NL-separated list of keyword + image ids. */
export const motiveTitle = (motive) =>
  titleCase(
    (motive || "")
      .split("\n")
      .map((m) => m.replace(/\s+[\d:]+/, ""))
      .filter((t) => t !== "helhet")
      .join(", ")
      .split(", ")
      .filter((x, i, xs) => xs.indexOf(x) == i) // unique
      .slice(0, 3)
      .join(", ")
  );

/** Display title for a museum object record. */
export const objectTitle = (record) =>
  record.titel || motiveTitle(record.motiv) || record.label;

/** Display title for a registry card record. */
export const irMotiveTitle = (record) =>
  record.motif2 || record.motif1 || record.label;
