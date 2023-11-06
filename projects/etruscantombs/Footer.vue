<template>
  <footer id="footer">
    <div id="developer-info">
      <a href="https://github.com/gu-gridh/multimodal-map" target="_blank">Github repository and development</a> <br>
      <a href="https://github.com/gu-gridh/multimodal-map" target="_blank">Database and API documentation</a> <br>
    </div>
    <a href="https://dh.gu.se/">
      <div id="PartnerLogo">+ ISVROMA</div>
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
  font-family: "Barlow Condensed", sans-serif;
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
}

#developer-info {
  float: left;
  margin-left:50px;
  margin-top:15px;
padding:0px 0px 0px 15px;
 font-size:1.5em;
 line-height:1.4;
 font-weight:200;
 border-width: 0 0 0 0.5px;
 border-color:white;
 border-style:dashed;
}

#developer-info a:link{
  font-weight:200;
}

</style>
