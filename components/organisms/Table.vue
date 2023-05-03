<script lang="ts" setup>
withDefaults(defineProps<{ fullWidth?: boolean }>(), { fullWidth: false });
</script>

<template>
  <div class="block nowrap overflow-x-auto overflow-y-hidden max-w-full">
    <table :class="{ 'w-full': fullWidth }" class="table-auto border-collapse">
      <slot />
    </table>
  </div>
</template>
