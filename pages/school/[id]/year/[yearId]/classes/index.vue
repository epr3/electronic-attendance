<script lang="ts" setup>
import { ModalActionSymbol } from "~/components/organisms/ModalContext.vue";

const actions = inject(ModalActionSymbol);

const { $client } = useNuxtApp();
const route = useRoute();
const { data, refresh } = await $client.class.getClasses.useQuery({
  schoolId: route.params.id as string,
  yearId: route.params.yearId as string,
  page: parseInt((route.query.page as string) ?? 1, 10),
  pageSize: parseInt((route.query.pageSize as string) ?? 12, 10),
});

const classes = computed(() =>
  data.value
    ? data.value.classes.map((item) => {
        return {
          id: item.id,
          title: item.title,
          headTeacher: `${item.headTeacher.firstName} ${item.headTeacher.lastName}`,
          noOfStudents: item._count.students,
        };
      })
    : []
);

const classId = ref("");

const columnHeaders = [
  { name: "Class Title", value: "title" },
  { name: "Head Teacher", value: "headTeacher" },
  { name: "No of students", value: "noOfStudents" },
];
</script>

<template>
  <div class="flex flex-col gap-4">
    <Button
      color="success"
      class="self-start"
      :to="`/school/${route.params.id}/year/${route.params.yearId}/classes/new`"
    >
      Add class
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
        <template v-if="classes.length">
          <TableRow v-for="row in classes" :key="row.id">
            <TableCell
              v-for="cell in columnHeaders"
              :key="`cell-${cell.value}-${row.id}`"
            >
              {{ row[cell.value as keyof typeof row] }}
            </TableCell>

            <TableCell>
              <div class="flex space-x-4">
                <IconButton
                  color="success"
                  :to="`/school/${route.params.id}/year/${route.params.yearId}/classes/${row.id}/subjects`"
                >
                  <div class="i-heroicons-academic-cap w-6 h-6" />
                </IconButton>

                <IconButton
                  color="info"
                  :to="`/school/${route.params.id}/year/${route.params.yearId}/classes/${row.id}`"
                >
                  <div class="i-heroicons-pencil-square w-6 h-6" />
                </IconButton>
                <IconButton
                  color="error"
                  @click="
                    () => {
                      classId = row.id;
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
          <h3 class="text-2xl font-semibold">Delete year</h3>
        </ModalHead>
        <ModalCloseButton />
        <ModalBody>
          <p>Are you sure you want to delete this year?</p>
        </ModalBody>
        <ModalFooter>
          <Button
            color="error"
            @click="
              async () => {
                await $client.class.deleteClass.mutate({
                  schoolId: route.params.id as string,
                  yearId: route.params.yearId as string,
                  classId,
                });
                classId = '';
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
                classId = '';
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
