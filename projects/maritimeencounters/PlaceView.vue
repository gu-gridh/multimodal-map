<script setup lang="ts">
import MapComponent from "@/components/MapComponent.vue";
// function toggleLanguage() {
//     if (i18n.global.locale === 'en') {
//         i18n.global.locale = 'it';
//     } else {
//         i18n.global.locale = 'en';
//     }
// }

// onMounted(async () => {
// });
</script>
    
<template>
    <div class="main-container">
    </div>
    <MapComponent />
</template>
    
<style scoped>
.main-container {
    background-color: rgba(232, 228, 217, 0.5) !important;
    backdrop-filter: blur(10px) saturate(50%) brightness(100%);
}

.sort{
margin-left:130px;
}
.show-button {
    color: white;
    height: auto;
    border-radius: 4px;
    padding: 2px 8px;
    background-color: transparent;
    float: right;
    font-size: 0.9em;
    margin-top: 5px;
    margin-left: 20px;
    transition: all 0.2s ease-in-out;
    min-width:60px;
}

.show-button:hover {
    background-color: var(--theme-4) !important;
    transform: scale(1.05);
}

/* unvisited link */
a:link {
    font-weight: normal !important;
}

/* visited link */
a:visited {
    font-weight: normal !important;
}

/* mouse over link */
a:hover {}

/* selected link */
a:active {}

.content-table td {
    color: black;
}

/* hides the zoom controls for the background map*/
#app .ol-zoom-in {
    display: none !important;
}

#app .ol-zoom-out {
    display: none !important;
}

.gallery__item {
    width: 200px;
    margin-bottom: 10px;
}

.plan-gallery__item {
    width: 200px;
    margin-bottom: 10px;
}


@media screen and (max-width: 900px) {

    #app .maijn-container{
    padding:0px!important;
}
#app .place-gallery-container{
    padding:0px!important;
    margin-left:0px;
}
#app .place-view{
    width:100%!important;
    padding-top:20px!important;
    margin-left:0px!important;
    padding-bottom:100px;
}

.sort{
margin-left:20px;
}

.square
{
  width:120px;  
  height:120px;  
}

.placeview-masonry-gallery
{
  width:100%;  
}
.document-placeholder
{
max-width:90%;
}
.documentlabel{
    display:none;
}
.documentdata{
    display:none;
}

.observation-placeholder{
    max-width:90%;
}
}
</style>
    