<script lang="ts" setup>
import { ROLE, User } from "@prisma/client";
import { object, string, nativeEnum } from "zod";

const route = useRoute();

const user = ref<(User & { role: ROLE }) | null>(null);

if (route.params.userId) {
  const { data } = await useFetch<User & { role: ROLE }>(
    `/api/auth/school/${route.params.id}/users/${route.params.userId}`
  );

  user.value = data.value;
}

const generalError = ref("");

const { handleSubmit, isSubmitting } = useForm({
  initialValues: user.value,
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
  const { email, firstName, lastName, telephone, role } = values;

  const apiRoute = route.params.userId
    ? `/api/school/${route.params.id}/users/${route.params.userId}`
    : `/api/school/${route.params.id}/users`;

  const method = route.params.userId ? "PUT" : "POST";

  const { error } = await useFetch(apiRoute, {
    method,
    body: { email, firstName, lastName, telephone, role },
  });

  if (error.value) {
    generalError.value = error.value?.message ?? "";
    return;
  }
  await navigateTo(`/school/${route.params.id}/user`);
});
</script>

<template>
  <div class="flex flex-col space-y-8">
    <div class="flex space-x-4 items-center">
      <div
        class="i-heroicons-arrow-left w-8 h-8 cursor-pointer"
        @click="
          async () => {
            await navigateTo(`/school/${route.params.id}/user`);
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
        <FormSelect label="Role" name="role" placeholder="Select role">
          <option
            v-for="role in Object.values(ROLE).filter(
              (item) => item !== ROLE.SUPERADMIN && item !== ROLE.DIRECTOR
            )"
            :key="role"
            :value="role"
          >
            {{ role.slice(0, 1).toUpperCase() + role.slice(1).toLowerCase() }}
          </option>
        </FormSelect>
      </FormElement>
      <Button :disabled="isSubmitting" type="submit">Submit</Button>
    </form>
  </div>
</template>
