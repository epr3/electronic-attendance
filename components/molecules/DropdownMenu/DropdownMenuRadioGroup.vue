<script setup lang="ts">
import {
  type DropdownMenuRadioGroupEmits,
  type DropdownMenuRadioGroupProps,
} from "radix-vue";

const props = defineProps<DropdownMenuRadioGroupProps>();

const emits = defineEmits<DropdownMenuRadioGroupEmits>();
</script>

<template>
  <RdxDropdownMenuRadioGroup
    v-bind="props"
    @update:model-value="emits('update:modelValue', $event)"
  >
    <slot />
  </RdxDropdownMenuRadioGroup>
</template>
