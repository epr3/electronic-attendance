<script lang="ts" setup>
const { $dayjs } = useNuxtApp();
const props = defineProps<{
  name: string;
}>();

const { remove, push, fields } = useFieldArray(toRef(props, "name"));
</script>

<template>
  <div v-for="(field, idx) in fields" :key="field.key">
    <FormElement :name="`${name}[${idx}].name`">
      <Input label="Holiday name" :name="`${name}[${idx}].name`" />
    </FormElement>
    <div class="flex gap-4">
      <DateSelect
        label="Start date"
        class="grow"
        :name="`${name}[${idx}].startDate`"
      />
      <DateSelect
        label="End date"
        class="grow"
        :name="`${name}[${idx}].endDate`"
      />
    </div>

    <button type="button" @click="remove(idx)">Remove</button>
  </div>
  <button
    type="button"
    @click="
      push({
        name: 'Example Holiday',
        startDate: $dayjs().format('YYYY-MM-DD'),
        endDate: $dayjs().add(1, 'd').format('YYYY-MM-DD'),
      })
    "
  >
    Add
  </button>
</template>
