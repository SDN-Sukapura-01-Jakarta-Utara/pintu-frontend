<template>
  <LoginForm />
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'backoffice-layout',
  middleware: 'auth'
})
</script>
