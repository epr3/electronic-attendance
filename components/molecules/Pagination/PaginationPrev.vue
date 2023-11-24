<script setup lang="ts">
import { type PaginationPrevProps, useForwardProps } from "radix-vue";

const props = withDefaults(defineProps<PaginationPrevProps>(), {
  asChild: true,
});
const forwarded = useForwardProps(props);
</script>

<template>
  <RdxPaginationPrev v-bind="forwarded" as-child>
    <Button
      size="icon"
      variant="outline"
      class="disabled:(cursor-not-allowed bg-gray-200 text-black)"
    >
      <slot>
        <div class="i-heroicons-chevron-left h-4 w-4" />
      </slot>
    </Button>
  </RdxPaginationPrev>
</template>
