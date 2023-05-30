<script lang="ts" setup>
import { TRPCClientError } from "@trpc/client";
import { ROLE } from "@prisma/client";
import { object, string } from "zod";

const route = useRoute();
const router = useRouter();

const { $client } = useNuxtApp();

let user = null;

if (route.params.studentId) {
  user = await $client.user.getUser.query({
    schoolId: route.params.id as string,
    userId: route.params.studentId as string,
  });
}

const generalError = ref("");

const { handleSubmit, isSubmitting, errors } = useForm({
  initialValues: user,
  validationSchema: toTypedSchema(
    object({
      firstName: string().min(1),
      lastName: string().min(1),
      email: string().email(),
      telephone: string().min(1),
    })
  ),
});

const onSubmit = handleSubmit(async (values) => {
  try {
    const { email, firstName, lastName, telephone } = values;
    if (route.params.studentId) {
      await $client.user.editUser.mutate({
        schoolId: route.params.id as string,
        userId: route.params.userId as string,
        email,
        firstName,
        lastName,
        telephone,
        role: ROLE.STUDENT,
      });
    } else {
      await $client.user.addUser.mutate({
        schoolId: route.params.id as string,
        email,
        firstName,
        lastName,
        telephone,
        role: ROLE.STUDENT,
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

      <h2 class="text-2xl font-bold">New student</h2>
    </div>
    <form class="flex flex-col space-y-4 items-stretch" @submit="onSubmit">
      <div class="flex space-x-4">
        <FormElement name="firstName">
          <Input label="First Name" name="firstName" />
        </FormElement>
        <FormElement name="lastName">
          <Input label="Last Name" name="lastName" />
        </FormElement>
      </div>
      <FormElement name="email">
        <Input label="Email" type="email" name="email" />
      </FormElement>

      <FormElement name="telephone">
        <Input label="Telephone" type="telephone" name="telephone" />
      </FormElement>

      <Button :disabled="isSubmitting" type="submit">Submit</Button>
    </form>
  </div>
</template>
