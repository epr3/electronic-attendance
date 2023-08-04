<script lang="ts" setup>
import { object, string } from "zod";

const route = useRoute();
const router = useRouter();

const generalError = ref("");

const page = 1;
const pageSize = 12;

const { data, error } = await useFetch(
  `/api/school/${route.params.id}/years/${route.params.yearId}/classes?page=${page}&pageSize=${pageSize}`
);

const { data: student } = await useFetch(
  `/api/school/${route.params.id}/users/${route.params.studentId}`
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
    `/api/school/${route.params.id}/years/${route.params.yearId}/classes/${route.params.classId}/students/${route.params.studentId}`,
    {
      method: "PUT",
      body: { classId },
    }
  );

  if (error.value) {
    generalError.value = error.value?.message ?? "";
    return;
  }
  await navigateTo(`/school/${route.params.id}/subject`);
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
        <Select label="Class" name="classId" placeholder="Select new class">
          <option v-for="item in classes" :key="item.id" :value="item.id">
            {{ item.title }}
          </option>
        </Select>
      </FormElement>
      <Button :disabled="isSubmitting" type="submit">Submit</Button>
    </form>
  </div>
</template>
