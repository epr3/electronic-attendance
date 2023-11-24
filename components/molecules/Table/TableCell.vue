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
  <td
    :class="cn('px-4 py-2', $attrs.class ?? '')"
    v-bind="{ colspan, rowspan }"
  >
    <slot />
  </td>
</template>
