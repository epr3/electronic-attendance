<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    label: string;
    name: string;
    placeholder?: string;
  }>(),
  { placeholder: "HH:mm" }
);
const { value, setValue } = useField<string>(() => props.name, undefined);
</script>

<template>
  <div class="relative flex flex-col items-center gap-4">
    <FormElement :name="name">
      <Input :label="label" :name="name" :placeholder="placeholder">
        <template #right-icon>
          <VDropdown>
            <div class="i-heroicons-clock w-4 h-4 cursor-pointer" />
            <template #popper="{ hide }">
              <DigitalClock
                :value="value"
                @select:time="
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
