<script lang="ts" setup>
withDefaults(
  defineProps<{
    rowspan?: number;
    colspan?: number;
  }>(),
  {
    rowspan: 1,
    colspan: 1,
  }
);
</script>

<template>
  <td class="px-4 py-2 border-r border-gray-6" v-bind="{ colspan, rowspan }">
    <slot />
  </td>
</template>
