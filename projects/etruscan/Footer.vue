<template>
  <footer id="footer">
    <div id="developer-info">
      <div class="links-stack">
        <a class="site-link link" href="https://github.com/gu-gridh/etruscantombs#etruscan-tombs" target="_blank">GitHub repository and development</a>
        <a class="site-link link" href="https://github.com/gu-gridh/etruscantombs#database-and-api-documentation" target="_blank">Database and API documentation</a>
      </div>
      <div class="links-stack border-style">
      <a class="site-link link" href="https://github.com/gu-gridh/etruscantombs#datasets" target="_blank">Dataset documentation</a>
      <a href="#" class="download-link link" @click="downloadData">Download the structured data</a>
    </div>
    </div>
    <div class="partners">
     
      <a href="https://isvroma.org">
        <div class="PartnerLogo" id="">ISVROMA</div>
      </a>
      <a href="https://dh.gu.se/">
        <div class="GRIDHLogo" id="">GU / GRIDH</div>
      </a>
  </div>
  </footer>
</template>

<script setup>

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

<style src="./styles/footer.css"></style>
