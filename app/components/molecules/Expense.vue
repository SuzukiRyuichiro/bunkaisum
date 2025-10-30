<template>
  <nuxt-link :to="{ name: 'expenses-id', params: { id: expense.id } }">
    <div class="rounded flex items-center p-2">
      <div class="p-2">
        <Icon name="mdi:food-croissant"></Icon>
      </div>
      <div class="flex-grow">
        <h2 class="text-lg font-semibold">{{ expense.title }}</h2>
        <p class="text-muted">
          Paid by <span class="font-semibold">{{ expense.payer.name }}</span>
        </p>
      </div>
      <div class="text-right">
        <p class="font-bold">¥{{ expense.totalAmount }}</p>
      </div>
    </div>
  </nuxt-link>
</template>

<script setup lang="ts">
import type { ExpenseWithPayer } from "~~/server/api/expenses/index.get";

defineProps<{
  expense: ExpenseWithPayer;
}>();
</script>
