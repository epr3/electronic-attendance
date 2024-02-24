<script lang="ts" setup>
const user = useUser();
const logout = async () => {
  await useFetch(api.auth.logout);
  user.value = null;
  await navigateTo(routes.auth.login);
};
</script>

<template>
  <div
    class="w-full h-24 bg-brand-primary px-8 py-4 flex justify-between items-center"
  >
    <h2 class="text-white text-2xl font-semibold">HUB</h2>
    <Button size="icon" variant="destructive" @click="logout">
      <div class="square-4 i-heroicons-power" />
    </Button>
  </div>
</template>
