<script setup lang="ts">
import PriceChart from '~/components/PriceChart.vue'

definePageMeta({
  layout: 'auth',
})

const route = useRoute()
const productId = route.params.id as string

const {data: stats, pending, error} = await useFetch<any>(`/api/products/${productId}`)

if (error.value) {
  throw createError({statusCode: 404, message: 'Produto não encontrado'})
}

function formatCurrency(value: number | undefined) {
  if (value === undefined) return ''
  return new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(value)
}

function formatDate(dateString: string | Date | undefined) {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('pt-BR')
}

// Chart Data Preparation
const chartData = computed(() => {
  if (!stats.value?.history) return { labels: [], datasets: [] }

  const history = stats.value.history
  const markets = [...new Set(history.map((h: any) => h.marketName))]

  const allDates = [...new Set(history.map((h: any) => formatDate(h.date)))].sort((a: any, b: any) => {
    const [d1, m1, y1] = a.split('/').map(Number)
    const [d2, m2, y2] = b.split('/').map(Number)
    return new Date(y1, m1 - 1, d1).getTime() - new Date(y2, m2 - 1, d2).getTime()
  })

  const colors = [
    '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'
  ]

  const datasets = markets.map((market, index) => {
    const marketHistory = history.filter((h: any) => h.marketName === market)

    // Map existing dates to points, null for missing dates
    const data = allDates.map(dateStr => {
      const match = marketHistory.find((h: any) => formatDate(h.date) === dateStr)
      return match ? match.price : null
    })

    return {
      label: market,
      data: data,
      borderColor: colors[index % colors.length],
      backgroundColor: colors[index % colors.length] + '20',
      tension: 0.3,
      spanGaps: true
    }
  })

  return {
    labels: allDates,
    datasets
  }
})
</script>

<template>
  <UContainer class="py-8">
    <div v-if="pending" class="flex justify-center p-8">
      <UIcon name="i-lucide-loader-2" class="animate-spin w-8 h-8 text-primary"/>
    </div>

    <div v-else-if="stats" class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <UButton icon="i-lucide-arrow-left" variant="ghost" to="/cadastros/produtos" color="neutral"/>
          <div>
            <h1 class="text-xl font-bold">{{ stats.product.name }}</h1>
            <p v-if="stats.product.category" class="text-sm text-gray-500 dark:text-gray-400">
              Categoria: {{ stats.product.category.name }}
            </p>
          </div>
        </div>
      </div>

      <!-- Price Evolution Chart -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-trending-up" class="w-5 h-5 text-primary"/>
            <h2 class="font-semibold">Evolução de Preços</h2>
          </div>
        </template>
        <div class="p-4">
          <PriceChart :data="chartData"/>
        </div>
      </UCard>

      <!-- Market Stats -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <UCard v-for="market in stats.marketsSummary" :key="market.name">
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-store" class="w-4 h-4 text-gray-400"/>
              <h3 class="font-medium">{{ market.name }}</h3>
            </div>
          </template>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-500">Média:</span>
              <span class="font-semibold">{{ formatCurrency(market.avg) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Mínimo:</span>
              <span class="text-green-600 font-semibold">{{ formatCurrency(market.min) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Máximo:</span>
              <span class="text-red-600 font-semibold">{{ formatCurrency(market.max) }}</span>
            </div>
            <div class="flex justify-between border-t pt-2 mt-2">
              <span class="text-gray-500">Total de compras:</span>
              <span>{{ market.count }}</span>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Full History Table -->
      <UCard>
        <template #header>
          <h2 class="font-semibold">Histórico de Preços</h2>
        </template>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead
              class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-400 border-b dark:border-gray-700">
            <tr>
              <th scope="col" class="px-6 py-3">Data</th>
              <th scope="col" class="px-6 py-3">Mercado</th>
              <th scope="col" class="px-6 py-3 text-right">Preço</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(h, index) in stats.history" :key="index"
                class="bg-white border-b dark:bg-gray-900 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <td class="px-6 py-4">{{ formatDate(h.date) }}</td>
              <td class="px-6 py-4">{{ h.marketName }}</td>
              <td class="px-6 py-4 text-right font-medium">{{ formatCurrency(h.price) }}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </UCard>
    </div>
  </UContainer>
</template>

