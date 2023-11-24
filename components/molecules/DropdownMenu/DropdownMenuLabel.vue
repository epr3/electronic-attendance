<script setup lang="ts">
import { type DropdownMenuLabelProps } from "radix-vue";

const props = defineProps<
  DropdownMenuLabelProps & {
    inset?: boolean;
  }
>();
</script>

<template>
  <RdxDropdownMenuLabel
    v-bind="props"
    :class="
      cn('px-4 py-2 text-sm font-semibold', inset && 'pl-8', $attrs.class ?? '')
    "
  >
    <slot />
  </RdxDropdownMenuLabel>
</template>
