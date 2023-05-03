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
    class="btn cursor-pointer"
    :class="{
      'btn-success': color === 'success',
      'btn-error': color === 'error',
      'btn-info': color === 'info',
      'btn-sm': size === 'sm',
      'btn-md': size === 'md',
      'btn-lg': size === 'lg',
      'btn-xl': size === 'xl',
    }"
  >
    <slot />
  </NuxtLink>
  <button
    v-else
    :type="type"
    :disabled="disabled"
    class="btn"
    :class="{
      'btn-success': !disabled && color === 'success',
      'btn-error': !disabled && color === 'error',
      'btn-info': !disabled && color === 'info',
      'btn-disabled': !!disabled,
      'btn-sm': size === 'sm',
      'btn-md': size === 'md',
      'btn-lg': size === 'lg',
      'btn-xl': size === 'xl',
    }"
  >
    <slot />
  </button>
</template>
