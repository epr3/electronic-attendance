<script lang="ts" setup>
const props = defineProps<{ name: string }>();

const name = computed(() => props.name);

const message = useFieldError(name);
</script>

<template>
  <div class="w-full">
    <slot />
    <p v-if="message" class="text-red-500 text-xs mt-2">{{ message }}</p>
  </div>
</template>
