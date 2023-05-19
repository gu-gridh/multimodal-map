<script setup lang="ts">
import type { Place } from './types';
import type { DianaClient } from "@/assets/diana"
import { inject } from "vue"

defineProps<{
        place: Place;
        id: number;
    }>();

    const capitalize = (word: String) => {
      const first = word[0].toUpperCase()
      const rest = word.slice(1)
      return first + rest
    }

    //check if data is missing - TODO


</script>

<template>

<div class="meta-top-gradient"> </div>
  <div class="meta-container">
    <header class="flex flex-row-reverse pt-8">
      <div class="flex-1"></div>
      <div class="container">
        <slot name="title">
          <h1 class="meta-title"></h1>
        </slot>
      </div>
      <div class="flex-1 text-center">
        <!-- TODO -->
        <!-- <router-link to="back" class="back-button"> </router-link> -->
      </div>
    </header>

    <main class="container metadata-posts">
      <p>{{ capitalize(place.properties.type.text) }}</p>
      <p>Description: {{ capitalize(place.properties.description) }}</p>
        <div>
            <p>{{place.properties.is_existing ? 'Existing' : 'Non-existing'}} - {{ place.properties.is_iconic ? 'Iconic' : 'Not iconic'}} - {{ place.properties.is_private ? 'Private' : 'Public'}}</p>
            <p v-if="place.properties.parent_place !== null"><a :href="place.properties.parent_place.id">Parent place</a></p>
        </div>
        <hr/>
        <div v-for="name in place.properties.names">
        <div v-if="name !== null || undefined">
            <p v-if="name.languages && name.languages.length > 0">{{ name.languages[0].abbreviation }} <span v-if="name.text">{{ name.text }}</span></p>        
            <p v-if="name.period !== null">Period: {{ name.period.start_year }} - {{ name.period.end_year }}. {{ capitalize(name.period.text) }}</p>
            <p v-if="name.informants && name.informants.length > 0">Informant: <span v-for="informant in name.informants">{{ name.informants[0].custom_id }}. {{ name.informants[0].note }}</span></p>
            <p v-if="name.referent">Comment: {{ name.referent.comment }}</p>
            <p v-if="name.note">Note: {{ name.note }}</p>
        </div>
        <hr/>

      </div>
    </main>

  </div>



</template>

<style>
body{
  background-color:rgb(45,45,45);
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
  width: 35px;
  height: 35px;
  border-radius: 50%;
  overflow: hidden;
  position: fixed;
}

.metadata {
  background-color: transparent !important;
}

.meta-top-gradient{
 background: linear-gradient(0deg, rgba(45,45,45,0) 00%, rgba(45,45,45,1) 90%);
}
</style>