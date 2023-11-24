<script setup lang="ts">
import { type PaginationFirstProps, useForwardProps } from "radix-vue";

const props = withDefaults(defineProps<PaginationFirstProps>(), {
  asChild: true,
});
const forwarded = useForwardProps(props);
</script>

<template>
  <RdxPaginationFirst v-bind="forwarded" as-child>
    <Button size="icon" variant="outline">
      <slot>
        <div class="i-heroicons-chevron-double-left h-4 w-4" />
      </slot>
    </Button>
  </RdxPaginationFirst>
</template>
