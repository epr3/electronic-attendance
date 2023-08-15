<script lang="ts" setup>
import { ROLE, type School, type SchoolUser, type User } from "@prisma/client";

const { $api, $routes } = useNuxtApp();

const props = defineProps<{
  user: User & {
    school: (SchoolUser & {
      school: School;
    })[];
  };
}>();

const route = useRoute();
const schools = computed(() =>
  props.user.school
    ? props.user.school.filter((school) => school.role === ROLE.DIRECTOR)
    : []
);

const logout = async () => {
  await useFetch($api.auth.logout);
  return await navigateTo($routes.auth.login);
};

const navItems = [
  {
    path: $routes.home,
    name: "Home",
  },
  {
    path: $routes.profile,
    name: "Profile",
  },
];
</script>
<template>
  <VDropdown class="absolute right-12 bottom-12">
    <div
      class="cursor-pointer flex justify-center items-center bg-white w-16 h-16 p-4 rounded-full shadow"
    >
      <div class="w-full h-full i-heroicons-user-20-solid" />
    </div>
    <template #popper>
      <ul v-close-popper="true" class="bg-white rounded-lg shadow py-2">
        <li>
          <span
            class="flex items-center justify-between menu-link font-medium hover:bg-transparent"
          >
            {{ `${user.firstName} ${user.lastName}` }}
            <div
              class="cursor-pointer w-6 h-6 shrink-0 i-heroicons-power"
              @click="logout"
            />
          </span>
        </li>
        <hr class="hr" />
        <li class="menu-header">Profile</li>

        <li v-for="item in navItems" :key="item.path">
          <NuxtLink
            :to="item.path"
            class="menu-link"
            :class="{ 'font-bold': route.path === item.path }"
          >
            {{ item.name }}
          </NuxtLink>
        </li>

        <template v-if="schools && schools.length">
          <hr class="hr" />
          <li class="menu-header">Schools</li>

          <li v-for="item in schools" :key="item.schoolId">
            <NuxtLink
              :to="$routes.users.index({ schoolId: item.schoolId })"
              class="menu-link"
              :class="{
                'font-bold': route.path === `/schools/${item.schoolId}`,
              }"
            >
              {{ item.school.name }}
            </NuxtLink>
          </li>
        </template>
      </ul>
    </template>
  </VDropdown>
</template>
