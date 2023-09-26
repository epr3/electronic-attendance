<script lang="ts" setup>
import { object, string } from "zod";

const { $routes, $api } = useNuxtApp();

await useFetch($api.auth.mfaSms);

const { handleSubmit, isSubmitting, errors } = useForm({
  validationSchema: toTypedSchema(
    object({
      token: string(),
    })
  ),
});

const onSubmit = handleSubmit(async (values) => {
  try {
    await useFetch($api.auth.mfaVerify, {
      method: "POST",
      body: { token: values.token },
    });

    return await navigateTo($routes.home);
  } catch (e) {
    // console.log(e);
  }
});
</script>

<template>
  <Card>
    <div class="space-y-4 p-4 lg:p-8 xl:w-128">
      {{ errors }}
      <h4 class="text-2xl font-bold">Verify your account</h4>
      <div class="flex flex-col items-stretch space-y-4">
        <form class="flex flex-col space-y-4 items-stretch" @submit="onSubmit">
          <FormElement name="email">
            <Input label="Token" type="text" name="token" />
          </FormElement>
          <Button :disabled="isSubmitting" type="submit" color="success">
            Verify
          </Button>
        </form>
      </div>
    </div>
  </Card>
</template>
