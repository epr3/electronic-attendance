export const usePagination = ({ navigation } = { navigation: false }) => {
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
    watch([page, pageSize], async () => {
      await navigateTo({
        path: "",
        query: { page: page.value, pageSize: pageSize.value },
      });
    });
  }

  return { page, pageSize, setPageSize, setPage, nextPage, prevPage };
};
