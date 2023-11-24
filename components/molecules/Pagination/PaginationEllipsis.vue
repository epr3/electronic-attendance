<script setup lang="ts">
import { useAttrs } from "vue";
import { type PaginationEllipsisProps, useForwardProps } from "radix-vue";

defineOptions({
  inheritAttrs: false,
});

const props = defineProps<PaginationEllipsisProps>();
const forwarded = useForwardProps(props);
const { class: className, ...rest } = useAttrs();
</script>

<template>
  <RdxPaginationEllipsis
    :class="cn('w-9 h-9 flex items-center justify-center', className ?? '')"
    v-bind="{ ...forwarded, ...rest }"
  >
    <slot>
      <div class="i-heroicons-ellipsis-horizontal w-4 h-4" />
    </slot>
  </RdxPaginationEllipsis>
</template>
