<script lang="ts" setup>
withDefaults(
  defineProps<{
    steps: string[];
    activeIndex?: number;
  }>(),
  {
    activeIndex: 0,
  }
);

defineEmits<{ (e: "step:select", step: number): void }>();
</script>

<template>
  <div class="space-x-4 flex py-4">
    <Step
      v-for="(step, i) in steps"
      :key="step"
      :step="i + 1"
      :step-description="step"
      :active="activeIndex === i"
      @click="$emit('step:select', i)"
    />
  </div>
</template>
