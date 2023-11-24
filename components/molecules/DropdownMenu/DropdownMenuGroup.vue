<script setup lang="ts">
import { type DropdownMenuGroupProps } from "radix-vue";

const props = defineProps<DropdownMenuGroupProps>();
</script>

<template>
  <RdxDropdownMenuGroup v-bind="props">
    <slot />
  </RdxDropdownMenuGroup>
</template>
