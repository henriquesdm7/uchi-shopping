<script setup lang="ts">

definePageMeta({
  layout: 'auth',
})

const {data: purchases, refresh} = await useFetch<any[]>('/api/purchases')

function formatDate(dateString: string | Date) {
  return new Date(dateString).toLocaleDateString('pt-BR');
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(value);
}

const getItems = (row: any) => [
  [{
    label: 'Detalhes',
    icon: 'i-lucide-eye',
    onSelect: () => navigateTo(`/compras/${row.id}`)
  }]
]
</script>

<template>
  <UContainer class="py-8">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-history" class="w-6 h-6 text-primary"/>
            <h1 class="text-xl font-bold">Histórico de Compras</h1>
          </div>
          <UButton icon="i-lucide-plus" to="/compras/registro">Registrar Compra</UButton>
        </div>
      </template>

      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead
            class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-400 border-b dark:border-gray-700">
          <tr>
            <th scope="col" class="px-6 py-3">Data</th>
            <th scope="col" class="px-6 py-3">Mercado</th>
            <th scope="col" class="px-6 py-3 text-right">Total</th>
            <th scope="col" class="px-6 py-3 text-right">Ações</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="purchase in purchases" :key="purchase.id"
              class="bg-white border-b dark:bg-gray-900 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
            <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">
              {{ formatDate(purchase.date) }}
            </td>
            <td class="px-6 py-4 text-gray-500 dark:text-gray-400">
              {{ purchase.market.name }}
            </td>
            <td class="px-6 py-4 text-right font-medium text-gray-900 dark:text-white">
              {{ formatCurrency(purchase.total) }}
            </td>
            <td class="px-6 py-4 text-right">
              <UDropdownMenu :items="getItems(purchase)">
                <UButton color="neutral" variant="ghost" icon="i-lucide-more-horizontal"/>
              </UDropdownMenu>
            </td>
          </tr>
          <tr v-if="!purchases?.length">
            <td colspan="4" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
              Nenhuma compra registrada
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </UCard>
  </UContainer>
</template>


