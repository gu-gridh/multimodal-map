<template>
  <div class="map-container h-full">
    <div class="non-clickable absolute z-10 grid grid-cols-6 gap-4 mx-12 mt-8">
      <div class="col-span-2 flex flex-col divide-y">
        <div class="px-8 py-6 bg-white rounded-t-lg shadow-lg">
          <div
            class="font-display text-5xl leading-tight"
            v-html="config.name"
          ></div>
        </div>
        <div class="px-8 py-6 bg-white rounded-b-lg shadow-lg">
          <p class="text-gray-700 text-base" v-html="config.about"></p>
        </div>
        <div class="filter-container">
          <area-search id="button-wrapper" class="clickable"></area-search>

          <CategoryButtonList
            :categories="['Streets', 'Buildings', 'Areas']"
            class="my-2"
          />

          <RangeSlider :min="1700" :max="2022" :step="1" class="my-2" />

          <autocomplete-component
            placeholderText="Search..."
            noResultsText="No results found."
            :displayFunction="displayName"
            :searchItems="searchText"
          ></autocomplete-component>
          <div class="clickable overflow-y-auto h-[600px]">
            <map-card
              v-for="result in results"
              v-bind:key="result"
              :place="result"
              class="pb-5 rounded-lg"
            >
            </map-card>
          </div>
        </div>
      </div>

      <div class="col-start-6 col-span-1">
        <div class="bg-white rounded-lg shadow-lgmb-4">
          <div class="px-8 py-6">
            <div>
              Here you'll find more information and media on the selected
              location.
            </div>
          </div>
        </div>
      </div>
    </div>
    <map-component
      :urls="urls"
      :center="[30.0636, -1.9567]"
      :getFeatureDisplayName="getName"
    ></map-component>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import MapComponent from "./components/MapComponent.vue";
import MapCard from "./components/MapCard.vue";
import AreaSearch from "./components/AreaSearch.vue";
import AutocompleteComponent from "./components/input/AutocompleteComponent.vue";
import RangeSlider from "./components/input/RangeSlider.vue";
import CategoryButtonList from "./components/input/CategoryButtonList.vue";
import axios from "axios";

import type Feature from "ol/Feature";
import type Geometry from "ol/geom/Geometry";
import type {
  FeatureCollection as GeoJSONFeatureCollection,
  Geometry as GeoJSONGeometry,
} from "geojson";

import type { Place, Name } from "./types/map";

import { storeToRefs } from "pinia";
import { mapStore } from "@/stores/store";

const { config } = defineProps({
  config: Object,
});

const store = mapStore();
const { params, results } = storeToRefs(store);

interface Paginated {
  count: number;
  next: string | null;
  previous: string | null;
}

type PaginatedFeatureCollection<P> = Paginated &
  GeoJSONFeatureCollection<GeoJSONGeometry, P>;

const urls = ref<Array<string>>();

function formatNames(
  id: number | undefined | string,
  names: Array<Name>
): string {
  const nameTexts = names.filter((x: Name) => x.text);
  let nameString = `ID: <b>${id}</b></br>`;
  if (nameTexts.length > 0) {
    return nameString + nameTexts.map((x: Name) => `${x.text}`).join(`</br>`);
  } else {
    return nameString + "No name registered.";
  }
}

function getName(f: Feature<Geometry>): string {
  const place = f.getProperties() as Place;

  return formatNames(f.getId(), place.names);
}

function displayName(p: Place): string {
  return formatNames(p.id, p.names);
}

function searchText(query: string): Promise<Array<Place>> {
  if (!query || query.length === 0) {
    return new Promise<Array<Place>>(() => [] as Array<Place>);
  } else {
    return axios
      .get<PaginatedFeatureCollection<Place>>(
        `${config.urls.baseURL}/${config.urls.place}`,
        { params: { search: query } }
      )
      .then((d) => {
        return d.data.features.map((p) => {
          return {
            id: p.id,
            ...p.properties,
          } as Place;
        });
      });
  }
}

watch(
  params,
  () => {
    const searchParams = {
      has_no_name: false,
      id__in: params.value.searchIds ? params.value.searchIds : null,
      in_bbox:
        params.value.bbox && !params.value.searchIds
          ? params.value.bbox.toString()
          : "",
      page_size: 500,
    };
    axios
      .get<PaginatedFeatureCollection<Place>>(
        `${config.urls.baseURL}/${config.urls.place}`,
        {
          params: searchParams,
        }
      )
      .then((response) => {
        urls.value = [response.request.responseURL];
        results.value = response.data.features.map((p) => {
          return {
            id: p.id,
            ...p.properties,
          };
        });
      });
  },
  { deep: true }
);
</script>

<style>
html,
body {
  height: 100vh;
  width: 100vw;
  margin: 0 !important;
}

#app {
  height: inherit;
  width: inherit;
  /* display: flex !important; */
}

.map-container {
  height: inherit;
  width: inherit;
}
</style>

<style scoped>
.filter-container {
  padding: 1.5rem 0 1.5rem 0;
  border-bottom-right-radius: 0.5rem /* 8px */;
  border-bottom-left-radius: 0.5rem /* 8px */;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
</style>
