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
    pointer-events: none;
  }

  @keyframes LogoGrow {

    0% {
      background-size: 10%;
      transform: rotate(-10deg);
      opacity: 0.0;
    }

    25% {
      background-size: 20%;
      transform: rotate(20deg);
      opacity: 0.1;
    }

    70% {
      background-size: 110%;
      transform: rotate(-2deg);
      opacity: 0.6;
    }

    100% {
      background-size: 100%;
      transform: rotate(-0deg);
      opacity: 0.8;
    }


  }

  .main-logo {
    width: 100px;
    height: 100px;
    background-image: url(/images/logo-1.png);
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    margin-top: -10px !important;
    animation-name: LogoGrow;
    animation-duration: 1.5s;
    opacity: 0.8;
    transform: rotate(-0deg);
  }

  @keyframes TitleGrow {
    from {
      opacity: 0.0;
    }

    to {
      opacity: 0.9;
    }
  }


  .main-title {
    text-align: center;
    margin-top: 15px !important;
    font-size: min(14vh, 130px) !important;
    line-height: 0.7 !important;
    font-family: "Teko", system-ui !important;
     color: var(--theme-3) !important;
    font-weight: 200;
    font-style: normal;
    animation-name: TitleGrow;
    animation-duration: 2s;
    opacity: 0.9;
  }

  .controls {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
</style>