<script lang="ts" setup>
withDefaults(
  defineProps<{
    size?: "sm" | "md" | "lg" | "xl";
    color?: "success" | "error" | "info";
    type?: "submit" | "reset" | "button";
    to?: string;
    disabled?: boolean;
  }>(),
  { size: "md", color: "info", type: "button", to: "", disabled: false }
);
</script>

<template>
  <NuxtLink
    v-if="to"
    :to="to"
    :class="
      cn(
        'btn cursor-pointer',
        {
          'btn-sm': size === 'sm',
          'btn-md': size === 'md',
          'btn-lg': size === 'lg',
          'btn-xl': size === 'xl',
        },
        { 'btn-disabled': disabled },
        {
          'btn-success': color === 'success',
          'btn-error': color === 'error',
          'btn-info': color === 'info',
        },
        $attrs.class ?? ''
      )
    "
  >
    <slot />
  </NuxtLink>
  <button
    v-else
    :type="type"
    :disabled="disabled"
    :class="
      cn(
        'btn',
        {
          'btn-sm': size === 'sm',
          'btn-md': size === 'md',
          'btn-lg': size === 'lg',
          'btn-xl': size === 'xl',
        },
        { 'btn-disabled': disabled },
        {
          'btn-success': color === 'success',
          'btn-error': color === 'error',
          'btn-info': color === 'info',
        },
        $attrs.class ?? ''
      )
    "
  >
    <slot />
  </button>
</template>
