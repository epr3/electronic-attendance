<script lang="ts" setup>
import { rrulestr } from "rrule";

const route = useRoute();
const { $client, $dayjs } = useNuxtApp();

const data = await $client.year.getYear.query({
  schoolId: route.params.id as string,
  yearId: route.params.yearId as string,
});

const yearDate = rrulestr(data.schoolDateRule);

const startYear = $dayjs(yearDate.options.dtstart).format("YYYY");
const endYear = $dayjs(yearDate.options.until).format("YYYY");

const tabList = [
  {
    name: "Classes",
    href: `/school/${route.params.id}/year/${route.params.yearId}/details/classes`,
  },
  {
    name: "Schedule",
    href: `/school/${route.params.id}/year/${route.params.yearId}/details/schedule`,
  },
];
</script>

<template>
  <div class="flex gap-4 flex-col">
    <h5 class="text-4xl self-center">
      School year:
      <span class="font-bold">{{ startYear }} - {{ endYear }}</span>
    </h5>

    <div class="w-full">
      <div class="flex w-full">
        <NuxtLink
          v-for="item in tabList"
          :key="item.href"
          :to="item.href"
          class="grow text-center py-4 px-6 block border-r-2 border-gray-2 text-white font-bold last:border-r-0"
          :class="{
            'bg-black': route.path.includes(item.href),
            'bg-gray-6': !route.path.includes(item.href),
          }"
        >
          {{ item.name }}
        </NuxtLink>
      </div>

      <div class="p-8 min-h-[500px] space-y-4">
        <NuxtPage />
      </div>
    </div>
  </div>
</template>
