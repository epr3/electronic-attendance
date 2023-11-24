<script lang="ts" setup>
defineProps<{
  orientation: "left" | "right";
  disabled: boolean;
}>();
</script>

<template>
  <Button size="icon" :disabled="disabled">
    <div
      :class="{
        'i-heroicons-arrow-left': orientation === 'left',
        'i-heroicons-arrow-right': orientation === 'right',
      }"
      class="w-4 h-4 cursor-pointer"
    />
  </Button>
</template>
