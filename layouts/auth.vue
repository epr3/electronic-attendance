<script lang="ts" setup>
const route = useRoute();

const navItems = [
  {
    icon: "i-heroicons-rectangle-group-solid",
    path: routes.school.get(route.params.id as string),
    name: "Dashboard",
  },
  {
    icon: "i-heroicons-user-group-solid",
    path: routes.users.index({
      schoolId: route.params.id as string,
    }),
    name: "Users",
  },
  {
    icon: "i-heroicons-user-solid",
    path: routes.profile,
    name: "Profile",
  },
];
</script>

<template>
  <div class="bg-brand-shade-light min-h-screen flex flex-col">
    <TopBar />
    <div class="container mx-auto py-12">
      <slot />
    </div>
    <BottomMenu v-if="navItems.length" :nav-items="navItems" />
  </div>
</template>
