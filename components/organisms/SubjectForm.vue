<script lang="ts" setup>
import { object, string } from "zod";
import type { Subject } from "~/database/schema";

const route = useRoute();

const subject = ref({});

if (route.params.subjectId) {
  subject.value = await useFetch<Subject>(
    api.subjects.id(route.params.subjectId as string)({
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
    ? api.subjects.id(route.params.subjectId as string)({
        schoolId: route.params.id as string,
      })
    : api.subjects.index({ schoolId: route.params.id as string });

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
    routes.subjects.index({ schoolId: route.params.id as string })
  );
});
</script>

<template>
  <div class="flex flex-col space-y-8">
    <div class="flex space-x-4 items-center">
      <Button size="icon" as-child>
        <NuxtLink
          :to="routes.subjects.index({ schoolId: route.params.id as string })"
        >
          <div class="i-heroicons-arrow-left" />
        </NuxtLink>
      </Button>

      <h2 class="text-2xl font-bold">New subject</h2>
    </div>
    <form class="flex flex-col space-y-4 items-stretch" @submit="onSubmit">
      <Field v-slot="{ componentField }" name="name">
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </Field>
      <Button :disabled="isSubmitting" type="submit">Submit</Button>
    </form>
  </div>
</template>
