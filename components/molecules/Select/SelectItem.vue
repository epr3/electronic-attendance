<script setup lang="ts">
import { type SelectItemProps } from "radix-vue";

const props = defineProps<SelectItemProps & { class?: string }>();
</script>

<template>
  <RdxSelectItem
    v-bind="props"
    :class="
      cn(
        'relative cursor-pointer flex w-full select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm hover:bg-gray3 outline-none focus:bg-accent focus:text-accent-dark data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        $attrs.class ?? ''
      )
    "
  >
    <span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <RdxSelectItemIndicator>
        <div class="i-heroicons-check h-4 w-4" />
      </RdxSelectItemIndicator>
    </span>

    <SelectItemText>
      <slot />
    </SelectItemText>
  </RdxSelectItem>
</template>
