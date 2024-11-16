<script setup>
const route = useRoute();
</script>

<template>
  <h1>Page: {{ route.fullPath }}</h1>
</template>

<style scoped></style>
