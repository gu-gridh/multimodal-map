<script setup lang="ts">
//component for splitting view
import Split from 'split.js'
import MapView from './MapView.vue'
import RightPanel from './RightPanel.vue'
import { onMounted } from 'vue'

const direction = window.innerWidth <= 1024 ? 'vertical' : 'horizontal';

onMounted(() => {
    Split(['#split-0', '#split-1'], {
        sizes: [75,25],
        minSize: [500, 360],
        direction: direction,
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


#split-1 {
    background-color:rgb(45,45,45) !important;
}

.gutter {
    background-color: rgb(45,45,45)!important;
    height:100vh!important;
    background-repeat: no-repeat;
    background-position: 50%!important;
    width:15px!important;
    background-color: transparent;
  border-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gutter.gutter-horizontal::after {
  content: " ";
  margin-left: -15px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-top:-80px;
  background-color: rgb(180,100,100);
  z-index: 1000;
  background-image: url(@/assets/horizontal.png);
  background-size: 25px 25px;
  background-repeat: no-repeat;
  background-position: center;
  box-shadow: 0rem 0rem 0.5rem rgba(0, 0, 0, 0.3);
}

.gutter.gutter-horizontal:hover {
  cursor: ew-resize;
}

@media (max-width: 1024px) {

  .split{
    display: flex;
    flex-direction: column;
    overflow: auto;
  }
}

@media (max-width: 1024px) {
  #split-1  {
    position: relative;
    bottom: 0;  
    height: 100%;
    width: 100% !important;
  }
}

@media (max-width: 1024px) {
  #split-0{
    min-width: 100% !important;
    height: 100% !important;
    position: absolute;
  }
}

</style>