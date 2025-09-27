<template>
  <div id="gallery-container">
    <div class="summary-content">
      <!-- bar charts -->
      <div class="charts">
        <div class="chart-card" v-for="(c, i) in barCharts" :key="c.title">
          <div class="chart-title">{{ c.title }}</div>
          <VueECharts :option="c.option" renderer="canvas" autoresize class="chart" :ref="el => (chartRefs[i] = el)" />
          <div class="dl-actions">
            <button class="dl-btn" @click="downloadCsv(i, c.title)">CSV</button>
            <button class="dl-btn" @click="downloadPng(i, c.title)">PNG</button>
          </div>
        </div>
      </div>

      <!-- timeline -->
      <div class="chart-card full-width">
        <div class="chart-title">Inscriptions per Year</div>
        <VueECharts :option="timelineOption" renderer="canvas" autoresize class="chart tall"
          :ref="el => (chartRefs['timeline'] = el)" />
        <div class="dl-actions">
          <button class="dl-btn" @click="downloadCsv('timeline', 'Inscription Year')">CSV</button>
          <button class="dl-btn" @click="downloadPng('timeline', 'Inscription Year')">PNG</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import VueECharts from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DatasetComponent,
  TitleComponent,
} from 'echarts/components'
import { BarChart, LineChart } from 'echarts/charts'

const chartRefs = ref([])

use([
  CanvasRenderer,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DatasetComponent,
  TitleComponent,
  BarChart,
  LineChart,
])

// fake data...
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

function downloadDataURL(dataURL, filename) {
  const a = document.createElement('a')
  a.href = dataURL
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
}

async function downloadPng(index, title) {
  await nextTick()
  const comp = chartRefs.value[index]
  const inst = comp?.chart
  if (!inst) return
  const url = inst.getDataURL({
    type: 'png',
    pixelRatio: 2,
    backgroundColor: '#000',
  })
  downloadDataURL(url, `${title.replace(/\s+/g, '_').toLowerCase()}.png`)
}

function getDatasetSource(index) {
  if (index === 'timeline') {
    return timelineOption.value?.dataset?.source || []
  }
  const item = barCharts.value[index]
  return item?.option?.dataset?.source || []
}

function downloadCsv(index, title) {
  const source = getDatasetSource(index)
  if (!source?.length) return

  const csv = source.map(r => r.join(',')).join('\n')
  const BOM = '\uFEFF'
  const url = URL.createObjectURL(new Blob([BOM + csv], { type: 'text/csv;charset=utf-8' }))

  const a = document.createElement('a')
  a.href = url
  a.download = title + '.csv'
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 0)
}

function makeBarOption(title, dataset, rotate = 0) {
  return {
    backgroundColor: 'transparent',
    grid: { left: 8, right: 8, top: 10, bottom: rotate ? 48 : 30, containLabel: true },
    tooltip: { trigger: 'axis' },
    dataset: { source: dataset },
    xAxis: {
      type: 'category',
      axisLine: { lineStyle: { color: '#bbb' } },
      axisLabel: {
        color: '#ddd',
        interval: 0,
        rotate,
        margin: 10,
      },
    },
    yAxis: {
      axisLine: { lineStyle: { color: '#bbb' } },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
      axisLabel: { color: '#ddd' },
    },
    series: [{ type: 'bar', barMaxWidth: 28, emphasis: { focus: 'series' }, itemStyle: { color: 'rgb(200,80,80)' } }],
    textStyle: { color: '#ddd' },
  }
}

const barCharts = ref([
  { title: 'Inscription types', option: makeBarOption('Type', data.typeOfInscription, 45) },
  { title: 'Writing systems', option: makeBarOption('Writing', data.writingSystem, 45) },
  { title: 'Languages', option: makeBarOption('Language', data.language, 45) },
    { title: 'Pictorial descriptions', option: makeBarOption('Pictorial', data.pictorialDescription, 90) },
  { title: 'Textual genres', option: makeBarOption('Genre', data.textualGenre, 90) },

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
  series: [{ type: 'line', symbol: 'none', smooth: true, itemStyle: { color: 'rgb(200,80,80)' } }],
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
  position: relative;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-width:1px 0px 0px 0px;
  border-radius: 12px;
  padding: 12px;
  flex: 1 1 420px;
}

.chart-card.full-width {
  flex: 1 1 100%;
  margin-top: 16px;
}

.chart-card.half-width {
  flex: 1 1 48%;
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

  .summary-content {
    padding-bottom: 25vh;
  }
}

.dl-actions {
  position: absolute;
  right: 10px;
  bottom: 8px;
  display: flex;
  gap: 8px;
}

.dl-btn {
  font-size: 12px;
  padding: 6px 8px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.18);
  color: #fff;
  border-radius: 8px;
  cursor: pointer;
}

.dl-btn:hover {
  background: rgba(255, 255, 255, 0.18);
}


</style>
