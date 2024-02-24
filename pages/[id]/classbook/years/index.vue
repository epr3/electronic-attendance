<script lang="ts" setup>
import { rrulestr } from "rrule";

definePageMeta({
  middleware: ["protected"],
});

const { $dayjs } = useNuxtApp();
const { schoolYearColumns } = useColumnDefs();
const route = useRoute();

const { page, pageSize, setPagination, pagination } = usePagination();

const { data } = await useFetch<{
  years: any[];
  count: number;
}>(api.years.index({ schoolId: route.params.id as string }), {
  query: {
    page,
    pageSize,
  },
});

const years = computed(() =>
  data.value
    ? data.value.years.map((item) => {
        const rRule = rrulestr(item.schoolDateRule);
        return {
          id: item.id,
          startDate: $dayjs(rRule.options.dtstart).format("YYYY-MM-DD"),
          endDate: $dayjs(rRule.options.until).format("YYYY-MM-DD"),
        };
      })
    : []
);
const count = computed(() => (data.value ? data.value.count : 0));
</script>

<template>
  <div class="flex flex-col gap-4">
    <Button variant="default" class="self-start" as-child>
      <NuxtLink :to="routes.years.new({ schoolId: route.params.id as string })">
        Add year
      </NuxtLink>
    </Button>

    <DataTable
      v-if="data"
      :columns="schoolYearColumns"
      :data="years"
      :page-count="Math.ceil(count / pageSize)"
      :pagination="pagination"
      :set-pagination="setPagination"
    />
  </div>
</template>
