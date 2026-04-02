<script setup>
import { ref, onMounted, defineProps, toRaw, watch, nextTick, computed } from "vue";
import L from "leaflet";
import "leaflet.markercluster";
import { mapStore } from "@/stores/store";
import { maritimeencountersStore } from "./store";
import API_ENDPOINTS from "./apiConfig";
import { storeToRefs } from "pinia";
import markerIcon from "@/assets/marker-white.svg";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet.heat";
import alandData from './polygons/aland_simplified.json';
import belgiumData from './polygons/belgium_simplified.json';
import czechData from './polygons/czech_simplified.json';
import denmarkData from './polygons/denmark_simplified.json';
import finlandData from './polygons/finland_simplified.json';
import franceData from './polygons/france_simplified.json';
import germanyData from './polygons/germany_simplified.json';
import irelandData from './polygons/ireland_simplified.json';
import netherlandsData from './polygons/netherlands_simplified.json';
import norwayData from './polygons/norway_simplified.json';
import polandData from './polygons/poland_simplified.json';
import portugalData from './polygons/portugal_simplified.json';
import russiaData from './polygons/russia_simplified.json';
import spainData from './polygons/spain_simplified.json';
import swedenData from './polygons/sweden_simplified.json';
import ukData from './polygons/uk_simplified.json';

(window).type = true;

const map = ref(null);
const markerClusterGroup = ref(null);
const layerGroupMap = ref({});
const fetchedIds = new Set();
const { selectedFeature } = storeToRefs(mapStore());
const store = maritimeencountersStore();
const { startRectangleDraw, showHeatMap, doneFetching, compareMode, commonSitesData, clusterRadius } = storeToRefs(store);
const isLoading = ref(false);
const showDownloadChoice = ref(false);
const drawnRectangleBounds = ref(null);
const drawnRectangleLayer = ref(null);
const drawnItems = ref(null);

//Heatmap
const heatmapLayer = ref(null);
const heatmapPoints = ref([]);

// Compare mode layers
const compareMarkerGroup = ref(null);
const compareAreaGroup = ref(null);

let hoverPopup = ref(null);
let polylineLayer = ref(null);
let abortController = null;
let compareAbortController = null;
let rectangleDrawer = null;

// Resource type color mapping for compare mode
const RESOURCE_COLORS = {
  'radiocarbon_dates': '#e74c3c',
  'individual_samples': '#3498db',
  'dna_samples': '#2ecc71',
  'metal_analysis': '#f39c12',
  'landing_points': '#9b59b6',
  'new_samples': '#1abc9c',
  'lnhouses': '#e67e22',
  'boats': '#2980b9',
};

const RESOURCE_LABELS = {
  'radiocarbon_dates': 'Radiocarbon',
  'individual_samples': 'Samples',
  'dna_samples': 'DNA',
  'metal_analysis': 'Metal',
  'landing_points': 'Landing',
  'new_samples': 'New Samples',
  'lnhouses': 'Houses',
  'boats': 'Boats',
};

const props = defineProps({
  mapOptions: {
    type: Object,
    default: () => ({
      center: [51.505, -0.09],
      zoom: 3,
    }),
  },
  params: {
    type: Object,
    default: () => ({}),
  },
  compareParams: {
    type: Object,
    default: null,
  },
  showConnections: {
    type: Boolean,
    default: false,
  },
});

// Computed: active resource types from compare selection (for legend)
const activeCompareTypes = computed(() => {
  if (!props.compareParams || !props.compareParams.type) return [];
  return props.compareParams.type.split(',');
});

function clearMarkerClusterLayersInBatches() {
  const layers = toRaw(markerClusterGroup.value)?.getLayers();
  if (layers && layers.length > 0) {
    const batchSize = 1000;
    let index = 0;

    function removeNextBatch() {
      const batch = layers.slice(index, index + batchSize);
      toRaw(markerClusterGroup.value)?.removeLayers(batch);
      index += batchSize;
      if (index < layers.length) {
        setTimeout(removeNextBatch, 0);
      }
    }

    removeNextBatch();
  }
}

//draw polygons for each country
const renderGeoJSON = (geojsonArray) => {
  geojsonArray.forEach((geojsonItem) => {
    const { name, data, id } = geojsonItem;

    const geoJSONLayer = L.geoJSON(data, {
      style: {
        color: "#ff7800",
        weight: 2,
        opacity: 0.0, //initially hidden
      },
    });

    const layerGroup = L.layerGroup([geoJSONLayer]);

    //add hover event listeners to each polygon
    geoJSONLayer.eachLayer((layer) => {
      const polygon = layer;

      polygon.on('mouseover', () => {
        polygon.setStyle({
          opacity: 0.65, //show polygon on hover
        });
      });

      polygon.on('mouseout', () => {
        polygon.setStyle({
          opacity: 0, //hide polygon when not hovering
        });
      });

      //when clicking on the polygon clear the markers and fetch new data
      polygon.on('click', async () => {
        const bounds = polygon.getBounds();
        toRaw(map.value)?.fitBounds(bounds, {
          padding: [20, 20],
          maxZoom: 8,
        });
      });
    });

    layerGroup.addTo(toRaw(map.value));
    layerGroupMap.value[name] = layerGroup;
  });
};

const waitForAuthToken = () => {
  return new Promise((resolve) => {
    const checkToken = () => {
      const token = sessionStorage.getItem("authToken");
      if (token) {
        resolve(token);
      } else {
        setTimeout(checkToken, 100);
      }
    };
    checkToken();
  });
};

//draw the markers on the map
const fetchData = async (initialUrl, params) => {
  if (abortController) {
    abortController.abort();
    console.log("Previous fetch aborted");
  }

  isLoading.value = true; //show spinner 
  abortController = new AbortController();
  const signal = abortController.signal;

  return new Promise(async (resolve, reject) => {
    let nextUrl = initialUrl;
    let initialParams = new URLSearchParams({ ...params }).toString();
    if (nextUrl && initialParams) {
      nextUrl = `${nextUrl}?${initialParams}`;
    }

    const token = await waitForAuthToken();

    while (nextUrl) {
      try {
        const res = await fetch(nextUrl.replace(/^http:/, "https:"), {
          signal, headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch data");

        const data = await res.json();

        const markersToAdd = [];
        data.features.forEach((feature) => {
          const featureId = feature.id;

          if (fetchedIds.has(featureId)) return;

          fetchedIds.add(featureId); //add id to set to prevent duplicates

          if (feature.geometry && feature.geometry.coordinates && feature.geometry.coordinates.length === 2) {
            const coords = feature.geometry.coordinates;
            if (!isNaN(coords[0]) && !isNaN(coords[1])) {
              const latLng = L.latLng(coords[1], coords[0]);

              const intensity = 1.5; //default intensity
              heatmapPoints.value.push([coords[1], coords[0], intensity]);

              const marker = L.marker(latLng, {
                icon: L.icon({
                  iconUrl: markerIcon,
                  iconSize: [30, 45],
                }),
              });

              marker.on("click", () => {
                selectedFeature.value = featureId;
              });

              marker.on("mouseover", () => {
                if (hoverPopup.value) {
                  toRaw(map.value)?.closePopup(toRaw(hoverPopup.value));
                }

                hoverPopup.value = L.popup({
                  closeButton: false,
                  offset: L.point(0, -30),
                })
                  .setLatLng(latLng)
                  .setContent(
                    `<b>Name:</b> ${feature.properties.name}<br><b>Coordinates:</b> ${coords[1].toFixed(6)}, ${coords[0].toFixed(6)}`
                  )
                  .openOn(toRaw(map.value));

                marker.on("mouseout", () => {
                  toRaw(map.value)?.closePopup(toRaw(hoverPopup.value));
                  hoverPopup.value = null;
                });
              });

              markersToAdd.push(marker);
            }
          }
        });

        toRaw(markerClusterGroup.value)?.addLayers(markersToAdd);

        nextUrl = data.next ? data.next.replace(/^http:/, "https:") : null;
      } catch (err) {
        if (err.name === "AbortError") {
          console.log("Fetch request was aborted");
          return;  //if fetch is aborted
        } else {
          console.error("Error fetching data:", err);
          reject(err);
        }
      }
    }

    if (heatmapLayer.value && heatmapLayer.value._map) {
      heatmapLayer.value.setLatLngs(heatmapPoints.value);
    }
    isLoading.value = false; //hide spinner
    resolve(); //when all pages are processed
    abortController = null;
  });
};

//for downloading site data
const fetchAllSites = async (initialUrl) => {
  let allData = [];
  let nextUrl = initialUrl;

  isLoading.value = true; //show the spinner
  const token = sessionStorage.getItem("authToken");

  while (nextUrl) {
    try {
      const res = await fetch(nextUrl.replace(/^http:/, "https:"), {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch data");
      const data = await res.json();
      allData = allData.concat(data.features);
      nextUrl = data.next ? data.next.replace(/^http:/, "https:") : null;
    } catch (err) {
      console.error("Error fetching data:", err);
      throw err;
    }
  }

  isLoading.value = false; //hide the spinner
  return allData;
};

//download the data as a JSON file
const downloadJSON = (data, filename) => {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
};

const handleDownloadChoice = async (format) => {
  showDownloadChoice.value = false;

  if (!drawnRectangleBounds.value) return;

  const bounds = drawnRectangleBounds.value;
  const southWest = bounds.getSouthWest();
  const northEast = bounds.getNorthEast();
  const bboxString = `${southWest.lng},${southWest.lat},${northEast.lng},${northEast.lat}`;
  const token = await waitForAuthToken();

  if (drawnRectangleLayer.value && drawnItems.value) {
    drawnItems.value.removeLayer(drawnRectangleLayer.value);
    drawnRectangleLayer.value = null;
  }
  drawnRectangleBounds.value = null;

  const baseUrl = API_ENDPOINTS.DATA;
  const queryParams = {
    download_format: format,
    in_bbox: bboxString,
    ...props.params,
  };

  let downloadUrl = `${baseUrl}?${new URLSearchParams(queryParams).toString()}`;

  if (format === "csv") {
    if (!token) {
      console.error("No auth token found");
      return;
    }

    try {
      const res = await fetch(downloadUrl, {
        headers: {
          Authorization: `Token ${token}`,
          Accept: "application/zip"
        }
      });

      if (!res.ok) {
        const msg = await res.text();
        console.error("CSV Download Error:", res.status, msg);
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "exported_csv.zip";
      document.body.appendChild(a);
      a.click();
      a.remove();

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("error downloading CSV:", err);
    }

    return;
  } else if (format === "json") {
    try {
      const res = await fetch(downloadUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        }
      });

      if (!res.ok) throw new Error("failed to fetch JSON data");

      const jsonData = await res.json();

      //for each key in the JSON response, trigger a separate file download.
      let delay = 0;
      for (const key in jsonData) {
        if (Object.prototype.hasOwnProperty.call(jsonData, key)) {
          const fileData = jsonData[key];
          const filename = key.toLowerCase() + ".json";
          setTimeout(() => {
            downloadJSON(fileData, filename);
          }, delay);
          delay += 500;
        }
      }
    } catch (error) {
      console.error("error fetching JSON data.", error);
    }
  }
};

watch(
  () => props.params,
  async (newParams) => {
    // Skip normal fetch when in compare mode
    if (compareMode.value || !newParams) return;

    doneFetching.value = false;

    if (!map.value) {
      await nextTick();
    }
    if (!map.value) {
      console.error("Map is not initialized yet.");
      return;
    }

    //clear existing data
    fetchedIds.clear();
    clearMarkerClusterLayersInBatches();
    heatmapPoints.value = [];
    if (heatmapLayer.value && heatmapLayer.value._map) {
      heatmapLayer.value.setLatLngs([]);
    }

    const baseUrl = API_ENDPOINTS.SEARCH;

    await fetchData(baseUrl, { page_size: 500, ...newParams })
      .then(() => {
        doneFetching.value = true;
      })
      .catch((err) => {
        console.error("Error during fetching:", err);
      });
  }
);

watch(() => props.showConnections, (newVal) => { //clear lines when showConnections is off
  if (!newVal && polylineLayer.value) {
    toRaw(polylineLayer.value)?.clearLayers();
  }
});

watch( //Download the data
  () => startRectangleDraw.value,
  (newVal) => {
    if (newVal && rectangleDrawer) {
      rectangleDrawer.enable();
      store.startRectangleDraw = false;
    }
  }
);

watch( //toggle visibility between heatmap and marker clusters
  () => showHeatMap.value,
  (newVal) => {
    if (newVal) {
      //show heatmap layer
      if (heatmapLayer.value) {
        if (map.value && !toRaw(map.value).hasLayer(toRaw(heatmapLayer.value))) {
          toRaw(map.value).addLayer(toRaw(heatmapLayer.value));
        }
        toRaw(heatmapLayer.value).setLatLngs(heatmapPoints.value);
      }
      //hide marker clusters
      if (
        map.value &&
        markerClusterGroup.value &&
        toRaw(map.value).hasLayer(toRaw(markerClusterGroup.value))
      ) {
        toRaw(map.value).removeLayer(toRaw(markerClusterGroup.value));
      }
    } else {
      //hide heatmap layer
      if (heatmapLayer.value) {
        if (map.value && toRaw(map.value).hasLayer(toRaw(heatmapLayer.value))) {
          toRaw(map.value).removeLayer(toRaw(heatmapLayer.value));
        }
      }

      //show marker clusters
      if (
        map.value &&
        markerClusterGroup.value &&
        !toRaw(map.value).hasLayer(toRaw(markerClusterGroup.value))
      ) {
        toRaw(map.value).addLayer(toRaw(markerClusterGroup.value));
      }
    }
  }
);

// === COMPARE MODE FUNCTIONS === //

function createCompareMarkerIcon(resourceCounts) {
  const types = Object.keys(resourceCounts);
  const total = types.length;
  const size = 32 + (total * 4);
  
  // Create colored segments for each resource type
  const segments = types.map((type, i) => {
    const color = RESOURCE_COLORS[type] || '#666';
    const angle = (360 / total) * i;
    const endAngle = (360 / total) * (i + 1);
    return `<path d="${describeArc(size/2, size/2, size/2 - 2, angle, endAngle)}" fill="${color}" stroke="white" stroke-width="1"/>`;
  }).join('');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    ${segments}
    <circle cx="${size/2}" cy="${size/2}" r="${size/4}" fill="white" stroke="#333" stroke-width="1"/>
    <text x="${size/2}" y="${size/2 + 4}" text-anchor="middle" font-size="11" font-weight="bold" fill="#333">${total}</text>
  </svg>`;

  return L.divIcon({
    html: svg,
    className: 'compare-marker-icon',
    iconSize: [size, size],
    iconAnchor: [size/2, size/2],
  });
}

// SVG arc path helper
function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
}

function polarToCartesian(cx, cy, r, angleDeg) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180.0;
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  };
}

// Haversine distance in km
function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Cluster nearby sites and return cluster groups
function clusterSites(features, radiusKm) {
  const points = features.map(f => ({
    lat: f.geometry.coordinates[1],
    lng: f.geometry.coordinates[0],
    feature: f,
  }));

  const visited = new Set();
  const clusters = [];

  for (let i = 0; i < points.length; i++) {
    if (visited.has(i)) continue;
    
    const cluster = [points[i]];
    visited.add(i);

    for (let j = i + 1; j < points.length; j++) {
      if (visited.has(j)) continue;
      
      // Check if point j is within radius of any point in current cluster
      const isNear = cluster.some(cp => 
        haversineDistance(cp.lat, cp.lng, points[j].lat, points[j].lng) <= radiusKm
      );

      if (isNear) {
        cluster.push(points[j]);
        visited.add(j);
      }
    }

    if (cluster.length >= 2) {
      clusters.push(cluster);
    }
  }

  return clusters;
}

function clearCompareLayers() {
  if (compareMarkerGroup.value) {
    toRaw(compareMarkerGroup.value).clearLayers();
  }
  if (compareAreaGroup.value) {
    toRaw(compareAreaGroup.value).clearLayers();
  }
}

function buildComparePopupContent(feature) {
  const props = feature.properties;
  const counts = props.resource_counts || {};
  const typeBadges = Object.entries(counts).map(([type, count]) => {
    const color = RESOURCE_COLORS[type] || '#666';
    const label = RESOURCE_LABELS[type] || type;
    return `<span style="display:inline-block;padding:2px 8px;margin:2px;border-radius:10px;background:${color};color:white;font-size:11px;">${label}: ${count}</span>`;
  }).join('');

  return `<div style="min-width:160px">
    <b>${props.name || 'Unknown Site'}</b><br/>
    <div style="margin-top:4px">${typeBadges}</div>
  </div>`;
}

async function fetchCommonSites(params) {
  if (compareAbortController) {
    compareAbortController.abort();
  }
  compareAbortController = new AbortController();
  const signal = compareAbortController.signal;

  isLoading.value = true;
  store.commonSitesLoading = true;

  const token = await waitForAuthToken();
  const queryString = new URLSearchParams({ page_size: 500, ...params }).toString();
  let allFeatures = [];
  let nextUrl = `${API_ENDPOINTS.COMMON_SITES}?${queryString}`;
  console.log('Fetching common sites:', nextUrl);

  try {
    while (nextUrl) {
      const res = await fetch(nextUrl.replace(/^http:/, "https:"), {
        signal,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error(`Common sites API error ${res.status}:`, errorText);
        throw new Error(`Failed to fetch common sites: ${res.status}`);
      }

      const data = await res.json();
      console.log('Common sites response:', { 
        count: data.count, 
        featuresInPage: data.features?.length, 
        next: data.next 
      });
      
      if (data.features) {
        allFeatures = allFeatures.concat(data.features);
      }
      nextUrl = data.next ? data.next.replace(/^http:/, "https:") : null;
    }

    console.log(`Common sites total: ${allFeatures.length} features found`);

    const geoJsonData = {
      type: "FeatureCollection",
      features: allFeatures,
    };

    store.commonSitesData = geoJsonData;
    renderCompareResults(geoJsonData);
  } catch (err) {
    if (err.name !== "AbortError") {
      console.error("Error fetching common sites:", err);
    }
  } finally {
    isLoading.value = false;
    store.commonSitesLoading = false;
    compareAbortController = null;
  }
}

function renderCompareResults(geoJson) {
  if (!map.value) return;

  clearCompareLayers();

  const features = geoJson.features || [];
  if (features.length === 0) return;

  // Add markers for each common site
  features.forEach(feature => {
    if (!feature.geometry || !feature.geometry.coordinates) return;
    const [lng, lat] = feature.geometry.coordinates;
    if (isNaN(lat) || isNaN(lng)) return;

    const resourceCounts = feature.properties.resource_counts || {};
    const icon = createCompareMarkerIcon(resourceCounts);

    const marker = L.marker([lat, lng], { icon });

    marker.on("click", () => {
      selectedFeature.value = feature.id;
    });

    marker.on("mouseover", () => {
      if (hoverPopup.value) {
        toRaw(map.value)?.closePopup(toRaw(hoverPopup.value));
      }
      hoverPopup.value = L.popup({
        closeButton: false,
        offset: L.point(0, -20),
        maxWidth: 300,
      })
        .setLatLng([lat, lng])
        .setContent(buildComparePopupContent(feature))
        .openOn(toRaw(map.value));
    });

    marker.on("mouseout", () => {
      toRaw(map.value)?.closePopup(toRaw(hoverPopup.value));
      hoverPopup.value = null;
    });

    toRaw(compareMarkerGroup.value)?.addLayer(marker);
  });

  // Cluster and highlight areas
  renderAreaHighlights(features);
}

function renderAreaHighlights(features) {
  if (!map.value || !compareAreaGroup.value) return;

  const radiusKm = clusterRadius.value;
  const clusters = clusterSites(features, radiusKm);

  clusters.forEach((cluster, idx) => {
    // Compute centroid of the cluster
    const avgLat = cluster.reduce((s, p) => s + p.lat, 0) / cluster.length;
    const avgLng = cluster.reduce((s, p) => s + p.lng, 0) / cluster.length;

    // Compute max distance from centroid to any point for the highlight radius
    let maxDist = 0;
    cluster.forEach(p => {
      const d = haversineDistance(avgLat, avgLng, p.lat, p.lng);
      if (d > maxDist) maxDist = d;
    });
    // Minimum visible radius of 5km, add padding
    const highlightRadius = Math.max(maxDist * 1.3, 5) * 1000; // meters

    // Create a convex hull polygon if 3+ points, otherwise a circle
    if (cluster.length >= 3) {
      const hullPoints = computeConvexHull(cluster.map(p => [p.lat, p.lng]));
      const polygon = L.polygon(hullPoints, {
        color: '#e74c3c',
        weight: 2,
        opacity: 0.6,
        fillColor: '#e74c3c',
        fillOpacity: 0.1,
        dashArray: '5,5',
      });

      polygon.bindTooltip(`${cluster.length} common sites in this area`, {
        sticky: true,
        className: 'compare-area-tooltip',
      });

      toRaw(compareAreaGroup.value)?.addLayer(polygon);
    }

    // Also add a circle to show the general area
    const circle = L.circle([avgLat, avgLng], {
      radius: highlightRadius,
      color: '#3498db',
      weight: 1.5,
      opacity: 0.4,
      fillColor: '#3498db',
      fillOpacity: 0.07,
    });

    circle.bindTooltip(`${cluster.length} common sites within ${Math.round(maxDist || radiusKm)} km`, {
      sticky: true,
      className: 'compare-area-tooltip',
    });

    toRaw(compareAreaGroup.value)?.addLayer(circle);
  });
}

// Simple convex hull (Graham scan)
function computeConvexHull(points) {
  if (points.length < 3) return points;

  // Find lowest point (min lat, then min lng)
  let lowest = 0;
  for (let i = 1; i < points.length; i++) {
    if (points[i][0] < points[lowest][0] || 
        (points[i][0] === points[lowest][0] && points[i][1] < points[lowest][1])) {
      lowest = i;
    }
  }
  [points[0], points[lowest]] = [points[lowest], points[0]];
  const pivot = points[0];

  const sorted = points.slice(1).sort((a, b) => {
    const angleA = Math.atan2(a[0] - pivot[0], a[1] - pivot[1]);
    const angleB = Math.atan2(b[0] - pivot[0], b[1] - pivot[1]);
    return angleA - angleB;
  });

  const hull = [pivot, sorted[0]];
  for (let i = 1; i < sorted.length; i++) {
    while (hull.length > 1 && cross(hull[hull.length - 2], hull[hull.length - 1], sorted[i]) <= 0) {
      hull.pop();
    }
    hull.push(sorted[i]);
  }
  return hull;
}

function cross(o, a, b) {
  return (a[1] - o[1]) * (b[0] - o[0]) - (a[0] - o[0]) * (b[1] - o[1]);
}

// Watch compare mode toggle
watch(
  () => compareMode.value,
  (isCompare) => {
    if (!map.value) return;
    
    if (isCompare) {
      // Hide normal markers, show compare layers
      if (markerClusterGroup.value && toRaw(map.value).hasLayer(toRaw(markerClusterGroup.value))) {
        toRaw(map.value).removeLayer(toRaw(markerClusterGroup.value));
      }
      if (heatmapLayer.value && toRaw(map.value).hasLayer(toRaw(heatmapLayer.value))) {
        toRaw(map.value).removeLayer(toRaw(heatmapLayer.value));
      }
      if (!toRaw(map.value).hasLayer(toRaw(compareMarkerGroup.value))) {
        toRaw(map.value).addLayer(toRaw(compareMarkerGroup.value));
      }
      if (!toRaw(map.value).hasLayer(toRaw(compareAreaGroup.value))) {
        toRaw(map.value).addLayer(toRaw(compareAreaGroup.value));
      }
    } else {
      // Restore normal markers, remove compare layers
      clearCompareLayers();
      if (compareMarkerGroup.value && toRaw(map.value).hasLayer(toRaw(compareMarkerGroup.value))) {
        toRaw(map.value).removeLayer(toRaw(compareMarkerGroup.value));
      }
      if (compareAreaGroup.value && toRaw(map.value).hasLayer(toRaw(compareAreaGroup.value))) {
        toRaw(map.value).removeLayer(toRaw(compareAreaGroup.value));
      }
      if (markerClusterGroup.value && !toRaw(map.value).hasLayer(toRaw(markerClusterGroup.value))) {
        toRaw(map.value).addLayer(toRaw(markerClusterGroup.value));
      }
      store.commonSitesData = null;
    }
  }
);

// Watch compare params changes
watch(
  () => props.compareParams,
  async (newParams) => {
    if (!newParams || !map.value) {
      clearCompareLayers();
      return;
    }
    await fetchCommonSites(newParams);
  }
);

// Watch cluster radius changes to re-render area highlights
watch(
  () => clusterRadius.value,
  () => {
    if (compareMode.value && commonSitesData.value && commonSitesData.value.features) {
      if (compareAreaGroup.value) {
        toRaw(compareAreaGroup.value).clearLayers();
      }
      renderAreaHighlights(commonSitesData.value.features);
    }
  }
);

onMounted(async () => {
  const token = await waitForAuthToken();

  if (token) {
    map.value = L.map("map", {
      zoomAnimation: true,
      fadeAnimation: true,
      markerZoomAnimation: true,
    }).setView([58.0, 12.0], 9); //gothenburg

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      minZoom: 3,
    }).addTo(toRaw(map.value));

    drawnItems.value = L.featureGroup().addTo(toRaw(map.value));
    const drawControl = new L.Control.Draw({
      draw: {
        marker: false,
        circle: false,
        circlemarker: false,
        polygon: false,
        polyline: false,
        rectangle: false,
      }
    });

    toRaw(map.value)?.addControl(drawControl);

    rectangleDrawer = new L.Draw.Rectangle(toRaw(map.value), drawControl.options.draw.rectangle);

    toRaw(map.value)?.on(L.Draw.Event.CREATED, (e) => {
      const layerType = e.layerType;
      const layer = e.layer;

      if (layerType === "rectangle") {
        drawnRectangleLayer.value = layer;
        drawnRectangleBounds.value = layer.getBounds();
        showDownloadChoice.value = true;
        drawnItems.value?.addLayer(e.layer);
      }
    });

    const geojsonFiles = [
      { name: "Denmark", data: denmarkData, id: "2" },
      { name: "Sweden", data: swedenData, id: "10" },
      { name: "Germany", data: germanyData, id: "1" },
      { name: "Norway", data: norwayData, id: "7" },
      { name: "Finland", data: finlandData, id: "4" },
      { name: "UK", data: ukData, id: "6" },
      { name: "Portugal", data: portugalData, id: "9" },
      { name: "Poland", data: polandData, id: "8" },
      { name: "Ireland", data: irelandData, id: "11" },
      { name: "France", data: franceData, id: "5" },
      { name: "Netherlands", data: netherlandsData, id: "16" },
      { name: "Belgium", data: belgiumData, id: "15" },
      { name: "Czech", data: czechData, id: "13" },
      { name: "Aland", data: alandData, id: "14" },
      { name: "Russia", data: russiaData, id: "12" },
      { name: "Spain", data: spainData, id: "3" },
    ];

    renderGeoJSON(geojsonFiles);

    markerClusterGroup.value = L.markerClusterGroup({
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: true,
      zoomToBoundsOnClick: true,
      maxClusterRadius: 100,
      chunkedLoading: true,
      iconCreateFunction: function (cluster) {
        const childCount = cluster.getChildCount();
        let c = ' marker-cluster-';

        if (childCount < 10) {
          c += 'small';
        } else if (childCount < 100) {
          c += 'medium';
        } else {
          c += 'large';
        }

        return L.divIcon({
          html: '<div><span>' + childCount + '</span></div>',
          className: 'marker-cluster' + c,
          iconSize: new L.Point(40, 40),
        });
      },
    });

    // Override _getExpandedVisibleBounds to limit to current map bounds
    markerClusterGroup.value._getExpandedVisibleBounds = function () {
      const rawThis = toRaw(this);
      return rawThis._map.getBounds();
    };

    //initialize heatmap layer
    heatmapLayer.value = L.heatLayer(heatmapPoints.value, { radius: 25 });

    // Initialize compare mode layers
    compareMarkerGroup.value = L.layerGroup();
    compareAreaGroup.value = L.layerGroup();

    toRaw(map.value)?.addLayer(toRaw(markerClusterGroup.value));

    //fetch bounding box
    const bbox = toRaw(map.value)?.getBounds().toBBoxString();
    const urlWithBBox = `${API_ENDPOINTS.SEARCH}?in_bbox=${bbox}&page_size=100`;

    //fetch the full dataset after bounding box
    fetchData(urlWithBBox, {})
      .then(() => {
        return fetchData(`${API_ENDPOINTS.SEARCH}?page_size=1000`, {});
      })
      .then(() => {
        doneFetching.value = true;
      })
      .catch((err) => {
        console.error("Error during fetching:", err);
      });

    //close any active hover popup before zooming
    toRaw(map.value)?.on('zoomstart', () => {
      if (hoverPopup.value) {
        toRaw(map.value)?.closePopup(toRaw(hoverPopup.value));
        hoverPopup.value = null;
      }
    });
  }
});
</script>

<template>
  <div id="map" style="width: 100%; height: 100vh;"></div>
  <div v-if="isLoading" class="download-spinner">
    <img src="@/assets/interface/bars-rotate-fade.svg" alt="Loading..." />
  </div>

  <!-- Compare Mode Legend -->
  <div v-if="compareMode && activeCompareTypes.length > 0" class="compare-legend">
    <div class="compare-legend-title">Resource Types</div>
    <div v-for="type in activeCompareTypes" :key="type" class="compare-legend-item">
      <span class="compare-legend-dot" :style="{ background: RESOURCE_COLORS[type] }"></span>
      <span class="compare-legend-label">{{ RESOURCE_LABELS[type] }}</span>
    </div>
    <div class="compare-legend-divider"></div>
    <div class="compare-legend-item">
      <span class="compare-legend-dot" style="background: #3498db; opacity: 0.5;"></span>
      <span class="compare-legend-label">Cluster area</span>
    </div>
    <div v-if="commonSitesData && commonSitesData.features" class="compare-legend-count">
      {{ commonSitesData.features.length }} common site{{ commonSitesData.features.length !== 1 ? 's' : '' }} found
    </div>
    <div v-else-if="isLoading" class="compare-legend-count">Loading...</div>
  </div>

  <!-- Download Choice -->
  <div v-if="showDownloadChoice" class="download-choice-modal">
    <div class="modal-content">
      <h3>Select Download Format</h3>
      <button @click="handleDownloadChoice('csv')">CSV</button>
      <button @click="handleDownloadChoice('json')">JSON</button>
    </div>
  </div>
</template>

<style scoped>
.download-spinner {
  position: absolute;
  top: 10px;
  right: 0px;
  width: 50px;
  height: 50px;
  z-index: 9999;
}

/* Small Clusters */
:deep(.marker-cluster-small) {
  background-color: #dddddd !important;
  /* outer circle color */
}

:deep(.marker-cluster-small div) {
  background-color: #d0d0d0 !important;
  /* inner circle color */
}

/* Medium Clusters */
:deep(.marker-cluster-medium) {
  background-color: rgba(166, 189, 219, 0.6) !important;
  /* outer circle color */
}

:deep(.marker-cluster-medium div) {
  background-color: rgba(140, 165, 200, 0.6) !important;
  /* inner circle color */
}

/* Large Clusters */
:deep(.marker-cluster-large) {
  background-color: #6aa7c5 !important;
  /* outer circle color */
}

:deep(.marker-cluster-large div) {
  background-color: #2b8cbe !important;
  /* inner circle color */
}

.download-choice-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.modal-content h3 {
  margin-bottom: 20px;
}

.modal-content button {
  margin: 10px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background: var(--theme-3);
  color: white;
  font-size: 16px;
}

.modal-content button:hover {
  background: var(--theme-4);
}

/* Compare Mode Styles */
:deep(.compare-marker-icon) {
  background: none !important;
  border: none !important;
}

.compare-legend {
  position: absolute;
  bottom: 80px;
  right: 20px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-radius: 10px;
  padding: 12px 16px;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  min-width: 140px;
}

.compare-legend-title {
  font-weight: 600;
  font-size: 13px;
  margin-bottom: 8px;
  color: #333;
}

.compare-legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 4px 0;
}

.compare-legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.compare-legend-label {
  font-size: 12px;
  color: #555;
}

.compare-legend-divider {
  height: 1px;
  background: #ddd;
  margin: 8px 0;
}

.compare-legend-count {
  font-size: 11px;
  color: #888;
  margin-top: 6px;
  text-align: center;
}

:deep(.compare-area-tooltip) {
  background: rgba(52, 152, 219, 0.9) !important;
  color: white !important;
  border: none !important;
  border-radius: 6px !important;
  font-size: 12px !important;
  padding: 4px 8px !important;
}

:deep(.compare-area-tooltip::before) {
  border-top-color: rgba(52, 152, 219, 0.9) !important;
}
</style>