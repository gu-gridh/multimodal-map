<script setup lang="ts">
import type { Place } from './types';
import PlaceCard from "./PlaceCard.vue"

    defineProps<{
        place: Place;
        id: number;
    }>();

</script>

<template>
    <div class="metadata">
        <PlaceCard :place="place" :id="id" />
    </div>
    <!-- gallery here -->
</template>

<style>
</style>