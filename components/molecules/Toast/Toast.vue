<script lang="ts">
import type { ToastRootEmits, ToastRootProps } from "radix-vue";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none",
  {
    variants: {
      variant: {
        default: "border bg-brand-shade-light text-gray9",
        destructive: "group border-red-9 bg-red-9 text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface ToastVariantProps extends VariantProps<typeof toastVariants> {}

export interface ToastProps extends ToastRootProps {
  class?: string;
  variant?: ToastVariantProps["variant"];
  onOpenChange?: ((value: boolean) => void) | undefined;
}
</script>

<script setup lang="ts">
import { useEmitAsProps } from "radix-vue";

const props = defineProps<ToastProps>();
const emits = defineEmits<ToastRootEmits>();
</script>

<template>
  <RdxToastRoot
    v-bind="{ ...props, ...useEmitAsProps(emits) }"
    :class="cn(toastVariants({ variant: props.variant }), $attrs.class ?? '')"
    @update:open="onOpenChange"
  >
    <slot />
  </RdxToastRoot>
</template>
