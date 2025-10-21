<template>
  <Expense v-for="expense in expenses" :key="expense.id" :expense="expense" />
</template>

<script setup lang="ts">
import Expense from "@/components/molecules/Expense.vue";

const expenses = [
  {
    id: 1,
    title: "Groceries",
    amount: 50.0,
    date: "2024-06-01",
    paidBy: "Scooter",
  },
  {
    id: 2,
    title: "Utilities",
    amount: 75.5,
    date: "2024-06-03",
    paidBy: "Scooter",
  },
  {
    id: 3,
    title: "Transport",
    amount: 20.0,
    date: "2024-06-05",
    paidBy: "Scooter",
  },
];
</script>
