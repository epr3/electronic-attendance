<script lang="ts" setup>
import { array, string, object } from "zod";

const { $dayjs } = useNuxtApp();
const steps = [
  "Select start date",
  "Select end date",
  "Select holidays",
  "Verify dates",
];

const initialValues: Record<string, string>[] = [
  {
    startDate: $dayjs().format("YYYY-MM-DD"),
  },
  { endDate: $dayjs().add(1, "d").format("YYYY-MM-DD") },
  {},
];

const schemas = [
  object({
    startDate: string().min(1),
  }),
  object({
    endDate: string().min(1),
  }),
  object({
    holidays: array(
      object({
        startDate: string().min(1),
        endDate: string().min(1),
      })
    ),
  }),
];
</script>

<template>
  <FormWizard
    v-slot="{ values }"
    :validation-schema="schemas"
    :initial-values="initialValues"
    :steps="steps"
  >
    <FormStep>
      <DateSelect name="startDate" />
    </FormStep>
    <FormStep>
      <DateSelect name="endDate" />
    </FormStep>
    <FormStep> Holidays </FormStep>
    <FormStep>
      {{ values }}
    </FormStep>
  </FormWizard>
</template>
