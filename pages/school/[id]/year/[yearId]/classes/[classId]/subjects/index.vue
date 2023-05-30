<script lang="ts" setup>
import { rrulestr } from "rrule";
import { ModalActionSymbol } from "~/components/organisms/ModalContext.vue";

const route = useRoute();
const { $client, $dayjs } = useNuxtApp();

const actions = inject(ModalActionSymbol);
const subjectId = ref("");

const { data, refresh } = useAsyncData("schedules", async () => {
  const schedules = await $client.schedule.getSchedules.query({
    classId: route.params.classId as string,
    schoolId: route.params.id as string,
    yearId: route.params.yearId as string,
    page: parseInt((route.query.page as string) ?? 1, 10),
    pageSize: parseInt((route.query.pageSize as string) ?? 12, 10),
  });
  return { schedules };
});

const schedules = computed(() => data.value?.schedules.schedules);

const returnDateFromRrule = (rule: string) => {
  const rrule = rrulestr(rule);

  return $dayjs(rrule.options.dtstart).format("dddd");
};
</script>

<template>
  <div class="flex flex-wrap gap-4">
    <Card
      v-for="item in schedules"
      :key="item.id"
      class="basis-full md:basis-1/4"
    >
      <div
        class="flex flex-col p-4 gap-4 items-center justify-center min-h-[200px]"
      >
        <div class="flex flex-col gap-4">
          <div class="flex items-center gap-2">
            <div class="i-heroicons-user w-8 h-8 shrink-0" />
            <span>
              {{ item.teacher.firstName }} {{ item.teacher.lastName }}
            </span>
          </div>
          <div class="flex items-center gap-2">
            <div class="i-heroicons-academic-cap w-8 h-8 shrink-0" />
            <span>{{ item.subject.name }}</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="i-heroicons-calendar w-8 h-8 shrink-0" />
            <span>{{ returnDateFromRrule(item.calendarRule) }}</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="i-heroicons-clock w-8 h-8 shrink-0" />
            <span>{{ item.startTime }} - {{ item.endTime }}</span>
          </div>
        </div>
        <div class="flex gap-2">
          <IconButton
            color="success"
            size="lg"
            :to="`/school/${route.params.id}/year/${route.params.yearId}/classes/${route.params.classId}/subjects/${item.id}/students`"
          >
            <div class="i-heroicons-users w-6 h-6" />
          </IconButton>
          <IconButton
            color="info"
            size="lg"
            :to="`/school/${route.params.id}/year/${route.params.yearId}/classes/${route.params.classId}/subjects/${item.id}`"
          >
            <div class="i-heroicons-pencil-square w-6 h-6" />
          </IconButton>
          <IconButton
            color="error"
            size="lg"
            @click="
              () => {
                subjectId = item.id;
                actions?.openModal();
              }
            "
          >
            <div class="i-heroicons-trash w-6 h-6" />
          </IconButton>
        </div>
      </div>
    </Card>
    <Card class="basis-full md:basis-1/4">
      <div class="flex items-center justify-center min-h-[200px]">
        <Button
          :to="`/school/${route.params.id}/year/${route.params.yearId}/classes/${route.params.classId}/subjects/new`"
          color="success"
        >
          <div class="flex items-center gap-2">
            <div class="i-heroicons-plus w-8 h-8 shrink-0" />
            <span>Add subject</span>
          </div>
        </Button>
      </div>
    </Card>
    <Modal>
      <ModalOverlay />
      <ModalContent>
        <ModalHead>
          <h3 class="text-2xl font-semibold">Delete subject</h3>
        </ModalHead>
        <ModalCloseButton />
        <ModalBody>
          <p>Are you sure you want to delete this subject?</p>
        </ModalBody>
        <ModalFooter>
          <Button
            color="error"
            @click="
              async () => {
                await $client.schedule.deleteSchedule.mutate({
                  schoolId: route.params.id as string,
                  yearId: route.params.yearId as string,
                  subjectId,
                  classId: route.params.classId as string,
                });
                subjectId = '';
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
                subjectId = '';
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
