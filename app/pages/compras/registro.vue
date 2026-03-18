<script setup lang="ts">
import {RegisterShoppingSchema} from "#shared/utils/shopping.schema";
import type {RegisterShoppingInput} from "#shared/utils/shopping.schema";

definePageMeta({
  layout: 'auth',
})

const fileInputRef = ref<HTMLInputElement | null>(null)
const imagePreview = ref<string | null>(null)

const state = reactive<Partial<RegisterShoppingInput>>({
  marketId: undefined,
  date: new Date().toISOString().split('T')[0],
  file: undefined,
})

// MOCK: Lista de supermercados para seleção (futuramente virá do banco de dados)
const {data: markets} = await useFetch('/api/markets')

function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    state.file = file

    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

function clearImage() {
  imagePreview.value = null
  state.file = undefined
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

const isLoading = ref(false);
const toast = useToast();

async function handleSubmit() {
  if (!state.file) return;

  isLoading.value = true;
  const formData = new FormData();
  formData.append('marketId', state.marketId || '');
  formData.append('date', state.date || '');
  formData.append('file', state.file);

  try {
    const response = await $fetch('/api/purchases', {
      method: 'POST',
      body: formData,
    });
    console.log(response);
    toast.add({title: 'Sucesso', description: 'Compra registrada para processamento!', color: 'success'})
  } catch (e) {
    console.error(e);
    toast.add({title: 'Erro', description: 'Falha ao enviar o registro.', color: 'error'})
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <UContainer class="py-8">
    <UCard>
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-receipt" class="w-6 h-6 text-primary"/>
          <h1 class="text-xl font-bold">Registrar Compra</h1>
        </div>
        <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Faça upload da foto da NF-e para iniciar o registro.
        </p>
      </template>

      <UForm :schema="RegisterShoppingSchema" class="space-y-6" :state="state" @submit="handleSubmit">
        <!-- Área de Upload -->
        <UFormField label="Foto da NF-e" name="file" required>
          <div
            class="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-950/30 transition-all min-h-50 w-full"
            @click="!imagePreview && fileInputRef?.click()"
          >
            <template v-if="!imagePreview">
              <div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-3">
                <UIcon name="i-lucide-upload-cloud" class="w-8 h-8 text-gray-400"/>
              </div>
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                Clique para selecionar ou arraste o arquivo aqui
              </p>
              <p class="text-xs text-gray-500 mt-1">PNG, JPG, JPEG</p>
            </template>

            <template v-else>
              <div class="relative group">
                <img :src="imagePreview" alt="Preview da NF-e"
                     class="max-h-80 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 object-contain"/>
                <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <UButton
                    color="error"
                    variant="solid"
                    icon="i-lucide-trash-2"
                    size="sm"
                    @click.stop="clearImage"
                  />
                </div>
              </div>
              <UButton
                v-if="imagePreview"
                size="xs"
                color="neutral"
                variant="ghost"
                class="mt-4"
                @click.stop="fileInputRef?.click()"
              >
                Trocar imagem
              </UButton>
            </template>

            <input
              ref="fileInputRef"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleFileChange"
            />
          </div>
        </UFormField>

        <div class="relative py-2">
          <div class="absolute inset-0 flex items-center">
            <span class="w-full border-t border-gray-300 dark:border-gray-700"/>
          </div>
          <div class="relative flex justify-center text-xs uppercase">
            <span class="bg-white dark:bg-gray-900 px-2 text-gray-500">Informações Adicionais</span>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UFormField label="Supermercado / Estabelecimento" name="marketId" required>
            <USelectMenu
              v-model="state.marketId"
              :items="markets || []"
              placeholder="Selecione o estabelecimento"
              label-key="name"
              value-key="id"
              search-input
              icon="i-lucide-store"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Data da Compra" name="date" required>
            <UInput type="date" v-model="state.date" icon="i-lucide-calendar" class="w-full" />
          </UFormField>
        </div>

        <div class="flex justify-end gap-3">
          <UButton variant="ghost" to="/">Cancelar</UButton>
          <UButton
            color="primary"
            icon="i-lucide-sparkles"
            type="submit"
          >
            Processar com IA
          </UButton>
        </div>
      </UForm>
    </UCard>
  </UContainer>
</template>

<style scoped>

</style>
