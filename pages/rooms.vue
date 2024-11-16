<script setup>
const route = useRoute();
</script>

<template>
  <div>
    <h1>Page: {{ route.fullPath }}</h1>
    <NuxtLink to="/rooms/1">Room 1</NuxtLink> | <NuxtLink to="/rooms/1/booking">Room 1 Booking</NuxtLink> | <NuxtLink to="/booking/confirmation/1">Room 1 confirmation</NuxtLink>
  </div>
</template>

<style scoped></style>
