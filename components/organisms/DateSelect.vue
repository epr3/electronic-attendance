<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    label: string;
    name: string;
    placeholder?: string;
  }>(),
  { placeholder: "YYYY-MM-DD" }
);
const { value, setValue } = useField<string>(() => props.name, undefined);
</script>

<template>
  <div class="relative flex flex-col items-center gap-4">
    <FormElement :name="name">
      <Input :label="label" :name="name" :placeholder="placeholder">
        <template #right-icon>
          <VDropdown>
            <div class="i-heroicons-calendar w-4 h-4 cursor-pointer" />
            <template #popper="{ hide }">
              <Calendar
                :highlighted-date="value"
                @select:date="
                  (value) => {
                    setValue(value);
                    hide();
                  }
                "
              />
            </template>
          </VDropdown>
        </template>
      </Input>
    </FormElement>
  </div>
</template>
