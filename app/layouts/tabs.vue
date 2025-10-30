<template>
  <UTabs :items="items">
    <template #expenses>
      <OrganismsExpenseList />
    </template>
    <template #balances>
      <OrganismsBalanceList />
    </template>
  </UTabs>
</template>

<script setup lang="ts">
const items = [
  {
    label: "Expenses",
    icon: "icon-park-outline:expenses",
    slot: "expenses",
  },
  {
    label: "Balances",
    icon: "fa7-solid:scale-unbalanced",
    slot: "balances",
  },
];
</script>
