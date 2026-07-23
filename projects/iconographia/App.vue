<script setup>
import { provide } from "vue";
import { storeToRefs } from "pinia";
import config from "./settings/config";
import { IconographiaClient } from "./settings/api";
import { iconographiaStore } from "./settings/store";
import { useSources } from "./settings/params";
import GalleryPane from "./GalleryPane.vue";
import Footer from "./Footer.vue";

const client = new IconographiaClient();
provide("config", config);
provide("client", client);

const { detailExpanded } = storeToRefs(iconographiaStore());
const { sources } = useSources();
</script>

<template>
  <div class="app-shell">
    <div class="split-layout">
      <!-- Left: the gallery, always visible (as in the original). -->
      <div id="visual-pane">
        <GalleryPane :sources="sources" />
      </div>

      <!-- Right: search/map or the detail view, swapped by the router. -->
      <div id="data-pane" :class="{ expanded: detailExpanded }">
        <router-view />
      </div>
    </div>

    <!-- Full-width footer under both panes. -->
    <Footer />
  </div>
</template>

<style>
.app-shell {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
}

.split-layout {
  display: flex;
  flex: 1;
  min-height: 0;
}

#visual-pane {
  flex: 1 1 55%;
  min-width: 0;
  height: 100%;
  overflow: hidden;
  background-color: var(--pane-visual);
}

#data-pane {
  flex: 0 0 44%;
  max-width: 620px;
  min-width: 420px;
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--pane-data);
  box-shadow: inset 0rem 0rem 3rem rgba(0, 0, 0, 0.6);
  z-index: 2;
}

/* Detail view expanded: the data pane takes over the whole window. */
#data-pane.expanded {
  position: fixed;
  inset: 0;
  max-width: none;
  min-width: 0;
  width: 100vw;
  height: 100vh;
  z-index: 50;
}

@media screen and (max-width: 900px) {
  .split-layout {
    flex-direction: column-reverse;
  }

  #visual-pane {
    height: 45%;
  }

  #data-pane {
    flex: 1;
    max-width: none;
    min-width: 0;
    height: 55%;
  }
}
</style>
