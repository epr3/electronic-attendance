<script lang="ts" setup>
import { ROLE } from "~/drizzle/schema";

const user = useUser();
if (!user.value) {
  await navigateTo("/login");
}

if (
  user.value &&
  !user.value.mfa &&
  user.value.roles.some((item) =>
    [ROLE.ADMIN, ROLE.DIRECTOR, ROLE.TEACHER].includes(item)
  )
) {
  await navigateTo("/mfa");
}

if (user.value && !user.value.mfaVerified) {
  await navigateTo("/mfa/verify");
} else {
  await navigateTo("/login");
}
</script>

<template>
  <div class="px-lg py-xl bg-brand-shade-dark min-h-screen">
    {{ user }}
    <ProfileMenu v-if="user" :user="user" />
    <slot />
  </div>
</template>
