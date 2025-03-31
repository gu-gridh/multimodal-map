<template>
<div class="about-container" v-bind:class="{fullopacity: visibleTranscriptions}"  :style="{ display: displayTranscriptions ? 'block' : 'none' }">
    <button @click="$emit('close')">
          <div class="p-1 px-2 clickable category-button"
            style="width:auto; padding:5px 15px; text-align: center; cursor: pointer; margin:20px"
            v-bind:class="{fullopacityui: visibleTranscriptions}">Back to main page</div>
        </button>
    <div class="flex-machine">
      <div class="red-content">
        <div class="about-main-title" v-bind:class="{fullopacityui: visibleTranscriptions}">Transcriptions</div>
        <div class="about-sub-title" v-bind:class="{fullopacityui: visibleTranscriptions}"></div>

        <div class="about-article-main" v-bind:class="{fullopacityui: visibleTranscriptions}">
            This folder contains selected transcriptions (in Kinyarwanda) of interviews with local citizens of Kigali city. The extracts target names of places in Nyarugenge District, and most of the texts are also linked to places found on the interactive map, with translations into English.
<br/>
<br/>
The transcriptions are from narrative walking interviews conducted in the streets of the Nyarugenge district in Kigali, using a GoPRo Camera.  The structure of the transcriptions will show you type of place of interest (building, street, area), name of the specific place of interest, informant code made up of a number, two initials given to the participant, and letters indicating the age and gender of the participant (OM= Old Male, YM= Young Male, OF=Old Female, YF= Young Female).
        </div>




        <div class="list" v-bind:class="{fullopacityui: visibleTranscriptions}">
          <p v-for="transcription in transcriptions" key="transcription.id" class="" @click="openPdf(transcription.document)">
            {{transcription.title}}
            </p>
        </div>




        
      </div>
    </div>
    <div class="about-lower-border"> </div>
    <div class="about-logo-top-right"> </div>
  </div>
</template>

<script>
import { DianaClient, } from "./settings/diana.js";
const diana = new DianaClient("rwanda");
export default {
    name: "transcriptions",
    props: {
      visibleTranscriptions: {
        type: Boolean,
        required: true,
      },
    },
    data() {
    return {
      displayTranscriptions: this.visibleTranscriptions,
      transcriptions: [],
      diana: new DianaClient('rwanda')
    };
  },
  watch: {
    visibleTranscriptions(newVal) {
      if (newVal) {
        // If visibleInstructions is true, immediately show the container
        this.displayTranscriptions = true;
      } else {
        // if visibleInstructions is false, wait for the transition to finish before hiding
        setTimeout(() => {
          this.displayTranscriptions = false;
        }, 1000); // transition duration
      }
    },
  },
  mounted: async function() {
        const response = await diana.listAll('transcription', {})
        console.log(response)
        this.transcriptions = response
    },
  methods: {
    openPdf(document) {
      const url = document;
      window.open(url, '_blank');
    }

  }
    }

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

  .list {
    margin-top: 20px;
    margin-bottom: 20px;
    padding: 0px 30px;
    font-size: 1.7em;
    font-weight: 400;
    color: black;
    opacity: 0.0;
    transition: all 0.4s ease-in-out;
    cursor: pointer;
    text-align: left;
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
    margin-top: 30px;
    flex-basis: auto;
    width: 100%;
    font-size: 64px;
    line-height: 0.85;
    font-weight: 400;
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
    text-align: left;
    color: black;
    font-weight: 100;
    columns: 1;
    column-gap: 30px;
    width: 850px;
    font-size: 1.7em;
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
    width: 80%;
    height: calc(100% - 80px);
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