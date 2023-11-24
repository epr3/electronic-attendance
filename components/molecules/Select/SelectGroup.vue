<script setup lang="ts">
import { type SelectGroupProps } from "radix-vue";

const props = defineProps<SelectGroupProps>();
</script>

<template>
  <RdxSelectGroup :class="cn('p-1 w-full', $attrs.class ?? '')" v-bind="props">
    <slot />
  </RdxSelectGroup>
</template>
