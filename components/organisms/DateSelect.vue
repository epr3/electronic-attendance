<script lang="ts" setup>
import { vOnClickOutside } from "@vueuse/components";

const props = defineProps<{ label: string; name: string }>();
const { value, setValue, errors } = useField<string>(
  () => props.name,
  undefined
);
const isCalendarShown = ref(false);

function showCalendar() {
  isCalendarShown.value = true;
}

function hideCalendar() {
  isCalendarShown.value = false;
}

function setInputValueAndHideCalendar(value: string) {
  setValue(value);
  hideCalendar();
}
</script>

<template>
  <div
    v-on-click-outside="hideCalendar"
    class="relative flex flex-col items-center gap-4"
  >
    <FormElement :error="errors[0]">
      <Input :label="label" :name="name" placeholder="YYYY-MM-DD">
        <template #right-icon>
          <div
            class="i-heroicons-calendar w-4 h-4 cursor-pointer"
            @click="showCalendar"
          />
        </template>
      </Input>
    </FormElement>
    <div v-if="isCalendarShown" class="absolute top-[120%] z-10">
      <Calendar
        :highlighted-date="value"
        @select:date="setInputValueAndHideCalendar"
      />
    </div>
  </div>
</template>
