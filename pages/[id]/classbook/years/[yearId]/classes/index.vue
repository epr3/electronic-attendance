<script lang="ts" setup>
import type { Class, User } from "~/database/schema";

const route = useRoute();
const { page, pageSize, setPagination } = usePagination();

const { data } = await useFetch<{
  classes: (Class & {
    headTeacher: User;
  })[];
  count: number;
}>(
  api.years.classes.index({
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
          // noOfStudents: item._count.students,
        };
      })
    : []
);

const count = computed(() => (data.value ? data.value.count : 0));

const columnHeaders = [
  { name: "Class Title", value: "title" },
  { name: "Head Teacher", value: "headTeacher" },
  { name: "No of students", value: "noOfStudents" },
];
</script>

<template>
  <div class="flex flex-col gap-4">
    <Button variant="default" class="self-start" as-child>
      <NuxtLink
        :to="
          routes.years.classes.new({
            schoolId: route.params.id as string,
            yearId: route.params.yearId as string,
          })
        "
      >
        Add year
      </NuxtLink>
    </Button>
    <!-- <DataTable
      v-if="data"
      :columns="schoolYearColumns"
      :data="years"
      :page-count="Math.ceil(count / pageSize)"
      :pagination="pagination"
      :set-pagination="setPagination"
    /> -->
  </div>
</template>
