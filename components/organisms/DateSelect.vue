<script lang="ts" setup>
const props = defineProps<{ name: string }>();
const { value, setValue, errors } = useField<string>(
  () => props.name,
  undefined
);
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <FormElement :error="errors[0]">
      <Input label="Date" :name="name" placeholder="YYYY-MM-DD" />
    </FormElement>
    <Calendar :highlighted-date="value" @select:date="setValue" />
  </div>
</template>
