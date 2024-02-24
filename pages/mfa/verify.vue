<script lang="ts" setup>
const user = useUser();
import { object, string, array } from "zod";

const { toast } = useToast();
await useFetch(api.auth.mfaSms);

const { handleSubmit, isSubmitting, errors } = useForm({
  validationSchema: toTypedSchema(
    object({
      token: array(string()),
    })
  ),
});

const onSubmit = handleSubmit(async (values) => {
  const { error } = await useFetch<{ schoolId: string }>(api.auth.mfaVerify, {
    method: "POST",
    body: { token: values.token.join("") },
  });

  if (error.value) {
    console.log(error.value);
    return toast({
      title: "Toast me an error",
      description: "Something went wrong",
      variant: "destructive",
    });
  }

  user.value = {
    ...user.value!,
    session: { ...user.value!.session, mfaVerified: true },
  };
  await navigateTo(routes.home, { replace: true });
});
</script>

<template>
  <Card>
    <div class="space-y-4 p-4 lg:p-8 xl:w-128">
      {{ errors }}
      <h4 class="text-2xl font-bold">Verify your account</h4>
      <div class="flex flex-col items-stretch space-y-4">
        <form class="flex flex-col space-y-4 items-stretch" @submit="onSubmit">
          <Field v-slot="{ value, handleChange }" name="token">
            <FormItem>
              <FormLabel>Token {{ value ? value.join("") : "" }}</FormLabel>
              <FormControl>
                <RdxPinInputRoot
                  :default-value="value"
                  placeholder="○"
                  class="flex gap-2 items-center mt-1"
                  @complete="handleChange"
                >
                  <RdxPinInputInput
                    v-for="(id, index) in 6"
                    :key="id"
                    :index="index"
                    class="w-10 h-10 bg-white rounded text-center shadow-lg text-gray9 placeholder:text-gray5 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-white"
                  />
                </RdxPinInputRoot>
              </FormControl>
              <FormMessage />
            </FormItem>
          </Field>

          <Button :disabled="isSubmitting" type="submit" color="success">
            Verify
          </Button>
        </form>
      </div>
    </div>
  </Card>
</template>
