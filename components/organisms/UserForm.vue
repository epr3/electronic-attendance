<script lang="ts" setup>
import { object, string, nativeEnum } from "zod";
import { ROLE } from "~/drizzle/schema";
import { SelectUserType } from "~/drizzle/types";

const route = useRoute();
const { $routes, $api } = useNuxtApp();

const user = ref<(SelectUserType & { role: ROLE }) | null>(null);

if (route.params.userId) {
  const { data } = await useFetch<SelectUserType & { role: ROLE }>(
    $routes.users.get(route.params.userId as string)({
      schoolId: route.params.id as string,
    })
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
    ? $api.users.id(route.params.userId as string)({
        schoolId: route.params.id as string,
      })
    : $api.users.index({ schoolId: route.params.id as string });

  const method = route.params.userId ? "PUT" : "POST";

  const { error } = await useFetch(apiRoute, {
    method,
    body: { email, firstName, lastName, telephone, role },
  });

  if (error.value) {
    generalError.value = error.value?.message ?? "";
    return;
  }
  await navigateTo(
    $routes.users.index({ schoolId: route.params.id as string })
  );
});
</script>

<template>
  <div class="flex flex-col space-y-8">
    <div class="flex space-x-4 items-center">
      <div
        class="i-heroicons-arrow-left w-8 h-8 cursor-pointer"
        @click="
          async () => {
            await navigateTo(
              $routes.users.index({ schoolId: route.params.id as string })
            );
          }
        "
      />

      <h2 class="text-2xl font-bold">New user</h2>
    </div>
    <form class="flex flex-col space-y-4 items-stretch" @submit="onSubmit">
      <div class="flex space-x-4">
        <FormElement class="basis-1/2" name="firstName">
          <Input label="First Name" name="firstName" />
        </FormElement>
        <FormElement class="basis-1/2" name="lastName">
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
