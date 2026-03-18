<script setup lang="ts">
import type {Market} from '@prisma/client'

definePageMeta({
  layout: 'auth',
})

const {data: markets, refresh} = await useFetch<Market[]>('/api/markets')
const toast = useToast();

async function handleDelete(id: string) {
  if (!confirm('Tem certeza que deseja excluir este mercado?')) return;

  try {
    await $fetch(`/api/markets/${id}`, {method: 'DELETE'})
    toast.add({title: 'Sucesso', description: 'Mercado excluído com sucesso!', color: 'success'})
    await refresh()
  } catch (e) {
    toast.add({title: 'Erro', description: 'Não foi possível excluir o mercado', color: 'error'})
  }
}

const getItems = (row: Market) => [
  {
    label: 'Editar',
    icon: 'i-lucide-pencil',
    onSelect: () => navigateTo(`/cadastros/mercados/${row.id}`)
  },
  {
    label: 'Excluir',
    icon: 'i-lucide-trash-2',
    color: 'error' as const,
    onSelect: () => handleDelete(row.id)
  }
]
</script>

<template>
  <UContainer class="py-8">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-store" class="w-6 h-6 text-primary"/>
            <h1 class="text-xl font-bold">Mercados</h1>
          </div>
          <UButton icon="i-lucide-plus" to="/cadastros/mercados/criar">Novo Mercado</UButton>
        </div>
      </template>

      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead
            class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-400 border-b dark:border-gray-700">
          <tr>
            <th scope="col" class="px-6 py-3">Nome</th>
            <th scope="col" class="px-6 py-3">Endereço</th>
            <th scope="col" class="px-6 py-3 text-right">Ações</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="market in markets" :key="market.id"
              class="bg-white border-b dark:bg-gray-900 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
            <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">
              {{ market.name }}
            </td>
            <td class="px-6 py-4 text-gray-500 dark:text-gray-400">
              {{ market.address }}
            </td>
            <td class="px-6 py-4 text-right">
              <UDropdownMenu :items="getItems(market)">
                <UButton color="neutral" variant="ghost" icon="i-lucide-more-horizontal"/>
              </UDropdownMenu>
            </td>
          </tr>
          <tr v-if="!markets?.length">
            <td colspan="3" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
              Nenhum mercado cadastrado
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </UCard>
  </UContainer>
</template>

