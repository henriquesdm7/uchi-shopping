<script setup lang="ts">
import {CreateUserSchema} from "#shared/utils/user.schema";

definePageMeta({
  layout: 'auth',
})

const state = reactive<CreateUserInput>({
  name: '',
  email: '',
  password: '',
})

const isLoading = ref(false);

async function handleSubmit() {
  isLoading.value = true;

  try {
    const response = await $fetch('/api/users', {
      method: 'POST',
      body: state
    })

    console.log(response)
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <UForm :schema="CreateUserSchema" :state="state" @submit="handleSubmit">
    <UFormField label="Nome" name="name" required>
      <UInput v-model="state.name"/>
    </UFormField>

    <UFormField label="Email" name="email" required>
      <UInput v-model="state.email"/>
    </UFormField>

    <UFormField label="Senha" name="password" required>
      <UInput type="password" v-model="state.password"/>
    </UFormField>

    <UButton :loading="isLoading" type="submit">Enviar</UButton>
  </UForm>
</template>
