<template>
  <div id="gallery-container">
    <div class="summary-content">
      <!-- bar charts -->
      <div class="charts">
      <!-- last chart spans the full row -->
        <div v-for="(c, i) in barCharts" :key="c.title"
          :class="['chart-card', { 'span-2': barCharts.length % 2 === 1 && i === barCharts.length - 1 }]"> 
          <div class="chart-title">{{ c.title }}</div>
          <VueECharts :option="c.option" renderer="canvas" autoresize class="chart" :ref="el => (chartRefs[i] = el)" />
          <div class="dl-actions">
            <button class="dl-btn" @click="downloadCsv(i, c.title)">CSV</button>
            <button class="dl-btn" @click="downloadPng(i, c.title)">PNG</button>
          </div>
        </div>
      </div>

      <!-- timeline -->
      <div class="chart-card full-width" v-if="hasTimelineData">
        <div class="chart-title">{{ $t('approxDistribution') }}</div>
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
import { ref, nextTick, computed, watch } from 'vue'
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
import { storeToRefs } from 'pinia';
import { inscriptionsStore } from './settings/store';

const chartRefs = ref([])
const { surfaceParams, imgParams } = storeToRefs(inscriptionsStore())

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

async function downloadPng(index, title) {
  await nextTick()
  const comp = chartRefs.value[index]
  const inst = comp?.chart
  if (!inst) return

  const dataURL = inst.getDataURL({
    type: 'png',
    pixelRatio: 4,
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
    grid: { left: 8, right: 8, top: 10, bottom: rotate ? 12 : 30 },
    tooltip: { trigger: 'axis' },
    dataset: { source: dataset },
    xAxis: {
      type: 'category',
      axisLine: { lineStyle: { color: '#333' } },
      // by defining background color (can be transparent) and width for the axisLabel the labels take up the same space and the bars have the same baseline
      axisLabel: { color: '#222', backgroundColor: "rgba(255, 255, 255, 0)", interval: 0, rotate, margin: 10, width: 90 },
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

  const charts = []
  const pushIfData = (items, title, mapper, rotate = 45) => {
    if (!Array.isArray(items) || items.length === 0) return
    const rows = [['Label', 'Count'], ...items.map(mapper)]
    charts.push({ title, option: makeBarOption(title, rows, rotate) })
  }

  pushIfData(
    s.type_of_inscription,
    i18n.global.t('inscriptiontypes'),
    it => [pick(it, 'type', 'type_ukr'), it.count]
  )
  pushIfData(
    s.writing_system,
    i18n.global.t('writingsystems'),
    it => [pick(it, 'writing_system', 'writing_system_ukr'), it.count]
  )
  pushIfData(
    s.language,
    i18n.global.t('languages'),
    it => [pick(it, 'language', 'language_ukr'), it.count]
  )
  pushIfData(
    s.pictorial_description,
    i18n.global.t('pictorialdescriptions'),
    it => [pick(it, 'pictorial_description', 'pictorial_description_ukr'), it.count]
  )
  pushIfData(
    s.textual_genre,
    i18n.global.t('textualgenres'),
    it => [pick(it, 'textual_genre', 'textual_genre_ukr'), it.count]
  )

  return charts
})

const timelineDataset = computed(() => {
  const arr = Array.isArray(summaryPayload.value?.avg_year) ? summaryPayload.value.avg_year : []
  if (!arr.length) return [['Year', 'Count']]
  const rows = arr
    .filter(it => Number.isFinite(+it.avg_year) && Number.isFinite(+it.count))
    .sort((a, b) => a.avg_year - b.avg_year)
    .map(it => [String(it.avg_year), it.count])
  return [['Year', 'Count'], ...rows]
})

const hasTimelineData = computed(() => timelineDataset.value.length > 1)

const timelineOption = computed(() => ({
  backgroundColor: 'transparent',
  grid: { left: 8, right: 8, top: 10, bottom: 35 },
  tooltip: { trigger: 'axis' },
  dataset: { source: timelineDataset.value },
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
  series: [{ type: 'line', smooth: true, symbol: 'circle', symbolSize: 0, itemStyle: { color: 'rgb(200,80,80)' } }],
  textStyle: { color: '#444' },
}))

const summaryQueryString = computed(() => {
  const merged = {
    ...surfaceParams.value,
    ...imgParams.value,
  };

  const transformed = Object.fromEntries(
    Object.entries(merged).map(([key, value]) =>
      key === 'panel__title__startswith' ? ['panel_title_str', value] : [key, value]
    )
  );

  return new URLSearchParams(transformed).toString();
});

async function fetchSummary() {
  const baseUrl = 'https://saintsophia.dh.gu.se/api/inscriptions/summary/'
  const query = summaryQueryString.value
  const url = query ? `${baseUrl}?${query}` : baseUrl
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)

  summaryPayload.value = await res.json()
}

watch(
  () => [surfaceParams.value, imgParams.value],
  () => {
    console.log('Summary params changed:', {
      surfaceParams: surfaceParams.value,
      imgParams: imgParams.value,
      query: summaryQueryString.value,
    });
    fetchSummary().catch(console.error)
  },
  { immediate: true, deep: true }
)

defineExpose({ downloadCsv, downloadPng })
</script>

<style scoped>
#gallery-container {
  position: absolute;
  margin-left: 510px;
  width: calc(100% - 510px);
  height: calc(100% - 80px);
  color: white;
  opacity: 0.9;
  padding: 20px;
  overflow-y: auto;
  background-color: var(--theme-1);
  user-select: none;
  -webkit-user-select: none;
}

.charts {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  align-items: stretch;
}

.chart-card {
  color: black;
  position: relative;
  padding: 12px;
  width: 100%;
  padding-bottom: 0px;
  padding-top: 6px;
  animation-duration: 0.5s;
  animation-name: pop-up;
}

.chart-card.full-width {
  grid-column: 1 / -1;
  margin-top: 16px;
  padding-bottom: 15px;
}

.chart-card.span-2 {
  grid-column: 1 / -1;
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
  margin-left: 2px;
  font-weight: 400;
}

@media (max-width: 900px) {
  .charts {
    grid-template-columns: 1fr;
  }

  .chart-title {
    display: block;
    max-width: 65%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}

.chart {
  width: 100%;
  height: 260px;
}

.chart.tall {
  height: 300px;
}

.chart.low {
  height: 200px;
}

.summary-content {
  max-width: 1400px;
  margin: 70px auto 0;
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
