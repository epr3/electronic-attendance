<script setup lang="ts">
import { type SelectValueProps } from "radix-vue";

const props = defineProps<SelectValueProps>();
</script>

<template>
  <RdxSelectValue v-bind="props">
    <slot />
  </RdxSelectValue>
</template>
