<script setup lang="ts">
import { type ToastTitleProps } from "radix-vue";

const props = defineProps<ToastTitleProps>();
</script>

<template>
  <RdxToastTitle
    v-bind="props"
    :class="cn('text-sm font-semibold', $attrs.class ?? '')"
  >
    <slot />
  </RdxToastTitle>
</template>
