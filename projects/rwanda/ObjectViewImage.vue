<script setup>
import ObjectViewComponent from "./ObjectViewComponent.vue";
import OpenSeadragon from "./OpenSeadragon.vue";
import { onMounted, ref } from "vue";
import { DianaClient } from "./settings/diana.js";

const props = defineProps({
  id: {
    type: Number
  },
});

const diana = new DianaClient("rwanda");
const object = ref();
const iiif_url = ref();

onMounted(async () => {
  if (props.id) {
    object.value = await diana.get("image", props.id.toString(), { depth: 1 });
    iiif_url.value = object.value.iiif_file
  }
  else console.log("no image id")
})

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
</script>

<template>
  <div class="flex">
    <div class="metadata">
      <ObjectViewComponent :title="object?.title" back="/">
        <p v-if="object?.description" class="my-5 object-title">{{ object?.description }}</p>
        <p v-if="object?.place_of_interest.description" class="object-description">{{
          capitalize(object?.place_of_interest.description) }}</p>
      </ObjectViewComponent>
    </div>

    <section class="illustration flex">
      <OpenSeadragon v-if="iiif_url" :src="`${iiif_url}/info.json`" class="flex-1" />

    </section>
  </div>
</template>

<style>
.meta-top-gradient {
  margin-top: 0vh;
  width: 350px;
  height: 30px;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0) 00%, rgba(0, 0, 0, 1) 90%);
  z-index: 100;
  position: absolute;
  margin-left: -15px;
}

.meta-container {
  overflow-y: auto;
  height: calc(100vh - 80px);
  padding-bottom: 30px;
  padding-left: 60px;
  padding-right: 20px;
  -ms-overflow-style: none !important;
  scrollbar-width: none;
}

.container {
  margin-left: 0px;
}

.meta-title {
  font-weight: 600 !important;
  font-size: 35px;
  line-height: 1.0;
  padding-right: 20px;
  margin-top: -15px;
  width: calc(100% - 25px);
  padding-left: 0px;
  position: relative;
  margin-left: 0px;

}

.category-button {
  width: 123px !important;
  padding: 2px 10px !important;
}

.metadata {
  background-color: black !important;
  overflow: hidden !important;
  margin-bottom: 10px;
  padding: 0px 0px;
  width: 350px;

}

.object-description {
  padding: 6px 20px 0px 0px;
  font-size: 24px;
}

.toPlace {
  margin-top: 50px;
  color: var(--theme-2);
  font-size: 1.1em !important;
  cursor: pointer;
}

#app #ToolbarVertical {
  top: 75px;
  margin-left: 10px;
}

@media screen and (min-width: 1900px) {
  .metadata .category-button {
    width: 140px !important;
    padding: 5px 18px !important;
    margin-top: 50px !important;
  }

  .metadata .back-button {
    margin-top: 5px;
  }


}



@media screen and (max-width: 900px) {

  .metadata .category-button {
    width: 100% !important;
    margin-top: 50px !important;
  }

  .meta-top-gradient {
    margin-top: 0vh;
    width: 100%;
    height: 30px;
    background: linear-gradient(0deg, rgba(0, 0, 0, 0) 00%, rgba(0, 0, 0, 1) 90%);
    z-index: 100;
    position: absolute;
    margin-top: 50vh;
  }
}
</style>
