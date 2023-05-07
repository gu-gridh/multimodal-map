<template>
  <footer id="footer">
    <a href="https://dh.gu.se/">
      <div id="CDHLogo">#GRIDH</div> <div id="GUBLogo">Göteborgs universitetsbibliotek</div>
    </a>
  </footer>
</template>

<script>
export default {
  name: "Footer",
  data() {},
};
</script>

<style scoped>
#footer {
  background-color: #222;
  color: white;
  line-height: 1;
  height: 80px;
  width: 100%;
  font-size: 12px;
  position: absolute;
  z-index: 3000;
  bottom: 0;
}

a {
  font-weight: bold;
}

#CDHLogo {
  float: right;
  margin-top: 0px;
  margin-right: 30px;
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

#GUBLogo {
  float: right;
  margin-top: 0px;
  margin-right: 60px;
  width: auto;
  height: auto;
  text-align: left;
  font-weight: 100;
  font-style: normal;
  font-size: 35px;
  line-height: 0.4;
  padding: 33px 0px 10px 0px;
  vertical-align: middle;
  font-family: "Barlow Condensed", sans-serif;
}
</style>
