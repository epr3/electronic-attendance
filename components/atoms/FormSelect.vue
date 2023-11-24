<script lang="ts" setup>
const props = defineProps<{
  name: string;
  label?: string;
  placeholder?: string;
}>();

const { value } = useField(() => props.name, undefined);
</script>

<template>
  <OldSelect v-model="value" :name="name" :label="label"><slot /></OldSelect>
</template>
