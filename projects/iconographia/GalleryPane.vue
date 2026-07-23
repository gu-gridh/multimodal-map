<script setup>
import { inject, ref, watch } from "vue";
import {
  objectImageThumb,
  irImageThumb,
  objectTitle,
  irMotiveTitle,
  titleCase,
} from "./settings/api";

const props = defineProps({
  /** Active sources in browse order (from settings/params.js). With the
      merged "all" collection this is [object, ir_motive]: museum objects
      are shown first, then registry cards — as in the original. */
  sources: { type: Array, required: true },
});

const client = inject("client");
const records = ref([]);
const total = ref(0);
const loading = ref(false);
const failedThumbs = ref(new Set());
const PAGE_SIZE = 60;

// Per-source paging state, index-aligned with props.sources.
let paging = [];
let fetchToken = 0;

async function reset() {
  const token = ++fetchToken;
  loading.value = true;
  records.value = [];
  paging = props.sources.map(() => ({ page: 0, total: null }));

  // Fetch all totals up front so the count and paging are exact.
  const counts = await Promise.all(
    props.sources.map((s) => client.list(s.type, { ...s.listParams, size: 1 }))
  );
  if (token !== fetchToken) return;
  counts.forEach((data, i) => (paging[i].total = data.count));
  total.value = paging.reduce((sum, p) => sum + p.total, 0);

  await loadChunk(token);
}

/** Load the next batch, spilling over into later sources until a full
    batch is gathered (or everything is loaded). This way a small result
    set — say 2 museum objects and 3 registry cards — appears in one go,
    and "load more" only shows when there really is more. */
async function loadChunk(token = fetchToken) {
  loading.value = true;
  let quota = PAGE_SIZE;
  try {
    for (let i = 0; i < props.sources.length && quota > 0; i++) {
      const source = props.sources[i];
      const state = paging[i];
      while (quota > 0 && state.page * PAGE_SIZE < state.total) {
        const data = await client.list(source.type, {
          ...source.listParams,
          page: state.page + 1,
          size: PAGE_SIZE,
        });
        if (token !== fetchToken) return;
        state.page += 1;
        quota -= data.results.length;
        records.value = records.value.concat(
          data.results.map((r) => ({ ...r, __type: source.type }))
        );
        if (data.results.length < PAGE_SIZE) break;
      }
    }
  } finally {
    if (token === fetchToken) loading.value = false;
  }
}

watch(() => props.sources, reset, { deep: true, immediate: true });

/** Load more automatically when scrolled near the bottom. */
function onScroll(evt) {
  const el = evt.target;
  if (
    !loading.value &&
    records.value.length < total.value &&
    el.scrollTop + el.clientHeight > el.scrollHeight - 600
  ) {
    loadChunk();
  }
}

function thumbUrl(record) {
  if (!record.thumbnail) return null;
  return record.__type === "object"
    ? objectImageThumb(record.thumbnail)
    : irImageThumb(record.thumbnail);
}

function title(record) {
  return record.__type === "object"
    ? objectTitle(record)
    : irMotiveTitle(record);
}

/** Hover overlay, as in the original Gallery: type + locality. */
function overlayHeading(record) {
  return record.__type === "object"
    ? titleCase(record.typ || record.cdh_category || "")
    : record.motif2 || record.motif1 || "";
}

function overlayPlace(record) {
  return record.__type === "object"
    ? record.ort || record.place_label || ""
    : record.place || record.place_ref_label || "";
}

function onImageError(record) {
  failedThumbs.value = new Set([
    ...failedThumbs.value,
    `${record.__type}-${record.id}`,
  ]);
}

const hasThumb = (record) =>
  thumbUrl(record) && !failedThumbs.value.has(`${record.__type}-${record.id}`);
</script>

<template>
  <div class="gallery-pane" @scroll="onScroll">
    <div class="gallery-count">
      {{ total }} {{ $t(total === 1 ? "record" : "records") }}
    </div>

    <div class="gallery-masonry">
      <router-link
        v-for="record in records"
        :key="`${record.__type}-${record.id}`"
        :to="`/${record.__type}/${record.id}`"
        class="gallery-card"
      >
        <div class="image-wrap">
          <img
            v-if="hasThumb(record)"
            :src="thumbUrl(record)"
            :alt="title(record)"
            loading="lazy"
            @error="onImageError(record)"
          />
          <div v-else class="gallery-noimage">{{ title(record) }}</div>

          <!-- Original-style hover overlay (grid-item-info). -->
          <div class="grid-item-info">
            <div class="grid-item-info-meta">
              <h1>{{ overlayHeading(record) }}</h1>
              <h2>{{ overlayPlace(record) }}</h2>
            </div>
          </div>
        </div>
        <div class="gallery-card-title">{{ title(record) }}</div>
      </router-link>
    </div>

    <div class="gallery-footer">
      <div v-if="loading" class="gallery-loading">…</div>
      <button
        v-else-if="records.length < total"
        class="filter-box"
        @click="loadChunk()"
      >
        {{ $t("loadMore") }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.gallery-pane {
  height: 100%;
  overflow-y: auto;
  padding: 20px 20px 60px;
}

.gallery-count {
  font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 12px;
}

.gallery-masonry {
  columns: 4 190px;
  column-gap: 12px;
}

.gallery-card {
  display: inline-block;
  width: 100%;
  margin-bottom: 12px;
  text-decoration: none;
  color: white;
  break-inside: avoid;
  border-radius: 8px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.04);
  transition: transform 0.15s ease-in-out;
}

.gallery-card:hover {
  transform: scale(1.02);
}

.image-wrap {
  position: relative;
}

.gallery-card img {
  width: 100%;
  display: block;
  background: #2b2b2b;
  min-height: 60px;
}

/* Original grid-item-info: bottom gradient, bold type + locality. */
.grid-item-info {
  position: absolute;
  inset: 0;
  background: linear-gradient(rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.7) 100%);
  color: white;
  opacity: 0;
  transition: opacity 0.4s ease-in-out;
}

.image-wrap:hover .grid-item-info {
  opacity: 0.95;
}

.grid-item-info-meta {
  position: absolute;
  bottom: 14px;
  left: 16px;
  right: 10px;
}

.grid-item-info-meta h1 {
  font-size: 22px;
  font-weight: 700;
  margin: 0;
  line-height: 1.05;
}

.grid-item-info-meta h2 {
  font-size: 16px;
  font-weight: 300;
  margin: 2px 0 0;
}

.gallery-noimage {
  padding: 24px 10px;
  font-weight: 300;
  font-size: 15px;
  opacity: 0.65;
  text-align: center;
}

.gallery-card-title {
  font-size: 13px;
  font-weight: 300;
  opacity: 0.85;
  padding: 6px 8px 8px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.gallery-footer {
  text-align: center;
  padding: 20px;
}

.gallery-loading {
  opacity: 0.6;
}
</style>
