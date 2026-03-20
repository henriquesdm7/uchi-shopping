<script setup lang="ts">

definePageMeta({
  layout: 'auth',
})

const {data: products, refresh} = await useFetch<any[]>('/api/products')
const toast = useToast()

const search = ref('')
const filteredProducts = computed(() => {
  if (!search.value) return products.value
  return products.value?.filter(p => p.name.toLowerCase().includes(search.value.toLowerCase()))
})

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(value);
}

const isUnifyModalOpen = ref(false)
const selectedDuplicateProduct = ref<any>(null)
const selectedBaseProduct = ref<any>(null)
const isSubmitting = ref(false)

const openUnifyModal = (product: any) => {
  selectedDuplicateProduct.value = product
  selectedBaseProduct.value = null
  isUnifyModalOpen.value = true
}

const confirmUnification = async () => {
  if (!selectedBaseProduct.value || !selectedDuplicateProduct.value) return
  if (selectedBaseProduct.value.id === selectedDuplicateProduct.value.id) {
    toast.add({ title: 'Erro', description: 'O produto principal não pode ser igual ao duplicado.', color: 'error' })
    return
  }

  isSubmitting.value = true
  try {
    await $fetch('/api/products/unify', {
      method: 'POST',
      body: {
        baseProductId: selectedBaseProduct.value.id,
        duplicateProductId: selectedDuplicateProduct.value.id
      }
    })
    toast.add({ title: 'Sucesso', description: 'Produtos unificados com sucesso!', color: 'success' })
    isUnifyModalOpen.value = false
    await refresh()
  } catch (e: any) {
    toast.add({ title: 'Erro', description: e.data?.message || 'Falha ao unificar produtos', color: 'error' })
  } finally {
    isSubmitting.value = false
  }
}

async function handleDeleteProduct(product: any) {
  if (!confirm(`Tem certeza que deseja excluir "${product.name}"?\nEsta ação não poderá ser desfeita.`)) return

  try {
    await $fetch(`/api/products/${product.id}`, { method: 'DELETE' })
    toast.add({ title: 'Sucesso', description: 'Produto deletado com sucesso!', color: 'success' })
    await refresh()
  } catch (e: any) {
    if (e.statusCode === 409) {
      toast.add({ 
        title: 'Ação Bloqueada', 
        description: e.statusMessage || 'Produto possui vínculos. Utilize a opção de Unificação.', 
        color: 'warning', 
        icon: 'i-lucide-alert-triangle' 
      })
    } else {
      toast.add({ title: 'Erro', description: 'Falha ao excluir o produto.', color: 'error' })
    }
  }
}

const getItems = (row: any) => [
  {
    label: 'Detalhes & Evolução',
    icon: 'i-lucide-line-chart',
    onSelect: () => navigateTo(`/cadastros/produtos/${row.id}`)
  },
  {
    label: 'Unificar Produto...',
    icon: 'i-lucide-merge',
    onSelect: (e: any) => {
      e?.preventDefault?.();
      setTimeout(() => openUnifyModal(row), 50);
    }
  },
  {
    label: 'Excluir',
    icon: 'i-lucide-trash-2',
    color: 'error' as const,
    onSelect: () => handleDeleteProduct(row)
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
    
    <UModal v-model:open="isUnifyModalOpen" title="Unificar Produtos" description="Escolha o produto base para a mesclagem.">
      <template #body>
        <div class="space-y-4">
          <UAlert
            title="Atenção"
            icon="i-lucide-alert-triangle"
            color="warning"
          >
            <template #description>
              Todas as transações e listas vinculadas a <strong>{{ selectedDuplicateProduct?.name }}</strong> serão migradas para o produto principal selecionado abaixo e em seguida, o produto <strong>{{ selectedDuplicateProduct?.name }}</strong> será <strong>apagado irreversivelmente</strong> do banco de dados.
            </template>
          </UAlert>

          <UFormField label="Produto Duplicado (Será Apagado)">
            <UInput :model-value="selectedDuplicateProduct?.name" disabled class="opacity-75 relative z-0" />
          </UFormField>

          <UFormField label="Produto Principal (Base para onde migrar)">
            <USelectMenu
              v-model="selectedBaseProduct"
              :items="products?.filter(p => p.id !== selectedDuplicateProduct?.id) || []"
              label-key="name"
              search-input
              placeholder="Selecione o produto principal..."
            />
          </UFormField>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end gap-3">
          <UButton color="neutral" variant="ghost" @click="isUnifyModalOpen = false">Cancelar</UButton>
          <UButton color="error" :loading="isSubmitting" :disabled="!selectedBaseProduct" @click="confirmUnification">
            Confirmar Mesclagem Operacional
          </UButton>
        </div>
      </template>
    </UModal>
  </UContainer>
</template>

