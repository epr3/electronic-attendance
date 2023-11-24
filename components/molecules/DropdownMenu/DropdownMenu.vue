<script setup lang="ts">
import {
  type DropdownMenuRootEmits,
  type DropdownMenuRootProps,
  useForwardPropsEmits,
} from "radix-vue";

const props = defineProps<DropdownMenuRootProps>();
const emits = defineEmits<DropdownMenuRootEmits>();

const forwarded = useForwardPropsEmits(props, emits);
</script>

<template>
  <RdxDropdownMenuRoot v-bind="forwarded">
    <slot />
  </RdxDropdownMenuRoot>
</template>
