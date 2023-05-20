<script lang="ts" setup>
const props = defineProps<{ label: string; name: string }>();
const { value, setValue } = useField<string>(() => props.name, undefined);
</script>

<template>
  <div class="relative flex flex-col items-center gap-4">
    <FormElement :name="name">
      <Input :label="label" :name="name" placeholder="yyyy-MM-DD">
        <template #right-icon>
          <VDropdown>
            <div class="i-heroicons-calendar w-4 h-4 cursor-pointer" />
            <template #popper>
              <Calendar :highlighted-date="value" @select:date="setValue" />
            </template>
          </VDropdown>
        </template>
      </Input>
    </FormElement>
  </div>
</template>
