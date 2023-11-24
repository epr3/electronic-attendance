<script setup lang="ts">
import { type DropdownMenuSeparatorProps } from "radix-vue";

const props = defineProps<DropdownMenuSeparatorProps>();
</script>

<template>
  <RdxDropdownMenuSeparator
    v-bind="props"
    class="-mx-1 my-1 h-px bg-gray-300"
  />
</template>
