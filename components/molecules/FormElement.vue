<script lang="ts" setup>
defineProps<{ error?: string }>();
</script>

<template>
  <div class="w-full">
    <slot />
    <p v-if="error" class="text-red-500 text-xs mt-2">{{ error }}</p>
  </div>
</template>
