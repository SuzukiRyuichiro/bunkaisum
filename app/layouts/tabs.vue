<template>
  <UTabs :items="items">
    <template #expenses>
      <ExpenseList />
    </template>
    <template #balances>
      <BalanceList />
    </template>
  </UTabs>
</template>

<script setup lang="ts">
import ExpenseList from "@/components/organisms/ExpenseList.vue";

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
