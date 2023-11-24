<script setup lang="ts">
import { type DropdownMenuItemProps } from "radix-vue";

const props = defineProps<DropdownMenuItemProps & { inset?: boolean }>();
</script>

<template>
  <RdxDropdownMenuItem
    v-bind="props"
    :class="[
      cn(
        'relative flex cursor-default select-none items-center rounded-sm px-4 py-2 text-sm outline-none transition-colors focus:(bg-brand-shade-dark text-white) data-[disabled]:(pointer-events-none opacity-50)',
        inset && 'pl-8',
        $attrs.class ?? ''
      ),
    ]"
  >
    <slot />
  </RdxDropdownMenuItem>
</template>
