<script lang="ts" setup>
withDefaults(
  defineProps<{
    colspan?: number;
  }>(),
  {
    colspan: 1,
  }
);
</script>

<template>
  <th
    class="text-white font-bold bg-gray-6 px-4 py-2 border-x border-gray-3"
    :colspan="colspan"
  >
    <slot />
  </th>
</template>
