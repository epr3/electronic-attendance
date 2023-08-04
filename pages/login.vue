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
  const { data, error } = await useFetch<
    {
      hasMfa: boolean;
      mfaRequired: boolean;
    },
    { message: string }
  >("/api/auth/login", {
    method: "POST",
    body: { email: values.email, password: values.password },
  });

  if (error.value) {
    generalError.value = error.value?.message ?? "";
    return;
  }

  if (data.value?.hasMfa) {
    return await navigateTo("/mfa/verify");
  }

  if (data.value?.mfaRequired) {
    return await navigateTo("/mfa");
  }
  return await navigateTo("/");
});
</script>

<template>
  <Card>
    <p v-if="generalError">{{ generalError }}</p>
    <div class="space-y-4 p-4 lg:p-8 xl:w-128">
      <h4 class="text-2xl font-bold">Log in</h4>
      <form class="flex flex-col space-y-4 items-stretch" @submit="onSubmit">
        <FormElement name="email">
          <Input label="Email" type="email" name="email" />
        </FormElement>

        <FormElement name="password">
          <Input label="Password" type="password" name="password" />
        </FormElement>
        <Button :disabled="isSubmitting" type="submit">Submit</Button>
      </form>
      <p>
        Don't have an account? Create one
        <StyledLink to="/register">here</StyledLink>!
      </p>
    </div>
  </Card>
</template>
