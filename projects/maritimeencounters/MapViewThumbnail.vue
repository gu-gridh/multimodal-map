<script lang="ts" setup>
import { watchEffect, ref } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { mapStore } from "@/stores/store";

const router = useRouter();
const { selectedFeature } = storeToRefs(mapStore());
const place = ref(null);
const previewData = ref<{[key: string]: any[]}>({});
const categoryTitles = {
  plank_boats: "Plank Boats",
  log_boats: "Log Boats",
  radiocarbon_dates: "Radiocarbon Dates",
  individual_samples: "Individual Samples",
  dna_samples: "DNA Samples",
  metal_analysis: "Metal Analysis",
  landing_points: "Landing Points",
  new_samples: "New Samples",
  metalwork: "Metalwork"
};
const expandedCard = ref<string | null>(null); //the currently expanded card

//fetch data when selectedFeature changes
watchEffect(async () => {
  if (selectedFeature.value) {
    //reset the expanded card
    expandedCard.value = null;
    
    try {
      const response = await fetch(`https://maritime-encounters.dh.gu.se/api/resources/site_resources/?site_id=${selectedFeature.value}`);
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
function toggleCard(key: string) {
  expandedCard.value = expandedCard.value === key ? null : key;
}

function deselectPlace() {
  selectedFeature.value = undefined;
  expandedCard.value = null; //reset the expanded card
}

function navigateToDetail(type: string, id: number) {
  router.push(`/${type}-${id}`);
}
</script>

<template>
  <div v-if="selectedFeature" class="mapview-preview">
    <div class="close-card-button" @click="deselectPlace">+</div>
    <div class="placecard-container" style="margin-top: 150px; margin-right: 40px">
      
      <!-- Plank Boats Card -->
      <div class="placecard" :class="{ expanded: expandedCard === 'plank_boats' }" @click="toggleCard('plank_boats')">
        <div class="placecard-full">
          <div class="placecard-text">
            <div class="placecard-title theme-color-text theme-title-typography">Plank Boats</div>
          </div>
          <div class="placecard-content">
          </div>
        </div>
      </div>

      <!-- Log boats Card -->
      <div class="placecard" :class="{ expanded: expandedCard === 'log_boats' }" @click="toggleCard('log_boats')">
        <div class="placecard-full">
          <div class="placecard-text">
            <div class="placecard-title theme-color-text theme-title-typography">Log Boats</div>
          </div>
          <div class="placecard-content">
          </div>
        </div>
      </div>

      <!-- Radiocarbon Dates Card -->
      <div class="placecard" :class="{ expanded: expandedCard === 'radiocarbon_dates' }" @click="toggleCard('radiocarbon_dates')">
        <div class="placecard-full">
          <div class="placecard-text">
            <div class="placecard-title theme-color-text theme-title-typography">Radiocarbon Dates</div>
          </div>
          <div class="placecard-content">
          </div>
        </div>
      </div>

      <!-- Individual Samples Card -->
      <div class="placecard" :class="{ expanded: expandedCard === 'individual_samples' }" @click="toggleCard('individual_samples')">
        <div class="placecard-full">
          <div class="placecard-text">
            <div class="placecard-title theme-color-text theme-title-typography">Individual Samples</div>
          </div>
          <div class="placecard-content">
          </div>
        </div>
      </div>

      <!-- DNA Samples Card -->
      <div class="placecard" :class="{ expanded: expandedCard === 'dna_samples' }" @click="toggleCard('dna_samples')">
        <div class="placecard-full">
          <div class="placecard-text">
            <div class="placecard-title theme-color-text theme-title-typography">DNA Samples</div>
          </div>
          <div class="placecard-content">
          </div>
        </div>
      </div>

   <!-- Metal Analysis Card -->
   <div class="placecard" :class="{ expanded: expandedCard === 'metal_analysis' }" @click="toggleCard('metal_analysis')">
        <div class="placecard-full">
          <div class="placecard-text">
            <div class="placecard-title theme-color-text theme-title-typography">{{ categoryTitles['metal_analysis'] }}</div>
          </div>
          <div class="placecard-content">
            <div class="placecard-metadata-content">
              <div v-if="previewData['metal_analysis'] && previewData['metal_analysis'].length > 0">
                <ul class="sample-id-list">
                <li v-for="(metal, index) in previewData['metal_analysis']" :key="index">
                  <span 
                    class="label-box" 
                    @click="navigateToDetail('metal_analysis', metal.id)"
                  >
                    Metal Analysis {{ metal.id }}
                  </span>
                </li>
              </ul>
              </div>
              <p v-else>No data available for {{ categoryTitles['metal_analysis'] }}.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Landing Points Card -->
      <div class="placecard" :class="{ expanded: expandedCard === 'landing_points' }" @click="toggleCard('landing_points')">
        <div class="placecard-full">
          <div class="placecard-text">
            <div class="placecard-title theme-color-text theme-title-typography">Landing Points</div>
          </div>
          <div class="placecard-content">
          </div>
        </div>
      </div>

    <!-- New Samples Card -->
    <div class="placecard" :class="{ expanded: expandedCard === 'new_samples' }" @click="toggleCard('new_samples')">
      <div class="placecard-full">
        <div class="placecard-text">
          <div class="placecard-title theme-color-text theme-title-typography">New Samples</div>
        </div>
        <div class="placecard-content">
          <div class="placecard-metadata-content">
            <div v-if="previewData['new_samples'] && previewData['new_samples'].length > 0">
              <ul class="sample-id-list">
                <li v-for="(sample, index) in previewData['new_samples']" :key="index">
                  <span 
                    class="label-box" 
                    @click="navigateToDetail('new_sample', sample.id)"
                  >
                    New Sample {{ sample.id }}
                  </span>
                </li>
              </ul>
            </div>
            <p v-else>No data available for {{ categoryTitles['new_samples'] }}.</p>
          </div>
        </div>
      </div>
    </div>

      <!-- Metalwork Card -->
      <div class="placecard" :class="{ expanded: expandedCard === 'metalwork' }" @click="toggleCard('metalwork')">
        <div class="placecard-full">
          <div class="placecard-text">
            <div class="placecard-title theme-color-text theme-title-typography">Metalwork</div>
          </div>
          <div class="placecard-content">
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style>
.placecard-title {
  padding: 0px 0px 0px 5px; 
}

.placecard-content {
  padding: 0px 0px 0px 5px; 
}

.label-box {
  display: inline-block;
  padding: 2px 6px;
  background-color: rgba(180, 100, 100, 1);
  color: white;
  border-radius: 4px;
  margin-right: 5px;
  cursor: pointer;
  font-weight: 300;
  transition: all 0.2s ease-in-out;
}

.label-box:hover {
  transform:scale(1.05);
}

.placecard-content span {
 margin-bottom: 5px !important;
}

.placecard {
  display: block;
  width: 100%;
  margin-top: -100px;
  height: 150px; /* collapsed height */
  overflow: hidden;
  transition: height 0.3s ease;
  cursor: pointer;
  position: relative;
  background-color: #f8f8f8;
  box-shadow:
    4px 0px 5px rgba(0, 0, 0, 0.1),   /* right shadow */
   -4px 0px 5px rgba(0, 0, 0, 0.1),   /* left shadow */
    0px -4px 10px rgba(0, 0, 0, 0.1);  /* top shadow */
}

.placecard:hover {
  height: 200px; 
}

.placecard.expanded {
  height: 300px; 
}

.placecard-full {
  padding: 10px;
  background-color: #f8f8f8;
}
</style>
