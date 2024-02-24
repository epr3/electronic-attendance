<script lang="ts" setup>
import { object, string } from "zod";

const generalError = ref("");

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(
    object({
      email: string().email(),
      password: string().min(8),
      firstName: string().min(1),
      lastName: string().min(1),
      telephone: string().min(1),
      schoolName: string().min(1),
    })
  ),
});

const onSubmit = handleSubmit(async (values) => {
  const { email, password, firstName, lastName, telephone, schoolName } =
    values;

  const { error } = await useFetch<null, { message: string }>(
    api.auth.register,
    {
      method: "POST",
      body: {
        email,
        password,
        firstName,
        lastName,
        telephone,
        schoolName,
      },
    }
  );

  if (error.value) {
    generalError.value = error.value?.message ?? "";
    return;
  }

  await navigateTo(routes.auth.registerSuccess);
});
</script>

<template>
  <Card>
    <p v-if="generalError">{{ generalError }}</p>
    <div class="space-y-4 p-4 lg:p-8 xl:w-128">
      <h4 class="text-2xl font-bold">Enroll Now</h4>
      <form class="flex flex-col space-y-4 items-stretch" @submit="onSubmit">
        <div class="flex space-x-4">
          <Field v-slot="{ componentField }" name="firstName">
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </Field>
          <Field v-slot="{ componentField }" name="lastName">
            <FormItem>
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
              <Input type="email" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </Field>

        <Field v-slot="{ componentField }" name="telephone">
          <FormItem>
            <FormLabel>Telephone</FormLabel>
            <FormControl>
              <Input type="tel" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </Field>

        <Field v-slot="{ componentField }" name="password">
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input type="password" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </Field>

        <Field v-slot="{ componentField }" name="schoolName">
          <FormItem>
            <FormLabel>School Name</FormLabel>
            <FormControl>
              <Input v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </Field>

        <Button :disabled="isSubmitting" type="submit">Submit</Button>
      </form>
      <p>
        Already have an account? Log in
        <StyledLink :to="routes.auth.login">here</StyledLink>!
      </p>
    </div>
  </Card>
</template>
