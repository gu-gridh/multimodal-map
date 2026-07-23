<script setup>
import { computed, inject, ref, watch, watchEffect } from "vue";
import { storeToRefs } from "pinia";
import TimeSlider from "./TimeSlider.vue";
import config from "./settings/config";
import { iconographiaStore } from "./settings/store";
import { useSources } from "./settings/params";

const client = inject("client");
const iconographia = iconographiaStore();
const {
  layer,
  categories,
  technique,
  searchString,
  selectedRange,
  includeUndated,
} = storeToRefs(iconographia);
const { sources } = useSources();

const [YEAR_MIN, YEAR_MAX] = config.timeRange;

/** From the legacy CATEGORIES list; the same chips filter both layers
    (value mapping handled in settings/params.js). */
const categoryChips = [
  { value: "all", label: "Alla kategorier" },
  { value: "kalkmålning", label: "Kalkmålning" },
  { value: "träskulptur", label: "Träskulptur" },
  { value: "krucifix", label: "Krucifix" },
  { value: "dopfunt", label: "Dopfunt" },
  { value: "altarskåp", label: "Altarskåp" },
  { value: "övrigt", label: "Övrigt" },
];

/** Place suggestions while typing (the legacy placeSuggestions). */
const suggestions = ref([]);
let suggestTimer = null;
watch(searchString, (value) => {
  clearTimeout(suggestTimer);
  if (!value || value.length < 2) {
    suggestions.value = [];
    return;
  }
  suggestTimer = setTimeout(async () => {
    // Only suggest places that actually carry records of the active
    // collection(s) — no zero-hit suggestions.
    const has =
      layer.value === "all" ? "object,ir_motive" : layer.value;
    const data = await client.list("place", { search: value, size: 8, has });
    suggestions.value = data.results.map((place) => ({
      id: place.id,
      name: place.name,
      label: [place.name, place.municipality].filter(Boolean).join(", "),
    }));
  }, 250);
});

function pickPlace(suggestion) {
  iconographia.placeId = suggestion.id;
  iconographia.placeName = suggestion.name;
  searchString.value = "";
  suggestions.value = [];
}

/** Technique facet (Registry only), fetched live from the API. */
const techniques = ref([]);
watchEffect(async () => {
  if (layer.value === "ir_motive" && !techniques.value.length) {
    techniques.value = await client.values("ir_motive", "technique");
  }
});

/** Total matching records (same filters as the gallery), summed over
    the active collection(s). */
const totalCount = ref(null);
watchEffect(async () => {
  const counts = await Promise.all(
    sources.value.map((s) =>
      client.list(s.type, { ...s.listParams, size: 1 })
    )
  );
  totalCount.value = counts.reduce((sum, d) => sum + d.count, 0);
});

const yearFilterActive = computed(
  () => selectedRange.value[0] > YEAR_MIN || selectedRange.value[1] < YEAR_MAX
);
</script>

<template>
  <div class="controls">
    <!-- Collection toggle + result count -->
    <div class="collection-row">
      <button
        v-for="c in ['all', 'object', 'ir_motive']"
        :key="c"
        class="filter-box"
        :class="{ 'filter-box-active': layer === c }"
        @click="layer = c"
      >
        {{
          $t(
            c === "all"
              ? "collectionAll"
              : c === "object"
                ? "collectionObjects"
                : "collectionRegistry"
          )
        }}
      </button>
      <span class="result-count">
        {{ totalCount ?? "…" }} {{ $t(totalCount === 1 ? "record" : "records") }}
      </span>
    </div>

    <!-- Search with place suggestions -->
    <div class="search-wrap" :class="{ 'has-suggestions': suggestions.length }">
      <input
        type="search"
        class="search-input"
        :value="searchString"
        :placeholder="$t('searchPlaceholder')"
        @input="searchString = $event.target.value"
      />
      <ol v-if="suggestions.length" class="search-suggestions">
        <li v-for="s in suggestions" :key="s.id">
          <button class="filter-box" @click="pickPlace(s)">{{ s.label }}</button>
        </li>
      </ol>
    </div>

    <!-- Category chips -->
    <div class="chip-row">
      <button
        v-for="c in categoryChips"
        :key="c.value"
        class="filter-box"
        :class="{ 'filter-box-active': categories[0] === c.value }"
        @click="categories = [c.value]"
      >
        {{ c.label }}
      </button>
    </div>

    <!-- Technique facet (Registry only) -->
    <select v-if="layer === 'ir_motive'" v-model="technique" class="technique-select">
      <option value="all">{{ $t("allTechniques") }}</option>
      <option v-for="t in techniques" :key="t.value" :value="t.value">
        {{ t.value }} ({{ t.count }})
      </option>
    </select>

    <!-- Time period -->
    <div class="time-row">
      <TimeSlider v-model="selectedRange" :min="YEAR_MIN" :max="YEAR_MAX" :step="10" />
      <label v-if="yearFilterActive" class="undated-toggle">
        <input type="checkbox" v-model="includeUndated" />
        {{ $t("includeUndated") }}
      </label>
    </div>
  </div>
</template>

<style scoped>
.controls {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.collection-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.result-count {
  margin-left: auto;
  font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  font-size: 13px;
  opacity: 0.7;
  white-space: nowrap;
}

.search-wrap {
  position: relative;
}

.search-input {
  width: 100%;
  padding: 10px 14px;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-family: inherit;
  font-weight: 300;
  background: rgba(255, 255, 255, 0.09);
  color: white;
  outline: none;
  box-sizing: border-box;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.45);
}

.search-input:focus {
  background: rgba(255, 255, 255, 0.14);
}

.has-suggestions .search-input {
  border-radius: 8px 8px 0 0;
}

/* Legacy-style suggestion dropdown (#262626 like the original). */
.search-suggestions {
  position: absolute;
  left: 0;
  right: 0;
  top: 100%;
  margin: 0;
  padding: 8px 8px 2px;
  list-style: none;
  background-color: #262626;
  border-radius: 0 0 10px 10px;
  z-index: 30;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.4);
}

.search-suggestions li {
  display: inline-block;
}

.chip-row {
  line-height: 1;
}

.technique-select {
  width: 100%;
  padding: 8px;
  border: none;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.09);
  color: white;
  font-family: inherit;
}

.technique-select option {
  color: black;
}

.time-row {
  padding: 0 2px;
}

.undated-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 6px;
  font-size: 14px;
  font-weight: 300;
  opacity: 0.85;
}
</style>
