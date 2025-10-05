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
        <div class="chart-title">Approx. distribution of new inscriptions over time</div>
        <VueECharts :option="timelineOption" renderer="canvas" autoresize class="chart low"
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
import { ref, nextTick, onMounted, computed } from 'vue'
import VueECharts from 'vue-echarts'
import i18n from '../../src/translations/sophia';
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

//years hardcoded for now
const data = {
  byYear: [
    ['Year', 'Count'],
    ['1000', 11],
    ['1100', 60],
    ['1200', 130],
    ['1300', 345],
    ['1400', 678],
    ['1500', 532],
    ['1600', 33],
    ['1700', 0],
    ['1800', 10],
    ['1900', 13],
    ['2000', 13],
  ],
}

async function downloadPng(index, title) {
  await nextTick()
  const comp = chartRefs.value[index]
  const inst = comp?.chart
  if (!inst) return

  const dataURL = inst.getDataURL({
    type: 'png',
    pixelRatio: 8,
    backgroundColor: 'rgb(255,255,255)',
  })

  const blob = await (await fetch(dataURL)).blob()
  const url = URL.createObjectURL(blob)
  const filename = `${title.replace(/\s+/g, '_').toLowerCase()}.png`
  save(url, filename)
}

function getDatasetSource(index) {
  if (index === 'timeline') {
    return timelineOption.value?.dataset?.source || []
  }
  const item = barCharts.value[index]
  return item?.option?.dataset?.source || []
}

function save(url, name) {
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.rel = 'noopener'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1500)
}

function downloadCsv(index, title) {
  const source = getDatasetSource(index)
  if (!source?.length) return

  const esc = v => {
    if (v == null) return ''
    const s = String(v)
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }

  const csv = source.map(row => row.map(esc).join(',')).join('\n')
  const BOM = '\uFEFF'
  const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const filename = `${title.replace(/\s+/g, '_').toLowerCase()}.csv`
  save(url, filename)
}

function makeBarOption(_title, dataset, rotate = 0) {
  return {
    backgroundColor: 'transparent',
    grid: { left: 8, right: 8, top: 10, bottom: rotate ? 12 : 30},
    tooltip: { trigger: 'axis' },
    dataset: { source: dataset },
    xAxis: {
      type: 'category',
      axisLine: { lineStyle: { color: '#333' } },
      axisLabel: { color: '#222', interval: 0, rotate, margin: 10 },
    },
    yAxis: {
      axisLine: { lineStyle: { color: '#222' } },
      splitLine: { lineStyle: { color: 'rgba(0,0,0,0.1)' } },
      axisLabel: { color: '#444' },
    },
    series: [{ type: 'bar', barMaxWidth: 28, emphasis: { focus: 'series' }, itemStyle: { color: 'rgb(180,80,80)' } }],
    textStyle: { color: '#444' },
  }
}

const summaryPayload = ref(null)
const isUk = computed(() => {
  const loc = typeof i18n.global.locale === 'object' && 'value' in i18n.global.locale
    ? i18n.global.locale.value
    : i18n.global.locale
  return String(loc).toLowerCase().startsWith('uk')
})

function pick(obj, enKey, ukKey) {
  return isUk.value ? (obj[ukKey] ?? obj[enKey]) : (obj[enKey] ?? obj[ukKey])
}

const barCharts = computed(() => {
  const s = summaryPayload.value
  if (!s) return []

  const typeRows = [['Category', 'Count'],
  ...s.type_of_inscription.map(it => [pick(it, 'type', 'type_ukr'), it.count])]
  const writingRows = [['System', 'Count'],
  ...s.writing_system.map(it => [pick(it, 'writing_system', 'writing_system_ukr'), it.count])]
  const languageRows = [['Language', 'Count'],
  ...s.language.map(it => [pick(it, 'language', 'language_ukr'), it.count])]
  const pictorialRows = [['Motif', 'Count'],
  ...s.pictorial_description.map(it => [pick(it, 'pictorial_description', 'pictorial_description_ukr'), it.count])]
  const textualRows = [['Genre', 'Count'],
  ...s.textual_genre.map(it => [pick(it, 'textual_genre', 'textual_genre_ukr'), it.count])]

  return [
    { title: i18n.global.t('inscriptiontypes'), option: makeBarOption('Type', typeRows, 45) },
    { title: i18n.global.t('writingsystems'), option: makeBarOption('Writing', writingRows, 45) },
    { title: i18n.global.t('languages'), option: makeBarOption('Language', languageRows, 45) },
    { title: i18n.global.t('pictorialdescriptions'), option: makeBarOption('Pictorial', pictorialRows, 90) },
    { title: i18n.global.t('textualgenres'), option: makeBarOption('Genre', textualRows, 90) },
  ]
})

const timelineOption = ref({
  backgroundColor: 'transparent',
  grid: { left: 8, right: 8, top: 10, bottom: 35},
  tooltip: { trigger: 'axis' },
  dataset: { source: data.byYear },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    axisLine: { lineStyle: { color: '#222' } },
    axisLabel: { color: '#444', rotate: 45, margin: 12 },
  },
  yAxis: {
    axisLine: { lineStyle: { color: '#bbb' } },
    splitLine: { lineStyle: { color: 'rgba(0,0,0,0.1)' } },
    axisLabel: { color: '#444' },
  },
  series: [{ type: 'line', symbol: 'none', smooth: true, itemStyle: { color: 'rgb(200,80,80)' } }],
  textStyle: { color: '#444' },
})

async function fetchSummary() {
  const res = await fetch('https://saintsophia.dh.gu.se/api/inscriptions/summary/')
  if (!res.ok) throw new Error(`HTTP ${res.status}`)

  summaryPayload.value = await res.json()
}

onMounted(() => {
  fetchSummary().catch(console.error)
})

defineExpose({ downloadCsv, downloadPng })
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
    background-color: var(--theme-1);
}

.charts {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: stretch;
  min-height:660px;

}

.chart-card {
  color:black;
  position: relative;
/*   background: rgba(255, 255, 255, 0.06);
  background: linear-gradient(0deg, rgba(30, 30, 30, 1.0) 0px, rgba(70, 70, 70, 1)100%) !important;
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-width: 1px 0px 0px 0px;
  border-radius: 12px; */
  padding: 12px;
  flex: 1 1 320px;
  padding-bottom: 15px;
  padding-top: 6px;
  animation-duration: 0.5s;
   animation-name: pop-up;
}

.chart-card.full-width {
  flex: 1 1 100%;
  margin-top: 16px;
  padding-bottom: 15px;
}

@keyframes pop-up {
    from {
      scale: 80% 80%;
        opacity: 1;
    }

    to {
        scale: 100% 100%;
        opacity: 1;
    }
}

.chart-title {
  font-size: 16px;
  letter-spacing: 0.02em;
  opacity: 0.9;
  margin-bottom: 6px;
  margin-left:2px;
  font-weight:400;
}

.chart {
  width: 100%;
  height: 275px;
}

.chart.tall {
  height: 300px;
}

.chart.low {
  height: 200px;
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
  top: 8px;
  display: flex;
  gap: 6px;
}

.dl-btn {
  font-size: 12px;
  padding: 2px 8px;
  background: rgba(255, 255, 255, 0.3);
  /* border: 1px solid rgba(255, 255, 255, 0.18); */
  color: black;
  border-radius: 6px;
  cursor: pointer;
  
}

.dl-btn:hover {
  background: rgba(255, 255, 255, 0.18);
    transform: scale(1.1);
}
</style>
