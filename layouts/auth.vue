<script lang="ts" setup>
import { User, SchoolUser, School, ROLE } from "@prisma/client";

const auth = useAuth();

if (!auth.value) {
  try {
    const { data } = await useFetch("/api/auth/session");
    auth.value = data;
  } catch (e) {
    await navigateTo("/login");
  }
}

if (!auth.value || !auth.value.user) {
  await navigateTo("/login");
}

if (auth.value) {
  if (
    !auth.value.user.mfa &&
    [ROLE.ADMIN, ROLE.DIRECTOR, ROLE.TEACHER].includes(auth.value.user.role)
  ) {
    await navigateTo("/mfa");
  }

  if (!auth.value.mfaVerified) {
    await navigateTo("/mfa/verify");
  }
}

const { data } = await useFetch<
  User & { school: (SchoolUser & { school: School })[] }
>("/api/auth/me");

const user = computed(() => (data ? data.value : null));
</script>

<template>
  <div class="px-lg py-xl bg-brand-shade-dark min-h-screen">
    {{ user }}
    <ProfileMenu v-if="user" :user="user" />
    <slot />
  </div>
</template>
