<script setup lang="ts">
import type { Place } from './types';

defineProps<{
        place: Place;
        id: number;
    }>();

    const capitalize = (word: String) => {
      const first = word[0].toUpperCase()
      const rest = word.slice(1)
      return first + rest
    }

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
        <p>Type: {{ capitalize(place.properties.type.text) }}</p>
        <div v-for="name in place.properties.names">
        <div v-if="name !== null || undefined">
        
            <p v-if="name.languages && name.languages.length > 0">{{ name.languages[0].name }} </p><p v-else>-</p>         
            <p v-if="name.text">{{ name.text }}</p>
            <!-- <p v-if="name.period.text && name.period.text !== null">{{ name.period.text }}</p><p v-else></p> -->
        </div>
        <hr/>

      </div>
      
      <!-- <div>
        <p>Exists: {{ object?.properties.is_existing }}</p>
        <p>Iconic: {{ object?.properties.is_iconic }}</p>
        <p>Private: {{ object?.properties.is_private }}</p>
      </div> -->
    </main>

  </div>



</template>

<style>

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
</style>