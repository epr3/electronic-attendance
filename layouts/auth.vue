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
  <div class="px-8 py-32 bg-blue-100 min-h-screen">
    <ProfileMenu v-if="user" :user="user" />
    <slot />
  </div>
</template>
