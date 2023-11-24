<script lang="ts" setup>
import { ErrorMessage } from "vee-validate";

const { name, formMessageId } = useFormField();
</script>

<template>
  <ErrorMessage
    :id="formMessageId"
    as="p"
    :name="toValue(name)"
    class="text-sm font-medium text-red-500"
  />
</template>
