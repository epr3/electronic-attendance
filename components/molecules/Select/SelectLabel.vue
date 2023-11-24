<script setup lang="ts">
import { type SelectLabelProps } from "radix-vue";

defineProps<SelectLabelProps>();
</script>

<template>
  <RdxSelectLabel
    :class="cn('py-1.5 pl-8 pr-2 text-sm font-semibold', $attrs.class ?? '')"
  >
    <slot />
  </RdxSelectLabel>
</template>
