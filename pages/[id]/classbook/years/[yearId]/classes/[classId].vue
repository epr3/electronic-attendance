<script lang="ts" setup>
import type { Class, User } from "~/database/schema";

const route = useRoute();

const { data } = await useFetch<Class & { students: User[] }>(
  api.years.classes.id(route.params.classId as string)({
    schoolId: route.params.id as string,
    yearId: route.params.yearId as string,
  })
);

const classObject = computed(() => (data.value ? data.value : { title: "" }));
</script>

<template>
  <div class="flex flex-col gap-4">
    <h1 class="text-center text-4xl font-bold">{{ classObject.title }}</h1>
    <NuxtPage />
  </div>
</template>
