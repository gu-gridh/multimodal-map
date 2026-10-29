<template>
  <footer id="footer">
    <div id="developer-info">
      <div class="links-stack">
        <router-link class="site-link link" to="/">Start page</router-link>
        <router-link class="site-link link" to="/about">About Forsviks bruk</router-link>
      </div>
      <div class="links-stack border-style">
        <router-link class="site-link link" to="/guide">User guide</router-link>
        <router-link class="site-link link" to="/map">Explore the map</router-link>
      </div>
    </div>
    <div class="partners">
      <router-link to="/"><div class="PartnerLogo">Forsviks bruk</div></router-link>
      <a href="https://dh.gu.se/"><div class="GRIDHLogo">GU / GRIDH</div></a>
    </div>
  </footer>
</template>

<style src="../etruscan/styles/footer.css"></style>
