<script setup lang="ts">
import { type DropdownMenuSubTriggerProps } from "radix-vue";

const props = defineProps<DropdownMenuSubTriggerProps>();
</script>

<template>
  <RdxDropdownMenuSubTrigger
    v-bind="props"
    :class="[
      cn(
        'flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent',
        $attrs.class ?? ''
      ),
    ]"
  >
    <slot />
    <div class="ml-auto h-4 w-4 i-heroicons-chevron-right" />
  </RdxDropdownMenuSubTrigger>
</template>
