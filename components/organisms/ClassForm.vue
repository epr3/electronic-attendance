<script lang="ts" setup>
import { TRPCClientError } from "@trpc/client";
import { object, string, array } from "zod";
import { ROLE } from "@prisma/client";

const route = useRoute();
const router = useRouter();
const { $client } = useNuxtApp();

let classObject = null;

const { data } = await useAsyncData(
  "classForm" + route.params.classId ? `-${route.params.classId}` : "",
  async () => {
    if (route.params.classId) {
      const [students, teachers] = await Promise.all([
        $client.user.getUsers.query({
          schoolId: route.params.id as string,
          page: 1,
          pageSize: 12,
          role: ROLE.STUDENT,
        }),
        $client.user.getUsers.query({
          schoolId: route.params.id as string,
          page: 1,
          pageSize: 12,
          role: ROLE.TEACHER,
        }),
      ]);

      return { students, teachers };
    }
    const [students, teachers] = await Promise.all([
      $client.user.getNonAssignedStudents.query({
        schoolId: route.params.id as string,
        page: 1,
        pageSize: 12,
      }),
      $client.user.getNonAssignedHeadTeachers.query({
        schoolId: route.params.id as string,
        page: 1,
        pageSize: 12,
      }),
    ]);
    return { students, teachers };
  }
);

if (route.params.classId) {
  classObject = await $client.class.getClass.query({
    schoolId: route.params.id as string,
    yearId: route.params.yearId as string,
    classId: route.params.classId as string,
  });
}

const students = computed(() => data.value.students.users);
const teachers = computed(() => data.value.teachers.users);

const generalError = ref("");

const { handleSubmit, isSubmitting, errors } = useForm({
  initialValues: classObject
    ? {
        title: classObject.title,
        headTeacherId: classObject.headTeacherId,
        students: classObject.students.map((item) => item.studentId),
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
  try {
    const { title, headTeacherId, students } = values;
    if (route.params.classId) {
      await $client.class.editClass.mutate({
        schoolId: route.params.id as string,
        classId: route.params.classId as string,
        yearId: route.params.yearId as string,
        title,
        headTeacherId,
        students,
      });
    } else {
      await $client.class.addClass.mutate({
        schoolId: route.params.id as string,
        yearId: route.params.yearId as string,
        title,
        headTeacherId,
        students,
      });
    }
    await navigateTo(
      `/school/${route.params.id}/year/${route.params.yearId}/classes`
    );
  } catch (e) {
    if (e instanceof TRPCClientError) {
      if (e.data.code === "BAD_REQUEST") {
        const fieldErrors = Object.keys(e.data.zodError.fieldErrors).reduce(
          (acc, val) => {
            acc[val as keyof typeof errors.value] = (
              e as TRPCClientError<any>
            ).data.zodError.fieldErrors[val][0];
            return acc;
          },
          {} as Record<keyof typeof errors.value, string>
        );
        generalError.value = Object.keys(fieldErrors)
          .map((item) => fieldErrors[item as keyof typeof fieldErrors])
          .join(",");
      } else {
        generalError.value = e.message;
      }
    }
  }
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
        <div class="basis-1/2">
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
        </div>
      </div>

      <Button class="self-start" :disabled="isSubmitting" type="submit">
        Submit
      </Button>
    </form>
  </div>
</template>
