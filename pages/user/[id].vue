<script setup>
const route = useRoute();
</script>

<template>
  <div>
    <h1>Page: {{ route.fullPath }}</h1>
    <NuxtLink to="/user/npc/order">User order</NuxtLink> |
    <NuxtLink to="/user/npc/profile">User profile</NuxtLink>
  </div>
</template>

<style scoped></style>
