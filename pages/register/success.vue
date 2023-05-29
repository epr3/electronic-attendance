<!-- <script lang="ts" setup>
const route = useRoute();
const { $client } = useNuxtApp();

const { data } = await useAsyncData("qrCode", async () => {
  const data = await $client.auth.mfaEnroll.query({
    email: route.query.email as string,
  });

  return { qrCode: data.qrCode };
});

const qrCode = computed(() => data.value?.qrCode ?? "");
</script> -->

<template>
  <Card>
    <div class="space-y-4 p-4 lg:p-8 xl:w-128">
      <h4 class="text-2xl font-bold">School successfully enrolled!</h4>
      <div class="flex flex-col items-stretch space-y-4">
        <p>
          You should receive an email shortly to confirm your account. Follow
          the steps there to start using the
          <strong>Electronic Attendance</strong> app.
        </p>
        <p>Did not receive an email?</p>
        <Button>Click here</Button>
      </div>
    </div>
  </Card>
</template>
