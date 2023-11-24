<script setup lang="ts">
import {
  type DropdownMenuRadioItemEmits,
  type DropdownMenuRadioItemProps,
  useEmitAsProps,
} from "radix-vue";

const props = defineProps<DropdownMenuRadioItemProps>();

const emits = defineEmits<DropdownMenuRadioItemEmits>();
</script>

<template>
  <RdxDropdownMenuRadioItem
    v-bind="{ ...props, ...useEmitAsProps(emits) }"
    :class="
      cn(
        'flex relative items-center rounded-md transition-colors data-[disabled]:opacity-50 data-[disabled]:pointer-events-none data-[highlighted]:bg-outline-hover pl-7 py-1.5 text-sm outline-none select-none cursor-default',
        $attrs.class ?? ''
      )
    "
  >
    <span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <RdxDropdownMenuItemIndicator>
        <div class="h-2 w-2 i-heroicons-check-circle fill-current" />
      </RdxDropdownMenuItemIndicator>
    </span>
    <slot />
  </RdxDropdownMenuRadioItem>
</template>
