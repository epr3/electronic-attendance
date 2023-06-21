<script lang="ts" setup>
import { User, SchoolUser, School } from "@prisma/client";

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
