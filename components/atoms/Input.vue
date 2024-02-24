<script lang="ts" setup>
const slots = useSlots();
const props = withDefaults(
  defineProps<{
    defaultValue?: string | number;
    modelValue?: string | number;
    type?: "text" | "password" | "tel" | "email";
    placeholder?: string;
    disabled?: boolean;
  }>(),
  {
    defaultValue: "",
    modelValue: "",
    type: "text",
    placeholder: "",
    disabled: false,
  }
);

const emits = defineEmits<{
  (e: "update:modelValue", payload: string | number): void;
}>();

const modelValue = useVModel(props, "modelValue", emits, {
  passive: true,
  defaultValue: props.defaultValue,
});
</script>

<template>
  <div class="relative flex gap-4 mt-1 rounded-md shadow-sm">
    <div
      v-if="!!slots['left-icon']"
      class="absolute pl-3 left-0 inset-y-0 flex items-center"
    >
      <slot name="left-icon" />
    </div>
    <input
      v-model="modelValue"
      :type="type"
      :disabled="disabled"
      :placeholder="placeholder"
      :class="
        cn(
          'block w-full py-2 px-3 bg-white rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm',
          { 'pl-8': !!slots['left-icon'] },
          { 'pr-8': !!slots['right-icon'] },
          $attrs.class ?? ''
        )
      "
    />
    <div
      v-if="!!slots['right-icon']"
      class="absolute pr-3 right-0 inset-y-0 flex items-center"
    >
      <slot name="right-icon" />
    </div>
  </div>
</template>
