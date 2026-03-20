<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

const {user} = useUserSession();
</script>

<template>
  <UContainer>
    <h2 class="text-lg">Boas-vindas, {{ user?.name }}!</h2>

    <!-- TODO:  NuxtUI NavigationMenu Vertical  -->
  </UContainer>
</template>
