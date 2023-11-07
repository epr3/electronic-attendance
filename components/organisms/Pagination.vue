<script lang="ts" setup>
const props = defineProps<{
  currentPage: number;
  total: number;
  pageSize: number;
}>();

defineEmits<{
  (e: "page:set", page: string): void;
  (e: "page-size:set", pageSize: string): void;
  (e: "page:prev"): void;
  (e: "page:next"): void;
}>();

const totalPages = computed(() => Math.ceil(props.total / props.pageSize));

const pageSizes = [5, 10, 25, 30, 40];
</script>

<template>
  <div class="flex justify-between items-center">
    <div class="flex items-center justify-center gap-2">
      <PaginationButton
        :disabled="currentPage === 1"
        orientation="left"
        @click="$emit('page:prev')"
      />
      <PaginationPage
        v-for="page in totalPages"
        :key="page"
        :page="page"
        :is-active="page === currentPage"
        @click="$emit('page:set', page.toString())"
      />
      <PaginationButton
        :disabled="currentPage === totalPages"
        orientation="right"
        @click="$emit('page:next')"
      />
    </div>

    <Select
      :model-value="pageSize"
      name="pageSize"
      @update:model-value="(data) => $emit('page-size:set', data as string)"
    >
      <option v-for="item in pageSizes" :key="`pageSize-${item}`" :value="item">
        {{ item }}
      </option>
    </Select>
  </div>
</template>
