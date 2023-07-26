<script lang="ts" setup>
import { ROLE, Subject, User } from "@prisma/client";
import { RRule, datetime, rrulestr } from "rrule";

import { array, string, object } from "zod";

const route = useRoute();
const { $dayjs } = useNuxtApp();
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
      users: (User & {
        role: ROLE;
      })[];
    }>(
      `/api/school/${route.params.id}/users?page=${studentsPage}&pageSize=${studentsPageSize}&role=STUDENT&includeClass=${route.params.classId}`
    ),
    $fetch<{
      users: (User & {
        role: ROLE;
      })[];
    }>(
      `/api/school/${route.params.id}/users?page=${teachersPage}&pageSize=${teachersPageSize}&role=TEACHER`
    ),
    $fetch<{
      subjects: Subject[];
    }>(
      `/api/school/${route.params.id}/subjects?page=${subjectsPage}&pageSize=${subjectsPageSize}`
    ),
  ]);

  let schedule = null;

  if (route.params.subjectId) {
    schedule = await $fetch(
      `/api/school/${route.params.id}/years/${route.params.yearId}/classes/${route.params.classId}/schedules/${route.params.subjectId}`
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
    ? `/api/school/${route.params.id}/years/${route.params.yearId}/classes/${route.params.classId}/schedules/${route.params.subjectId}`
    : `/api/school/${route.params.id}/years/${route.params.yearId}/classes/${route.params.classId}/schedules`;

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
    `/school/${route.params.id}/year/${route.params.yearId}/classes/${route.params.classId}/subjects`
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
            <Select
              label="Subject"
              name="subjectId"
              placeholder="Select subject"
            >
              <option v-for="item in subjects" :key="item.id" :value="item.id">
                {{ item.name }}
              </option>
            </Select>
          </FormElement>
          <FormElement name="teacherId">
            <Select
              label="Teacher"
              name="teacherId"
              placeholder="Select teacher"
            >
              <option v-for="item in teachers" :key="item.id" :value="item.id">
                {{ item.firstName }} {{ item.lastName }}
              </option>
            </Select>
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
