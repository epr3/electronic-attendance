<script setup lang="ts">
import { merge, cloneDeep } from "lodash-es";
import { ZodRawShape, ZodObject } from "zod";

const props = defineProps<{
  validationSchema: ZodObject<ZodRawShape>[];
  initialValues: Record<
    string,
    string | { startDate: string; endDate: string }[]
  >[];
  steps: string[];
}>();

const emit = defineEmits<{
  (e: "submit", values: Record<string, any>): void;
}>();
const currentStepIdx = ref(0);

// Injects the starting step, child <form-steps> will use this to generate their ids
const stepCounter = ref(0);
provide("STEP_COUNTER", stepCounter);

// Inject the live ref of the current index to child components
// will be used to toggle each form-step visibility
provide("CURRENT_STEP_INDEX", currentStepIdx);

// if this is the last step
const isLastStep = computed(() => {
  return currentStepIdx.value === stepCounter.value - 1;
});

// If the `previous` button should appear
const hasPrevious = computed(() => {
  return currentStepIdx.value > 0;
});

// extracts the indivdual step schema
const currentSchema = computed(() => {
  return toTypedSchema(props.validationSchema[currentStepIdx.value]);
});

const currentInitialValues = computed(() => {
  return props.initialValues[currentStepIdx.value];
});
// We are using the "submit" handler to progress to next steps
// and to submit the form if its the last step
const { values, handleSubmit, resetForm } = useForm({
  // vee-validate will be aware of computed schema changes
  validationSchema: currentSchema,
  // initialValues: {},
  // turn this on so each step values won't get removed when you move back or to the next step
  keepValuesOnUnmount: true,
});

function goToPrev() {
  if (currentStepIdx.value === 0) {
    return;
  }

  currentStepIdx.value--;
}

watch(
  currentStepIdx,
  () => {
    resetForm({
      values: merge(currentInitialValues.value, cloneDeep(values)),
    });
  },

  { immediate: true }
);

// We are using the "submit" handler to progress to next steps
// and to submit the form if its the last step
const onSubmit = handleSubmit(() => {
  if (!isLastStep.value) {
    currentStepIdx.value++;

    return;
  }

  // Let the parent know the form was filled across all steps
  emit("submit", values);
});
</script>

<template>
  <div class="flex flex-col gap-8">
    <Steps :steps="steps" :active-index="currentStepIdx" />
    <form novalidate class="flex flex-col gap-4" @submit="onSubmit">
      <slot v-bind="{ values }" />

      <div class="flex gap-4">
        <Button type="button" :disabled="!hasPrevious" @click="goToPrev">
          Previous
        </Button>
        <Button type="submit">{{ isLastStep ? "Submit" : "Next" }}</Button>
      </div>
    </form>
  </div>
</template>
