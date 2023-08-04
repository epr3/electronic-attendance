<script lang="ts" setup>
withDefaults(
  defineProps<{
    size?: "sm" | "md" | "lg" | "xl";
    color?: "success" | "error" | "info" | "primary";
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
    :disabled="disabled"
    :to="to"
    class="btn p-4 flex items-center justify-center min-w-[48px] cursor-pointer"
    :class="{
      'btn-success': color === 'success',
      'btn-error': color === 'error',
      'btn-info': color === 'info',
      'btn-disabled!': disabled,
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
    :disabled="disabled"
    :type="type"
    class="btn p-4 flex items-center justify-center min-w-[48px]"
    :class="{
      'btn-success': color === 'success',
      'btn-error': color === 'error',
      'btn-info': color === 'info',
      'btn-disabled!': disabled,
      'btn-sm': size === 'sm',
      'btn-md': size === 'md',
      'btn-lg': size === 'lg',
      'btn-xl': size === 'xl',
    }"
  >
    <slot />
  </button>
</template>
