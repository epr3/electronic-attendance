<script lang="ts" setup>
import { type LabelProps } from "radix-vue";

defineOptions({
  inheritAttrs: false,
});
defineProps<LabelProps>();

const { error, formItemId } = useFormField();
const { class: className, ...rest } = useAttrs();
</script>

<template>
  <RdxLabel
    :class="
      cn(
        'block text-sm tracking-tight font-medium text-foreground text-left',
        error && 'text-error',
        className ?? ''
      )
    "
    :for="formItemId"
    v-bind="rest"
  >
    <slot />
  </RdxLabel>
</template>