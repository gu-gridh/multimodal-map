import { inject, watch } from "vue";
import type { PaginatedFeatureCollection, Place } from "@/types/map";
import axios from "axios";
import type { Project } from "@/types/project";
import { storeToRefs } from "pinia";
import { mapStore } from "@/stores/store";

export function useRwandaMap() {
  const config = inject("config") as Project;
  const store = mapStore();
  const { params, results, mapUrls } = storeToRefs(store);

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
          mapUrls.value = [response.request.responseURL];
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

  return { searchText };
}
