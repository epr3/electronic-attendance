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
  <Button
    size="icon"
    :variant="isActive ? 'default' : 'secondary'"
    @click="$emit('click')"
  >
    {{ page }}
  </Button>
</template>
