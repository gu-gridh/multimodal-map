<template>
  <footer id="footer">
    <a href="https://ub.gu.se/">
      <div id="GUBLogo">GUB</div>
    </a>
    <a href="https://dh.gu.se/">
      <div id="CDHLogo">#GRIDH +</div> 
    </a> 
   
    <div id="citation"> 
      Citera portalen som: Humlesjö, Siska, Åhlfeldt, Johan, Strinnholm, Anders <i>et al.</i> (2023).<br>
      <i>Göteborgs jubileum 1923</i>, v.1.0 GRIDH. https://jubileet1923.dh.gu.se/. Accessed [datum]</div>
  </footer>
</template>

<script setup lang="ts">
</script>

<style>
#footer {
  background-color: #222;
  color: white;
  line-height: 1;
  height: 82px;
  width: calc(100% + 2px);
  font-size: 12px;
  position: absolute;
  z-index: 3000;
  bottom: -2px;
    font-family: "Barlow Condensed", sans-serif;
}

a {
  font-weight: bold;
}

#CDHLogo {
  float: right;
  margin-top: 0px;
  margin-right:10px;
  width: auto;
  height: auto;
  text-align: left;
  font-weight: 100;
  font-style: normal;
  font-size: 57px;
  line-height: 0.4;
  padding: 25px 0px 10px 0px;
  vertical-align: middle;

}

#GUBLogo {
  float: right;
  margin-top: 0px;
  margin-right: 50px;
  width: auto;
  height: auto;
  text-align: left;
  font-weight: 100;
  font-style: normal;
  font-size: 57px;
  line-height: 0.4;
  padding: 25px 0px 10px 0px;
  vertical-align: middle;

}

#citation {
  float: right;
  margin-right: 20px;
  width: 500px;
  height: auto;
  text-align: right;
  font-weight: 200;
  font-style: normal;
  font-size: 16px;
  line-height: 1.2;
  padding-right:20px;
  margin-top:20px;;
  vertical-align: middle;
  border-style:solid;
  border-width:0 0.5px 0 0px;
  border-color:white;

}

</style>
