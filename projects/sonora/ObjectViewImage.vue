<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import ObjectViewComponent from "./ObjectViewComponent.vue";
import OpenSeadragon from "./MapViewPreviewImage.vue";
import i18n from '../../src/translations/sonora';

const props = defineProps({
  object: Object,
  id: Number
});

const metadataFields = computed(() => {
  return Object.entries(props.object).reduce((acc, [key, value]) => {
    if (value && typeof value === 'object' && 'label' in value && 'data' in value && !key.endsWith('expl')) {
      acc[key] = value;
    }
    return acc;
  }, {});
});

const explFields = computed(() => {
  return Object.entries(props.object).reduce((acc, [key, value]) => {
    if (key.endsWith('expl') && value && typeof value === 'object' && 'label' in value && 'data' in value) {
      acc[key] = value;
    }
    return acc;
  }, {});
});

const imageUrls = computed(() => {
  const urls = [];
  for (const key in props.object) {
    if (props.object[key].Filename) {
      urls.push(props.object[key].Filename + '/info.json');
    }
  }
  return urls;
});

const downloadUrls = computed(() => {
  const urls = [];
  for (const key in props.object) {
    if (props.object[key].Download) {
      urls.push(props.object[key].Download);
    }
  }
  return urls;
});

const placesBeforeFiles = computed(() => {
  const places = [];
  for (const key in props.object) {
    if (props.object[key].Filename) break;
    if (props.object[key].place && props.object[key].org_nr) {
      places.push({ name: props.object[key].place, placeNr: props.object[key].org_nr });
    }
  }
  return places;
});

//state for popup
const isPopupVisible = ref(false);
const mousePosition = ref({ x: 0, y: 0 });

const togglePopup = (event) => {
  isPopupVisible.value = !isPopupVisible.value;
};

const handleClickOutside = (event) => {
  const popup = document.querySelector('.popup');
  if (popup && !popup.contains(event.target) && !event.target.classList.contains('open-popup-button')) {
    isPopupVisible.value = false;
  }
};

//check and set the locale
const currentLanguage = ref(localStorage.getItem('sonoraLanguage') || 'en');
i18n.global.locale = currentLanguage.value;

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div class="metadata">
    <ObjectViewComponent :title="(object['Titel'] ? object['Titel'].data : '')">
      <button @click="togglePopup" class="open-popup-button">{{ $t('help') }}</button>
      <div class="objects">
        <div v-for="(field, key) in metadataFields" :key="key">
          <div class="label">{{ field.label }}:</div>
          <div class="data">{{ field.data }}</div>
        </div>
        <div class="places-list" style="margin-top: 20px;" v-if="placesBeforeFiles.length > 0">
          <h3>{{ $t('found_in') }}:</h3>
          <ul>
            <li v-for="(place, index) in placesBeforeFiles" :key="index">
              <router-link :to="`/place/${place.placeNr}`">{{ place.name }}</router-link>
            </li>
          </ul>
        </div>
      </div>
    </ObjectViewComponent>

    <!-- Popup window -->
    <div v-if="isPopupVisible" class="popup" :style="{ left: mousePosition.x + 'px', top: mousePosition.y + 'px' }">
      <div class="popup-content">
        <p v-for="(field, key) in explFields" :key="key">
          <b>{{ field.label }}:</b> {{ field.data }}
        </p>
        <button @click="togglePopup" class="close-popup-button">{{ $t('close') }}</button>
      </div>
    </div>
  </div>

  <section class="illustration flex">
    <OpenSeadragon
        v-if="imageUrls.length > 0"
        :src="imageUrls"
        :downloadUrls="downloadUrls"
        :showReferenceStrip="true"
        :key="imageUrls.join(',')"
        class="flex-1"
    />
    <div id="ToolbarVertical">
      <a id="full-page" href="#full-page">
        <div id="FullPage" class="NavButton"></div>
      </a>
      <a id="zoom-in" href="#zoom-in">
        <div id="ZoomIn" class="NavButton"></div>
      </a>
      <a id="zoom-out" href="#zoom-out">
        <div id="ZoomOut" class="NavButton"></div>
      </a>
    </div>
  </section>
</template>

<style scoped>
#app p {
  margin-bottom: 10px;
  max-width: 400px;
}

.back-button {
  left: 20px;
  top: 40px;
  background: url(@/assets/backbutton.png);
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: center;
  background-color: rgba(35, 35, 35, 0.9);
  border-radius: 50%;
  width: 20px!important;
  height: 20px!important;
  border-radius: 50%;
  overflow: hidden;
  position: fixed;
}

.data {
  color: var(--theme-6) !important;
}

.metadata {
  background-color: rgb(114, 135, 138) !important;
}

.theme-button {
  margin-top: 20px;
  margin-bottom: 10px;
}

.places-list a {
  color: var(--theme-6) !important;
}

.places-list a:hover {
  color: white !important;
  font-size: 110%;
  transform: scale(1.05);
  transition: transform 0.3s ease;
}

.content {
  width: 100%;
}

.open-popup-button {
  margin-top: 5px;
  padding: .125rem;
  padding-left: .5rem;
  padding-right: .5rem;
  background-color: #fff9;
  color: #475569;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: inherit;
  font-feature-settings: inherit;
  font-variation-settings: inherit;
  font-size: 100%;
  font-weight: inherit;
  line-height: inherit;
}

.open-popup-button:hover {
  background-color: var(--theme-4)!important;
  color: #fff;
}

.popup {
  position: fixed;
  top: 40% !important;
  left: 40% !important;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 15px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1200;
  color: black;
  border-radius: 8px;
  box-shadow: 0 0 20px #0000004d;
}

@media (max-width: 900px) {
  .popup {
    top: 50% !important;
    left: 50% !important;
    width: 50%;
    height: 50%;
    overflow-y: auto;
    padding: 10px;
  }
  .popup-content {
    max-height: 100%;
    overflow-y: auto;
  }
}

.metadata .objects {
  margin-top: 10px !important;
}

.close-popup-button {
  font-weight: bold;
  color: var(--theme-3)!important;
}
</style>
