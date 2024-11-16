<script setup>
const route = useRoute();
</script>

<template>
  <div>
    <h1>Page: {{ route.fullPath }}</h1>
    <NuxtLink to="/account/login">Login</NuxtLink> | <NuxtLink to="/account/signup">Signup</NuxtLink>
  </div>
</template>

<style scoped></style>
