<script setup lang="ts" generic="TData, TValue">
import type { ColumnDef, PaginationState } from "@tanstack/vue-table";
import { FlexRender, getCoreRowModel, useVueTable } from "@tanstack/vue-table";

const props = defineProps<{
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination: {
    pageIndex: number;
    pageSize: number;
  };
  pageCount: number;
  setPagination: (pagination: PaginationState) => PaginationState;
}>();

const table = useVueTable({
  get data() {
    return props.data;
  },
  columns: props.columns,
  get pageCount() {
    return props.pageCount;
  },
  state: {
    pagination: props.pagination,
  },
  getCoreRowModel: getCoreRowModel(),
  // manualFiltering: true,
  manualPagination: true,
  // manualSorting: true,
  // debugAll: true,
  onPaginationChange: (updater) => {
    if (typeof updater === "function") {
      props.setPagination(
        updater({
          pageIndex: props.pagination.pageIndex,
          pageSize: props.pagination.pageSize,
        })
      );
    } else {
      props.setPagination(updater);
    }
  },
});
</script>

<template>
  <Table>
    <TableHeader>
      <TableRow
        v-for="headerGroup in table.getHeaderGroups()"
        :key="headerGroup.id"
      >
        <TableHead v-for="header in headerGroup.headers" :key="header.id">
          <FlexRender
            v-if="!header.isPlaceholder"
            :render="header.column.columnDef.header"
            :props="header.getContext()"
          />
        </TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <template v-if="table.getRowModel().rows?.length">
        <TableRow
          v-for="row in table.getRowModel().rows"
          :key="row.id"
          :data-state="row.getIsSelected() ? 'selected' : undefined"
        >
          <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
            <FlexRender
              :render="cell.column.columnDef.cell"
              :props="cell.getContext()"
            />
          </TableCell>
        </TableRow>
      </template>
      <template v-else>
        <TableRow>
          <TableCell :colspan="columns.length" class="h-24 text-center">
            No results.
          </TableCell>
        </TableRow>
      </template>
    </TableBody>
  </Table>

  <DataTablePagination :table="table" />
</template>
