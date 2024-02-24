<script setup lang="ts">
import { type ToastDescriptionProps } from "radix-vue";

const props = defineProps<ToastDescriptionProps>();
</script>

<template>
  <RdxToastDescription
    :class="cn('text-sm opacity-90', $attrs.class ?? '')"
    v-bind="props"
  >
    <slot />
  </RdxToastDescription>
</template>
