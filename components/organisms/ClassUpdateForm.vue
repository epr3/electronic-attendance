<script lang="ts" setup>
import { object, string } from "zod";
import type { SelectClassType } from "~/drizzle/types";

const route = useRoute();
const router = useRouter();
const { $routes, $api } = useNuxtApp();

const generalError = ref("");

const page = 1;
const pageSize = 12;

const { data } = await useFetch<{ classes: SelectClassType[] }>(
  $api.years.classes.index({
    schoolId: route.params.id as string,
    yearId: route.params.yearId as string,
  }),
  {
    query: {
      page,
      pageSize,
    },
  }
);

const { data: student } = await useFetch(
  $api.users.id(route.params.studentId as string)({
    schoolId: route.params.id as string,
  })
);

const classes = computed(() => data.value?.classes ?? []);

const { handleSubmit, isSubmitting } = useForm({
  initialValues: {
    classId: (route.params.classId as string) ?? "",
  },
  validationSchema: toTypedSchema(
    object({
      classId: string().uuid(),
    })
  ),
});

const onSubmit = handleSubmit(async (values) => {
  const { classId } = values;

  const { error } = await useFetch(
    $api.years.classes.students.id(route.params.studentId as string)({
      schoolId: route.params.id as string,
      yearId: route.params.yearId as string,
      classId,
    }),
    {
      method: "PUT",
      body: { classId },
    }
  );

  if (error.value) {
    generalError.value = error.value?.message ?? "";
    return;
  }
  await navigateTo(
    $routes.years.classes.students.index({
      schoolId: route.params.id as string,
      yearId: route.params.yearId as string,
      classId: route.params.classId as string,
    })
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

      <h2 class="text-2xl font-bold">Migrate student</h2>
    </div>
    {{ JSON.stringify(student) }}
    <form class="flex flex-col space-y-4 items-stretch" @submit="onSubmit">
      <FormElement name="classId">
        <FormSelect label="Class" name="classId" placeholder="Select new class">
          <option v-for="item in classes" :key="item.id" :value="item.id">
            {{ item.title }}
          </option>
        </FormSelect>
      </FormElement>
      <Button :disabled="isSubmitting" type="submit">Submit</Button>
    </form>
  </div>
</template>
