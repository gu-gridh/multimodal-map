<template>
  <footer id="footer">
    <a href="https://dh.gu.se/">
      <div id="PartnerLogo">+ SONORA</div>
    </a>
    <a href="https://dh.gu.se/">
      <div id="CDHLogo">#GRIDH</div>
    </a>
  </footer>
</template>

<script setup lang="ts">
</script>

<style>
#footer {
  display:block;
  background-color: #222;
  color: white;
  line-height: 1;
  height: 82px;
  width: calc(100% + 2px);
  font-size: 12px;
  position: absolute;
  z-index: 3000;
  bottom: -2px;;
}

a {
  font-weight: bold;
}

#CDHLogo {
  float: right;
  margin-top: 0px;
  margin-right: 10px;
  width: auto;
  height: auto;
  text-align: left;
  font-weight: 100;
  font-style: normal;
  font-size: 45px;
  line-height: 0.4;
  padding: 30px 0px 10px 0px;
  vertical-align: middle;
  font-family: "Barlow Condensed", sans-serif;
}

#PartnerLogo {
  float: right;
  margin-top: 0px;
  margin-right: 60px;
  width: auto;
  height: auto;
  text-align: left;
  font-weight: 100;
  font-style: normal;
  font-size: 45px;
  line-height: 0.4;
  padding: 30px 0px 10px 0px;
  vertical-align: middle;
  font-family: "Barlow Condensed", sans-serif;
}

</style>
