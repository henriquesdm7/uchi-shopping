<script setup lang="ts">

import LogoutButton from "~/components/LogoutButton.vue";
import AuthMenu from "~/components/layout/AuthMenu.vue";
</script>

<template>
  <div>
    <UHeader>
      <template #left>
        <NuxtLink to="/">
          <AppLogo class="w-auto h-6 shrink-0"/>
        </NuxtLink>
      </template>
      <template #right>
        <UColorModeSelect/>
        <LogoutButton/>
      </template>
    </UHeader>
    <div class="w-full border-b border-default">
      <AuthMenu
        class="w-full max-w-(--ui-container) mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 h-full"/>
    </div>
  </div>
  <UMain>
    <slot/>
  </UMain>
  <UFooter>
    <div class="text-center text-sm text-gray-500">
      &copy; {{ new Date().getFullYear() }} Uchi Shopping. Todos os direitos reservados.
    </div>
  </UFooter>
</template>

<style scoped>

</style>
