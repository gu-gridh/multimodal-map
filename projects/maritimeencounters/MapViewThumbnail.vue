<script setup>
import { watchEffect, ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { mapStore } from "@/stores/store";

const { selectedFeature } = storeToRefs(mapStore());
const place = ref(null);
const previewData = ref({});
const categoryTitles = {
  boats: "Boats",
  radiocarbon_dates: "Radiocarbon Dates",
  individual_samples: "Individual Samples",
  dna_samples: "DNA Samples",
  metal_analysis: "Metal Analysis",
  landing_points: "Landing Points",
  new_samples: "New Samples",
  metalwork: "Metalwork",
  lnhouses: "Late Neolithic Houses",
};
const expandedCard = ref(null);

//compute if all categories have no data
const allCategoriesEmpty = computed(() => {
  return Object.keys(categoryTitles).every(
    (category) => !previewData.value[category] || previewData.value[category].length === 0
  );
});

//fetch data when selectedFeature changes
watchEffect(async () => {
  if (selectedFeature.value) {
    //reset the expanded card
    expandedCard.value = null;

    try {
      const token = sessionStorage.getItem("authToken");

      const response = await fetch(
        `https://maritime-encounters.dh.gu.se/api/resources/site_resources/?site_id=${selectedFeature.value}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const responseData = await response.json();

      previewData.value = {};
      for (const category of Object.keys(categoryTitles)) {
        previewData.value[category] = responseData[category] || [];
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  } else {
    place.value = null;
    previewData.value = {};
  }
});

//toggles expansion of the card
function toggleCard(key) {
  expandedCard.value = expandedCard.value === key ? null : key;
}

function deselectPlace() {
  selectedFeature.value = undefined;
  expandedCard.value = null; //reset the expanded card
}

function navigateToDetail(url, id) {
  window.open(`${url}${id}/`, '_blank');
}

function getCapitalizedVesselType(type) {
  if (!type) return '';
  return type.charAt(0).toUpperCase() + type.slice(1);
}
</script>

<template>
  <div v-if="selectedFeature" class="mapview-preview">
    <div class="close-card-button" @click="deselectPlace">+</div>
    <div class="placecard-container" style="margin-top: 155px; margin-right: 40px">

      <!-- No Data Available Card -->
      <div v-if="allCategoriesEmpty" class="placecard">
        <div class="placecard-full">
          <div class="placecard-text">
            <div class="placecard-title theme-color-text theme-title-typography">
              No data available
            </div>
          </div>
        </div>
      </div>

      <!-- Boats Card -->
           <div v-if="previewData['boats'] && previewData['boats'].length > 0" class="placecard"
        :class="{ expanded: expandedCard === 'boats' }" @click="toggleCard('boats')">
        <div class="placecard-full">
          <div class="placecard-text">
            <div class="placecard-title theme-color-text theme-title-typography">
              {{ categoryTitles['boats'] }}
            </div>
          </div>
          <div class="placecard-content">
            <!-- Content for Boats -->
            <div class="placecard-metadata-content">
              <ul class="sample-id-list">
                <li v-for="(boat, index) in previewData['boats']" :key="index">
                  <span class="label-box" @click.stop="navigateToDetail('https://maritime-encounters.dh.gu.se/api/resources/boat/', boat.id)">
                    {{ getCapitalizedVesselType(boat.vessel_type) }} {{ boat.id }}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Radiocarbon Dates Card -->
      <div v-if="previewData['radiocarbon_dates'] && previewData['radiocarbon_dates'].length > 0" class="placecard"
        :class="{ expanded: expandedCard === 'radiocarbon_dates' }" @click="toggleCard('radiocarbon_dates')">
        <div class="placecard-full">
          <div class="placecard-text">
            <div class="placecard-title theme-color-text theme-title-typography">
              {{ categoryTitles['radiocarbon_dates'] }}
            </div>
          </div>
          <div class="placecard-content">
            <!-- Content for Radiocarbon Dates -->
            <div class="placecard-metadata-content">
              <ul class="sample-id-list">
                <li v-for="(date, index) in previewData['radiocarbon_dates']" :key="index">
                  <span class="label-box"
                    @click.stop="navigateToDetail('https://maritime-encounters.dh.gu.se/api/resources/radiocarbon/', date.id)">
                    Radiocarbon Date {{ date.id }}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Individual Samples Card -->
      <div v-if="previewData['individual_samples'] && previewData['individual_samples'].length > 0" class="placecard"
        :class="{ expanded: expandedCard === 'individual_samples' }" @click="toggleCard('individual_samples')">
        <div class="placecard-full">
          <div class="placecard-text">
            <div class="placecard-title theme-color-text theme-title-typography">
              {{ categoryTitles['individual_samples'] }}
            </div>
          </div>
          <div class="placecard-content">
            <!-- Content for Individual Samples -->
            <div class="placecard-metadata-content">
              <ul class="sample-id-list">
                <li v-for="(sample, index) in previewData['individual_samples']" :key="index">
                  <span class="label-box" @click.stop="navigateToDetail('https://maritime-encounters.dh.gu.se/api/resources/individualobjects/', sample.id)">
                    Individual Sample {{ sample.id }}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- DNA Samples Card -->
      <div v-if="previewData['dna_samples'] && previewData['dna_samples'].length > 0" class="placecard"
        :class="{ expanded: expandedCard === 'dna_samples' }" @click="toggleCard('dna_samples')">
        <div class="placecard-full">
          <div class="placecard-text">
            <div class="placecard-title theme-color-text theme-title-typography">
              {{ categoryTitles['dna_samples'] }}
            </div>
          </div>
          <div class="placecard-content">
            <!-- Content for DNA Samples -->
            <div class="placecard-metadata-content">
              <ul class="sample-id-list">
                <li v-for="(sample, index) in previewData['dna_samples']" :key="index">
                  <span class="label-box" @click.stop="navigateToDetail('https://maritime-encounters.dh.gu.se/api/resources/adna/', sample.id)">
                    DNA Sample {{ sample.id }}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Metal Analysis Card -->
      <div v-if="previewData['metal_analysis'] && previewData['metal_analysis'].length > 0" class="placecard"
        :class="{ expanded: expandedCard === 'metal_analysis' }" @click="toggleCard('metal_analysis')">
        <div class="placecard-full">
          <div class="placecard-text">
            <div class="placecard-title theme-color-text theme-title-typography">
              {{ categoryTitles['metal_analysis'] }}
            </div>
          </div>
          <div class="placecard-content">
            <!-- Content for Metal Analysis -->
            <div class="placecard-metadata-content">
              <ul class="sample-id-list">
                <li v-for="(analysis, index) in previewData['metal_analysis']" :key="index">
                  <span class="label-box"
                    @click.stop="navigateToDetail('https://maritime-encounters.dh.gu.se/api/resources/metalanalysis/', analysis.id)">
                    Metal Analysis {{ analysis.id }}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Landing Points Card -->
      <div v-if="previewData['landing_points'] && previewData['landing_points'].length > 0" class="placecard"
        :class="{ expanded: expandedCard === 'landing_points' }" @click="toggleCard('landing_points')">
        <div class="placecard-full">
          <div class="placecard-text">
            <div class="placecard-title theme-color-text theme-title-typography">
              {{ categoryTitles['landing_points'] }}
            </div>
          </div>
          <div class="placecard-content">
            <!-- Content for Landing Points -->
            <div class="placecard-metadata-content">
              <ul class="sample-id-list">
                <li v-for="(point, index) in previewData['landing_points']" :key="index">
                  <span class="label-box" @click.stop="navigateToDetail('https://maritime-encounters.dh.gu.se/api/resources/landingpoints/', point.id)">
                    Landing Point {{ point.id }}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- New Samples Card -->
      <div v-if="previewData['new_samples'] && previewData['new_samples'].length > 0" class="placecard"
        :class="{ expanded: expandedCard === 'new_samples' }" @click="toggleCard('new_samples')">
        <div class="placecard-full">
          <div class="placecard-text">
            <div class="placecard-title theme-color-text theme-title-typography">
              {{ categoryTitles['new_samples'] }}
            </div>
          </div>
          <div class="placecard-content">
            <!-- Content for New Samples -->
            <div class="placecard-metadata-content">
              <ul class="sample-id-list">
                <li v-for="(sample, index) in previewData['new_samples']" :key="index">
                  <span class="label-box"
                    @click.stop="navigateToDetail('https://maritime-encounters.dh.gu.se/api/resources/newsamples/', sample.id)">
                    New Sample {{ sample.id }}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Metalwork Card -->
      <div v-if="previewData['metalwork'] && previewData['metalwork'].length > 0" class="placecard"
        :class="{ expanded: expandedCard === 'metalwork' }" @click="toggleCard('metalwork')">
        <div class="placecard-full">
          <div class="placecard-text">
            <div class="placecard-title theme-color-text theme-title-typography">
              {{ categoryTitles['metalwork'] }}
            </div>
          </div>
          <div class="placecard-content">
            <!-- Content for Metalwork -->
            <div class="placecard-metadata-content">
              <ul class="sample-id-list">
                <li v-for="(item, index) in previewData['metalwork']" :key="index">
                  <span class="label-box"
                    @click.stop="navigateToDetail('https://maritime-encounters.dh.gu.se/api/resources/metalwork/', item.id)">
                    Metalwork {{ item.id }}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Late Neolithic Houses Card -->
      <div v-if="previewData['lnhouses'] && previewData['lnhouses'].length > 0" class="placecard"
        :class="{ expanded: expandedCard === 'lnhouses' }" @click="toggleCard('lnhouses')">
        <div class="placecard-full">
          <div class="placecard-text">
            <div class="placecard-title theme-color-text theme-title-typography">
              {{ categoryTitles['lnhouses'] }}
            </div>
          </div>
          <div class="placecard-content">
            <!-- Content for Late Neolithic Houses -->
            <div class="placecard-metadata-content">
              <ul class="sample-id-list">
                <li v-for="(item, index) in previewData['lnhouses']" :key="index">
                  <span class="label-box"
                    @click.stop="navigateToDetail('https://maritime-encounters.dh.gu.se/api/resources/lnhouses/', item.id)">
                    Late Neolithic Houses {{ item.id }}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.placecard-container {
  margin-right: 20px !important;
}

.close-card-button {
  right: 50px !important;
  background-color: var(--theme-3) !important;
}

.placecard-title {
  padding: 0px 0px 0px 5px;
}

.placecard-content {
  padding: 0px 0px 0px 5px;
}

.label-box {
  display: inline-block;
  padding: 2px 6px;
  background-color: var(--theme-3);
  color: white;
  border-radius: 4px;
  margin-right: 5px;
  cursor: pointer;
  font-weight: 300;
  transition: all 0.2s ease-in-out;
}

.label-box:hover {
  transform: scale(1.05);
}

.placecard-content span {
  margin-bottom: 5px !important;
}

.placecard {
  display: block;
  float: right;
  width: 80%;
  margin-top: -100px;
  height: 200px; /* collapsed height */
  overflow: hidden;
  transition: height 0.3s ease;
  cursor: pointer;
  position: relative;
  background-color: #f8f8f8;
  box-shadow:
    4px 0px 5px rgba(0, 0, 0, 0.1),
    /* right shadow */
    -4px 0px 5px rgba(0, 0, 0, 0.1),
    /* left shadow */
    0px -4px 10px rgba(0, 0, 0, 0.1);
  /* top shadow */
}

.placecard:hover {
  height: 250px; /* expanded height */
}

.placecard.expanded {
  height: 350px;
}

.placecard-full {
  padding: 10px;
  background-color: #f8f8f8;
}

.sample-id-list::after { /* card fade effect */
  content: "";
  left: 0px;
  display: block;
  height: 30px;
  background: linear-gradient(transparent, rgb(226 226 226));
  position: absolute;
  bottom: 0;
  width: 100%;
}

.placecard.expanded .sample-id-list::after {
  opacity: 0; /* hide fade effect when expanded */
}
</style>