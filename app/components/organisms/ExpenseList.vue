<template>
  <div v-if="expenses">
    <MoleculesExpense
      v-for="expense in expenses"
      :key="expense.id"
      :expense="expense"
    />
  </div>
  <div v-else>Loading...</div>
</template>

<script setup lang="ts">
import type { InternalApi } from "nitropack";

type ApiResponse = InternalApi["/api/expenses"]["get"];

defineProps<{
  expenses?: ApiResponse;
}>();
</script>
