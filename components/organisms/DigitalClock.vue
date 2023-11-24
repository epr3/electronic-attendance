<script lang="ts" setup>
import { object, number } from "zod";

const props = withDefaults(defineProps<{ value?: string }>(), {
  value: "",
});
const emit = defineEmits<{ (e: "select:time", value: string): void }>();

const hour = computed(() =>
  props.value ? parseInt(props.value.split(":")[0]) : 0
);
const minute = computed(() =>
  props.value ? parseInt(props.value.split(":")[1]) : 0
);

const { setFieldValue, values, handleSubmit } = useForm({
  validationSchema: toTypedSchema(
    object({
      hour: number(),
      minute: number(),
    })
  ),
  initialValues: {
    hour: hour.value,
    minute: minute.value,
  },
});

const computeSameHour = (hour: number) => values.hour === hour;
const computeSameMinute = (minute: number) => values.minute === minute;

const setHour = (hour: number) => {
  setFieldValue("hour", hour);
};

const setMinute = (minute: number) => {
  setFieldValue("minute", minute);
};
const submitForm = handleSubmit((values) => {
  emit(
    "select:time",
    `${values.hour.toString().padStart(2, "0")}:${values.minute
      .toString()
      .padStart(2, "0")}`
  );
});
</script>

<template>
  <form novalidate class="flex flex-col" @submit="submitForm">
    <div
      class="flex flex-col items-center gap-4 bg-white p-4 shadow-lg rounded-lg"
    >
      <div class="flex h-[200px] overflow-hidden w-full text-center">
        <ul class="overflow-auto h-full basis-1/2">
          <li
            v-for="i in 24"
            :key="`hour-${i}`"
            class="text-2xl font-semibold cursor-pointer hover:(bg-gray-500 text-white)"
            :class="{
              'bg-gray-500 text-white': computeSameHour(i - 1),
              'text-gray-500': !computeSameHour(i - 1),
            }"
            @click="setHour(i - 1)"
          >
            {{ (i - 1).toString().padStart(2, "0") }}
          </li>
        </ul>
        <ul class="overflow-auto h-full basis-1/2">
          <li
            v-for="i in 60"
            :key="`minute-${i}`"
            class="text-2xl font-semibold cursor-pointer hover:(bg-gray-500 text-white)"
            :class="{
              'bg-gray-500 text-white': computeSameMinute(i - 1),
              'text-gray-500': !computeSameMinute(i - 1),
            }"
            @click="setMinute(i - 1)"
          >
            {{ (i - 1).toString().padStart(2, "0") }}
          </li>
        </ul>
      </div>
    </div>
    <div class="flex">
      <Button class="rounded-0 basis-1/2" variant="default" type="submit">
        Submit
      </Button>
      <Button v-close-popper class="rounded-0 basis-1/2" variant="destructive">
        Close
      </Button>
    </div>
  </form>
</template>
