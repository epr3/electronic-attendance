<script lang="ts" setup>
import { number, object } from "zod";

const { $dayjs } = useNuxtApp();

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const props = withDefaults(defineProps<{ highlightedDate?: string }>(), {
  highlightedDate: "",
});
const emit = defineEmits<{ (e: "select:date", value: string): void }>();

const highlightedDate = computed(() => props.highlightedDate);

const currentDate = ref(
  highlightedDate.value ? $dayjs(highlightedDate.value) : $dayjs()
);

const { setFieldValue, values, handleSubmit } = useForm({
  validationSchema: toTypedSchema(
    object({
      year: number(),
      month: number(),
      date: number(),
    })
  ),
  initialValues: {
    month: currentDate.value.month(),
    year: currentDate.value.year(),
    date: currentDate.value.date(),
  },
});

const selectedDate = computed(() => {
  return $dayjs(
    `${values.year}-${(values.month as number) + 1}-${values.date}`
  );
});

const startOfMonth = computed(() => selectedDate.value.startOf("month"));
const endOfMonth = computed(() => selectedDate.value.endOf("month"));

function computeSameDay(day: number) {
  return endOfMonth.value.clone().date(day).isSame(selectedDate.value, "d");
}

function incrementMonth() {
  setFieldValue("month", (values.month as number) + 1);
}
function decrementMonth() {
  setFieldValue("month", (values.month as number) - 1);
}

function selectDate(date: number) {
  setFieldValue("date", date);
}

const submitForm = handleSubmit(() => {
  emit("select:date", selectedDate.value.format("YYYY-MM-DD"));
});
</script>

<template>
  <form novalidate class="flex flex-col" @submit="submitForm">
    <div
      class="flex flex-col items-center gap-4 bg-white p-4 shadow-lg rounded-lg"
    >
      <div class="flex gap-2 items-center">
        <div
          class="i-heroicons-chevron-left w-4 h-4 cursor-pointer"
          @click="decrementMonth"
        />
        <div class="flex gap-2">
          <Select name="month">
            <option v-for="i in 12" :key="`month-${i - 1}`" :value="i - 1">
              {{
                $dayjs()
                  .month(i - 1)
                  .format("MMMM")
              }}
            </option>
          </Select>

          <Select name="year">
            <option
              v-for="i in [
                currentDate.year() - 2,
                currentDate.year() - 1,
                currentDate.year(),
                currentDate.year() + 1,
                currentDate.year() + 2,
              ]"
              :key="`year-${i}`"
              :value="i"
            >
              {{ $dayjs().year(i).format("YYYY") }}
            </option>
          </Select>
        </div>
        <button
          class="i-heroicons-chevron-right w-4 h-4 cursor-pointer"
          @click="incrementMonth"
        />
      </div>

      <div class="grid grid-cols-7 gap-2 w-full text-center">
        <div
          v-for="day in weekDays"
          :key="day"
          class="p-2 border-b border-brand-shade-light"
        >
          {{ day }}
        </div>
      </div>
      <div class="grid grid-cols-7 gap-2 w-full">
        <div
          v-for="i in startOfMonth.day()"
          :key="`month-start-${i}`"
          class="bg-gray-300 p-4"
        />
        <div
          v-for="i in endOfMonth.date()"
          :key="`month-day-${i}`"
          class="p-2 border border-gray-300 flex items-center justify-center cursor-pointer hover:(bg-brand-shade-dark text-white)"
          :class="{
            'bg-brand-shade-dark text-white': computeSameDay(i),
            'bg-white': !computeSameDay(i),
          }"
          @click="selectDate(i)"
        >
          {{ i }}
        </div>
        <div
          v-for="i in 6 - endOfMonth.day()"
          :key="`month-end-${i}`"
          class="bg-gray-300 p-4"
        />
      </div>
    </div>

    <div class="flex">
      <Button class="rounded-0 basis-1/2" color="success" type="submit">
        Submit
      </Button>
      <Button v-close-popper class="rounded-0 basis-1/2" color="error">
        Close
      </Button>
    </div>
  </form>
</template>
