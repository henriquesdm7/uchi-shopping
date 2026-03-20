<script setup lang="ts">
import { ref } from 'vue';

definePageMeta({ layout: 'auth' });

const route = useRoute();
const listId = route.params.id as string;

const { data: list, refresh: refreshList } = await useFetch(`/api/shopping-lists/${listId}`);
const { data: products } = await useFetch<any[]>('/api/products');

const newItemName = ref('');
const isAdding = ref(false);

async function addItem() {
  if (!newItemName.value.trim()) return;
  isAdding.value = true;
  
  try {
    await $fetch(`/api/shopping-lists/${listId}/items`, {
      method: 'POST',
      body: { name: newItemName.value.trim(), quantity: 1 }
    });
    newItemName.value = '';
    await refreshList();
  } catch (error) {
    console.error('Erro ao adicionar item', error);
  } finally {
    isAdding.value = false;
  }
}

async function toggleChecked(item: { id: string; checked: boolean }) {
  try {
    await $fetch(`/api/shopping-lists/items/${item.id}`, {
      method: 'PUT',
      body: { checked: !item.checked }
    });
    await refreshList();
  } catch (error) {
    console.error('Erro ao atualizar item', error);
  }
}

async function changeQuantity(item: any, amount: number) {
  const newQtd = item.quantity + amount;
  if (newQtd < 1) return;
  
  // Atualiza otimisticamente a prop do item
  item.quantity = newQtd;
  
  try {
    await $fetch(`/api/shopping-lists/items/${item.id}`, {
      method: 'PUT',
      body: { quantity: newQtd }
    });
    // Força a re-vincular os dados do backend para garantir a reatividade visual no Nuxt
    await refreshList();
  } catch (error) {
    console.error('Erro ao atualizar quantidade', error);
    item.quantity -= amount;
  }
}

async function deleteItem(itemId: string) {
  try {
    await $fetch(`/api/shopping-lists/items/${itemId}`, { method: 'DELETE' });
    await refreshList();
  } catch (error) {
    console.error('Erro ao excluir item', error);
  }
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}
</script>

<template>
  <UContainer class="py-8">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <UButton to="/listas" variant="ghost" icon="i-lucide-arrow-left" color="neutral" />
            <h1 class="text-xl font-bold" v-if="list">{{ list.name }}</h1>
          </div>
          
          <form @submit.prevent="addItem" class="flex items-center gap-2">
            <div class="relative w-64">
              <input 
                v-model="newItemName" 
                list="products-datalist" 
                placeholder="Nome do produto..."
                class="w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-white dark:bg-gray-900 px-3 py-1.5 text-sm text-gray-900 dark:text-white"
                required
              />
              <datalist id="products-datalist" v-if="products">
                <option v-for="p in products" :key="p.id" :value="p.name"></option>
              </datalist>
            </div>
            <UButton type="submit" color="primary" :loading="isAdding" icon="i-lucide-plus">
              Adicionar
            </UButton>
          </form>
        </div>
      </template>

      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-400 border-b dark:border-gray-700">
            <tr>
              <th scope="col" class="px-6 py-3 w-12"></th>
              <th scope="col" class="px-6 py-3 text-center w-32">Qtd</th>
              <th scope="col" class="px-6 py-3">Produto</th>
              <th scope="col" class="px-6 py-3">Menor Preço Atual (30d)</th>
              <th scope="col" class="px-6 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody v-if="list">
            <tr v-for="item in list.items" :key="item.id" class="bg-white border-b dark:bg-gray-900 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <td class="px-6 py-4">
                <UCheckbox
                  :model-value="item.checked"
                  @update:model-value="toggleChecked(item)"
                />
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center justify-center gap-2">
                  <UButton variant="ghost" color="neutral" icon="i-lucide-minus" size="xs" :disabled="item.quantity <= 1" @click="changeQuantity(item, -1)" />
                  <span class="w-4 text-center">{{ item.quantity }}</span>
                  <UButton variant="ghost" color="neutral" icon="i-lucide-plus" size="xs" @click="changeQuantity(item, 1)" />
                </div>
              </td>
              <td class="px-6 py-4 font-medium text-gray-900 dark:text-white" :class="{'line-through text-gray-500': item.checked}">
                <div class="flex items-center gap-2">
                  {{ item.name }}
                  <UButton v-if="item.productId" :to="`/cadastros/produtos/${item.productId}`" variant="link" color="primary" class="p-0" icon="i-lucide-external-link" target="_blank" />
                </div>
              </td>
              <td class="px-6 py-4 text-gray-500 dark:text-gray-400">
                <div v-if="item.bestPrice" class="flex flex-col">
                  <span class="text-green-600 dark:text-green-400 font-medium">
                    {{ formatCurrency(item.bestPrice.price) }}
                  </span>
                  <span class="text-xs text-gray-500">
                    em {{ item.bestPrice.marketName }} ({{ new Date(item.bestPrice.date).toLocaleDateString('pt-BR') }})
                  </span>
                </div>
                <span v-else class="text-xs text-gray-400 italic">Sem histórico recente</span>
              </td>
              <td class="px-6 py-4 text-right">
                <UButton variant="ghost" color="error" icon="i-lucide-trash-2" @click="deleteItem(item.id)" />
              </td>
            </tr>
            <tr v-if="!list.items?.length">
              <td colspan="5" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                Sua lista está vazia. Adicione produtos acima.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </UCard>
  </UContainer>
</template>
