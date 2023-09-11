<script setup lang="ts">
import type { Place } from './types';
import { ref, watchEffect } from 'vue'

const sort = ref('type')

//TODO - sort function called by watchEffect

//watch for changes in the sort dropdown
watchEffect(() => {
    console.log(sort.value)
    //if sort by type, sort by type
    //if sort by year, sort by year
})

</script>

<template>
    <!-- Here we will show info of the place -->
    <div class="place-view">
        <div class="place-card-container">
            Card with map and other info
        </div>

        <div class="place-gallery-container">
            Gallery of objects will show here with the ability to sort by TYPE of object
            <div>
                <select v-model="sort" class="dropdown">
                    <option actve value="type">Sort by TYPE</option>
                    <option value="year">Sort by YEAR</option>
                </select>
            </div>
            <!-- Sort by TYPE table-->
            <table class="content-table" v-if="sort == 'type'">
                <tr>
                    <td>Documents</td>
                    <td>Content will link to pdf-viewer?</td>
                </tr>
                <tr>
                    <td>3D Models</td>
                    <td>Content will link to ModelView</td>
                </tr>
                <tr>
                    <td>Plans</td>
                    <td>Content</td>
                </tr>
                <tr>
                    <td>Photos</td>
                    <td>Content will link to ImageView</td>
                </tr>
                <tr>
                    <td>Observations</td>
                    <td>Content</td>
                </tr>
            </table>

            <!-- TODO Sort by year-table -->
        </div>
    </div>
</template>

<style scoped>
.place-view {
    color: black;
}
.place-card-container{
    overflow:hidden !important; 
    width:600px!important;
    float: left;
}
.place-gallery-container {
    width: 60%;
    float: left;
    padding:30px;
}  
.dropdown {
    color: black;
}
.content-table td {
    padding: 15px;
}
</style>
