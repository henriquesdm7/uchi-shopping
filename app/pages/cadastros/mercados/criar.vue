<script setup lang="ts">
import {CreateMarketSchema} from "#shared/utils/market.schema";
import type {CreateMarketInput} from "#shared/utils/market.schema";

definePageMeta({
  layout: 'auth',
})

const state = reactive<CreateMarketInput>({
  name: '',
  address: '',
  latitude: undefined,
  longitude: undefined,
})

const isLoading = ref(false);
const toast = useToast();

async function handleSubmit() {
  isLoading.value = true;
  try {
    await $fetch('/api/markets', {
      method: 'POST',
      body: state
    })
    toast.add({title: 'Sucesso', description: 'Mercado criado com sucesso!', color: 'success'})
    await navigateTo('/cadastros/mercados')
  } catch (e) {
    toast.add({title: 'Erro', description: 'Não foi possível criar o mercado', color: 'error'})
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
          <UButton icon="i-lucide-arrow-left" variant="ghost" to="/cadastros/mercados" color="neutral"/>
          <div>
            <h1 class="text-xl font-bold">Novo Mercado</h1>
            <p class="text-sm text-gray-500 dark:text-gray-400">Preencha os dados abaixo para cadastrar um novo estabelecimento.</p>
          </div>
        </div>
      </template>

      <UForm :schema="CreateMarketSchema" :state="state" class="space-y-6" @submit="handleSubmit">
        <div class="space-y-6">
          <UFormField label="Nome do Estabelecimento" name="name" required help="Nome visível nas listas de compras">
            <UInput v-model="state.name" placeholder="Ex: Supermercado Central" icon="i-lucide-store" size="lg" autofocus/>
          </UFormField>

          <UFormField label="Endereço Completo" name="address">
            <UTextarea v-model="state.address" placeholder="Rua, Número, Bairro, Cidade..." :rows="3" />
          </UFormField>

          <div class="relative py-2">
            <div class="absolute inset-0 flex items-center">
              <span class="w-full border-t border-gray-300 dark:border-gray-700"/>
            </div>
            <div class="relative flex justify-center text-xs uppercase">
              <span class="bg-white dark:bg-gray-900 px-2 text-gray-500">Geolocalização (Opcional)</span>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UFormField label="Latitude" name="latitude">
              <UInput type="number" step="any" v-model.number="state.latitude" icon="i-lucide-map-pin" placeholder="-23.550520"/>
            </UFormField>

            <UFormField label="Longitude" name="longitude">
              <UInput type="number" step="any" v-model.number="state.longitude" icon="i-lucide-map-pin" placeholder="-46.633308"/>
            </UFormField>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-800 mt-6">
            <UButton variant="ghost" to="/cadastros/mercados" color="neutral">Cancelar</UButton>
            <UButton type="submit" :loading="isLoading" icon="i-lucide-save" size="md">Salvar Cadastro</UButton>
        </div>
      </UForm>
    </UCard>
  </UContainer>
</template>

