<script lang="ts" setup>
import { ROLE } from "~/drizzle/schema";
import {
  type SelectSchoolType,
  type SelectSchoolUserType,
  type SelectUserSessionType,
  type SelectUserType,
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
  <DropdownMenu>
    <div class="absolute right-12 bottom-12">
      <DropdownMenuTrigger
        class="cursor-pointer flex justify-center items-center bg-white w-16 h-16 p-4 rounded-full shadow"
      >
        <div class="w-full h-full i-heroicons-user-20-solid" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        avoid-collisions
        class="bg-white rounded-lg shadow py-2"
      >
        <div class="flex items-center justify-between font-medium">
          {{ `${user.firstName} ${user.lastName}` }}
          <div
            class="cursor-pointer w-6 h-6 shrink-0 i-heroicons-power"
            @click="logout"
          />
        </div>

        <DropdownMenuSeparator />
        <DropdownMenuLabel>Profile</DropdownMenuLabel>

        <DropdownMenuItem
          v-for="item in navItems"
          :key="item.path"
          as-child
          class="cursor-pointer"
        >
          <NuxtLink
            :to="item.path"
            :class="{ 'font-bold': route.path === item.path }"
          >
            {{ item.name }}
          </NuxtLink>
        </DropdownMenuItem>

        <template v-if="schools && schools.length">
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Schools</DropdownMenuLabel>

          <DropdownMenuItem
            v-for="item in schools"
            :key="item.schoolId"
            as-child
            class="cursor-pointer"
          >
            <NuxtLink
              :to="$routes.users.index({ schoolId: item.schoolId })"
              :class="{
                'font-bold': route.path === `/schools/${item.schoolId}`,
              }"
            >
              {{ item.school.name }}
            </NuxtLink>
          </DropdownMenuItem>
        </template>

        <RdxDropdownMenuArrow class="fill-white" />
      </DropdownMenuContent>
    </div>
  </DropdownMenu>
</template>
