<script lang="ts" setup>
withDefaults(
  defineProps<{ step?: number; stepDescription?: string; active?: boolean }>(),
  { step: 1, stepDescription: "", active: false }
);
</script>

<template>
  <div
    class="border-t-4 text-xs grow py-2 cursor-pointer"
    :class="{
      'border-blue-500': active,
      'border-gray-200': !active,
    }"
  >
    <p :class="{ 'text-gray-7': !active, 'text-blue-500': active }">
      Step {{ step }}
    </p>

    <p v-if="stepDescription">{{ stepDescription }}</p>
  </div>
</template>
