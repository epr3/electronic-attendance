<script lang="ts" setup>
import { Subject } from "@prisma/client";
import { ModalActionSymbol } from "~/components/organisms/ModalContext.vue";

const actions = inject(ModalActionSymbol);

const { $routes, $api } = useNuxtApp();

const route = useRoute();

const { page, pageSize, setPage, setPageSize, nextPage, prevPage } =
  usePagination();

const { data, refresh } = await useFetch<{
  subjects: Subject[];
  count: number;
}>($api.subjects.index({ schoolId: route.params.id as string }), {
  query: {
    page,
    pageSize,
  },
});

const subjects = computed(() => (data.value ? data.value.subjects : []));
const count = computed(() => (data.value ? data.value.count : 0));

const subjectId = ref("");

const columnHeaders = [{ name: "Name", value: "name" }] as {
  name: string;
  value: keyof { name: string };
}[];

const deleteSubject = (subjectId: string) =>
  $fetch($api.subjects.id(subjectId)({ schoolId: route.params.id as string }), {
    method: "DELETE",
  });
</script>

<template>
  <div class="flex flex-col gap-4">
    <Button
      color="success"
      class="self-start"
      :to="$routes.subjects.new({ schoolId: route.params.id as string })"
    >
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
        <TableRow v-for="row in subjects" :key="row.id">
          <TableCell
            v-for="cell in columnHeaders"
            :key="`cell-${cell}-${row.id}`"
          >
            {{ row[cell.value] }}
          </TableCell>

          <TableCell>
            <div class="flex space-x-4">
              <IconButton
                :to="
                  $routes.subjects.get(row.id)({
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
      </TableBody>
    </Table>
    <Pagination
      v-if="subjects.length"
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
