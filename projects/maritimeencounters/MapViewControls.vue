<template>
  <div class="control-organisation justify-space">
    <div class="tag-section ">
      <div class="section-title">Type of Data</div>
      <div class="broad-controls" style="width:120px">
        <CategoryButtonDropdown v-model="dataType"
          :categories="{'radiocarbon_dates': 'Radiocarbon Dates', 'individual_samples': 'Individual Samples', 'dna_samples': 'DNA Samples', 'metal_analysis': 'Metal Analysis', 'landing_points': 'Landing Points', 'new_samples': 'New Samples'}"
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
        <h3>Sites Available:</h3>
        <p>{{ count }}</p>
      </div>
      <div class="data-widget-item">|</div>
      <div class="data-widget-item">
        <h3>Points Hidden:</h3>
        <p>{{ pointsHidden }}</p>
      </div>
    </div>
  </div>
  <div style="display:flex; flex-direction: row; justify-content:center; width:100%;">
    <div id="resetfilters" class="broad-controls theme-button category-button"
      style="margin-top:15px; width:auto; cursor:pointer; transition: all 0.2s ease-in-out; background-color:var(--theme-3); color:white;"
      v-if="isFilterModified" @click="clearAll">
      Reset
    </div>
  </div>
</template>

<script setup>
import { inject, ref, computed, watch } from "vue";
import CategoryButtonDropdown from "./CategoryButtonDropdown.vue";
import RangeSlider from "./RangeSliderMaritime.vue";
import { storeToRefs } from "pinia";
import { maritimeencountersStore } from "./store";

const config = inject("config");
const { selectedRange, dataType, imgParams } = storeToRefs(maritimeencountersStore());
const count = ref(0);
const initialCount = ref(0);

const isFilterModified = computed(() => {
  return (
    dataType.value[0] !== "all" ||
    selectedRange.value[0] !== -2450 || selectedRange.value[1] !== 50
  );
});

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

watch(
  imgParams,
  async (newParams) => {
    try {
      const token = await waitForAuthToken();

      const response = await fetch(
        `https://maritime-encounters.dh.gu.se/api/resources/search/?page_size=500&${new URLSearchParams(newParams)}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );
      const data = await response.json();
      if (initialCount.value === 0) {
        initialCount.value = data.count;
      }
      count.value = data.count;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  },
  { immediate: true }
);

const pointsHidden = computed(() => initialCount.value - count.value);

function clearAll() {
  dataType.value = ["all"];
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

.slider-handle:focus  {
  --slider-handle-ring-color: var(--theme-4);
  --slider-handle-shadow: 0.5px 0.5px 2px 1px var(--theme-4);
}
</style>