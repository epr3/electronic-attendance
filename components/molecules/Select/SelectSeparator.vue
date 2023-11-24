<script setup lang="ts">
import { type SelectSeparatorProps } from "radix-vue";

defineProps<SelectSeparatorProps>();
</script>

<template>
  <RdxSelectSeparator
    :class="cn('-mx-1 my-1 h-px bg-gray5', $attrs.class ?? '')"
  />
</template>
