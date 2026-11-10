<template>
  <div class="title-area">
    <div class="main-logo"></div>
    <div class="main-title">Utforska<br>bruket</div>
  
  </div>

</template>




<style>
  
    .title-area {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    }

     .main-logo{
      width:100px;
      height:100px;
      background-image: url(/images/logo-1.png);
      background-size: contain;
      background-repeat: no-repeat;
       margin-top:-10px!important;
    }

    .main-title{
  text-align: center;
  margin-top:15px!important;
  font-size: min(14vh, 130px)!important;
  line-height: 0.7!important;
  font-family: "Teko", system-ui!important;
  font-weight: 200;
  font-style: normal;
}
  
  .controls {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
</style>