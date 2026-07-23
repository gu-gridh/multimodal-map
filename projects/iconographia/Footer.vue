<template>
  <footer id="footer">
    <div id="developer-info">
      <div class="links-stack">
        <a class="site-link link" href="https://github.com/gu-gridh/iconographia?tab=readme-ov-file#iconographia-app"
          target="_blank" rel="noopener">GitHub repository and development</a>
        <a class="site-link link"
          href="https://github.com/gu-gridh/documentation/blob/main/gridh-projects/iconographia.md#database-and-api-documentation"
          target="_blank" rel="noopener">Database and API documentation</a>
      </div>
      <div class="links-stack border-style">
        <a class="site-link link"
          href="https://github.com/gu-gridh/documentation/blob/main/gridh-projects/iconographia.md#dataset-documentation"
          target="_blank" rel="noopener">Dataset documentation</a>
        <a class="site-link link"
          href="https://github.com/gu-gridh/documentation/blob/main/gridh-projects/iconographia.md#development-team"
          target="_blank" rel="noopener">Development team</a>
      </div>
    </div>
    <div class="partners">
      <a href="https://www.gu.se/">
        <div class="PartnerLogo">GU</div>
      </a>
      <a href="https://dh.gu.se/">
        <div class="GRIDHLogo">GRIDH</div>
      </a>
    </div>
  </footer>
</template>

<style scoped>
/* The big footer shared by the other multimodal-map projects
   (adapted from projects/etruscan/Footer.vue to our flex layout). */
#footer {
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  background-color: #222;
  color: white;
  line-height: 1;
  height: 82px;
  width: 100%;
  font-size: 12px;
  font-family: "Barlow Condensed", sans-serif;
  flex-shrink: 0;
  z-index: 60;
}

#developer-info {
  display: flex;
  align-items: flex-end;
  margin-left: 30px;
  padding-bottom: 14px;
  font-size: 1.5em;
  line-height: 1.4;
  font-weight: 200;
}

.links-stack {
  margin-right: 20px;
}

.links-stack a {
  display: block;
  font-weight: 200;
}

.border-style {
  border-width: 0 0 0 0.5px;
  border-color: white;
  border-style: dashed;
  padding-left: 20px;
  padding-right: 10px;
}

.link,
.link:visited {
  color: white;
  text-decoration: none;
}

.link:hover {
  opacity: 0.8;
}

.site-link {
  background: url("https://data.dh.gu.se/ui-icons/arrow_link_white_circle.png");
  background-size: 18px;
  background-position: 0px 50%;
  background-repeat: no-repeat;
  padding-left: 25px;
}

.partners {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.partners a {
  text-decoration: none;
  color: white;
}

.GRIDHLogo,
.PartnerLogo {
  text-align: left;
  font-weight: 100;
  font-size: 30px;
  line-height: 0.8;
  padding: 0px 50px 0px 30px;
}

.PartnerLogo {
  padding-right: 30px;
  border-width: 0px 0.5px 0px 0px;
  border-color: white;
  border-style: solid;
}

@media screen and (max-width: 900px) {
  #developer-info {
    font-size: 1.1em;
    margin-left: 14px;
  }

  .GRIDHLogo,
  .PartnerLogo {
    font-size: 22px;
    padding: 0 18px;
  }
}
</style>
