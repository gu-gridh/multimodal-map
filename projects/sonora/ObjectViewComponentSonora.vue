<script setup lang="ts">
import { useRouter } from 'vue-router';

const props = defineProps({
  title: String,
  back: String,
  backName: String,
});

const router = useRouter();

const goBack = () => {
    router.go(-1);
};
</script>

<template>
     <div class="meta-top-gradient"> </div>
  <div class="meta-container no-touch">
 

    <header class="flex flex-row-reverse pt-8">
      <div class="flex-1" ></div>
      <div class="container" >
        <slot name="title">
          <h1 class="meta-title theme-title-typography">{{ title }}</h1>
        </slot>
      </div>
      <div class="flex-1 text-center" >
        <div @click="goBack" class="back-button"></div>
      </div>
    </header>

    <main class="container metadata-posts" >
      <slot />
    </main>
  </div>
</template>

<style>
#app Body{
 
}

.meta-top-gradient{
  margin-top:0vh;
 width:450px;
 height:30px;
 background: linear-gradient(0deg, rgba(0,0,0,0) 00%, rgba(0,0,0,1) 90%);
 z-index:100;
 position:absolute;
}

.meta-container{
  overflow-y: auto;
  height:calc(100vh - 80px);
  padding-bottom:30px;
  padding-left:75px;
  padding-right:20px;
  -ms-overflow-style: none!important;
  scrollbar-width: none;
}

.meta-container::-webkit-scrollbar {
    width: 0px !important;
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
  cursor: pointer;
  position: fixed;
}

.meta-title {
  font-weight: 100;
  font-size: 35px;
  line-height: 1.0;
  padding-right: 20px;
  padding-top: 6px;
  width: calc(100% - 25px);
 
}

.metadata {
  float: left;
  width: 450px;
  height: 100vh;
  color: white;
}

.metadata-posts {
  padding-left: 0px;
  padding-right: 0px;
}

.object-title {
  font-size: 150%;
  line-height: 1.2;
  width: 100%;
  padding-bottom: 10px;
}

.illustration {
  float: left;
  width: calc(100% - 350px);
  background-color: black;
  height: 100vh;
}

#app p{
  margin-bottom:20px;
}

#app .meta-container a{
  color:#CCFFFF;
  cursor:pointer;
}

#app .meta-container a:hover{
  cursor:pointer;
}

/* If your screen is very small */

/* The basic structure */
@media screen and (max-width: 900px) {
  .meta-top-gradient{
    width:100%;
  margin-top:49.9vh;

}
}


</style>
