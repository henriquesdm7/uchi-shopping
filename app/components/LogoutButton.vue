<script setup lang="ts">
const router = useRouter();
const toast = useToast();

function handleLogout() {
  $fetch('/api/logout', {method: 'POST'}).then(() => router.push('/login'));
  toast.add({title: 'Logout', description: 'Você saiu da sua conta', color: 'primary'})
}
</script>

<template>
  <UButton variant="outline" color="error" @click="handleLogout">
    Sair
  </UButton>
</template>

<style scoped>

</style>
