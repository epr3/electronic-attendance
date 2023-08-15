<script lang="ts" setup>
import { Subject } from "@prisma/client";

import { object, string } from "zod";

const route = useRoute();
const router = useRouter();
const { $api, $routes } = useNuxtApp();

const subject = ref({});

if (route.params.subjectId) {
  subject.value = await useFetch<Subject>(
    $api.subjects.id(route.params.subjectId as string)({
      schoolId: route.params.id as string,
    })
  );
}

const generalError = ref("");

const { handleSubmit, isSubmitting } = useForm({
  initialValues: subject,
  validationSchema: toTypedSchema(
    object({
      name: string().min(1),
    })
  ),
});

const onSubmit = handleSubmit(async (values) => {
  const { name } = values;

  const apiRoute = route.params.subjectId
    ? $api.subjects.id(route.params.subjectId as string)({
        schoolId: route.params.id as string,
      })
    : $api.subjects.index({ schoolId: route.params.id as string });

  const method = route.params.subjectId ? "PUT" : "POST";

  const { error } = await useFetch(apiRoute, {
    method,
    body: { name },
  });

  if (error.value) {
    generalError.value = error.value?.message ?? "";
    return;
  }
  await navigateTo(
    $routes.subjects.index({ schoolId: route.params.id as string })
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

      <h2 class="text-2xl font-bold">New subject</h2>
    </div>
    <form class="flex flex-col space-y-4 items-stretch" @submit="onSubmit">
      <FormElement name="name">
        <Input label="Name" name="name" />
      </FormElement>
      <Button :disabled="isSubmitting" type="submit">Submit</Button>
    </form>
  </div>
</template>
