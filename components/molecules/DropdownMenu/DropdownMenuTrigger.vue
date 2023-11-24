<script setup lang="ts">
import { type DropdownMenuTriggerProps } from "radix-vue";

const props = defineProps<DropdownMenuTriggerProps>();
</script>

<template>
  <RdxDropdownMenuTrigger class="outline-none" v-bind="props">
    <slot />
  </RdxDropdownMenuTrigger>
</template>
