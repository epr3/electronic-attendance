<script lang="ts" setup>
const { $dayjs } = useNuxtApp();

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const props = withDefaults(
  defineProps<{
    defaultValue?: string | number;
    modelValue?: string | number;
  }>(),
  { defaultValue: "", modelValue: "" }
);
const emits = defineEmits<{ (e: "update:modelValue", date: string): void }>();
const modelValue = useVModel(props, "modelValue", emits, {
  passive: true,
  defaultValue: props.defaultValue,
});

const highlightedDate = computed(() => modelValue.value);

const currentDate = ref(
  highlightedDate.value ? $dayjs(highlightedDate.value) : $dayjs()
);

const date = ref(currentDate.value.date().toString());
const month = ref(currentDate.value.month().toString());
const year = ref(currentDate.value.year().toString());

const selectedDate = computed(() => {
  return $dayjs(`${year.value}-${parseInt(month.value) + 1}-${date.value}`);
});

const startOfMonth = computed(() => selectedDate.value.startOf("month"));
const endOfMonth = computed(() => selectedDate.value.endOf("month"));

function computeSameDay(day: number) {
  return endOfMonth.value.clone().date(day).isSame(selectedDate.value, "d");
}

function incrementMonth() {
  month.value = (parseInt(month.value) + 1).toString();
}
function decrementMonth() {
  month.value = (parseInt(month.value) - 1).toString();
}

function selectDate(day: number) {
  date.value = day.toString();
}

const submitDate = () => {
  emits("update:modelValue", selectedDate.value.format("YYYY-MM-DD"));
};
</script>

<template>
  <div class="flex flex-col">
    <div class="flex flex-col items-center gap-4 bg-white p-4 shadow-lg">
      <div class="flex gap-2 items-center">
        <div
          class="i-heroicons-chevron-left w-4 h-4 cursor-pointer"
          @click="decrementMonth"
        />
        <div class="flex gap-2">
          <Select v-model="month">
            <SelectTrigger>
              <SelectValue :placeholder="currentDate.format('MMMM')" />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectItem
                  v-for="i in 12"
                  :key="`month-${i - 1}`"
                  :value="(i - 1).toString()"
                >
                  {{
                    $dayjs()
                      .month(i - 1)
                      .format("MMMM")
                  }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select v-model="year">
            <SelectTrigger>
              <SelectValue :placeholder="currentDate.year().toString()" />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectItem
                  v-for="i in [
                    currentDate.year() - 2,
                    currentDate.year() - 1,
                    currentDate.year(),
                    currentDate.year() + 1,
                    currentDate.year() + 2,
                  ]"
                  :key="`year-${i}`"
                  :value="i.toString()"
                >
                  {{ $dayjs().year(i).format("YYYY") }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
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
      <Button class="rounded-0 basis-1/2" variant="default" @click="submitDate">
        Submit
      </Button>
      <Button class="rounded-0 basis-1/2" variant="destructive"> Close </Button>
    </div>
  </div>
</template>
