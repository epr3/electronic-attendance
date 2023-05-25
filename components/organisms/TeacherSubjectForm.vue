<script lang="ts" setup>
import { ROLE } from "@prisma/client";
import { RRule, datetime } from "rrule";

import { array, string, object } from "zod";

const route = useRoute();
const { $dayjs, $client } = useNuxtApp();
const steps = ["Select dates & teacher", "Select students", "Verify data"];

const { data } = await useAsyncData("teacherSubjectForm", async () => {
  const [students, teachers, subjectsData] = await Promise.all([
    $client.user.getStudentsByClass.query({
      schoolId: route.params.id as string,
      page: 1,
      pageSize: 12,
      classId: route.params.classId as string,
    }),
    $client.user.getUsers.query({
      schoolId: route.params.id as string,
      page: 1,
      pageSize: 12,
      role: ROLE.TEACHER,
    }),
    $client.subject.getSubjects.query({
      schoolId: route.params.id as string,
      page: 1,
      pageSize: 12,
    }),
  ]);
  return { students, teachers, subjectsData };
});

const students = computed(() => data.value?.students.users);
const teachers = computed(() => data.value?.teachers.users);
const subjects = computed(() => data.value?.subjectsData.subjects);
// let year:
//   | (SchoolYear & {
//       holidays: SchoolYearHolidays[];
//     })
//   | null = null;

// if (route.params.yearId) {
//   subject = await $client.year.getYear.query({
//     schoolId: route.params.id as string,
//     yearId: route.params.yearId as string,
//   });
// }

const initialValues: Record<
  string,
  string | { name: string; startDate: string; endDate: string }[]
>[] = [
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
  }).refine(() => true, { message: "The dates selected are not valid." }),
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

  await $client.schedule.addSchedule.mutate({
    schoolId: route.params.id as string,
    yearId: route.params.yearId as string,
    students: values.students,
    calendarRule: schedule.toString(),
    classId: route.params.classId as string,
    startTime: values.startTime,
    endTime: values.endTime,
    teacherId: values.teacherId,
    subjectId: values.subjectId,
  });

  await navigateTo(
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
              <option
                v-for="item in teachers"
                :key="item.userId"
                :value="item.userId"
              >
                {{ item.user.firstName }} {{ item.user.lastName }}
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
            :id="item.userId"
            :key="item.userId"
            has-border
            name="students"
            :value="item.userId"
            :label="`${item.user.firstName} ${item.user.lastName}`"
          />
        </div>
      </FormElement>
    </FormStep>
    <FormStep>
      {{ values }}
    </FormStep>
  </FormWizard>
</template>
