<script setup lang="ts">

definePageMeta({
  layout: 'auth',
})

const {data: categories, refresh} = await useFetch<any[]>('/api/categories')
const toast = useToast();

async function handleDelete(id: string) {
  if (!confirm('Tem certeza que deseja excluir esta categoria?')) return;

  try {
    await $fetch(`/api/categories/${id}`, {method: 'DELETE'})
    toast.add({title: 'Sucesso', description: 'Categoria excluída com sucesso!', color: 'success'})
    await refresh()
  } catch (e: any) {
    if (e.statusCode === 500) {
      toast.add({title: 'Erro', description: 'Não é possível excluir categoria em uso.', color: 'error'})
    } else {
      toast.add({title: 'Erro', description: 'Não foi possível excluir a categoria', color: 'error'})
    }
  }
}

const getItems = (row: any) => [
  {
    label: 'Editar',
    icon: 'i-lucide-pencil',
    onSelect: () => navigateTo(`/cadastros/categorias/${row.id}`)
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
            <UIcon name="i-lucide-tag" class="w-6 h-6 text-primary"/>
            <h1 class="text-xl font-bold">Categorias</h1>
          </div>
          <UButton icon="i-lucide-plus" to="/cadastros/categorias/criar">Nova Categoria</UButton>
        </div>
      </template>

      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-400 border-b dark:border-gray-700">
          <tr>
            <th scope="col" class="px-6 py-3">Nome</th>
            <th scope="col" class="px-6 py-3 text-right">Ações</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="category in categories" :key="category.id" class="bg-white border-b dark:bg-gray-900 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
            <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">
              <div class="flex items-center gap-2">
                <UIcon :name="category.icon || 'i-lucide-tag'" class="w-4 h-4 text-gray-400"/>
                {{ category.name }}
              </div>
            </td>
            <td class="px-6 py-4 text-right">
              <UDropdownMenu :items="[getItems(category)]">
                <UButton color="neutral" variant="ghost" icon="i-lucide-more-horizontal"/>
              </UDropdownMenu>
            </td>
          </tr>
          <tr v-if="!categories?.length">
            <td colspan="2" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
              Nenhuma categoria cadastrada
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </UCard>
  </UContainer>
</template>

