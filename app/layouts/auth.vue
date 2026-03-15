<script setup lang="ts">

</script>

<template>
  <UHeader>
    <template #left>
      <NuxtLink to="/">
        <AppLogo class="w-auto h-6 shrink-0"/>
      </NuxtLink>
    </template>
    <template #right>
      <UColorModeButton/>
    </template>
  </UHeader>
  <UMain>
    <slot/>
  </UMain>
  <UFooter>
    <div class="text-center text-sm text-gray-500">
      &copy; {{ new Date().getFullYear() }} SuportIA. Todos os direitos reservados.
    </div>
  </UFooter>
</template>

<style scoped>

</style>
