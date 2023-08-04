<script lang="ts" setup>
import { Class, ClassStudent } from "@prisma/client";

const route = useRoute();

const { data } = await useFetch<Class & { students: ClassStudent[] }>(
  `/api/school/${route.params.id}/years/${route.params.yearId}/classes/${route.params.classId}`
);

const classObject = computed(() => (data.value ? data.value : { title: "" }));
</script>

<template>
  <div class="flex flex-col gap-4">
    <h1 class="text-center text-4xl font-bold">{{ classObject.title }}</h1>
    <NuxtPage />
  </div>
</template>
