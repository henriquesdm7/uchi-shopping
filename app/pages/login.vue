<script setup lang="ts">
import type {AuthFormField} from "@nuxt/ui/components/AuthForm.vue";
import {type PasswordLoginInput, PasswordLoginSchema} from "#shared/utils/auth.schema";
import {type FormSubmitEvent} from "@nuxt/ui/runtime/types";

definePageMeta({
  layout: "guest",
})

const toast = useToast();
const isLoading = ref(false);

const fields: AuthFormField[] = [{
  name: 'email',
  type: 'email',
  label: 'Email',
  required: true,
}, {
  name: 'password',
  type: 'password',
  label: 'Senha',
  required: true,
}]

const providers = [{
  label: 'Github',
  icon: 'i-simple-icons-github',
  onClick: () => {
    toast.add({title: 'Login com Github', description: 'Em breve', color: 'warning', icon: 'i-simple-icons-github'});
  }
}]

async function onSubmit(event: FormSubmitEvent<PasswordLoginInput>) {
  isLoading.value = true;

  const response = await $fetch('/api/login', {
    method: 'POST',
    body: event.data,
  });

  isLoading.value = false;
}
</script>

<template>
  <div class="flex justify-center p-4">
    <UPageCard class="w-full max-w-md">
      <UAuthForm title="Acessar minha conta"
                 description="Faça login para acessar sua conta"
                 :schema="PasswordLoginSchema"
                 :fields="fields"
                 :providers="providers"
                 separator="ou"
                 :loading="isLoading"
                 @submit="onSubmit"/>
    </UPageCard>
  </div>
</template>

<style scoped>

</style>
