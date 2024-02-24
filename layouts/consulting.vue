<script lang="ts" setup>
definePageMeta({
  middleware: ["protected"],
});

const user = useUser();

const route = useRoute();
const navItems = ref<{ icon: string; path: string; name: string }[]>([]);
if (user.value?.schools) {
  navItems.value = [
    {
      icon: "i-heroicons-rectangle-group-solid",
      path: routes.home,
      name: "Dashboard",
    },
    {
      icon: "i-heroicons-user-group-solid",
      path: routes.users.index({
        schoolId:
          (route.params.id as string) || user.value!.schools[0].schoolId,
      }),
      name: "Users",
    },
    {
      icon: "i-heroicons-user-solid",
      path: routes.profile,
      name: "Profile",
    },
  ];
}
</script>

<template>
  <div class="px-lg py-xl bg-brand-shade-dark min-h-screen">
    <slot />
    <BottomMenu v-if="navItems.length" :nav-items="navItems" />
  </div>
</template>
