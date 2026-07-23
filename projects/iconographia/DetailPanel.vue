<script setup>
import { computed, inject, onUnmounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import OpenSeadragon from "openseadragon";
import { iconographiaStore } from "./settings/store";
import {
  objectImageIIIF,
  irImageUrl,
  objectTitle,
  irMotiveTitle,
} from "./settings/api";

const props = defineProps({
  type: { type: String, required: true }, // "object" | "ir_motive"
  id: { type: [String, Number], required: true },
});

const client = inject("client");
const { detailExpanded } = storeToRefs(iconographiaStore());
const record = ref(null);
const viewerEl = ref();
const metaEl = ref();
let viewer = null;

const isObject = computed(() => props.type === "object");

const title = computed(() => {
  if (!record.value) return "";
  return isObject.value
    ? objectTitle(record.value)
    : irMotiveTitle(record.value);
});

/** OpenSeadragon tile sources: IIIF pyramids for museum photos,
    plain images for the scanned registry cards. */
const tileSources = computed(() => {
  if (!record.value) return [];
  const images = record.value.images || [];
  return isObject.value
    ? images.map((img) => objectImageIIIF(img.bildfil))
    : images.map((img) => ({ type: "image", url: irImageUrl(img.filename) }));
});

/** Dating, as a compact string. */
const dating = computed(() => {
  const r = record.value;
  if (!r) return "";
  const min = isObject.value ? r.dat_min : r.mindate;
  const max = isObject.value ? r.dat_max : r.maxdate;
  if (!min && !max) return r.tid || r.dating || "";
  if (min && max && String(min) !== String(max)) return `${min}–${max}`;
  return String(min || max);
});

/** Metadata rows: [i18n key, value]; empty values are skipped. */
const metadata = computed(() => {
  const r = record.value;
  if (!r) return [];
  const rows = isObject.value
    ? [
        ["category", r.cdh_category],
        ["objectType", [r.typ, r.undertyp].filter(Boolean).join(" / ")],
        ["museum", r.museum],
        ["inventoryNo", r.invnr || r.inventarienummer],
        ["artist", r.upphovsman],
        ["dating", dating.value],
        ["material", r.material],
        ["dimensions", [r.hojd, r.bredd].filter(Boolean).join(" × ")],
        ["province", r.landskap],
        ["placeName", r.ort],
        ["parish", r.parish_label],
        ["place", r.place_label],
        ["inscription", r.inskrift],
        ["condition", r.kondition],
        ["colour", r.farg],
        ["motifs", r.motiv],
        ["keywords", r.sokord],
        ["literature", r.litteratur],
        ["other", r.ovrigt],
      ]
    : [
        ["category", r.cdh_category || r.saints],
        ["motif", [r.motif1, r.motif2].filter(Boolean).join(" — ")],
        ["subject", [r.subject1, r.subject2, r.subject3].filter(Boolean).join(" — ")],
        ["technique", r.technique],
        ["dating", dating.value],
        ["church", r.church],
        ["parish", r.parish || r.parish_ref_label],
        ["province", r.province],
        ["placeName", r.place || r.place_ref_label],
        ["cardVolume", r.volume ? `${r.volume} / ${r.card}` : ""],
        ["note", r.note],
      ];
  return rows.filter(([, value]) => value);
});

/** External resource links for registry cards. */
const links = computed(() => {
  const r = record.value;
  if (!r || isObject.value) return [];
  return [
    r.uri && { label: "Kulturarvsdata", url: r.uri },
    r.site_uri && { label: "Digitalt arkiv RAÄ", url: r.site_uri },
  ].filter(Boolean);
});

const showOcr = ref(false);

/** Sequence position for the "n/total" indicator. */
const currentPage = ref(1);
const pageCount = computed(() => tileSources.value.length);

function goToPage(delta) {
  if (!viewer) return;
  const next = currentPage.value - 1 + delta;
  if (next < 0 || next >= pageCount.value) return;
  viewer.goToPage(next);
}

function initViewer() {
  if (viewer) {
    viewer.destroy();
    viewer = null;
  }
  if (!tileSources.value.length || !viewerEl.value) return;
  currentPage.value = 1;
  viewer = OpenSeadragon({
    element: viewerEl.value,
    prefixUrl: "/openseadragon/",
    tileSources: tileSources.value,
    sequenceMode: tileSources.value.length > 1,
    // The default top-left sequence arrows are replaced by our own
    // bottom-centre control with an n/total indicator.
    showSequenceControl: false,
    showNavigator: true,
    navigatorAutoFade: true,
    homeFillsViewer: false,
    visibilityRatio: 0.7,
    minZoomImageRatio: 0.5,
    showFullPageControl: false,
    autoResize: true,
  });
  viewer.addHandler("page", (event) => {
    currentPage.value = event.page + 1;
  });
}

// Guard against out-of-order responses: when navigating quickly between
// records (e.g. an ir_motive fetch still in flight when an object is
// clicked), a stale response must not overwrite the newer record.
let loadToken = 0;

watch(
  () => [props.type, props.id],
  async () => {
    const token = ++loadToken;
    record.value = null; // clear stale content while loading
    showOcr.value = false;
    try {
      const data = await client.get(props.type, props.id);
      if (token !== loadToken) return; // superseded by a newer navigation
      record.value = data;
      initViewer();
      if (metaEl.value) metaEl.value.scrollTop = 0;
    } catch (error) {
      if (token === loadToken) console.error("Failed to load record", error);
    }
  },
  { immediate: true }
);

onUnmounted(() => {
  detailExpanded.value = false;
  if (viewer) viewer.destroy();
});
</script>

<template>
  <div class="detail-panel" :class="{ expanded: detailExpanded }">
    <div class="detail-toolbar">
      <router-link to="/" class="toolbar-button">← {{ $t("backToSearch") }}</router-link>
      <button class="toolbar-button" @click="detailExpanded = !detailExpanded">
        {{ detailExpanded ? "⇲ " + $t("collapse") : "⇱ " + $t("expand") }}
      </button>
    </div>

    <div class="detail-body">
      <div class="illustration-pane">
        <div ref="viewerEl" class="osd-viewer"></div>
        <div v-if="pageCount > 1" class="sequence-nav">
          <button
            class="seq-button"
            :disabled="currentPage === 1"
            :aria-label="$t('previousImage')"
            @click="goToPage(-1)"
          >
            ‹
          </button>
          <span class="seq-indicator">{{ currentPage }}/{{ pageCount }}</span>
          <button
            class="seq-button"
            :disabled="currentPage === pageCount"
            :aria-label="$t('nextImage')"
            @click="goToPage(1)"
          >
            ›
          </button>
        </div>
      </div>

      <div ref="metaEl" class="meta-pane" v-if="record">
        <div class="collection-tag">
          {{ $t(isObject ? "collectionObjects" : "collectionRegistry") }}
        </div>
        <h1 class="object-title">{{ title }}</h1>

        <dl class="object-metadata">
          <template v-for="[key, value] in metadata" :key="key">
            <dt>{{ $t(key) }}</dt>
            <dd class="pre-line">{{ value }}</dd>
          </template>
        </dl>

        <div v-if="links.length" class="object-links">
          <a v-for="link in links" :key="link.url" :href="link.url" target="_blank" rel="noopener">
            {{ link.label }} ↗
          </a>
        </div>

        <div v-if="!isObject && record.ocr" class="ocr-section">
          <button class="ocr-toggle" @click="showOcr = !showOcr">
            {{ $t("ocrText") }} {{ showOcr ? "▲" : "▼" }}
          </button>
          <pre v-if="showOcr" class="ocr-text">{{ record.ocr }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.detail-panel {
  display: flex;
  flex-direction: column;
  height: 100vh;
  min-height: 0;
}

.detail-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  flex-shrink: 0;
}

.toolbar-button {
  background: rgba(255, 255, 255, 0.08);
  border: none;
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.85);
  padding: 6px 12px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 300;
  cursor: pointer;
  text-decoration: none;
}

.toolbar-button:hover {
  background: rgba(255, 255, 255, 0.16);
  color: white;
}

/* Right-pane mode: viewer on top, metadata below. */
.detail-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.illustration-pane {
  flex: 0 0 46%;
  min-height: 0;
  background: rgb(22, 22, 22);
  position: relative;
}

/* Bottom-centre image sequence control: ‹ 2/4 › */
.sequence-nav {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  border-radius: 20px;
  padding: 4px 10px;
  z-index: 10;
}

.seq-button {
  background: none;
  border: none;
  color: white;
  font-size: 22px;
  line-height: 1;
  padding: 0 6px 3px;
  cursor: pointer;
}

.seq-button:disabled {
  opacity: 0.3;
  cursor: default;
}

.seq-button:not(:disabled):hover {
  color: rgb(214, 160, 160);
}

.seq-indicator {
  font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  font-size: 13px;
  color: white;
}

.osd-viewer {
  width: 100%;
  height: 100%;
}

.meta-pane {
  flex: 1;
  overflow-y: auto;
  padding: 20px 28px 60px;
}

/* Expanded mode: viewer left, metadata right (full window). */
.detail-panel.expanded .detail-body {
  flex-direction: row;
}

.detail-panel.expanded .illustration-pane {
  flex: 1;
}

.detail-panel.expanded .meta-pane {
  flex: 0 0 400px;
}

.collection-tag {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.55;
}

.object-title {
  font-weight: 300;
  font-size: 30px;
  line-height: 1.05;
  margin: 6px 0 18px;
}

.object-metadata {
  display: grid;
  grid-template-columns: 130px 1fr;
  gap: 6px 12px;
  font-size: 15px;
  font-weight: 300;
  margin: 0;
}

.object-metadata dt {
  opacity: 0.55;
}

.object-metadata dd {
  margin: 0;
}

.pre-line {
  white-space: pre-line;
}

.object-links {
  margin-top: 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.object-links a {
  color: rgb(214, 160, 160);
}

.ocr-section {
  margin-top: 22px;
}

.ocr-toggle {
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: inherit;
  border-radius: 6px;
  padding: 6px 12px;
  cursor: pointer;
  font-family: inherit;
}

.ocr-text {
  margin-top: 10px;
  white-space: pre-wrap;
  font-size: 13px;
  opacity: 0.8;
  background: rgba(0, 0, 0, 0.3);
  padding: 12px;
  border-radius: 6px;
}

@media screen and (max-width: 900px) {
  .detail-panel {
    height: 100%;
  }

  .detail-panel.expanded .detail-body {
    flex-direction: column;
  }

  .detail-panel.expanded .meta-pane {
    flex: 1;
  }
}
</style>
