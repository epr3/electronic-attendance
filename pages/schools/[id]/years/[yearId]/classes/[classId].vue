<script lang="ts" setup>
import { Class, ClassStudent } from "@prisma/client";

const route = useRoute();
const { $api } = useNuxtApp();

const { data } = await useFetch<Class & { students: ClassStudent[] }>(
  $api.years.classes.id(route.params.classId as string)({
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
