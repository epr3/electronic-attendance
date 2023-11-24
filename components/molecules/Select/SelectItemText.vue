<script setup lang="ts">
import { type SelectItemTextProps } from "radix-vue";

const props = defineProps<SelectItemTextProps>();
</script>

<template>
  <RdxSelectItemText v-bind="props">
    <slot />
  </RdxSelectItemText>
</template>
