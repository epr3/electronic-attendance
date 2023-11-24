<script setup lang="ts">
import {
  type DropdownMenuContentEmits,
  type DropdownMenuContentProps,
  useForwardPropsEmits,
} from "radix-vue";

const props = withDefaults(defineProps<DropdownMenuContentProps>(), {
  sideOffset: 4,
});
const emits = defineEmits<DropdownMenuContentEmits>();

const forwarded = useForwardPropsEmits(props, emits);
</script>

<template>
  <RdxDropdownMenuPortal>
    <RdxDropdownMenuContent
      :class="[
        cn(
          'z-50 min-w-[8rem] p-4 overflow-hidden rounded-md border bg-white text-gray9 shadow-md',
          $attrs.class ?? ''
        ),
      ]"
      v-bind="forwarded"
    >
      <slot />
    </RdxDropdownMenuContent>
  </RdxDropdownMenuPortal>
</template>
