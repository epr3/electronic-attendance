<script lang="ts" setup>
withDefaults(
  defineProps<{
    size?: "sm" | "md" | "lg" | "xl";
    color?: "success" | "error" | "info";
    type?: "submit" | "reset" | "button";
    to?: string;
  }>(),
  { size: "md", color: "info", type: "button", to: "" }
);
</script>

<template>
  <NuxtLink
    v-if="to"
    :to="to"
    class="btn p-4 flex items-center justify-center min-w-auto cursor-pointer"
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
    class="btn p-4 flex items-center justify-center min-w-auto"
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
  </button>
</template>
