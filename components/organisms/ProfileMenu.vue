<script lang="ts" setup>
import { PopoverPortal, PopoverTrigger } from "radix-vue";
import { ROLE } from "~/drizzle/schema";
import {
  SelectSchoolType,
  SelectSchoolUserType,
  SelectUserSessionType,
  SelectUserType,
} from "~/drizzle/types";

const { $api, $routes } = useNuxtApp();

const props = defineProps<{
  user: SelectUserType & {
    roles: ROLE[];
    session: SelectUserSessionType;
    schools: (SelectSchoolUserType & { school: SelectSchoolType })[];
  };
}>();

const route = useRoute();
const schools = computed(() =>
  props.user.schools
    ? props.user.schools.filter((school) => school.role === ROLE.DIRECTOR)
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
  <PopoverRoot>
    <div class="absolute right-12 bottom-12">
      <PopoverTrigger
        class="cursor-pointer flex justify-center items-center bg-white w-16 h-16 p-4 rounded-full shadow"
      >
        <div class="w-full h-full i-heroicons-user-20-solid" />
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverContent as-child>
          <ul class="bg-white rounded-lg shadow py-2">
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
          <PopoverArrow class="fill-white" />
        </PopoverContent>
      </PopoverPortal>
    </div>
  </PopoverRoot>
</template>
