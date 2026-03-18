<script setup lang="ts">
import type {Product, Category} from '@prisma/client'

definePageMeta({
  layout: 'auth',
})

const {data: products} = await useFetch<any[]>('/api/products')

const search = ref('')
const filteredProducts = computed(() => {
  if (!search.value) return products.value
  return products.value?.filter(p => p.name.toLowerCase().includes(search.value.toLowerCase()))
})

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(value);
}

const getItems = (row: any) => [
  {
    label: 'Detalhes & Evolução',
    icon: 'i-lucide-line-chart',
    onSelect: () => navigateTo(`/cadastros/produtos/${row.id}`)
  }
]
</script>

<template>
  <UContainer class="py-8">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-package" class="w-6 h-6 text-primary"/>
            <h1 class="text-xl font-bold">Produtos</h1>
          </div>
          <UInput v-model="search" icon="i-lucide-search" placeholder="Buscar produto..." class="w-64"/>
        </div>
      </template>

      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-400 border-b dark:border-gray-700">
          <tr>
            <th scope="col" class="px-6 py-3">Nome</th>
            <th scope="col" class="px-6 py-3">Categoria</th>
            <th scope="col" class="px-6 py-3 text-right">Preço Médio</th>
            <th scope="col" class="px-6 py-3 text-right">Compras</th>
            <th scope="col" class="px-6 py-3 text-right">Ações</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="product in filteredProducts" :key="product.id" class="bg-white border-b dark:bg-gray-900 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
            <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">
              {{ product.name }}
            </td>
            <td class="px-6 py-4 text-gray-500 dark:text-gray-400">
              <span v-if="product.category" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                <UIcon :name="product.category.icon || 'i-lucide-tag'" class="w-3 h-3 mr-1"/>
                {{ product.category.name }}
              </span>
              <span v-else class="text-gray-400 italic">Sem categoria</span>
            </td>
            <td class="px-6 py-4 text-right">
              {{ formatCurrency(product.averagePrice) }}
            </td>
            <td class="px-6 py-4 text-right">
              {{ product.purchaseCount }}
            </td>
            <td class="px-6 py-4 text-right">
              <UDropdownMenu :items="[getItems(product)]">
                <UButton color="neutral" variant="ghost" icon="i-lucide-more-horizontal"/>
              </UDropdownMenu>
            </td>
          </tr>
          <tr v-if="!filteredProducts?.length">
            <td colspan="5" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
              Nenhum produto encontrado
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </UCard>
  </UContainer>
</template>

