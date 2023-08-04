<script lang="ts" setup>
const props = defineProps<{
  id: string;
  name: string;
  label: string;
  value: string;
  hasBorder?: boolean;
}>();

const name = computed(() => props.name);
const value = computed(() => props.value);

const { checked, handleChange } = useField(name, undefined, {
  type: "checkbox",
  checkedValue: value,
});
</script>

<template>
  <div
    class="flex relative py-4 items-start"
    :class="{
      'border-t border-gray-300 border-collapse last:border-b': hasBorder,
    }"
  >
    <div class="flex-1">
      <label :for="id">{{ label }}</label>
    </div>
    <div class="grow-0 ml-3 flex items-center h-6">
      <input
        :id="id"
        class="w-4 h-4 rounded border border-gray-300"
        :checked="checked"
        :name="name"
        type="checkbox"
        :value="value"
        @input="handleChange(value)"
      />
    </div>
  </div>
</template>
