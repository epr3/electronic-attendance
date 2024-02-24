<script lang="ts" setup>
import type { Subject } from "~/database/schema";

definePageMeta({
  middleware: ["protected"],
});

const { subjectColumns } = useColumnDefs();

const route = useRoute();

const { page, pageSize, pagination, setPagination } = usePagination();

const { data } = await useFetch<{
  subjects: Subject[];
  count: number;
}>(api.subjects.index({ schoolId: route.params.id as string }), {
  query: {
    page,
    pageSize,
  },
});

const subjects = computed(() => (data.value ? data.value.subjects : []));
const count = computed(() => (data.value ? data.value.count : 0));
</script>

<template>
  <div class="flex flex-col gap-4">
    <Button variant="default" class="self-start" as-child>
      <NuxtLink
        :to="routes.subjects.new({ schoolId: route.params.id as string })"
      >
        Add subject
      </NuxtLink>
    </Button>
    <DataTable
      v-if="data"
      :columns="subjectColumns"
      :data="subjects"
      :page-count="Math.ceil(count / pageSize)"
      :pagination="pagination"
      :set-pagination="setPagination"
    />
  </div>
</template>
