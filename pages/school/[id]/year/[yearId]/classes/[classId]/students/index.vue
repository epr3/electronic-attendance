<script lang="ts" setup>
import { ROLE, User } from "@prisma/client";

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
    role: ROLE.STUDENT,
    includeClass: route.params.classId,
  },
});

const students = computed(() => (data.value ? data.value.users : []));
const count = computed(() => (data.value ? data.value.count : 0));

const studentId = ref("");

const columnHeaders = [
  { name: "First Name", value: "firstName" },
  { name: "Last Name", value: "lastName" },
] as { name: string; value: keyof User }[];

const deleteStudent = (studentId: string) =>
  $fetch(
    `/api/school/${route.params.id}/years/${route.params.yearId}/classes/${route.params.classId}/students/${studentId}`,
    {
      method: "DELETE",
    }
  );
</script>

<template>
  <div class="flex flex-col gap-4">
    <Button
      color="success"
      class="self-start"
      :to="`/school/${route.params.id}/year/${route.params.yearId}/classes/${route.params.classId}/students/new`"
    >
      Add student
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
        <TableRow v-for="row in students" :key="row.id">
          <TableCell
            v-for="cell in columnHeaders"
            :key="`cell-${cell}-${row.id}`"
          >
            {{ row[cell.value] }}
          </TableCell>

          <TableCell>
            <div class="flex space-x-4">
              <IconButton color="info" :to="`students/${row.id}`">
                <div class="i-heroicons-arrows-right-left w-6 h-6" />
              </IconButton>
              <IconButton
                color="error"
                @click="
                  () => {
                    studentId = row.id;
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
      v-if="students.length"
      :page-size="pageSize"
      :current-page="page"
      :total="count"
      @page:set="setPage"
      @page-size:set="setPageSize"
      @page:prev="prevPage"
      @page:next="nextPage"
    />
    <Modal>
      <ModalOverlay />
      <ModalContent>
        <ModalHead>
          <h3 class="text-2xl font-semibold">Remove student from class</h3>
        </ModalHead>
        <ModalCloseButton />
        <ModalBody>
          <p>Are you sure you want to remove the student from this class?</p>
        </ModalBody>
        <ModalFooter>
          <Button
            color="error"
            @click="
              async () => {
                async () => {
                  await deleteStudent(studentId);
                  studentId = '';
                  await refresh();
                  actions?.closeModal();
                };
              }
            "
          >
            Remove
          </Button>
          <Button
            @click="
              () => {
                studentId = '';
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
