<script setup lang="ts">
import {CreateCategorySchema} from "#shared/utils/category.schema";
import type {CreateCategoryInput} from "#shared/utils/category.schema";

definePageMeta({
  layout: 'auth',
})

const state = reactive<CreateCategoryInput>({
  name: '',
  icon: '',
})

const isLoading = ref(false);
const toast = useToast();

async function handleSubmit() {
  isLoading.value = true;
  try {
    await $fetch('/api/categories', {
      method: 'POST',
      body: state
    })
    toast.add({title: 'Sucesso', description: 'Categoria criada com sucesso!', color: 'success'})
    await navigateTo('/cadastros/categorias')
  } catch (e: any) {
    if (e.statusCode === 409) {
      toast.add({title: 'Erro', description: 'Já existe uma categoria com este nome', color: 'error'})
    } else {
      toast.add({title: 'Erro', description: 'Não foi possível criar a categoria', color: 'error'})
    }
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <UContainer class="py-8">
    <UCard>
      <template #header>
        <div class="flex items-center gap-4">
          <UButton icon="i-lucide-arrow-left" variant="ghost" to="/cadastros/categorias" color="neutral"/>
          <div>
            <h1 class="text-xl font-bold">Nova Categoria</h1>
            <p class="text-sm text-gray-500 dark:text-gray-400">Preencha os dados abaixo para cadastrar uma nova categoria.</p>
          </div>
        </div>
      </template>

      <UForm :schema="CreateCategorySchema" :state="state" class="space-y-6" @submit="handleSubmit">
        <div class="space-y-6">
          <UFormField label="Nome da Categoria" name="name" required help="Nome visível nas listas de compras">
            <UInput v-model="state.name" placeholder="Ex: Hortifruti" icon="i-lucide-tag" size="lg" autofocus/>
          </UFormField>

          <UFormField label="Ícone (Opcional)" name="icon" help="Nome do ícone Lucide (ex: i-lucide-apple)">
            <UInput v-model="state.icon" placeholder="i-lucide-..." icon="i-lucide-image"/>
          </UFormField>

          <div v-if="state.icon" class="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
            <span class="text-sm text-gray-500">Preview:</span>
            <UIcon :name="state.icon" class="w-6 h-6"/>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-800 mt-6">
            <UButton variant="ghost" to="/cadastros/categorias" color="neutral">Cancelar</UButton>
            <UButton type="submit" :loading="isLoading" icon="i-lucide-save" size="md">Salvar Cadastro</UButton>
        </div>
      </UForm>
    </UCard>
  </UContainer>
</template>

