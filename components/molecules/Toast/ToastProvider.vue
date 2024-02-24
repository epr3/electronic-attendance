<script setup lang="ts">
import { type ToastProviderProps } from "radix-vue";

const props = defineProps<ToastProviderProps>();
</script>

<template>
  <RdxToastProvider v-bind="props">
    <slot />
  </RdxToastProvider>
</template>
