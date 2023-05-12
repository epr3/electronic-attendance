<script lang="ts" setup>
import { RRule, datetime } from "rrule";
import { array, string, object } from "zod";

const { $dayjs } = useNuxtApp();
const steps = ["Select dates", "Select holidays", "Verify dates"];

const initialValues: Record<
  string,
  string | { name: string; startDate: string; endDate: string }[]
>[] = [
  {
    startDate: $dayjs().format("YYYY-MM-DD"),
    endDate: $dayjs().add(1, "d").format("YYYY-MM-DD"),
  },
  {
    holidays: [
      {
        name: "Example Holiday",
        startDate: $dayjs().format("YYYY-MM-DD"),
        endDate: $dayjs().add(1, "d").format("YYYY-MM-DD"),
      },
    ],
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
        name: string().min(1),
        startDate: string().min(1),
        endDate: string().min(1),
      })
    ),
  }),
  object({}),
];

function onSubmit(values: Record<string, any>) {
  const startDateDayJs = $dayjs(values.startDate);
  const endDateDayjs = $dayjs(values.endDate);

  const yearRule = new RRule({
    freq: RRule.DAILY,
    dtstart: datetime(
      startDateDayJs.year(),
      startDateDayJs.month(),
      startDateDayJs.day()
    ),
    until: datetime(
      endDateDayjs.year(),
      endDateDayjs.month(),
      endDateDayjs.day()
    ),
  });

  const holidayRrules = values.holidays.map(
    (item: { startDate: string; endDate: string; name: string }) => {
      const startDateDayJs = $dayjs(item.startDate);
      const endDateDayjs = $dayjs(item.endDate);

      return {
        name: item.name,
        rrule: new RRule({
          freq: RRule.DAILY,
          dtstart: datetime(
            startDateDayJs.year(),
            startDateDayJs.month(),
            startDateDayJs.day()
          ),
          until: datetime(
            endDateDayjs.year(),
            endDateDayjs.month(),
            endDateDayjs.day()
          ),
        }).toString(),
      };
    }
  );

  console.log(yearRule.toString(), holidayRrules);
}
</script>

<template>
  <FormWizard
    v-slot="{ values }"
    :validation-schema="schemas"
    :initial-values="initialValues"
    :steps="steps"
    @submit="onSubmit"
  >
    <FormStep>
      <div class="flex gap-4">
        <DateSelect label="Start date" class="grow" name="startDate" />
        <DateSelect label="End date" class="grow" name="endDate" />
      </div>
    </FormStep>
    <FormStep>
      <HolidayTable name="holidays" />
    </FormStep>
    <FormStep>
      {{ values }}
    </FormStep>
  </FormWizard>
</template>
