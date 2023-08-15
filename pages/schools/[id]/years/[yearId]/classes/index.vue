<script lang="ts" setup>
import { Class, User } from "@prisma/client";
import { ModalActionSymbol } from "~/components/organisms/ModalContext.vue";

const actions = inject(ModalActionSymbol);

const { $routes, $api } = useNuxtApp();

const route = useRoute();
const { page, pageSize, setPage, setPageSize, nextPage, prevPage } =
  usePagination();

const { data, refresh } = await useFetch<{
  classes: (Class & {
    _count: {
      students: number;
    };
    headTeacher: User;
  })[];
  count: number;
}>(
  $api.years.classes.index({
    schoolId: route.params.id as string,
    yearId: route.params.yearId as string,
  }),
  {
    query: {
      page,
      pageSize,
    },
  }
);

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

const count = computed(() => (data.value ? data.value.count : 0));

const classId = ref("");

const columnHeaders = [
  { name: "Class Title", value: "title" },
  { name: "Head Teacher", value: "headTeacher" },
  { name: "No of students", value: "noOfStudents" },
];

const deleteClass = (classId: string) =>
  $fetch(
    $api.years.classes.id(classId)({
      schoolId: route.params.id as string,
      yearId: route.params.yearId as string,
    }),
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
      :to="
        $routes.years.classes.new({
          schoolId: route.params.id as string,
          yearId: route.params.yearId as string,
        })
      "
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
                size="lg"
                :to="
                  $routes.years.classes.students.index({
                    schoolId: route.params.id as string,
                    yearId: route.params.yearId as string,
                    classId: row.id,
                  })
                "
              >
                <div class="i-heroicons-users w-6 h-6" />
              </IconButton>
              <IconButton
                color="success"
                :to="
                  $routes.years.classes.subjects.index({
                    classId: row.id,
                    schoolId: route.params.id as string,
                    yearId: route.params.yearId as string,
                  })
                "
              >
                <div class="i-heroicons-academic-cap w-6 h-6" />
              </IconButton>

              <IconButton
                color="info"
                :to="
                  $routes.years.classes.get(row.id)({
                    schoolId: route.params.id as string,
                    yearId: route.params.yearId as string,
                  })
                "
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
      </TableBody>
    </Table>
    <Pagination
      v-if="classes.length"
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
                await deleteClass(classId);
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
