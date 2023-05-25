<script lang="ts" setup>
const route = useRoute();
const { $client } = useNuxtApp();

const { data } = useAsyncData(async () => {
  const classObject = await $client.class.getClass.query({
    classId: route.params.classId as string,
    yearId: route.params.yearId as string,
    schoolId: route.params.id as string,
  });

  return { class: classObject };
});

const classObject = computed(() =>
  data.value ? data.value.class : { title: "" }
);
</script>

<template>
  <div class="flex flex-col gap-4">
    <h1 class="text-center text-4xl font-bold">{{ classObject.title }}</h1>
    <NuxtPage />
  </div>
</template>
