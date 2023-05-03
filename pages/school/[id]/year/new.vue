<script lang="ts" setup>
const currentDate = ref("");
function selectDate(date: string) {
  currentDate.value = date;
}
</script>

<template>
  <div>
    <YearForm />
  </div>
</template>
