<template>
  <div class="about-container" v-bind:class="{fullopacity: visibleAbout}"  :style="{ display: displayAbout ? 'block' : 'none' }">
    <div class="flex-machine">
      <div class="red-content">
        <div class="about-main-title" v-bind:class="{fullopacityui: visibleAbout}">READING THE SIGNS</div>
        <div class="about-sub-title" v-bind:class="{fullopacityui: visibleAbout}"></div>

        <div class="about-article-main" v-bind:class="{fullopacityui: visibleAbout}">
          This portal is a part of the research project Reading the signs. The map visualizes some of the data of the
          project: it shows names of streets, buildings, and areas. It also contains photos of signs and buildings, in
          addition to texts about them. 
        </div>




        <div class="about-article-sub" v-bind:class="{fullopacityui: visibleAbout}">
          This project is a collaboration between University of Gothenburg, Sweden, and University of Kigali, Rwanda and
          financed by Vetenskapsrådet (VR). The portal was developed by Gothenburg Research
          Infrastructure in Digital Humanities (GRIDH) at the University of Gothenburg. The data has been collected by
          Dr. Jean de Dieu Amini Ngabonziza and Dr. Tove Rosendal. The data model and the backend was created by Johan
          Åhlfeldt and Aram Karimi, GRIDH. The interface has mainly been developed by Kristin Åkerlund, GRIDH.
        </div>




        <button @click="$emit('close')">
          <div class="p-1 px-2 clickable category-button"
            style="width:auto; padding:5px 15px; text-align: center; cursor: pointer;"
            v-bind:class="{fullopacityui: visibleAbout}">Explore</div>
        </button>
      </div>
    </div>
    <div class="about-lower-border"> </div>
    <div class="about-logo-top-right"> </div>
  </div>


</template>

<script>
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
        // If visibleInstructions is true, immediately show the container
        this.displayAbout = true;
      } else {
        // if visibleInstructions is false, wait for the transition to finish before hiding
        setTimeout(() => {
          this.displayAbout = false;
        }, 1000); // transition duration
      }
    },
  },
  methods: {
    
  },
  };
</script>

<style scoped>
  body {
    border: 0px;
  }

  .about-container {
    position: fixed;
    color: white;
    line-height: 1;
    height: calc(100% - 80px);
    width: 100%;
    font-size: 12px;
    z-index: 2000;
    backdrop-filter: blur(0px);
    pointer-events: none;
    transform: scale(1.5);
    translate: 0px 100px;
    transition: all 0.5s ease-in-out;
    opacity: 0.0;
    overflow-y: auto;
    background: linear-gradient(90deg, rgba(235, 235, 235, 1) 0%, rgba(235, 235, 235, 0.8) 30%);

  }

  .fullopacity {
    backdrop-filter: blur(20px);
    opacity: 1.0;
    pointer-events: auto;
    transform: scale(1.0);
    translate: 0px 0px;
    background: linear-gradient(90deg, rgba(235, 235, 235, 1) 0%, rgba(235, 235, 235, 0.8) 100%);
  }

  .flex-machine {
    height: calc(100vh - 80px);
    display: flex!important;
    flex-direction: column!important;
    justify-content: center!important;
  }

  .red-content {
    height:auto;
    display: flex;
    flex-direction: column;
    align-content: flex-end;
    justify-content: start;
  }

  .about-main-title {
    font-family: 'Teko', sans-serif;
    margin-top: 100px;
    flex-basis: auto;
    width: 100%;
    font-size: 105px;
    line-height: 0.85;
    font-weight: 600;
    letter-spacing: -0.2rem;
    text-align: center;
    color: var(--theme-2);
    opacity: 0.0;
    margin-bottom: 40px;
    transition: all 0.4s ease-in-out;

  }

  .about-sub-title {
    font-family: "Josefin Sans", sans-serif !important;
    margin-top: -30px;
    flex-basis: auto;
    width: 100%;
    font-size: 65px;
    line-height: 0.9;
    font-weight: 100;
    letter-spacing: -0.2rem;
    text-align: center;
    color: var(--theme-2);
    opacity: 0.0;
    margin-bottom: 40px;
    transition: all 0.4s ease-in-out;

  }

  .about-article-main {
    position: relative;
    float: left;
    text-align: center;
    color: black;
    font-weight: 100;
    columns: 1;
    column-gap: 30px;
    width: 850px;
    font-size: 1.9em;
    opacity: 0.0;
    padding: 00px 30px;
    transition: all 0.4s ease-in-out;

  }

  .about-article-sub {
    position: relative;
    float: left;
    text-align: justify;
    color: black;
    columns: 2;
    column-gap: 30px;
    width: 950px;
    font-size: 1.4em;
    font-weight: 200;
    opacity: 0.0;
    padding: 30px;
    transition: all 0.4s ease-in-out;
    font-size: 1.7em;
  }

  .about-container .category-button {
    width: 200px !important;
    position: relative;
    float: left;
    font-size: 2em;
    font-weight: 400;
    transition: all 0.4s ease-in-out;
    background-color: var(--theme-1);
    padding: 10px 20px !important;
    z-index: 1000;
    opacity: 1.0;
    margin-bottom: 50px;
  }

  .fullopacityui {
    opacity: 1.0;
  }

  a {
    font-weight: bold;
  }

  .about-lower-border {
    flex-grow: 1;
    margin-top: 0px;
    pointer-events: none;
    width: 100%;
    height: 300px;
    position: relative;
    /* background:url(./images/about-mountains.png); */
    background-repeat: no-repeat;
    background-size: cover;
    opacity: 0.7;

  }

  .about-logo-top-right {
    display: block;
    pointer-events: none;
    width: 200px;
    height: 90px;
    position: absolute;
    /* background:url(./images/logo-Infravis-516.png); */
    background-repeat: no-repeat;
    background-size: contain;
    top: 30px;
    right: 60px;
    opacity: 0.7;

  }
</style>