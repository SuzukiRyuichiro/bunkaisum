<template>
  <div>
    <!-- Back button -->
    <button @click="$router.back()">← Back</button>
    <h1>Expense Detail</h1>
    <!-- Your expense detail -->
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "default",
});
</script>
