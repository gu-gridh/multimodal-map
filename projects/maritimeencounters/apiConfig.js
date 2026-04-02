// Switch to 'http://localhost:8000' for local development
const API_BASE = 'https://maritime-encounters.dh.gu.se';

const API_ENDPOINTS = {
    BASE: API_BASE,
    PLACE: `${API_BASE}/api/resources/geojson/site/`,
    SEARCH: `${API_BASE}/api/resources/search/`,
    COMMON_SITES: `${API_BASE}/api/resources/common_sites/`,
    SITE_RESOURCES: `${API_BASE}/api/resources/site_resources/`,
    DATA: `${API_BASE}/api/resources/data/`,
    LOGIN: `${API_BASE}/login/`,
    ADMIN_PLACE: 'https://diana.dh.gu.se/admin/resources/place/',
};

export default API_ENDPOINTS;