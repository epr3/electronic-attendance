<script lang="ts" setup>
import { User, SchoolUser, School } from "@prisma/client";
const { $client } = useNuxtApp();

const { data } = await $client.auth.me.useQuery();

const user = computed(() =>
  data
    ? (data.value?.user as User & {
        school: (SchoolUser & {
          school: School;
        })[];
      })
    : null
);
</script>

<template>
  <div class="px-lg py-xl bg-brand-shade-dark min-h-screen">
    <ProfileMenu v-if="user" :user="user" />
    <slot />
  </div>
</template>
