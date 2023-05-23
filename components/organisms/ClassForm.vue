<script lang="ts" setup>
import { ROLE } from "@prisma/client";

const route = useRoute();
const { $client } = useNuxtApp();

const teachersData = await $client.user.getUsers.query({
  schoolId: route.params.id as string,
  page: 1,
  pageSize: 12,
  role: ROLE.TEACHER,
});

const studentData = await $client.user.getUsers.query({
  schoolId: route.params.id as string,
  page: 1,
  pageSize: 12,
  role: ROLE.STUDENT,
});

console.log(teachersData.users, studentData.users);
</script>

<template>
  <p>Class Form</p>
</template>
