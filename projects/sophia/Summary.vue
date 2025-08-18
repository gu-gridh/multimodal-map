<template>
  <div id="gallery-container">
    <div class="summary-content">
      <!-- bar charts -->
      <div class="charts">
        <div class="chart-card" v-for="c in barCharts" :key="c.title">
          <div class="chart-title">{{ c.title }}</div>
          <VueECharts
            :option="c.option"
            renderer="svg"
            autoresize
            class="chart"
          />
        </div>
      </div>

      <!-- timeline -->
      <div class="chart-card full-width">
        <div class="chart-title">Inscription Year</div>
        <VueECharts
          :option="timelineOption"
          renderer="svg"
          autoresize
          class="chart tall"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import VueECharts from 'vue-echarts'
import { use } from 'echarts/core'

import { SVGRenderer } from 'echarts/renderers'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DatasetComponent,
  TitleComponent,
} from 'echarts/components'
import { BarChart, LineChart } from 'echarts/charts'

use([
  SVGRenderer,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DatasetComponent,
  TitleComponent,
  BarChart,
  LineChart,
])

//fake data...
const data = {
  typeOfInscription: [
    ['Category', 'Count'],
    ['Textual', 32],
    ['Pictorial', 18],
    ['Composite', 12],
  ],
  writingSystem: [
    ['System', 'Count'],
    ['Armenian', 51],
    ['Cyrillic', 28],
    ['Glagolitic', 9],
    ['Greek', 5],
    ['Latin', 3],
    ['Mixed script', 3],
    ['N/A', 3],
  ],
  language: [
    ['Language', 'Count'],
    ['Ancient Greek', 40],
    ['Armenian', 24],
    ['Church Slavonic', 8],
    ['Greek', 5],
    ['Latin', 5],
    ['Low German', 5],
    ['Mixed', 2],
    ['N/A', 2],
    ['Polish', 1],
    ['Ukranian', 1],
    ['Russian', 1],
  ],
  textualGenre: [
    ['Genre', 'Count'],
    ['Abecedary', 11],
    ['Alphabet', 37],
    ['Calendar', 9],
    ['Christogram', 7],
    ['Commemoration', 4],
    ['Curse', 3],
    ['Exercise', 3],
    ['Invocation', 3],
    ['List', 3],
    ['Monogram', 2],
    ['Musical notation', 2],
    ['N/A', 2],
    ['Name', 2],
    ['Name list', 1],
    ['Numbers', 1],
    ['Other', 1],
    ['Phrase', 1],
    ['Prayer', 1],
    ['Quotation', 1],
    ['Signature', 1],
    ['Theonym', 1],
    ['Travel', 1],
    ['Word', 1],
  ],
  pictorialDescription: [
    ['Motif', 'Count'],
    ['Anthropomorphic', 14],
    ['Bible stories', 21],
    ['Cross', 17],
    ['Emblem', 8],
    ['Hand', 6],
    ['Ornithomorphic', 6],
    ['Plants', 2],
    ['Religious Objects', 2],
    ['Saints', 1],
    ['Skulls', 1],
    ['Symbolism', 1],
    ['Zoomorphic', 1],
  ],

  //years
  byYear: [
    ['Year', 'Count'],
    ['-500', 2],
    ['-400', 3],
    ['-300', 5],
    ['-200', 8],
    ['-100', 10],
    ['0', 12],
    ['100', 15],
    ['200', 18],
    ['300', 14],
    ['400', 9],
    ['500', 6],
    ['600', 4],
    ['700', 3],
    ['800', 5],
    ['900', 7],
    ['1000', 11],
    ['1100', 9],
    ['1200', 13],
  ],
}

function makeBarOption(title, dataset) {
  return {
    backgroundColor: 'transparent',
    grid: { left: 8, right: 8, top: 10, bottom: 30, containLabel: true },
    tooltip: { trigger: 'axis' },
    dataset: { source: dataset },
    xAxis: {
      type: 'category',
      axisLine: { lineStyle: { color: '#bbb' } },
      axisLabel: { color: '#ddd' },
    },
    yAxis: {
      axisLine: { lineStyle: { color: '#bbb' } },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
      axisLabel: { color: '#ddd' },
    },
    series: [{ type: 'bar', barMaxWidth: 28, emphasis: { focus: 'series' } }],
    textStyle: { color: '#ddd' },
  }
}

const barCharts = ref([
  { title: 'Type of inscription', option: makeBarOption('Type', data.typeOfInscription) },
  { title: 'Writing system', option: makeBarOption('Writing', data.writingSystem) },
  { title: 'Language', option: makeBarOption('Language', data.language) },
  { title: 'Textual genre', option: makeBarOption('Genre', data.textualGenre) },
  { title: 'Pictorial description', option: makeBarOption('Pictorial', data.pictorialDescription) },
])

const timelineOption = ref({
  backgroundColor: 'transparent',
  grid: { left: 8, right: 8, top: 10, bottom: 35, containLabel: true },
  tooltip: { trigger: 'axis' },
  dataset: { source: data.byYear },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    axisLine: { lineStyle: { color: '#bbb' } },
    axisLabel: { color: '#ddd', rotate: 45, margin: 12 },
  },
  yAxis: {
    axisLine: { lineStyle: { color: '#bbb' } },
    splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
    axisLabel: { color: '#ddd' },
  },
  series: [{ type: 'line', symbol: 'none', smooth: true }],
  textStyle: { color: '#ddd' },
})
</script>

<style scoped>
#gallery-container {
  position: absolute;
  margin-left: 510px;
  width: calc(100% - 510px);
  height: calc(100% - 80px);
  background-color: black;
  color: white;
  opacity: 0.9;
  padding: 20px;
  overflow-y: auto;
}

.charts {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: stretch;
}

.chart-card {
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 12px;
  padding: 12px;
  flex: 1 1 320px;
}

.chart-card.full-width {
  flex: 1 1 100%;
  margin-top: 16px;
}

.chart-title {
  font-size: 14px;
  letter-spacing: 0.02em;
  opacity: 0.9;
  margin-bottom: 6px;
}

.chart {
  width: 100%;
  height: 240px;
}
.chart.tall {
  height: 300px;
}

.summary-content {
  max-width: 1400px;
  margin: 50px auto 0;
}

@media screen and (max-width: 900px) {
  #gallery-container {
    margin-left: 0;
    width: 100%;
    height: 100%;
  }
  .chart {
    height: 220px;
  }
}
</style>
