<template>
  <div class="control-organisation justify-space">
    <div class="tag-section ">
      <div class="section-title">Type of Data</div>
      <div class="broad-controls" style="width:120px">
        <CategoryButtonDropdown v-model="selectedSite"
          :categories="{ '1': 'Plank Boats', '2': 'Log Boats', '3': 'Radiocarbon Dates', '4': 'Individual Samples', '5': 'DNA Samples', '6': 'Metal Analysis', '7': 'Landing Points', '8': 'New Samples', '9': 'Metalwork' }"
          :limit="1" styleType="dropdown" class="my-2" type="site" style="width:100%" />
      </div>
    </div>
  </div>

  <div class="tag-section margin-3">
    <!-- <div class="section-title">{{ $t('timeperiod') }}</div> -->
    <div class="slider-widget">
      <div class="slider-section">
        <RangeSlider ref="rangeSliderRef" v-model="selectedRange" :min="-2450" :max="50" :step="1" class="my-2"
          :isSliderVisible="true" />
      </div>
    </div>
  </div>

  <!-- Data Section -->
  <div class="data-widget">
    <div class="data-widget-section">
      <div class="data-widget-item">
        <h3>Points Shown:</h3>
        <p>{{ currentTombCount }}</p>
      </div>
      <div class="data-widget-item">|</div>
      <div class="data-widget-item">
        <h3>Points Hidden:</h3>
        <p>{{ hiddenTombs }}</p>
      </div>
    </div>
  </div>
  <div style="display:flex; flex-direction: row; justify-content:center; width:100%;">
    <div id="resetfilters" class="broad-controls theme-button category-button"
      style="margin-top:15px; width:auto; cursor:pointer; transition: all 0.2s ease-in-out; background-color:var(--theme-4); color:white;"
      v-if="isFilterModified" @click="clearAll">
      Reset
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, ref, computed, onMounted, watch } from "vue";
import CategoryButtonDropdown from "./CategoryButtonDropdown.vue";
import RangeSlider from "./RangeSliderMaritime.vue";
import { storeToRefs } from "pinia";
import { maritimeencountersStore } from "./store";
import type { MaritimeEncountersProject } from "./types";

const config = inject<MaritimeEncountersProject>("config");
const { selectedRange, selectedSite } = storeToRefs(maritimeencountersStore());

const isFilterModified = computed(() => {
  return (
    selectedSite.value[0] !== "all" ||
    selectedRange.value[0] !== -2450 || selectedRange.value[1] !== 50
  );
});

//initialize variables for data section
const hiddenTombs = ref(0);
const currentTombCount = ref(0);

onMounted(async () => {
  // await fetchDataAndPopulateRef("epoch", TAGS);
});

// async function fetchDataAndPopulateRef<T>(type: string, refToPopulate: any, params: Record<string, any> = {}) {
//   try {
//     const data = await dianaClient.listAll<T>(type, params);
//     refToPopulate.value = {};

//     data.forEach((result: any) => {
//       //fetch here
//     });
//   } catch (error) {
//     console.error(`Error fetching data for type ${type}:`, error);
//   }
// }

function clearAll() {
  selectedSite.value = ["all"];
  selectedRange.value = [-2450, 50];
}
</script>

<style>
.loading-svg {
  width: 100%;
  height: 180px;
  background: url("/90-ring-with-bg.svg");
  background-size: 60px;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  display: block;
  margin: auto;
  transition: all 0.4s;

}

#app .tag-section .broad-controls {
  font-size: 0.9em;
}

.loading-svg:hover {
  height: 240px;
  transform: scale(1.5);
}

.justify {
  display: flex;
  flex-direction: row;
  justify-content: left;
}

#app .section-title {
  margin-top: 6px;
  margin-bottom: -3px;
}

#app .tag-section {
  margin-top: -5px;
  margin-bottom: 0px;
}

#app .start-end-box {
  width: 15%;
  font-size: 20px;
  text-align: center;
  padding-top: 0rem;
  padding-bottom: 0.5rem;
}

#app .rounded {
  border-radius: 10px;
}

#app .broad-controls {
  width: 100%;

}

#app .control-organisation {
  width: 98%;
  float: left;
  display: flex;
  flex-direction: row;
  margin-top: 10px;
}

.justify-left {
  justify-content: left;
}

.justify-space {
  justify-content: space-between;
}

.margin-20 {
  margin-left: 20px;
}

.margin-5 {
  margin-left: 5px;
}

.data-widget {
  font-size: 110%;
  float: left;
  pointer-events: none;
  width: 98%;
  margin-top: 10px;
  padding: 15px 25px;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.5);
  min-height: 50px;
  backdrop-filter: blur(5px);
}

.data-widget-section {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.data-widget-divider {
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: -25px;
  width: calc(100% + 50px);
  border-style: dotted;
  border-color: var(--theme-3);
  border-width: 1px 0px 0px 0px;
  height: 1px;
}

.data-widget-item h3 {
  display: inline;
}

.data-widget-item p {
  display: inline;
  color: var(--theme-3);
  margin-left: 3px;
  font-weight: 500;
}

@media screen and (max-width: 900px) {
  #app .broad-controls {
    width: 100%;

  }

  #app .control-organisation {
    width: 98%;
    float: none;
    display: flex;
    flex-direction: column;
    margin-top: 10px;
  }

  .justify-space {
    justify-content: left;
  }

  #app .tag-section {
    font-size: 100%;
  }

  .margin-20 {
    margin-left: 0px;
  }

  .margin-5 {
    margin-left: 0px;
  }

  .data-widget {
    display: none;
  }
}

.slide-leave-active {
  transition: all 0.4s;
  opacity: 1.0;
}

.slide-leave-to {
  opacity: 0.5;
}

.slideinactive {
  opacity: 0.4;
  pointer-events: none !important;
  transition: all 0.4s;
}

.slideactive {
  transition: all 0.4s;
  opacity: 1.0;
}

.slider-widget {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 110%;
  float: left;
  width: 98%;
  border-radius: 10px;
  min-height: 50px;
  backdrop-filter: blur(5px);
}

#app .slider-section {
  width: 100%;
}
</style>