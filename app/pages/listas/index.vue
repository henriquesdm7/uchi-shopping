<script setup lang="ts">
import { ref } from 'vue';

definePageMeta({ layout: 'auth' });

const { data: lists, refresh } = await useFetch('/api/shopping-lists');
const newListName = ref('');
const isCreating = ref(false);

async function createList() {
  if (!newListName.value.trim()) return;
  isCreating.value = true;
  try {
    await $fetch('/api/shopping-lists', {
      method: 'POST',
      body: { name: newListName.value.trim() }
    });
    newListName.value = '';
    await refresh();
  } catch (error) {
    console.error('Erro ao criar lista', error);
  } finally {
    isCreating.value = false;
  }
}

async function deleteList(id: string) {
  if (!confirm('Tem certeza que deseja apagar esta lista?')) return;
  try {
    await $fetch(`/api/shopping-lists/${id}`, { method: 'DELETE' });
    await refresh();
  } catch (error) {
    console.error('Erro ao excluir lista', error);
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('pt-BR');
}
</script>

<template>
  <UContainer class="py-8">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-list-todo" class="w-6 h-6 text-primary" />
            <h1 class="text-xl font-bold">Minhas Listas</h1>
          </div>
          
          <form @submit.prevent="createList" class="flex items-center gap-2">
            <UInput
              v-model="newListName"
              placeholder="Nome da nova lista"
              required
            />
            <UButton type="submit" color="primary" :loading="isCreating" icon="i-lucide-plus">Nova</UButton>
          </form>
        </div>
      </template>

      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-400 border-b dark:border-gray-700">
            <tr>
              <th scope="col" class="px-6 py-3">Nome da Lista</th>
              <th scope="col" class="px-6 py-3">Criada em</th>
              <th scope="col" class="px-6 py-3 text-center">Itens</th>
              <th scope="col" class="px-6 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="list in lists" :key="list.id" class="bg-white border-b dark:bg-gray-900 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">
                {{ list.name }}
              </td>
              <td class="px-6 py-4 text-gray-500 dark:text-gray-400">
                {{ formatDate(list.createdAt) }}
              </td>
              <td class="px-6 py-4 text-center">
                <UBadge color="neutral" variant="subtle">{{ list._count?.items || 0 }}</UBadge>
              </td>
              <td class="px-6 py-4 text-right space-x-2">
                <UButton :to="`/listas/${list.id}`" variant="ghost" color="primary" icon="i-lucide-external-link" />
                <UButton variant="ghost" color="error" icon="i-lucide-trash-2" @click="deleteList(list.id)" />
              </td>
            </tr>
            <tr v-if="!lists?.length">
              <td colspan="4" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                Nenhuma lista encontrada. Crie uma acima!
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </UCard>
  </UContainer>
</template>
