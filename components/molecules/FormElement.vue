<script lang="ts" setup>
const props = defineProps<{ name: string }>();

const message = useFieldError(props.name);
</script>

<template>
  <div class="w-full">
    <slot />
    <p v-if="message" class="text-red-500 text-xs mt-2">{{ message }}</p>
  </div>
</template>
