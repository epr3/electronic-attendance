<script lang="ts" setup>
import { RRule, datetime, rrulestr } from "rrule";

import { array, string, object } from "zod";
import { ROLE } from "~/drizzle/schema";
import {
  SelectSubjectTeacherClassType,
  SelectSubjectType,
  SelectUserType,
} from "~/drizzle/types";

const route = useRoute();
const { $dayjs, $routes, $api } = useNuxtApp();
const steps = ["Select dates & teacher", "Select students", "Verify data"];

const studentsPage = 1;
const studentsPageSize = 12;
const teachersPage = 1;
const teachersPageSize = 12;
const subjectsPage = 1;
const subjectsPageSize = 12;

const { data } = await useAsyncData("teacherSubjectForm", async () => {
  const [students, teachers, subjectsData] = await Promise.all([
    $fetch<{
      users: (SelectUserType & {
        role: ROLE;
      })[];
    }>($routes.users.index({ schoolId: route.params.id as string }), {
      query: {
        role: ROLE.STUDENT,
        page: studentsPage,
        pageSize: studentsPageSize,
        includeClass: route.params.classId as string,
      },
    }),
    $fetch<{
      users: (SelectUserType & {
        role: ROLE;
      })[];
    }>($routes.users.index({ schoolId: route.params.id as string }), {
      query: {
        role: ROLE.TEACHER,
        page: teachersPage,
        pageSize: teachersPageSize,
      },
    }),
    $fetch<{
      subjects: SelectSubjectType[];
    }>($api.subjects.index({ schoolId: route.params.id as string }), {
      query: { page: subjectsPage, pageSize: subjectsPageSize },
    }),
  ]);

  let schedule = null;

  if (route.params.subjectId) {
    schedule = await $fetch<
      SelectSubjectTeacherClassType & { students: { studentId: string }[] }
    >(
      $api.years.classes.schedules.id(route.params.subjectId as string)({
        schoolId: route.params.id as string,
        yearId: route.params.yearId as string,
        classId: route.params.classId as string,
      })
    );
  }

  return { students, teachers, subjectsData, schedule };
});

const students = computed(() => data.value?.students.users);
const teachers = computed(() => data.value?.teachers.users);
const subjects = computed(() => data.value?.subjectsData.subjects);
const schedule = computed(() => {
  if (data.value?.schedule) {
    const scheduleRRule = rrulestr(data.value.schedule.calendarRule);

    return [
      {
        startDate: $dayjs(scheduleRRule.options.dtstart).format("YYYY-MM-DD"),
        endDate: $dayjs(scheduleRRule.options.until).format("YYYY-MM-DD"),
        startTime: data.value.schedule.startTime,
        endTime: data.value.schedule.endTime,
        subjectId: data.value.schedule.subjectId,
        teacherId: data.value.schedule.teacherId,
      },
      {
        students: data.value.schedule.students.map((item) => item.studentId),
      },
      {},
    ];
  }

  return [];
});

const initialValues = schedule.value.length
  ? schedule.value
  : [
      {
        startDate: $dayjs().startOf("d").format("YYYY-MM-DD"),
        endDate: $dayjs().add(1, "d").startOf("d").format("YYYY-MM-DD"),
        startTime: $dayjs().startOf("d").format("HH:mm"),
        endTime: $dayjs().add(1, "d").startOf("d").format("HH:mm"),
      },
      {},
      {},
    ];

const schemas = [
  object({
    subjectId: string().uuid(),
    teacherId: string().uuid(),
    startDate: string().min(1),
    endDate: string().min(1),
    startTime: string().min(1),
    endTime: string().min(1),
  }),
  object({
    students: array(string().uuid()),
  }),
  object({}),
];

async function onSubmit(values: Record<string, any>) {
  const startDate = $dayjs(values.startDate).utc();
  const endDate = $dayjs(values.endDate).utc();

  const schedule = new RRule({
    freq: RRule.WEEKLY,
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

  const apiRoute = route.params.subjectId
    ? $api.years.classes.schedules.id(route.params.subjectId as string)({
        schoolId: route.params.id as string,
        yearId: route.params.yearId as string,
        classId: route.params.classId as string,
      })
    : $api.years.classes.schedules.index({
        schoolId: route.params.id as string,
        yearId: route.params.yearId as string,
        classId: route.params.classId as string,
      });

  const method = route.params.subjectId ? "PUT" : "POST";

  const { error } = await useFetch(apiRoute, {
    method,
    body: { calendarRule: schedule.toString(), ...values },
  });

  if (error.value) {
    // generalError.value = error.value?.message ?? "";
    return;
  }

  return await navigateTo(
    $routes.years.classes.subjects.index({
      schoolId: route.params.id as string,
      yearId: route.params.yearId as string,
      classId: route.params.classId as string,
    })
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
      <div class="flex flex-col gap-4">
        <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <FormElement name="subjectId">
            <FormSelect
              label="Subject"
              name="subjectId"
              placeholder="Select subject"
            >
              <option v-for="item in subjects" :key="item.id" :value="item.id">
                {{ item.name }}
              </option>
            </FormSelect>
          </FormElement>
          <FormElement name="teacherId">
            <FormSelect
              label="Teacher"
              name="teacherId"
              placeholder="Select teacher"
            >
              <option v-for="item in teachers" :key="item.id" :value="item.id">
                {{ item.firstName }} {{ item.lastName }}
              </option>
            </FormSelect>
          </FormElement>
        </div>

        <div class="gap-4 grid grid-cols-1 lg:grid-cols-2">
          <DateSelect
            label="Start date"
            class="grow"
            name="startDate"
            placeholder="YYYY-MM-DD"
          />
          <DateSelect
            label="End date"
            class="grow"
            name="endDate"
            placeholder="YYYY-MM-DD"
          />
        </div>
        <div class="gap-4 grid grid-cols-1 lg:grid-cols-2">
          <TimeSelect
            label="Start time"
            class="grow"
            name="startTime"
            placeholder="HH:mm"
          />
          <TimeSelect
            label="End time"
            class="grow"
            name="endTime"
            placeholder="HH:mm"
          />
        </div>
      </div>
    </FormStep>
    <FormStep>
      <FormElement name="students">
        <div class="flex flex-col">
          <Checkbox
            v-for="item in students"
            :id="item.id"
            :key="item.id"
            has-border
            name="students"
            :value="item.id"
            :label="`${item.firstName} ${item.lastName}`"
          />
        </div>
      </FormElement>
    </FormStep>
    <FormStep>
      {{ values }}
    </FormStep>
  </FormWizard>
</template>
