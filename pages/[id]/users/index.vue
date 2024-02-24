<script lang="ts" setup>
definePageMeta({
  middleware: ["protected"],
});

import { ROLE, type SchoolUser, type User } from "~/database/schema";

const { userColumns } = useColumnDefs();

const route = useRoute();

const { page, pageSize, pagination, setPagination } = usePagination();

const { data } = await useFetch<{
  users: (User & { schools: SchoolUser[] })[];
  count: number;
}>(api.users.index({ schoolId: route.params.id as string }), {
  query: {
    "role[eq]": ROLE.ADMIN,
    page,
    pageSize,
  },
});

const users = computed(
  () =>
    data.value?.users.map((item) => ({
      id: item.id,
      firstName: item.firstName,
      lastName: item.lastName,
      email: item.email,
      telephone: item.telephone,
      verifiedAt: item.verifiedAt,
      role: item.schools[0].role,
    })) ?? []
);
const count = computed(() => (data.value ? data.value.count : 0));
</script>

<template>
  <div class="flex flex-col gap-4">
    <Button variant="default" class="self-start" as-child>
      <NuxtLink :to="routes.users.new({ schoolId: route.params.id as string })">
        Add user
      </NuxtLink>
    </Button>

    <DataTable
      v-if="data"
      :columns="userColumns"
      :data="users"
      :page-count="Math.ceil(count / pageSize)"
      :pagination="pagination"
      :set-pagination="setPagination"
    />
  </div>
</template>
