<script lang="ts" setup>
const open = ref(false);

withDefaults(
  defineProps<{
    label: string;
    name: string;
    placeholder?: string;
  }>(),
  { placeholder: "YYYY-MM-DD" }
);
</script>

<template>
  <PopoverRoot v-model:open="open">
    <Field
      v-slot="{ componentField }"
      :name="name"
      class="relative flex flex-col items-center gap-4"
    >
      <FormItem>
        <FormLabel>{{ label }}</FormLabel>
        <FormControl>
          <Input v-bind="componentField" :placeholder="placeholder">
            <template #right-icon>
              <PopoverTrigger
                class="i-heroicons-calendar w-4 h-4 cursor-pointer"
              />
            </template>
          </Input>
        </FormControl>
        <FormMessage />
      </FormItem>

      <PopoverPortal>
        <PopoverContent>
          <Calendar
            v-bind="componentField"
            @update:model-value="open = false"
          />
        </PopoverContent>
      </PopoverPortal>
    </Field>
  </PopoverRoot>
</template>
