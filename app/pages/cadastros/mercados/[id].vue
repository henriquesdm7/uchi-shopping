<script setup lang="ts">
import {UpdateMarketSchema} from "#shared/utils/market.schema";
import type {UpdateMarketInput} from "#shared/utils/market.schema";

definePageMeta({
  layout: 'auth',
})

const route = useRoute()
const marketId = route.params.id as string

const {data: market, pending, error} = await useFetch(`/api/markets/${marketId}`)

if (error.value) {
  throw createError({statusCode: 404, statusMessage: 'Mercado não encontrado'})
}

const state = reactive<UpdateMarketInput>({
  name: market.value?.name ?? '',
  address: market.value?.address ?? '',
  latitude: market.value?.latitude ?? undefined,
  longitude: market.value?.longitude ?? undefined,
})

const isLoading = ref(false);
const toast = useToast();

async function handleSubmit() {
  isLoading.value = true;
  try {
    await $fetch(`/api/markets/${marketId}`, {
      method: 'PUT',
      body: state
    })
    toast.add({title: 'Sucesso', description: 'Mercado atualizado com sucesso!', color: 'success'})
    await navigateTo('/cadastros/mercados')
  } catch (e) {
    toast.add({title: 'Erro', description: 'Não foi possível atualizar o mercado', color: 'error'})
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
            <h1 class="text-xl font-bold">Editar Mercado</h1>
            <p class="text-sm text-gray-500 dark:text-gray-400">Atualize as informações do estabelecimento.</p>
          </div>
        </div>
      </template>

      <div v-if="pending" class="flex justify-center p-4">
        <UIcon name="i-lucide-loader-2" class="animate-spin w-8 h-8 text-primary"/>
      </div>

      <UForm v-else :schema="UpdateMarketSchema" :state="state" class="space-y-6" @submit="handleSubmit">
        <div class="space-y-6">
          <UFormField label="Nome do Estabelecimento" name="name" required>
            <UInput v-model="state.name" placeholder="Ex: Supermercado Central" icon="i-lucide-store" size="lg"/>
          </UFormField>

          <UFormField label="Endereço Completo" name="address">
            <UTextarea v-model="state.address" placeholder="Rua, Número, Bairro, Cidade..." :rows="3" />
          </UFormField>

          <div class="relative py-2">
            <div class="absolute inset-0 flex items-center">
              <span class="w-full border-t border-gray-300 dark:border-gray-700"/>
            </div>
            <div class="relative flex justify-center text-xs uppercase">
              <span class="bg-white dark:bg-gray-900 px-2 text-gray-500">Geolocalização</span>
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
          <UButton type="submit" :loading="isLoading" icon="i-lucide-save" size="md">Salvar Alterações</UButton>
        </div>
      </UForm>
    </UCard>
  </UContainer>
</template>

