<script setup lang="ts">
import { type PaginationLastProps, useForwardProps } from "radix-vue";

const props = withDefaults(defineProps<PaginationLastProps>(), {
  asChild: true,
});
const forwarded = useForwardProps(props);
</script>

<template>
  <RdxPaginationLast v-bind="forwarded" as-child>
    <Button size="icon" variant="outline">
      <slot>
        <div class="i-heroicons-chevron-double-right h-4 w-4" />
      </slot>
    </Button>
  </RdxPaginationLast>
</template>
