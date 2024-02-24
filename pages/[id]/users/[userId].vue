<script setup lang="ts">
import { ROLE } from "~/database/schema";

definePageMeta({
  middleware: ["protected"],
});
</script>

<template>
  <UserForm :role="ROLE.ADMIN" />
</template>
