<script lang="ts" setup>
import { rrulestr } from "rrule";
import { ModalActionSymbol } from "~/components/organisms/ModalContext.vue";

const actions = inject(ModalActionSymbol);

const { $client, $dayjs } = useNuxtApp();
const route = useRoute();
const { data, refresh } = await $client.year.getYears.useQuery({
  schoolId: route.params.id as string,
  page: parseInt((route.query.page as string) ?? 1, 10),
  pageSize: parseInt((route.query.pageSize as string) ?? 12, 10),
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

const yearId = ref("");

const columnHeaders = [
  { name: "Start Date", value: "startDate" },
  { name: "End Date", value: "endDate" },
  // { name: "Holidays", value: "email" },
];
</script>

<template>
  <div class="flex flex-col gap-4">
    <Button
      color="success"
      class="self-start"
      :to="`/school/${route.params.id}/year/new`"
    >
      Add year
    </Button>
    <Table full-width>
      <thead>
        <TableRow>
          <TableHeadCell v-for="column in columnHeaders" :key="column.name">
            {{ column.name }}
          </TableHeadCell>
          <TableHeadCell>Actions</TableHeadCell>
        </TableRow>
      </thead>
      <TableBody>
        <template v-if="years.length">
          <TableRow v-for="row in years" :key="row.id">
            <TableCell
              v-for="cell in columnHeaders"
              :key="`cell-${cell}-${row.id}`"
            >
              {{ row[cell.value as keyof typeof row] }}
            </TableCell>

            <TableCell>
              <div class="flex space-x-4">
                <IconButton color="success" :to="`year/${row.id}/classes`">
                  <div class="i-heroicons-eye w-6 h-6" />
                </IconButton>
                <IconButton color="info" :to="`year/${row.id}`">
                  <div class="i-heroicons-pencil-square w-6 h-6" />
                </IconButton>
                <IconButton
                  color="error"
                  @click="
                    () => {
                      yearId = row.id;
                      actions?.openModal();
                    }
                  "
                >
                  <div class="i-heroicons-trash w-6 h-6" />
                </IconButton>
              </div>
            </TableCell>
          </TableRow>
        </template>
        <TableRow v-else>
          <TableCell :colspan="columnHeaders.length + 1">
            No data to display.
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
    <Modal>
      <ModalOverlay />
      <ModalContent>
        <ModalHead>
          <h3 class="text-2xl font-semibold">Delete year</h3>
        </ModalHead>
        <ModalCloseButton />
        <ModalBody>
          <p>Are you sure you want to delete this year?</p>
        </ModalBody>
        <ModalFooter>
          <Button
            color="error"
            @click="
              async () => {
                await $client.year.deleteYear.mutate({
                  schoolId: route.params.id as string,
                  yearId,
                });
                yearId = '';
                await refresh();
                actions?.closeModal();
              }
            "
          >
            Delete
          </Button>
          <Button
            @click="
              () => {
                yearId = '';
                actions?.closeModal();
              }
            "
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  </div>
</template>
