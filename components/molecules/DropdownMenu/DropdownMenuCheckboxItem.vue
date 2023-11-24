<script setup lang="ts">
import {
  type DropdownMenuCheckboxItemEmits,
  type DropdownMenuCheckboxItemProps,
  useEmitAsProps,
} from "radix-vue";

const props = defineProps<DropdownMenuCheckboxItemProps>();
const emits = defineEmits<DropdownMenuCheckboxItemEmits>();
</script>

<template>
  <RdxDropdownMenuCheckboxItem
    v-bind="{ ...props, ...useEmitAsProps(emits) }"
    :class="
      cn(
        'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-brand-accent-dark data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        $attrs.class ?? ''
      )
    "
  >
    <span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuItemIndicator>
        <div class="w-4 h-4 i-heroicons-check" />
      </DropdownMenuItemIndicator>
    </span>
    <slot />
  </RdxDropdownMenuCheckboxItem>
</template>
