<script lang="ts" setup>
import { RRule, datetime, rrulestr } from "rrule";
import { array, string, object } from "zod";
import {
  SelectSchoolYearHolidaysType,
  SelectSchoolYearType,
} from "~/drizzle/types";

const route = useRoute();
const { $dayjs, $api, $routes } = useNuxtApp();
const steps = ["Select dates", "Select holidays", "Verify dates"];

const year = ref<
  | (SelectSchoolYearType & {
      holidays: SelectSchoolYearHolidaysType[];
    })
  | null
>(null);

if (route.params.yearId) {
  const { data } = await useFetch<
    SelectSchoolYearType & {
      holidays: SelectSchoolYearHolidaysType[];
    }
  >($api.years.index({ schoolId: route.params.id as string }), {});
  year.value = data.value;
}

const initialValues: Record<
  string,
  string | { name: string; startDate: string; endDate: string }[]
>[] = [
  year.value
    ? {
        startDate: $dayjs(
          rrulestr(year.value.schoolDateRule).options.dtstart
        ).format("YYYY-MM-DD"),
        endDate: $dayjs(
          rrulestr(year.value.schoolDateRule).options.until
        ).format("YYYY-MM-DD"),
      }
    : {
        startDate: $dayjs().format("YYYY-MM-DD"),
        endDate: $dayjs().add(1, "d").format("YYYY-MM-DD"),
      },
  year.value
    ? {
        holidays: year.value.holidays.map(
          (item: { name: string; holidayDateRule: string }) => ({
            name: item.name,
            startDate: $dayjs(
              rrulestr(item.holidayDateRule).options.dtstart
            ).format("YYYY-MM-DD"),
            endDate: $dayjs(
              rrulestr(item.holidayDateRule).options.until
            ).format("YYYY-MM-DD"),
          })
        ),
      }
    : {
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
  }).refine(() => true, { message: "The dates selected are not valid." }),
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

async function onSubmit(values: Record<string, any>) {
  const startDate = $dayjs(values.startDate).utc();
  const endDate = $dayjs(values.endDate).utc();
  const schedule = new RRule({
    freq: RRule.DAILY,
    dtstart: datetime(
      startDate.year(),
      startDate.month() + 1,
      startDate.date(),
      startDate.hour(),
      startDate.minute(),
      0
    ),
    until: datetime(
      endDate.year(),
      endDate.month() + 1,
      endDate.date(),
      endDate.hour(),
      endDate.minute(),
      0
    ),
  });

  const holidayRrules = values.holidays.map(
    (item: { startDate: string; endDate: string; name: string }) => {
      const startDate = $dayjs(item.startDate).utc();
      const endDate = $dayjs(item.endDate).utc();
      const schedule = new RRule({
        freq: RRule.DAILY,
        dtstart: datetime(
          startDate.year(),
          startDate.month() + 1,
          startDate.date(),
          startDate.hour(),
          startDate.minute(),
          0
        ),
        until: datetime(
          endDate.year(),
          endDate.month() + 1,
          endDate.date(),
          endDate.hour(),
          endDate.minute(),
          0
        ),
      });

      return {
        name: item.name,
        rule: schedule.toString(),
      };
    }
  );

  const apiRoute = route.params.userId
    ? $api.years.id(route.params.yearId as string)({
        schoolId: route.params.id as string,
      })
    : $api.years.index({
        schoolId: route.params.id as string,
      });

  const method = route.params.userId ? "PUT" : "POST";

  const { error } = await useFetch(apiRoute, {
    method,
    body: {
      schoolDateRule: schedule.toString(),
      holidayDateRules: holidayRrules,
    },
  });

  if (error.value) {
    // generalError.value = error.value?.message ?? "";
    return;
  }

  await navigateTo(
    $routes.years.index({ schoolId: route.params.id as string })
  );
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
      <div class="gap-4 grid grid-cols-1 lg:grid-cols-2">
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
