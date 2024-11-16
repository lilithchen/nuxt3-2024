<script setup>
const route = useRoute();
</script>

<template>
  <div>Page: {{ route.fullPath }}</div>
</template>

<style scoped></style>
