<script lang="ts" setup>
import { ROLE } from "~/drizzle/schema";

const user = useUser();

if (!user.value) {
  await navigateTo("/login");
}

if (
  user.value &&
  !user.value.mfaEnabled &&
  user.value.roles.some((item) =>
    [ROLE.ADMIN, ROLE.DIRECTOR, ROLE.TEACHER].includes(item)
  )
) {
  await navigateTo("/mfa");
}

if (user.value && !user.value.session.mfaVerified) {
  await navigateTo("/mfa/verify");
}
</script>

<template>
  <div class="px-lg py-xl bg-brand-shade-dark min-h-screen">
    {{ user }}
    <ProfileMenu v-if="user" :user="user" />
    <slot />
  </div>
</template>
