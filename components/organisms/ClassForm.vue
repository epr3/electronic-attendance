<script lang="ts" setup>
import { object, string, array } from "zod";
import { Class, ClassStudent, ROLE, User } from "@prisma/client";

const route = useRoute();
const router = useRouter();

const studentsPage = 1;
const studentsPageSize = 12;
const headTeacherPage = 1;
const headTeacherPageSize = 12;

const classObject = ref<(Class & { students: ClassStudent[] }) | null>(null);

const { data } = await useAsyncData<{
  students: { users: (User & { role: ROLE })[] };
  teachers: { users: (User & { role: ROLE })[] };
}>(
  "classForm" + route.params.classId ? `-${route.params.classId}` : "",
  async () => {
    const apiUrl = route.params.classId
      ? `/api/school/${route.params.id}/users?excludeYear=${route.params.yearId}&includeClass=${route.params.classId}`
      : `/api/school/${route.params.id}/users?excludeYear=${route.params.yearId}`;
    const [students, teachers] = await Promise.all([
      $fetch<{ users: (User & { role: ROLE })[] }>(
        `${apiUrl}&page=${studentsPage}&pageSize=${studentsPageSize}&role=${ROLE.STUDENT}`
      ),
      $fetch<{ users: (User & { role: ROLE })[] }>(
        `${apiUrl}&page=${headTeacherPage}&pageSize=${headTeacherPageSize}&role=${ROLE.TEACHER}`
      ),
    ]);

    return { students, teachers };
  }
);

if (route.params.classId) {
  const { data } = await useFetch<Class & { students: ClassStudent[] }>(
    `/api/school/${route.params.id}/years/${route.params.yearId}/classes/${route.params.classId}`
  );
  classObject.value = data.value;
}

const students = computed(() => data.value?.students.users ?? []);
const teachers = computed(() => data.value?.teachers.users ?? []);

const generalError = ref("");

const { handleSubmit, isSubmitting } = useForm({
  initialValues: classObject.value
    ? {
        title: classObject.value.title,
        headTeacherId: classObject.value.headTeacherId,
        students: classObject.value.students.map((item) => item.studentId),
      }
    : {},
  validationSchema: toTypedSchema(
    object({
      title: string().min(1),
      headTeacherId: string().uuid(),
      students: array(string().uuid()),
    })
  ),
});

const onSubmit = handleSubmit(async (values) => {
  const { title, headTeacherId, students } = values;
  const apiRoute = route.params.classId
    ? `/api/school/${route.params.id}/years/${route.params.yearId}/classes/${route.params.classId}`
    : `/api/school/${route.params.id}/years/${route.params.yearId}/classes`;

  const method = route.params.classId ? "PUT" : "POST";

  const { error } = await useFetch(apiRoute, {
    method,
    body: { title, headTeacherId, students },
  });

  if (error.value) {
    generalError.value = error.value?.message ?? "";
    return;
  }
  return await navigateTo(
    `/school/${route.params.id}/year/${route.params.yearId}/classes`
  );
});
</script>

<template>
  <div class="flex flex-col space-y-8">
    <div class="flex space-x-4 items-center">
      <div
        class="i-heroicons-arrow-left w-8 h-8 cursor-pointer"
        @click="
          () => {
            router.go(-1);
          }
        "
      />

      <h2 class="text-2xl font-bold">New class</h2>
    </div>
    <form class="flex flex-col gap-4" @submit="onSubmit">
      <div class="flex gap-4 space-y-4 items-stretch">
        <div class="flex flex-col gap-4 basis-1/2">
          <FormElement name="title">
            <Input label="Title" name="title" />
          </FormElement>
          <FormElement name="headTeacherId">
            <Select
              label="Head Teacher"
              name="headTeacherId"
              placeholder="Select head teacher"
            >
              <option v-for="item in teachers" :key="item.id" :value="item.id">
                {{ item.firstName }} {{ item.lastName }}
              </option>
            </Select>
          </FormElement>
        </div>
        <div class="basis-1/2">
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
        </div>
      </div>

      <Button class="self-start" :disabled="isSubmitting" type="submit">
        Submit
      </Button>
    </form>
  </div>
</template>
