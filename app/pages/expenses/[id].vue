<template>
  <div>
    <!-- Back button -->
    <button @click="$router.back()">← Back</button>
    <h1>Expense Detail</h1>
    <!-- Your expense detail -->
    <p>Expense ID: {{ $route.params.id }}</p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "default",
});
</script>
