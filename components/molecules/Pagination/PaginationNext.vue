<script setup lang="ts">
import { type PaginationNextProps, useForwardProps } from "radix-vue";

const props = withDefaults(defineProps<PaginationNextProps>(), {
  asChild: true,
});
const forwarded = useForwardProps(props);
</script>

<template>
  <RdxPaginationNext v-bind="forwarded" as-child>
    <Button size="icon" variant="outline">
      <slot>
        <div class="i-heroicons-chevron-right h-4 w-4" />
      </slot>
    </Button>
  </RdxPaginationNext>
</template>
