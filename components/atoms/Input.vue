<script lang="ts" setup>
const slots = useSlots();
const props = withDefaults(
  defineProps<{
    name: string;
    label?: string;
    type?: "text" | "password" | "telephone" | "email";
    placeholder?: string;
    disabled?: boolean;
  }>(),
  {
    label: "",
    type: "text",
    placeholder: "",
    disabled: false,
  }
);

const { value } = useField(() => props.name, undefined);
</script>

<template>
  <label
    v-if="label"
    class="block text-sm font-medium text-gray-700"
    :for="name"
  >
    {{ label }}
  </label>

  <div class="relative flex gap-4 mt-1 rounded-md shadow-sm">
    <div
      v-if="!!slots['left-icon']"
      class="absolute pl-3 left-0 inset-y-0 flex items-center"
    >
      <slot name="left-icon" />
    </div>
    <input
      v-model="value"
      :type="type"
      :name="name"
      :disabled="disabled"
      :placeholder="placeholder"
      class="block w-full py-2 px-3 bg-white rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
      :class="{ 'pl-8': !!slots['left-icon'], 'pr-8': !!slots['right-icon'] }"
    />
    <div
      v-if="!!slots['right-icon']"
      class="absolute pr-3 right-0 inset-y-0 flex items-center"
    >
      <slot name="right-icon" />
    </div>
  </div>
</template>
