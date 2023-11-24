<script setup lang="ts">
import {
  type DropdownMenuSubEmits,
  type DropdownMenuSubProps,
  useForwardPropsEmits,
} from "radix-vue";

const props = defineProps<DropdownMenuSubProps>();
const emits = defineEmits<DropdownMenuSubEmits>();

const forwarded = useForwardPropsEmits(props, emits);
</script>

<template>
  <RdxDropdownMenuSub v-bind="forwarded">
    <slot />
  </RdxDropdownMenuSub>
</template>
