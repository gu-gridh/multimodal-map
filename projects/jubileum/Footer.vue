<template>
  <footer id="footer">
    <div id="developer-info">
      <div class="links-stack">
        <a class="site-link link" href="https://gupea.ub.gu.se/handle/2077/74634" target="_blank">Publikationer i
          GUPEA</a>
        <a class="download-link" href="" target="_blank">
          Text och bild: CC BY 4.0 / CC0 1.0</a>
      </div>
      <div class="links-stack citationjub border-style ">
        Citera portalen: Humlesjö, Siska, Åhlfeldt, Johan, Strinnholm, Anders <i>et al.</i> (2023).<br>
        <i>Göteborgs jubileum 1923</i>, v.1.0 GRIDH. https://jubileet1923.dh.gu.se/. Accessed [datum]
      </div>
    </div>


    <div class="partners">

      <div class="partner">
        <a href="https://ub.gu.se">
          <div class="link PartnerLogo" id="">UB</div>
        </a>
      </div>

      <div class="partner">
        <a href="https://dh.gu.se/">
          <div class="link GRIDHLogo" id="">GU / GRIDH
          </div>
        </a>
      </div>

    </div>
  </footer>
</template>

<script setup>
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

const triggerDownload = (data, filename) => {
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
  display: block;
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

.partners {
  display: flex;
  flex-direction: row;
  position: fixed;
  bottom: 0px;
  right: 0px;
  height: 80px;
  width: auto;
}

.partner {
  width: auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-content: center;
}



.GRIDHLogo {
  float: right;
  margin-top: 30px;
  width: auto;
  height: auto;
  text-align: left;
  font-weight: 100;
  font-style: normal;
  font-size: 30px;
  line-height: 0.8;
  padding: 0px 50px 5px 30px;
  vertical-align: middle;
}


.PartnerLogo {
  float: right;
  margin-top: 30px;
  width: auto;
  height: auto;
  text-align: left;
  font-weight: 100;
  font-style: normal;
  font-size: 30px;
  line-height: 0.8;
  padding: 0px 30px 5px 30px;
  vertical-align: middle;
  border-width: 0px 0.5px 0px 0.0px;
  border-color: white;
  border-style: solid;
}

#developer-info {
  display: flex;
  align-items: center;
  margin-left: 50px;
  margin-top: 15px;
  font-size: 1.5em;
  line-height: 1.4;
  font-weight: 200;
}

.border-style {
  border-width: 0 0px 0 0.5px;
  border-color: white;
  border-style: dashed;
  padding-left: 10px;
  padding-right: 20px;

}

.link {
  color: white;
}

.link:visited {
  color: white;
}

.link:hover {
  opacity: 0.8;
}

.download-link {
  background: url("https://data.dh.gu.se/ui-icons/download_white_circle.png");
  background-size: 18px;
  background-position: 0px 50%;
  background-repeat: no-repeat;
  padding-left: 25px;
  margin-left: 0px;
}

.site-link {
  background: url("https://data.dh.gu.se/ui-icons/arrow_link_white_circle.png");
  background-size: 18px;
  background-position: 0px 50%;
  background-repeat: no-repeat;
  padding-left: 25px;

}

.links-stack {
  margin-right: 20px;
}

.links-stack a {
  display: block;
}

#developer-info a:link {
  font-weight: 200;
}

.citationjub {
  font-size: 0.8em !important;

  padding-left: 20px;
  padding-top: 0px;


}

@media (max-width: 1000px) {
  .citationjub {
    display: none;
  }
}
</style>