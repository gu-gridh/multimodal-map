<script setup lang="ts">
defineProps({
  title: String,
  back: String,
});
</script>

<template>
  <div>
    <header class="flex flex-row-reverse pt-8 ">
      <div class="flex-1 "></div>
      <div class="container">
        <slot name="title">
          <h1 class="meta-title">{{ title }}</h1>
        </slot>
      </div>
      <div class="flex-1 text-center">
        <router-link
          v-if="back"
          :to="back"
          class="back-button"
        >
        </router-link>
      </div>
    </header>

    <main class="container py-5 mx-20">
      <slot />
    </main>
  </div>
</template>

<style>
.back-button {
  left:20px;
  top:40px;
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
  position:absolute;
}

.meta-title{
font-weight:100;
font-size:50px;
line-height:0.9;
margin-left:75px;
}

.metadata {
  float:left;
  width:350px;
  height:100vh;
  background-color:black;
  color:white;

}

.illustration {
  float:left;
  width:calc(100% - 350px);
  background-color:black;
  height:100vh;
}

</style>
