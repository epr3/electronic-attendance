<script lang="ts" setup>
definePageMeta({
  layout: "auth",
});

const route = useRoute();

const tabList = [
  {
    name: "Personnel",
    href: `/school/${route.params.id}/user`,
  },
  {
    name: "Subjects",
    href: `/school/${route.params.id}/subject`,
  },
  {
    name: "Years",
    href: `/school/${route.params.id}/year`,
  },
];
</script>

<template>
  <Card>
    <div class="lg:min-w-[800px]">
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
  </Card>
</template>
