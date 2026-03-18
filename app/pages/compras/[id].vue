<script setup lang="ts">
// Using any type for purchase here to simplify deep relation types, ideally define proper interface
const route = useRoute()
const purchaseId = route.params.id as string

const {data: purchase, pending, error, refresh} = await useFetch<any>(`/api/purchases/${purchaseId}`)
const toast = useToast()

if (error.value) {
  throw createError({statusCode: 404, message: 'Compra não encontrada'})
}

function formatDate(dateString: string | Date | undefined) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('pt-BR', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'});
}

function formatCurrency(value: number | undefined) {
  if (value === undefined) return '';
  return new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(value);
}

// Editing state
const editingItem = ref<string | null>(null)
const editForm = reactive({
  quantity: 0,
  unitPrice: 0
})

function startEdit(item: any) {
  editingItem.value = item.id
  editForm.quantity = item.quantity
  editForm.unitPrice = item.unitPrice
}

function cancelEdit() {
  editingItem.value = null
}

async function saveEdit(item: any) {
  try {
    await $fetch(`/api/purchases/items/${item.id}`, {
      method: 'PUT',
      body: {
        quantity: editForm.quantity,
        unitPrice: editForm.unitPrice
      }
    })

    await refresh()
    editingItem.value = null
    toast.add({title: 'Sucesso', description: 'Item atualizado', color: 'success'})
  } catch (e) {
    toast.add({title: 'Erro', description: 'Falha ao atualizar item', color: 'error'})
  }
}
</script>

<template>
  <UContainer class="py-8">
    <div v-if="pending" class="flex justify-center p-8">
      <UIcon name="i-lucide-loader-2" class="animate-spin w-8 h-8 text-primary"/>
    </div>

    <div v-else-if="purchase" class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <UButton icon="i-lucide-arrow-left" variant="ghost" to="/compras/historico" color="neutral"/>
          <div>
            <h1 class="text-xl font-bold">{{ purchase.market.name }}</h1>
            <p class="text-sm text-gray-500 dark:text-gray-400 capitalize">{{ formatDate(purchase.date) }}</p>
          </div>
        </div>
        <div class="text-right">
          <p class="text-sm text-gray-500 dark:text-gray-400">Total</p>
          <p class="text-2xl font-bold text-primary">{{ formatCurrency(purchase.total) }}</p>
        </div>
      </div>

      <!-- Items List -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-shopping-bag" class="w-5 h-5"/>
            <h2 class="font-semibold">Itens da Compra ({{ purchase.items.length }})</h2>
          </div>
        </template>

        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-400 border-b dark:border-gray-700">
              <tr>
                <th scope="col" class="px-6 py-3">Produto</th>
                <th scope="col" class="px-6 py-3">Categoria</th>
                <th scope="col" class="px-6 py-3 text-right">Qtd</th>
                <th scope="col" class="px-6 py-3 text-right">Preço Unit.</th>
                <th scope="col" class="px-6 py-3 text-right">Total</th>
                <th scope="col" class="px-6 py-3 text-right w-10">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in purchase.items" :key="item.id" class="bg-white border-b dark:bg-gray-900 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">
                  {{ item.product.name }}
                </td>
                <td class="px-6 py-4 text-gray-500 dark:text-gray-400">
                  <span v-if="item.product.category" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                    {{ item.product.category.name }}
                  </span>
                  <span v-else class="text-gray-400 italic">Sem categoria</span>
                </td>

                <!-- Editable Quantity -->
                <td class="px-6 py-4 text-right">
                  <div v-if="editingItem === item.id" class="flex justify-end">
                    <UInput v-model.number="editForm.quantity" type="number" step="any" class="w-20 text-right" size="xs" autofocus />
                  </div>
                  <span v-else>{{ item.quantity }}</span>
                </td>

                <!-- Editable Unit Price -->
                <td class="px-6 py-4 text-right">
                  <div v-if="editingItem === item.id" class="flex justify-end">
                    <UInput v-model.number="editForm.unitPrice" type="number" step="0.01" class="w-24 text-right" size="xs" />
                  </div>
                  <span v-else>{{ formatCurrency(item.unitPrice) }}</span>
                </td>

                <!-- Calculated Total -->
                <td class="px-6 py-4 text-right font-medium">
                  {{ formatCurrency(item.totalPrice) }}
                </td>

                <!-- Actions -->
                <td class="px-6 py-4 text-right">
                   <div v-if="editingItem === item.id" class="flex items-center gap-1 justify-end">
                     <UButton icon="i-lucide-check" size="xs" color="success" square variant="soft" @click="saveEdit(item)"/>
                     <UButton icon="i-lucide-x" size="xs" color="error" square variant="soft" @click="cancelEdit"/>
                   </div>
                   <div v-else class="flex justify-end">
                     <UButton icon="i-lucide-pencil" size="xs" color="neutral" variant="ghost" square @click="startEdit(item)"/>
                   </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </UCard>
    </div>
  </UContainer>
</template>

