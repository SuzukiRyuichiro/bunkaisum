<template>
  <Badge>Count: {{ count }}</Badge>
  <h1 class="font-semibold">YOYOYO</h1>
  <h1 class="text-red-600">Fuck me</h1>
  <button @click="increment">Increment</button>
  <USlider v-model="count" />
</template>

<script setup lang="ts">
const count = ref(0);

const increment = () => {
  count.value += 1;
};
</script>
