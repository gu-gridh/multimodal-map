// For local development run with VITE_API_BASE=http://localhost:8000
const API_BASE = import.meta.env.VITE_API_BASE || 'https://maritime-encounters.dh.gu.se';

const API_ENDPOINTS = {
    BASE: API_BASE,
    PLACE: `${API_BASE}/api/resources/geojson/site/`,
    SEARCH: `${API_BASE}/api/resources/search/`,
    MAP_SITES: `${API_BASE}/api/resources/map_sites/`,
    SITE_TYPES: `${API_BASE}/api/resources/site_types/`,
    COMMON_SITES: `${API_BASE}/api/resources/common_sites/`,
    SITE_RESOURCES: `${API_BASE}/api/resources/site_resources/`,
    DATA: `${API_BASE}/api/resources/data/`,
    LOGIN: `${API_BASE}/login/`,
    ADMIN_PLACE: 'https://diana.dh.gu.se/admin/resources/place/',
};

// The server sits behind a proxy that reports http:// in pagination links;
// upgrade them only when the API itself is served over https.
export const secureUrl = (url) =>
    API_BASE.startsWith('https:') ? url.replace(/^http:/, 'https:') : url;

export default API_ENDPOINTS;
