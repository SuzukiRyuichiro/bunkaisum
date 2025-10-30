<template>
  <div>
    <OrganismsExpenseList :expenses="expenses" />
  </div>
</template>

<script setup lang="ts">
import type { ExpenseWithPayer } from "~~/server/api/expenses/index.get";

const { data: expenses } = await useFetch<ExpenseWithPayer[]>("/api/expenses");
</script>
