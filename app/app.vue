<script setup lang="ts">
import {pt_br} from "@nuxt/ui/locale";

useHead({
  meta: [
    {name: 'viewport', content: 'width=device-width, initial-scale=1'}
  ],
  link: [
    {rel: 'icon', href: '/favicon.ico'}
  ],
  htmlAttrs: {
    lang: 'pt-BR'
  }
})

const title = 'SuportIA'
const description = 'Um sistema de suporte técnico inteligente, alimentado por IA e que oferece velocidade e precisão.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
})
</script>

<template>
  <UApp :locale="pt_br">
    <NuxtLayout>
      <NuxtPage/>
    </NuxtLayout>
  </UApp>
</template>
