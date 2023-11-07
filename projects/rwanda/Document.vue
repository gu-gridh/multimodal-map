<template>
    <div>
        <div class="flex-1 text-center" >
            <router-link to="" class="back-button"> </router-link>
         </div>
        <div class="metadata">
            PDF view
            <p>Place</p>
            <p>Info</p>
            <p>Author</p>
        </div>
        <div class="pdf-view">
            <object data="" type="application/pdf" width="100%" height="500px">
            <p>Unable to display PDF file. <a href="">Download</a> instead.</p>
            </object>
        </div>
        
    
    </div>
</template>

<script setup lang="ts">


</script>

<style>
.metadata {
    width: 20%;
    padding-top: 100px;
    padding-left: 20px;
}

.pdf-view {
    width: 80%
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
</style>
