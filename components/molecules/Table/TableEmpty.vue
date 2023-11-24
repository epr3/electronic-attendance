<script lang="ts" setup>
withDefaults(defineProps<{ colspan?: number }>(), {
  colspan: 1,
});
</script>

<template>
  <TableRow>
    <TableCell
      :class="
        cn(
          'p-4 whitespace-nowrap align-middle text-sm text-gray-500',
          $attrs.class ?? ''
        )
      "
      :colspan="colspan"
    >
      <div class="flex items-center justify-center py-10">
        <slot />
      </div>
    </TableCell>
  </TableRow>
</template>
