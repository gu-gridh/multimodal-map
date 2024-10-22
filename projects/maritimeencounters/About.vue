<template>
  <div class="about-container" v-bind:class="{ fullopacity: visibleAbout }"
    :style="{ display: displayAbout ? 'block' : 'none' }">
    <div class="flex-machine">
      <div class="red-content">

        <div class="about-main-title theme-color-text" v-bind:class="{ fullopacityui: visibleAbout }"> Maritime Encounters</div>
        <div class="about-sub-title theme-color-text" v-bind:class="{ fullopacityui: visibleAbout }"></div>

        <div class="about-article-main" v-bind:class="{ fullopacityui: visibleAbout }">
          This portal collects and visualises datasets concerning Maritime Encounters, a project by the University of Gothenburg.
        </div>

        <div class="about-article-sub" v-bind:class="{ fullopacityui: visibleAbout }">
          The portal was realised by the Gothenburg Research Infrastructure in Digital Humanities (GRIDH) at the University of Gothenburg in collaboration with InfraVis. The frontend is currently developed by M.A.Tristan
          Bridge and Dr.Matteo Tomasini, while the backend is developed by M.A.Aram Karimi.The database is curated
          and maintained by Dr.Michael McGuire, Dr.Ashely Green and Prof.Marc Vander Linden. Please contact
          matteo.tomasini(at)lir.gu.se if you have any questions about the portal. 
        </div>

        <button @click="$emit('close')">
          <div class="p-1 px-2 category-button"
            style="width:auto; padding:5px 15px; text-align: center; cursor: pointer;"
            v-bind:class="{ fullopacityui: visibleAbout }"> {{ "Explore" }}</div>
        </button>
      </div>
    </div>
    <div class="about-logos-container">
      <div class="about-logo about-logo-bottom"></div>
      <div class="about-logo about-logo-bottom2"></div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "aboutview",
  props: {
    visibleAbout: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      displayAbout: this.visibleAbout,
    };
  },
  watch: {
    visibleAbout(newVal) {
      if (newVal) {
        // If visibleAbout is true, immediately show the container
        this.displayAbout = true;
      } else {
        //if visibleAbout is false, wait for the transition to finish before hiding
        setTimeout(() => {
          this.displayAbout = false;
        }, 1000); //transition duration
      }
    },
  },
};
</script>

<style scoped>
.about-container {
  color: black;
  overflow-y: auto;
  background: linear-gradient(90deg, rgba(245, 235, 225, 1) 0%, rgba(245, 235, 225, 0.8) 100%) !important;
  padding-bottom: 40px !important;
}

.fullopacity {
  backdrop-filter: blur(5px);
  background: linear-gradient(90deg, rgba(245, 235, 225, 1) 0%, rgba(245, 235, 225, 0.8) 100%) !important;
}

.category-button {
  position: relative;
  float: left;
  font-size: 1.4vw !important;
  font-weight: 400;
  transition: all 0.4s ease-in-out;
  padding: 8px 20px !important;
  z-index: 1000;
  opacity: 1.0;
}

.about-main-title {
  font-family: 'Teko', sans-serif;
}

@media screen and (max-width: 1500px) {
  .category-button {
    font-size: 1.2em !important;
  }
}

@media screen and (max-width: 900px) {
  .category-button {
    margin-top: 30px;
    font-size: 1.9em !important;
  }
}


.about-logo {
  display: block;
  pointer-events: none;
  width: 200px;
  height: 200px;
  background-size: contain !important;
  background-repeat: no-repeat !important;
  background-position: center !important;
  opacity: 0.9;
}

.about-logo-bottom {
  background: url(/images/logo1.svg);
}

.about-logo-bottom2 {
  background: url(/images/logo2.svg);
}

.about-logos-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 50px;
  padding: 0px 30px;
  margin-top: 20vh;
}
</style>
