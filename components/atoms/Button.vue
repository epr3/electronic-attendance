<script lang="ts" setup>
import { type PrimitiveProps } from "radix-vue";

import { cva } from "class-variance-authority";

const buttonVariants = cva(
  "flex justify-center items-center text-center text-black font-semibold rounded shadow-md",
  {
    variants: {
      variant: {
        default: "bg-brand-primary text-white",
        destructive: "bg-danger text-white",
        outline:
          "border border-brand-primary bg-transparent hover:bg-brand-accent-dark hover:text-white",
        secondary: "bg-brand-accent-light text-black",
        ghost: "hover:(bg-brand-accent-light text-brand-accent-dark)",
        link: "text-black underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-sm",
        lg: "h-11 py-8 px-8 text-lg",
        icon: "square-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface Props {
  variant?: NonNullable<Parameters<typeof buttonVariants>[0]>["variant"];
  size?: NonNullable<Parameters<typeof buttonVariants>[0]>["size"];
}

// eslint-disable-next-line vue/define-macros-order
const props = withDefaults(defineProps<PrimitiveProps & Props>(), {
  as: "button",
  variant: "default",
  size: "default",
});
</script>

<template>
  <RdxPrimitive
    :as="props.as"
    :as-child="props.asChild"
    :class="cn(buttonVariants({ variant, size }), $attrs.class ?? '')"
  >
    <slot />
  </RdxPrimitive>
</template>
