<script lang="ts" setup>
import { vOnClickOutside } from "@vueuse/components";
import { ROLE, type School, type SchoolUser, type User } from "@prisma/client";

const { $client } = useNuxtApp();

const props = defineProps<{
  user: User & {
    school: (SchoolUser & {
      school: School;
    })[];
  };
}>();

const route = useRoute();
const schools = computed(() =>
  props.user.school.filter((school) => school.role === ROLE.DIRECTOR)
);

const logout = async () => {
  await $client.auth.logout.query();
  await navigateTo("/login");
};

const menuOpen = ref(false);

function openMenu() {
  menuOpen.value = true;
}
function closeMenu() {
  menuOpen.value = false;
}

const navItems = [
  {
    path: "/",
    name: "Home",
  },
  {
    path: "/profile",
    name: "Profile",
  },
];
</script>
<template>
  <div v-on-click-outside="closeMenu" class="absolute right-8 top-8 z-40">
    <div class="relative">
      <div
        class="cursor-pointer flex justify-center items-center bg-white w-16 h-16 p-4 rounded-full shadow"
        @click="openMenu"
      >
        <div class="w-full h-full i-heroicons-user-20-solid" />
      </div>

      <div v-if="menuOpen" class="absolute top-[120%] right-[30%]">
        <ul
          class="w-[320px] bg-white rounded-lg shadow py-2"
          @click="closeMenu"
        >
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

          <template v-if="schools.length">
            <hr class="hr" />
            <li class="menu-header">Schools</li>

            <li v-for="item in schools" :key="item.schoolId">
              <NuxtLink
                :to="`/school/${item.schoolId}/user`"
                class="menu-link"
                :class="{
                  'font-bold': route.path === `/school/${item.schoolId}`,
                }"
              >
                {{ item.school.name }}
              </NuxtLink>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </div>
</template>
