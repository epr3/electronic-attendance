import { type PaginationState } from "@tanstack/vue-table";

export const usePagination = ({ navigation } = { navigation: true }) => {
  const route = useRoute();

  const pagination = ref<PaginationState>({
    pageIndex: parseInt((route.query.page as string) ?? 1, 10) - 1,
    pageSize: parseInt((route.query.pageSize as string) ?? 5, 10),
  });

  //! MUST MATCH TANSTACK TABLE SHAPE
  function setPagination({ pageIndex, pageSize }: PaginationState) {
    pagination.value.pageSize = pageSize;
    pagination.value.pageIndex = pageIndex;

    return { pageIndex, pageSize };
  }

  if (navigation) {
    watch(
      pagination,
      async (newValue) => {
        const { pageIndex, pageSize } = newValue;
        await navigateTo({
          path: "",
          query: { page: pageIndex + 1, pageSize },
        });
      },
      { deep: true }
    );
  }

  const page = computed(() => pagination.value.pageIndex);
  const pageSize = computed(() => pagination.value.pageSize);

  return { pagination, page, pageSize, setPagination };
};
