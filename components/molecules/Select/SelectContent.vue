<script setup lang="ts">
import {
  type SelectContentEmits,
  type SelectContentProps,
  useForwardPropsEmits,
} from "radix-vue";

const props = withDefaults(defineProps<SelectContentProps>(), {
  position: "popper",
  sideOffset: 4,
});
const emits = defineEmits<SelectContentEmits>();

const forwarded = useForwardPropsEmits(props, emits);
</script>

<template>
  <RdxSelectPortal>
    <RdxSelectContent
      v-bind="{ ...forwarded, ...$attrs }"
      :class="
        cn(
          'relative z-50 min-w-[10rem] overflow-hidden rounded-md bg-white border border-border text-gray9 shadow-md',
          position === 'popper' &&
            'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
          $attrs.class ?? ''
        )
      "
    >
      <RdxSelectViewport
        :class="
          cn(
            'p-1',
            position === 'popper' &&
              'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]'
          )
        "
      >
        <slot />
      </RdxSelectViewport>
    </RdxSelectContent>
  </RdxSelectPortal>
</template>
