<script lang="ts" setup>
import type { School } from "~/database/schema";

definePageMeta({
  layout: "auth",
  middleware: ["protected"],
});
const route = useRoute();

const { data } = await useFetch<School>(
  `/api/schools/${route.params.id}/dashboard`
);
</script>

<template>
  <div class="flex flex-col gap-4">
    <h1 class="text-2xl font-semibold text-gray9">About {{ data?.name }}</h1>

    <div class="grid grid-cols-3 gap-8">
      <NuxtLink
        class="p-8 rounded-lg shadow flex flex-col items-center justify-center gap-4"
        :to="`/${route.params.id}/classbook`"
      >
        <div class="i-heroicons-book-open square-12" />
        <h2 class="text-2xl font-semibold text-gray9">Classbook</h2>
      </NuxtLink>
      <NuxtLink
        class="p-8 rounded-lg shadow flex flex-col items-center justify-center gap-4"
        :to="`/${route.params.id}/consulting`"
      >
        <div class="i-heroicons-question-mark-circle square-12" />
        <h2 class="text-2xl font-semibold text-gray9">Consulting</h2>
      </NuxtLink>
      <NuxtLink
        class="p-8 rounded-lg shadow flex flex-col items-center justify-center gap-4"
        :to="`/${route.params.id}/admin`"
      >
        <div class="i-heroicons-wrench-screwdriver square-12" />
        <h2 class="text-2xl font-semibold text-gray9">Admin</h2>
      </NuxtLink>
    </div>
  </div>
</template>
