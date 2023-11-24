<script setup lang="ts" generic="TData">
import { type Table } from "@tanstack/vue-table";

interface DataTablePaginationProps {
  table: Table<TData>;
}
defineProps<DataTablePaginationProps>();
</script>

<template>
  <div class="flex items-center justify-between px-2">
    <div class="flex items-center space-x-6 lg:space-x-8">
      <div class="flex items-center space-x-2">
        <p class="text-sm font-medium">Rows per page</p>
        <Select
          :model-value="table.getState().pagination.pageSize.toString()"
          @update:model-value="table.setPageSize"
        >
          <SelectTrigger class="h-8 w-[70px]">
            <SelectValue
              :placeholder="table.getState().pagination.pageSize.toString()"
            />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem
                v-for="pageSize in [2, 5, 10, 20, 30]"
                :key="pageSize"
                :value="`${pageSize}`"
              >
                {{ pageSize }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div class="flex items-center justify-center text-sm font-medium">
        Page
        {{
          table.getPageCount() > 0
            ? table.getState().pagination.pageIndex + 1
            : 0
        }}
        of
        {{ table.getPageCount() }}
      </div>
      <RdxPaginationRoot
        v-slot="{ page }"
        :page="table.getState().pagination.pageIndex + 1"
        :total="table.getPageCount() * table.getState().pagination.pageSize"
        :sibling-count="2"
        show-edges
        :items-per-page="table.getState().pagination.pageSize"
      >
        <RdxPaginationList v-slot="{ items }" class="flex items-center gap-x-2">
          <PaginationFirst
            :disabled="!table.getCanPreviousPage()"
            @click="table.setPageIndex(0)"
          />
          <PaginationPrev
            :disabled="!table.getCanPreviousPage()"
            @click="table.previousPage()"
          />
          <template v-for="(item, index) in items">
            <RdxPaginationListItem
              v-if="item.type === 'page'"
              :key="item.value"
              :value="item.value"
              as-child
            >
              <Button
                size="icon"
                :variant="item.value === page ? 'default' : 'outline'"
                @click="table.setPageIndex(index)"
              >
                {{ item.value }}
              </Button>
            </RdxPaginationListItem>
            <PaginationEllipsis v-else :key="item.type" :index="index" />
          </template>
          <PaginationNext
            :disabled="!table.getCanNextPage()"
            @click="table.nextPage()"
          />
          <PaginationLast
            :disabled="!table.getCanNextPage()"
            @click="table.setPageIndex(table.getPageCount() - 1)"
          />
        </RdxPaginationList>
      </RdxPaginationRoot>
    </div>
  </div>
</template>
