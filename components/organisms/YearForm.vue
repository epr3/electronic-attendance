<script lang="ts" setup>
import { array, string, object } from "zod";

const { $dayjs } = useNuxtApp();
const steps = ["Select dates", "Select holidays", "Verify dates"];

const initialValues: Record<string, string>[] = [
  {
    startDate: $dayjs().format("YYYY-MM-DD"),
    endDate: $dayjs().add(1, "d").format("YYYY-MM-DD"),
  },
  {},
];

const schemas = [
  object({
    startDate: string().min(1),
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
      <div class="flex gap-4">
        <DateSelect label="Start date" class="grow" name="startDate" />
        <DateSelect label="End date" class="grow" name="endDate" />
      </div>
    </FormStep>
    <FormStep> Holidays </FormStep>
    <FormStep>
      {{ values }}
    </FormStep>
  </FormWizard>
</template>
