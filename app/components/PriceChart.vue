<script setup lang="ts">
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'vue-chartjs'
import type { ChartData, ChartOptions } from 'chart.js'
import type { PropType } from 'vue'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const props = defineProps({
  data: {
    type: Object as PropType<ChartData<'line'>>,
    required: true
  },
  options: {
    type: Object as PropType<ChartOptions<'line'>>,
    default: () => ({
      responsive: true,
      maintainAspectRatio: false,
    })
  }
})
</script>

<template>
  <div class="h-64 w-full">
    <Line :data="data" :options="options" />
  </div>
</template>

