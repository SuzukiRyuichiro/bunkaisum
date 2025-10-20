<template>
  <div>
    <UNavigationMenu :items="items" />
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
const items = ref([
  {
    label: "Expenses",
    icon: "i-lucide-book-open",
    to: "/expenses",
  },
  {
    label: "Balance",
    icon: "i-lucide-box",
    to: "/balances",
  },
]);
</script>
