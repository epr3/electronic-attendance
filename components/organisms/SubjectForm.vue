<script lang="ts" setup>
import { Subject } from "@prisma/client";
import { TRPCClientError } from "@trpc/client";
import { object, string } from "zod";

const route = useRoute();
const router = useRouter();

const { $client } = useNuxtApp();

let subject = null;

if (route.params.subjectId) {
  subject = await $client.subject.getSubject.query({
    schoolId: route.params.id as string,
    subjectId: route.params.subjectId as string,
  });
}

const generalError = ref("");

const { handleSubmit, isSubmitting, errors } = useForm({
  initialValues: subject as Subject,
  validationSchema: toTypedSchema(
    object({
      name: string().min(1),
    })
  ),
});

const onSubmit = handleSubmit(async (values) => {
  try {
    const { name } = values;
    if (route.params.subjectId) {
      await $client.subject.editSubject.mutate({
        schoolId: route.params.id as string,
        subjectId: route.params.subjectId as string,
        name,
      });
    } else {
      await $client.subject.addSubject.mutate({
        schoolId: route.params.id as string,
        name,
      });
    }
    router.go(-1);
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
