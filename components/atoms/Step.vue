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
      'border-brand-accent-dark': active,
      'border-gray-3': !active,
    }"
  >
    <p
      class="font-bold"
      :class="{ 'text-gray-7': !active, 'text-brand-accent-dark': active }"
    >
      Step {{ step }}
    </p>

    <p v-if="stepDescription">{{ stepDescription }}</p>
  </div>
</template>
