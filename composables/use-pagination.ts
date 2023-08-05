export const usePagination = ({ navigation } = { navigation: true }) => {
  const route = useRoute();

  const page = ref(parseInt((route.query.page as string) ?? 1, 10));
  const pageSize = ref(parseInt((route.query.pageSize as string) ?? 5, 10));

  const setPageSize = (data: string) => {
    pageSize.value = parseInt(data);
  };

  const setPage = (data: string) => {
    page.value = parseInt(data);
  };

  const nextPage = () => {
    page.value += 1;
  };

  const prevPage = () => {
    page.value -= 1;
  };
  if (navigation) {
    watch([page, pageSize], async (newValue) => {
      const [newPage, newPageSize] = newValue;
      await navigateTo({
        path: "",
        query: { page: newPage, pageSize: newPageSize },
      });
    });
  }

  return { page, pageSize, setPageSize, setPage, nextPage, prevPage };
};
