<script lang="ts" setup>
import { object, string } from "zod";

const { $routes, $api } = useNuxtApp();

const { data } = await useFetch<{ qrCode: string; secret: string }>(
  $api.auth.mfaGenerateQr
);

const qrCode = computed(() => data.value?.qrCode || "");
const secret = computed(() => data.value?.secret || "");

const { handleSubmit, isSubmitting, errors } = useForm({
  validationSchema: toTypedSchema(
    object({
      token: string(),
    })
  ),
});

async function smsEnroll() {
  await useFetch($api.auth.mfaEnroll, {
    method: "POST",
    body: { secret: secret.value, smsOnly: true },
  });

  return await navigateTo($routes.auth.mfaVerify);
}

const onSubmit = handleSubmit(async (values) => {
  await useAsyncData("verify", () =>
    $fetch($api.auth.mfaEnroll, {
      method: "POST",
      body: { secret: secret.value, smsOnly: false, token: values.token },
    })
  );

  return await navigateTo($routes.home);
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
          <FormElement name="token">
            <Input label="Token" type="text" name="token" />
          </FormElement>
          <Button :disabled="isSubmitting" type="submit" color="success">
            Enroll MFA
          </Button>
        </form>
        <Button @click="smsEnroll">Enroll only using SMS</Button>
      </div>
    </div>
  </Card>
</template>
