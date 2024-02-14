<template>
  <footer id="footer">
    <div id="developer-info">
      <div class="links-stack border-style">
        <a class="site-link link" href="https://github.com/gu-gridh/etruscantombs#etruscan-tombs" target="_blank">GitHub repository and development</a>
        <a class="site-link link" href="https://github.com/gu-gridh/etruscantombs#database-and-api-documentation" target="_blank">Database and API documentation</a>
      </div>
      <div class="links-stack">
      <a class="site-link link" href="https://github.com/gu-gridh/etruscantombs#datasets" target="_blank">Dataset documentation</a>
      <a href="#" class="download-link link" @click="downloadData">Download the structured data</a>
    </div>
    </div>
    <div class="partners">
    <a href="https://dh.gu.se/">
      <div class="link" id="PartnerLogo">+ SONORA</div>
    </a>
    <a href="https://dh.gu.se/">
      <div class="link" id="CDHLogo">#GRIDH</div>
    </a>
  </div>
  </footer>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const downloadData = async () => {
  let url = 'https://diana.dh.gu.se/api/etruscantombs/geojson/place/?page_size=100';
  let pageNumber = 0;

  try {
    while (url) {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const pageData = await response.json();
      pageNumber++;

      triggerDownload(pageData.features, `EtruscanTombsData_${pageNumber}.json`);

      url = pageData.next ? pageData.next.replace(/^http:/, 'https:') : null;
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const triggerDownload = (data: any[], filename: string) => {
  const jsonBlob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  const downloadUrl = window.URL.createObjectURL(jsonBlob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(downloadUrl);
};
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

.partners{
float: right;
position:fixed;
bottom:0px;
right:0px;
height:80px;
width:600px;
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
  color:white;
}

#PartnerLogo {
  float: right;
  margin-top: 0px;
  margin-right: 40px;
  width: auto;
  height: auto;
  text-align: left;
  font-weight: 100;
  font-style: normal;
  font-size: 45px;
  line-height: 0.4;
  padding: 30px 0px 10px 0px;
  vertical-align: middle;
  color:white;
}

#developer-info {
  display: flex; 
  align-items: flex-end; 
  margin-left: 50px;
  margin-top: 15px;
  font-size: 1.5em;
  line-height: 1.4;
  font-weight: 200;
}

.border-style {
  border-width: 0 0.5px 0 0px;
  border-color: white;
  border-style: dashed;
  padding-left: 10px; 
  padding-right: 20px; 

}

.link{
color:white;
}

.link:visited{
color:white;
}

.link:hover{
opacity:0.8;
}

.download-link{
  background:url("@/assets/interface/downloadbuttonwhite.png");
  background-size:18px;
  background-position:0px 50%;
  background-repeat:no-repeat;
  padding-left:25px;
  margin-left:0px;
}

.site-link{
  background:url("@/assets/interface/linkbuttonwhite.png");
  background-size:18px;
  background-position:0px 50%;
  background-repeat:no-repeat;
  padding-left:25px;

}

.links-stack {
  margin-right: 20px; 
}

.links-stack a {
  display: block;
}

#developer-info a:link{
  font-weight:200;
}

</style>
