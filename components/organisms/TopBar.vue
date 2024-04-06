<script lang="ts" setup>
const session = useUserSession();
const logout = async () => {
  await $fetch(api.auth.logout);
  session.value = null;
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