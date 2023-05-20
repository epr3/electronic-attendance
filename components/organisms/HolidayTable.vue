<script lang="ts" setup>
const { $dayjs } = useNuxtApp();
const props = defineProps<{
  name: string;
}>();

const { remove, push, fields } = useFieldArray(toRef(props, "name"));
</script>

<template>
  <div class="flex flex-col gap-4 items-start">
    <Button
      type="button"
      color="success"
      @click="
        push({
          name: 'Example Holiday',
          startDate: $dayjs().format('YYYY-MM-DD'),
          endDate: $dayjs().add(1, 'd').format('YYYY-MM-DD'),
        })
      "
    >
      Add
    </Button>
    <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <Card
        v-for="(field, idx) in fields"
        :key="field.key"
        class="flex flex-col gap-4 bg-white p-8"
      >
        <FormElement :name="`${name}[${idx}].name`">
          <Input label="Holiday name" :name="`${name}[${idx}].name`" />
        </FormElement>
        <div class="gap-4 grid grid-cols-1 lg:grid-cols-2">
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
        <Button color="error" type="button" @click="remove(idx)">Remove</Button>
      </Card>
    </div>
  </div>
</template>
