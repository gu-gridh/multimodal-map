<script setup>
defineProps({
  title: String,
  back: String,
});
</script>

<template>
     <div class="meta-top-gradient"> </div>
  <div class="meta-container no-touch">
 

    <header class="flex flex-row-reverse pt-8">
      <div class="flex-1" ></div>
      <div class="container" >
        <slot name="title">
          <h1 class="meta-title">{{ title }}</h1>
        </slot>
      </div>
      <div class="flex-1 text-center" >
        <router-link v-if="back" :to="back" class="back-button"> </router-link>
      </div>
    </header>

    <main class="container" >
      <slot />
    </main>
  </div>
</template>

<style>
  html,
body {
  font-family: "Barlow Condensed", sans-serif !important;
  background-color:black !important;
}

.meta-top-gradient {
  margin-top: 0vh;
  width: 350px;
  height: 30px;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0) 00%, rgba(0, 0, 0, 1) 90%);
  z-index: 100;
  position: absolute;
  margin-left: -15px;
}

.meta-container{
  overflow-y: auto;
  padding-bottom:30px;
  padding-left:60px;
  padding-right:20px;
  -ms-overflow-style: none!important;
  scrollbar-width: none;
}

.meta-container::-webkit-scrollbar {
    width: 0px !important;
    }

.back-button {
  left: 20px;
  top: 45px;
  background: url(@/assets/backbutton.png);
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: center;
  background-color: rgba(35, 35, 35, 0.9);
  border-radius: 50%;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  overflow: hidden;
  position: fixed;
}

.meta-title {
  font-weight: 600 !important;
  font-size: 35px;
  line-height: 1.0;
  padding-right: 20px;
  margin-top: -10px;
  width: calc(100% - 25px);
  padding-left: 0px;
  position: relative;
  margin-left: 0px;
}
.metadata {
  background-color: black;
  overflow: hidden !important;
  margin-bottom: 0px;
  padding: 0px 0px;
  width: 350px;
  color:white;

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

.container {
  margin-left: 0px;
}



.category-button {
  width: 123px !important;
  padding: 2px 10px !important;
}



.object-description {
  padding: 6px 20px 0px 0px;
  font-size: 24px;
}

.toPlace {
  margin-top: 50px;
  color: var(--theme-2);
  font-size: 1.1em !important;
  cursor: pointer;
}


/* If your screen is very small */

/* The basic structure */
@media screen and (max-width: 900px) {
  .meta-top-gradient{
    width:100%;
  margin-top:49.9vh;
    width: 100%;
    height: 30px;
    background: linear-gradient(0deg, rgba(0, 0, 0, 0) 00%, rgba(0, 0, 0, 1) 90%);
    z-index: 100;
    position: absolute;
      margin-left: -0px;

}
.metadata {
  overflow: hidden !important;
  width: 100%!important;
  color:white;
}

.metadata .category-button {
    width: 100% !important;
    margin-top: 50px !important;
  }

}





@media screen and (min-width: 1900px) {
  .metadata .category-button {
    width: 140px !important;
    padding: 5px 18px !important;
    margin-top: 50px !important;
  }

  .metadata .back-button {
    margin-top: 5px;
  }
}






</style>
