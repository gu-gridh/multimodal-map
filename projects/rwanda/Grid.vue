<script setup lang="ts">
//component for splitting view
import Split from 'split.js'
import MapView from './MapView.vue'
import RightPanel from './RightPanel.vue'
import { onMounted } from 'vue'

onMounted(() => {
    Split(['#split-0', '#split-1'], {
        sizes: [80,20]
    })
})
</script>

<template>
    <div class="split">
        <div id="split-0">
            <MapView/>
        </div>
        <div id="split-1">
         <router-view>
            <RightPanel/>
        </router-view>
            
        </div>
    </div>
</template>

<style>

.split {
    display: flex;
    flex-direction: row;
}

.gutter {
    background-color: #eee;
    background-repeat: no-repeat;
    background-position: 50%;
}

.gutter.gutter-horizontal {
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==');
    cursor: col-resize;
}
</style>