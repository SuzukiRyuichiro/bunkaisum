<template>
  <div class="py-2">
    <UTabs :items="items">
      <template #expenses>
        <OrganismsExpenseList :expenses="expenses" />
      </template>
      <template #balances>
        <OrganismsBalanceList />
      </template>
    </UTabs>
  </div>
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

const { data: expenses } = await useFetch("/api/expenses");
</script>
