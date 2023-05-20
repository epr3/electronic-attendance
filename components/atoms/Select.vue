<script lang="ts" setup>
const props = defineProps<{
  name: string;
  label?: string;
  placeholder?: string;
}>();

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
  <div class="relative shadow-sm rounded-md mt-1">
    <select
      :id="name"
      v-model="value"
      class="relative w-full min-w-[120px] border border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 appearance-none bg-transparent"
      :name="name"
    >
      <option v-if="placeholder" value="">{{ placeholder }}</option>
      <slot />
    </select>
    <div
      class="absolute h-full flex justify-center items-center top-1/2 -translate-y-1/2 w-6 right-2 pointer-events-none"
    >
      <div class="i-heroicons-chevron-down" />
    </div>
  </div>
</template>
