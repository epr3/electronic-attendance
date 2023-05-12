<script lang="ts" setup>
import { TRPCClientError } from "@trpc/client";
import { object, string } from "zod";

const { $client } = useNuxtApp();

const generalError = ref("");

const { handleSubmit, isSubmitting, errors } = useForm({
  validationSchema: toTypedSchema(
    object({
      email: string().email(),
      password: string().min(8),
    })
  ),
});

const onSubmit = handleSubmit(async (values) => {
  try {
    await $client.auth.login.mutate({
      email: values.email,
      password: values.password,
    });

    await navigateTo("/");
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
          {} as Record<"email" | "password", string>
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
