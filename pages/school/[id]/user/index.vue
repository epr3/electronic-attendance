<script lang="ts" setup>
import { User, ROLE } from "@prisma/client";

import { ModalActionSymbol } from "~/components/organisms/ModalContext.vue";

const actions = inject(ModalActionSymbol);

const route = useRoute();

const { page, pageSize, setPage, setPageSize, nextPage, prevPage } =
  usePagination();

const { data, refresh } = await useFetch<{
  users: (User & { role: ROLE })[];
  count: number;
}>(`/api/school/${route.params.id}/users`, {
  query: {
    page,
    pageSize,
  },
});

const users = computed(() => (data.value ? data.value.users : []));
const count = computed(() => (data.value ? data.value.count : 0));

const userId = ref("");

const columnHeaders = [
  { name: "First Name", value: "firstName" },
  { name: "Last Name", value: "lastName" },
  { name: "Email", value: "email" },
  { name: "Role", value: "role" },
  { name: "Telephone", value: "telephone" },
  { name: "Verified At", value: "verifiedAt" },
] as { name: string; value: keyof ({ role: ROLE } & User) }[];

const deleteUser = (userId: string) =>
  $fetch(`/api/school/${route.params.id}/users/${userId}`, {
    method: "DELETE",
  });
</script>

<template>
  <div class="flex flex-col gap-4">
    <Button color="success" class="self-start" to="user/new"> Add user </Button>
    <Table full-width>
      <thead>
        <TableRow>
          <TableHeadCell v-for="column in columnHeaders" :key="column.name">
            {{ column.name }}
          </TableHeadCell>
          <TableHeadCell>Actions</TableHeadCell>
        </TableRow>
      </thead>
      <TableBody>
        <template v-if="users.length">
          <TableRow v-for="row in users" :key="row.id">
            <TableCell
              v-for="cell in columnHeaders"
              :key="`cell-${cell}-${row.id}`"
            >
              {{
                cell.value === "role"
                  ? row[cell.value].slice(0, 1).toUpperCase() +
                    row[cell.value].slice(1).toLowerCase()
                  : row[cell.value]
              }}
            </TableCell>

            <TableCell>
              <div class="flex space-x-4">
                <IconButton color="info" :to="`user/${row.id}`">
                  <div class="i-heroicons-pencil-square w-6 h-6" />
                </IconButton>
                <IconButton
                  color="error"
                  @click="
                    () => {
                      userId = row.id;
                      actions?.openModal();
                    }
                  "
                >
                  <div class="i-heroicons-trash w-6 h-6" />
                </IconButton>
              </div>
            </TableCell>
          </TableRow>
        </template>
        <TableRow v-else>
          <TableCell :colspan="columnHeaders.length + 1">
            No data to display.
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
    <Pagination
      v-if="users.length"
      :page-size="pageSize"
      :current-page="page"
      :total="count"
      @page-size:set="setPageSize"
      @page:set="setPage"
      @page:next="nextPage"
      @page:prev="prevPage"
    />
    <Modal>
      <ModalOverlay />
      <ModalContent>
        <ModalHead>
          <h3 class="text-2xl font-semibold">Delete user</h3>
        </ModalHead>
        <ModalCloseButton />
        <ModalBody>
          <p>Are you sure you want to delete this user?</p>
        </ModalBody>
        <ModalFooter>
          <Button
            color="error"
            @click="
              async () => {
                await deleteUser(userId);
                userId = '';
                await refresh();
                actions?.closeModal();
              }
            "
          >
            Delete
          </Button>
          <Button
            @click="
              () => {
                userId = '';
                actions?.closeModal();
              }
            "
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  </div>
</template>
