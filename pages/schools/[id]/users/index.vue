<script lang="ts" setup>
import { ModalActionSymbol } from "~/components/organisms/ModalContext.vue";
import { ROLE } from "~/drizzle/schema";
import { SelectUserType } from "~/drizzle/types";

const actions = inject(ModalActionSymbol);

const route = useRoute();
const { $routes, $api } = useNuxtApp();

const { page, pageSize, setPage, setPageSize, nextPage, prevPage } =
  usePagination();

const { data, refresh } = await useFetch<{
  users: (SelectUserType & { role: ROLE })[];
  count: number;
}>($api.users.index({ schoolId: route.params.id as string }), {
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
] as { name: string; value: keyof ({ role: ROLE } & SelectUserType) }[];

const deleteUser = (userId: string) =>
  $fetch($api.users.id(userId)({ schoolId: route.params.id as string }), {
    method: "DELETE",
  });
</script>

<template>
  <div class="flex flex-col gap-4">
    <Button
      color="success"
      class="self-start"
      :to="$routes.users.new({ schoolId: route.params.id as string })"
    >
      Add user
    </Button>

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
        <TableRow v-for="row in users" :key="row.id">
          <TableCell
            v-for="cell in columnHeaders"
            :key="`cell-${cell}-${row.id}`"
          >
            {{
              cell.value === "role"
                ? row[cell.value].slice(0, 1).toUpperCase() +
                  row[cell.value].slice(1).toLowerCase()
                : row[cell.value as keyof SelectUserType]
            }}
          </TableCell>

          <TableCell>
            <div class="flex space-x-4">
              <IconButton
                color="info"
                :to="
                  $routes.users.get(row.id)({
                    schoolId: route.params.id as string,
                  })
                "
              >
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
