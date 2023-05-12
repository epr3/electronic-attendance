<script lang="ts" setup>
import { User, ROLE } from "@prisma/client";

import { ModalActionSymbol } from "~/components/organisms/ModalContext.vue";

const actions = inject(ModalActionSymbol);

const { $client } = useNuxtApp();
const route = useRoute();
const { data, refresh } = await $client.user.getUsers.useQuery({
  schoolId: route.params.id as string,
  page: parseInt((route.query.page as string) ?? 1, 10),
  pageSize: parseInt((route.query.pageSize as string) ?? 12, 10),
});

const users = computed(() =>
  data.value
    ? data.value.users.map((item) => ({ ...item.user, role: item.role }))
    : []
);

const userId = ref("");

const columnHeaders = [
  { name: "First Name", value: "firstName" },
  { name: "Last Name", value: "lastName" },
  { name: "Email", value: "email" },
  { name: "Role", value: "role" },
  { name: "Telephone", value: "telephone" },
  { name: "Verified At", value: "verifiedAt" },
] as { name: string; value: keyof ({ role: ROLE } & User) }[];
</script>

<template>
  <div class="flex flex-col gap-4">
    <Button class="self-start" to="user/new"> Add user </Button>
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
                <IconButton :to="`user/${row.id}`">
                  <div class="i-heroicons-pencil-square w-6 h-6" />
                </IconButton>
                <IconButton
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
                await $client.user.deleteUser.mutate({
                  schoolId: route.params.id as string,
                  userId,
                });
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