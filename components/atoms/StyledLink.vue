<script lang="ts" setup>
withDefaults(defineProps<{ to: string; target?: "_self" | "_blank" }>(), {
  target: "_self",
});
</script>

<template>
  <NuxtLink :to="to" :target="target" class="text-blue-6"> <slot /></NuxtLink>
</template>
