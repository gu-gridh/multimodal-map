<script setup lang="ts">
import type { Place } from './types';
import PlacePage from "./PlacePage.vue"

    defineProps<{
        place: Place;
        id: number;
    }>();

</script>

<template>
    <div class="metadata">
        <PlacePage :place="place" :id="id" />
    </div>
    <!-- gallery here -->
</template>

<style>
</style>