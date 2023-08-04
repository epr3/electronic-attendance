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
        @click="$emit('page:set', page)"
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
      @update:model-value="(data) => $emit('page-size:set', data)"
    >
      <option value="3">3</option>
      <option value="12">12</option>
      <option value="24">24</option>
      <option value="36">36</option>
    </Select>
  </div>
</template>
