<script lang="ts" setup>
const { error, formItemId, formDescriptionId, formMessageId } = useFormField();
</script>

<template>
  <RdxSlot
    :id="formItemId"
    :aria-describedby="
      !error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`
    "
    :aria-invalid="!!error"
  >
    <slot />
  </RdxSlot>
</template>
