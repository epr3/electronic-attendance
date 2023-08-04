<script lang="ts" setup>
import { Subject } from "@prisma/client";
import { ModalActionSymbol } from "~/components/organisms/ModalContext.vue";

const actions = inject(ModalActionSymbol);

const route = useRoute();
const page = parseInt((route.query.page as string) ?? 1, 10);
const pageSize = parseInt((route.query.pageSize as string) ?? 12, 10);

const { data, refresh } = await useFetch<{ subjects: Subject[] }>(
  `/api/school/${route.params.id}/subjects?page=${page}&pageSize=${pageSize}`
);

const subjects = computed(() => (data.value ? data.value.subjects : []));

const subjectId = ref("");

const columnHeaders = [{ name: "Name", value: "name" }] as {
  name: string;
  value: keyof { name: string };
}[];

const deleteSubject = (subjectId: string) =>
  $fetch(`/api/school/${route.params.id}/subjects/${subjectId}`, {
    method: "DELETE",
  });
</script>

<template>
  <div class="flex flex-col gap-4">
    <Button color="success" class="self-start" to="subject/new">
      Add subject
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
        <template v-if="subjects.length">
          <TableRow v-for="row in subjects" :key="row.id">
            <TableCell
              v-for="cell in columnHeaders"
              :key="`cell-${cell}-${row.id}`"
            >
              {{ row[cell.value] }}
            </TableCell>

            <TableCell>
              <div class="flex space-x-4">
                <IconButton :to="`subject/${row.id}`">
                  <div class="i-heroicons-pencil-square w-6 h-6" />
                </IconButton>
                <IconButton
                  color="error"
                  @click="
                    () => {
                      subjectId = row.id;
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
          <h3 class="text-2xl font-semibold">Delete subject</h3>
        </ModalHead>
        <ModalCloseButton />
        <ModalBody>
          <p>Are you sure you want to delete this subject?</p>
        </ModalBody>
        <ModalFooter>
          <Button
            color="error"
            @click="
              async () => {
                await deleteSubject(subjectId);
                subjectId = '';
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
                subjectId = '';
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
