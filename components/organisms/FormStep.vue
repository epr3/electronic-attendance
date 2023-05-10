<script setup lang="ts">
// This is a ref injected from FormWizard
// clones the step index to get the step's index and advances it by 1 for the next step
// meaning each step gets a index id starting from 1
const currentIdx = (inject<Ref<number>>("STEP_COUNTER") as Ref<number>).value++;
// Grabs the live ref to the current form active step
const formStepIdx = inject<Ref<number>>("CURRENT_STEP_INDEX") as Ref<number>;

// If this step should be shown
const shouldShow = computed(() => {
  return currentIdx === formStepIdx.value;
});
</script>

<template>
  <slot v-if="shouldShow" />
</template>
