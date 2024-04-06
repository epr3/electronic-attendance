<script lang="ts" setup>
import { object, string } from "zod";

const generalError = ref("");

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(
    object({
      email: string().email(),
      password: string().min(8),
    })
  ),
});

const onSubmit = handleSubmit(async (values) => {
  try {
    await $fetch<{ schoolId: string }>(api.auth.login, {
      method: "POST",
      body: { email: values.email, password: values.password },
    });

    await navigateTo(routes.home, { replace: true });
  } catch (error) {
    console.error(error);
    generalError.value = error.message ?? "";
    return;
  }
});
</script>

<template>
  <Card>
    <p v-if="generalError">{{ generalError }}</p>
    <div class="space-y-4 p-4 lg:p-8 xl:w-128">
      <h4 class="text-2xl font-bold">Log in</h4>
      <form
        class="flex flex-col space-y-4 items-stretch"
        novalidate
        @submit="onSubmit"
      >
        <Field v-slot="{ componentField }" name="email">
          <FormItem>
            <FormLabel>E-mail</FormLabel>
            <FormControl>
              <Input type="email" v-bind="componentField" />
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

        <Button :disabled="isSubmitting" type="submit">Submit</Button>
      </form>
      <p>
        Don't have an account? Create one
        <StyledLink :to="routes.auth.register">here</StyledLink>!
      </p>
    </div>
  </Card>
</template>