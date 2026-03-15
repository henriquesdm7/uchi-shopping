<script setup lang="ts">
import type {AuthFormField} from "@nuxt/ui/components/AuthForm.vue";

definePageMeta({
  layout: "guest",
})

const toast = useToast();

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
</script>

<template>
  <div class="flex justify-center p-4">
    <UPageCard class="w-full max-w-md">
      <UAuthForm title="Acessar minha conta"
                 description="Faça login para acessar sua conta"
                 :fields="fields"
                 :providers="providers"
                 separator="ou"/>
    </UPageCard>
  </div>
</template>

<style scoped>

</style>
