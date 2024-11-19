<script lang="ts" setup>
  import { watchEffect, ref, inject } from "vue";
  import { storeToRefs } from "pinia";
  import { mapStore } from "@/stores/store";
  // import { inscriptionsStore } from "./settings/store";
  import type {
    Image, PanelMetadata, Language,
  } from "./types";
  import type { SophiaClient } from "@/assets/saintsophia";
  import OpenSeadragon from "./MapViewPreviewImage.vue";
  import apiConfig from "./settings/apiConfig"
  import { inscriptionsStore } from "./settings/store";

  const { panelStr, selectedInscription, searchType } = storeToRefs(inscriptionsStore());
  const { selectedFeature } = storeToRefs(mapStore());
  const sophia = inject("sophia") as SophiaClient;
  const images = ref < Image[] > ();
  const imageUrls = ref < string[] > ([]);
  let panel = ref < PanelMetadata > ();
  const room = ref < string | null > (null);
  const documentation = ref < string | null > (null);
  const hasImages = ref < boolean > (false);
  const number_of_inscriptions = ref < number | null > (null)
  const languages = ref < Language[] > ();
  const tags = ref < string[] > ();

  //when a place is selected, fetch image and info
  watchEffect(async () => {
    documentation.value = null;
    if (selectedFeature.value) {
      const panelId = selectedFeature.value.getId();
      panelStr.value = selectedFeature.value.values_?.title || ''; 
      selectedInscription.value = { displayText: panelStr.value }; 
      searchType.value = 'surfaces'; //for the search bar
      panel.value = await sophia.list < PanelMetadata > ("panel", { id: panelId });
      number_of_inscriptions.value = panel.value.results[0].number_of_inscriptions
      languages.value = panel.value.results[0].list_of_languages.length
      tags.value = panel.value.results[0].tags.length;

      images.value = await sophia.listAll < Image > ("image", { panel: panelId, depth: 2 });
      // If images are available
      if (images.value.length > 0) {
        hasImages.value = true;
        const filteredImages = images.value.filter(image => {
          return (image.type_of_image.text === 'Orthophoto' | image.type_of_image.text === 'Topography') //Only display images that are orthophoto
        });
        imageUrls.value = filteredImages.map(image => `${image.iiif_file}/info.json`);

        // Populate place details
        if (images.value[0].panel) {
          room.value = images.value[0].panel.room || null;
          // TODO the documentation binding needs to be language dependent. Or not there at all.
          // documentation.value = images.value[0].panel.documentation[0].observation || null;
        }
      } else {
        hasImages.value = false;
        imageUrls.value = [];
        // If no images are available, fetch details from `geojson/place` endpoint
        const response = await fetch(`${apiConfig.PANEL}?id=${panelId}`);
        const geojsonData = await response.json();
        if (geojsonData.features.length > 0) {
          const feature = geojsonData.features[0];
          room.value = feature.properties.room || null;
          documentation.value = feature.properties.documentation || null;
        }
      }
    } else {
      images.value = [];
      imageUrls.value = [];
    }
  });

  //deselecting place will close the preview
  function deselectPlace() {
    selectedFeature.value = undefined;
  }
</script>

<template>
  <div v-if="selectedFeature" class="mapview-preview">
    <div class="placecard">
      <div class="close-card-button" @click="deselectPlace"
        style="font-family: Barlow Condensed, sans-serif !important;">+</div>
      <div class="placecard-top">
        <!-- Render OpenSeadragon viewer only if hasImages is true -->
        <OpenSeadragon v-if="hasImages" :src="imageUrls" :key="imageUrls.join(',')" class="flex-1" />

        <!-- Render "No images available" div if hasImages is false -->
        <div v-else class="no-images">
          {{ $t('nophoto') }}
        </div>
      </div>

      <div class="placecard-bottom">
        <div class="placecard-text">
          <div class="placecard-title theme-color-text theme-title-typography">{{ $t('panel') }} {{
            selectedFeature.get("title") }}</div>
        </div>
        <div class="placecard-content">
          <div class="placecard-metadata-content">

            <div class="metadata-group">
              <div class="metadata-item">
                <div class="label">{{ $t('inscriptions') }}:</div>
                <div class="tag theme-color-text">{{ number_of_inscriptions }}</div>
              </div>

              <div class="metadata-item">
                <div class="label">{{ $t('languages') }}:</div>
                <div class="tag theme-color-text">{{ languages }}</div>
              </div>

            </div>

            <div class="metadata-group">
              
              <div class="metadata-item">
                <div class="label">{{ $t('medium') }}:</div>
                <div class="tag theme-color-text">Wall</div>
              </div>

              <div class="metadata-item">
                <div class="label">{{ $t('material') }}:</div>
                <div class="tag theme-color-text">Plaster</div>
              </div>

            </div>
          </div>

        </div>
        <!--   <div class="placecard-metadata-content">
          <div class="preview" v-html="documentation">
          </div>
        </div> -->
      </div>

      <div class="placecard-center-button">
        <a :href="`https://71807.dh.gu.se/viewer/?q=${selectedFeature.get('title')}/orthophoto`">
          <button class="theme-button theme-color-background" style="margin-top:0px;">{{ $t('exploreData') }}</button>
        </a>
      </div>
    </div>
  </div>
</template>

<style>
  /* override */

  .placecard-metadata-content{
    display: flex;
    flex-direction: row;
  }

  .metadata-group{
    display: flex;
    flex-direction: column;
  }

  .metadata-item {
    margin-bottom: 5px;
    display: flex;
    gap: 10px;
    width: auto;
    margin-right: 30px;
  }

  .label {
    width: auto !important;
    margin-right: 0px !important;

  }

  .tag {
    margin-left: 0px;
    padding: 0px !important;
    width: auto !important;
  }

  .close-card-button {
    left: calc(45px);
  }

  .osd {
    background-color: black !important;
  }
</style>