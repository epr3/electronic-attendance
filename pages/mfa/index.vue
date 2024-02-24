<script lang="ts" setup>
const user = useUser();
import { object, array, string } from "zod";

const { data } = await useFetch<{ qrCode: string; secret: string }>(
  api.auth.mfaGenerateQr
);

const qrCode = computed(() => data.value?.qrCode || "");
const secret = computed(() => data.value?.secret || "");

const { handleSubmit, isSubmitting, errors } = useForm({
  validationSchema: toTypedSchema(
    object({
      token: array(string()),
    })
  ),
});

async function emailEnroll() {
  await useFetch(api.auth.mfaEnroll, {
    method: "POST",
    body: { secret: secret.value, emailOnly: false },
  });

  return await navigateTo(routes.auth.mfaVerify);
}

const onSubmit = handleSubmit(async (values) => {
  await useAsyncData("verify", () =>
    $fetch(api.auth.mfaEnroll, {
      method: "POST",
      body: {
        secret: secret.value,
        emailOnly: false,
        token: values.token.join(""),
      },
    })
  );

  user.value = {
    ...user.value!,
    mfaEnabled: true,
    session: { ...user.value!.session, mfaVerified: true },
  };

  await navigateTo(routes.home, { replace: true });
  return;
});
</script>

<template>
  <Card>
    <div class="space-y-4 p-4 lg:p-8 xl:w-128">
      {{ errors }}
      <h4 class="text-2xl font-bold">Add MFA to your account</h4>
      <div class="flex flex-col items-stretch space-y-4">
        <img :src="qrCode" alt="qrCode" />
        <p>After scanning the QR Code, type in the PIN below.</p>
        <form
          novalidate
          class="flex flex-col space-y-4 items-stretch"
          @submit="onSubmit"
        >
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
            Enroll MFA
          </Button>
        </form>
        <Button @click="emailEnroll">Enroll only using E-mail</Button>
      </div>
    </div>
  </Card>
</template>
