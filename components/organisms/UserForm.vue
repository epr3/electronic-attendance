<script lang="ts" setup>
import { object, string } from "zod";
import { type User, ROLE } from "~/database/schema";

const props = defineProps<{ role: ROLE }>();

const route = useRoute();

const user = ref<(User & { role: ROLE }) | null>(null);

if (route.params.userId) {
  const { data } = await useFetch<User & { role: ROLE }>(
    routes.users.get(route.params.userId as string)({
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
      telephone: string().min(1),
    })
  ),
});

const onSubmit = handleSubmit(async (values) => {
  const { email, firstName, lastName, telephone } = values;

  const apiRoute = route.params.userId
    ? api.users.id(route.params.userId as string)({
        schoolId: route.params.id as string,
      })
    : api.users.index({ schoolId: route.params.id as string });

  const method = route.params.userId ? "PUT" : "POST";

  const { error } = await useFetch(apiRoute, {
    method,
    body: { email, firstName, lastName, telephone, role: props.role },
  });

  if (error.value) {
    generalError.value = error.value?.message ?? "";
    return;
  }
  await navigateTo(routes.users.index({ schoolId: route.params.id as string }));
});
</script>

<template>
  <div class="flex flex-col space-y-8">
    <div class="flex space-x-4 items-center">
      <Button size="icon" as-child>
        <NuxtLink
          :to="routes.users.index({ schoolId: route.params.id as string })"
        >
          <div class="i-heroicons-arrow-left" />
        </NuxtLink>
      </Button>

      <h2 class="text-2xl font-bold">New user</h2>
    </div>
    <form class="flex flex-col space-y-4 items-stretch" @submit="onSubmit">
      <div class="flex space-x-4">
        <Field v-slot="{ componentField }" name="firstName">
          <FormItem class="basis-1/2">
            <FormLabel>First Name</FormLabel>
            <FormControl>
              <Input v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </Field>
        <Field v-slot="{ componentField }" name="lastName">
          <FormItem class="basis-1/2">
            <FormLabel>Last Name</FormLabel>
            <FormControl>
              <Input v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </Field>
      </div>
      <Field v-slot="{ componentField }" name="email">
        <FormItem>
          <FormLabel>E-mail</FormLabel>
          <FormControl>
            <Input v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </Field>
      <Field v-slot="{ componentField }" name="telephone">
        <FormItem>
          <FormLabel>Telephone </FormLabel>
          <FormControl>
            <Input type="tel" v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </Field>

      <Button :disabled="isSubmitting" type="submit">Submit</Button>
    </form>
  </div>
</template>
