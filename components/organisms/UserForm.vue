<script lang="ts" setup>
import { TRPCClientError } from "@trpc/client";
import { ROLE, User } from "@prisma/client";
import { object, string, nativeEnum } from "zod";

const route = useRoute();
const router = useRouter();

const { $client } = useNuxtApp();

let user = null;

if (route.params.userId) {
  user = await $client.user.getUser.query({
    schoolId: route.params.id as string,
    userId: route.params.userId as string,
  });
}

const generalError = ref("");

const { handleSubmit, isSubmitting, errors } = useForm({
  initialValues: user as User & { role: ROLE },
  validationSchema: toTypedSchema(
    object({
      firstName: string().min(1),
      lastName: string().min(1),
      email: string().email(),
      role: nativeEnum(ROLE),
      telephone: string().min(1),
    })
  ),
});

const onSubmit = handleSubmit(async (values) => {
  try {
    const { email, firstName, lastName, telephone, role } = values;
    if (route.params.userId) {
      await $client.user.editUser.mutate({
        schoolId: route.params.id as string,
        userId: route.params.userId as string,
        email,
        firstName,
        lastName,
        telephone,
        role,
      });
    } else {
      await $client.user.addUser.mutate({
        schoolId: route.params.id as string,
        email,
        firstName,
        lastName,
        telephone,
        role,
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

      <h2 class="text-2xl font-bold">New user</h2>
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
      <FormElement name="role">
        <Select label="Role" name="role" placeholder="Select role">
          <option
            v-for="role in Object.values(ROLE).filter(
              (item) => item !== ROLE.SUPERADMIN && item !== ROLE.DIRECTOR
            )"
            :key="role"
            :value="role"
          >
            {{ role.slice(0, 1).toUpperCase() + role.slice(1).toLowerCase() }}
          </option>
        </Select>
      </FormElement>
      <Button :disabled="isSubmitting" type="submit">Submit</Button>
    </form>
  </div>
</template>
