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
    :class="cn('text-gray9 font-bold px-4 py-2 text-left', $attrs.class ?? '')"
    :colspan="colspan"
  >
    <slot />
  </th>
</template>
