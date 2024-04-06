<script lang="ts" setup>
const route = useRoute();
console.log(route.params);
const navItems = [
  {
    icon: "i-heroicons-rectangle-group-solid",
    path: routes.admin.index({ schoolId: route.params.id as string }),
    name: "Secretary",
  },
  {
    icon: "i-heroicons-user-group-solid",
    path: routes.admin.students.index({
      schoolId: route.params.id as string,
    }),
    name: "Students",
  },
  {
    icon: "i-heroicons-users-solid",
    path: routes.admin.teachers.index({
      schoolId: route.params.id as string,
    }),
    name: "Teachers",
  },
  {
    icon: "i-heroicons-chart-pie-solid",
    path: routes.users.index({
      schoolId: route.params.id as string,
    }),
    name: "Statistics",
  },
];
</script>

<template>
  <div class="bg-brand-shade-light min-h-screen flex flex-col">
    <AdminTopBar />
    <div class="container mx-auto py-12">
      <slot />
    </div>
    <BottomMenu v-if="route.params.id" :nav-items="navItems" />
  </div>
</template>
