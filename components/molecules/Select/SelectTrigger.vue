<script setup lang="ts">
import { type SelectTriggerProps } from "radix-vue";

const props = withDefaults(
  defineProps<SelectTriggerProps & { invalid?: boolean }>(),
  {
    invalid: false,
  }
);
</script>

<template>
  <RdxSelectTrigger
    v-bind="props"
    :class="[
      cn(
        'flex h-10 w-full items-center justify-between rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        $attrs.class ?? ''
      ),
      props.invalid
        ? '!ring-destructive ring-2 placeholder:!text-destructive'
        : '',
    ]"
  >
    <slot />
    <RdxSelectIcon as-child>
      <div class="i-heroicons-chevron-down w-4 h-4 opacity-50" />
    </RdxSelectIcon>
  </RdxSelectTrigger>
</template>
