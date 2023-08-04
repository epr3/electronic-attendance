<script lang="ts" setup>
defineProps<{
  page: number;
  isActive: boolean;
}>();

defineEmits<{
  (e: "click"): void;
}>();
</script>

<template>
  <IconButton :color="isActive ? 'primary' : 'info'" @click="$emit('click')">
    {{ page }}
  </IconButton>
</template>
