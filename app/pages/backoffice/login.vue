<template>
  <LoginForm />
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'backoffice-layout',
  middleware: 'auth'
})

useHead({
  title: 'Login | PINTU SDN Sukapura 01',
  link: [
    {
      rel: 'icon',
      type: 'image/jpeg',
      href: '/logo-sekolah.jpg'
    }
  ]
})
</script>
