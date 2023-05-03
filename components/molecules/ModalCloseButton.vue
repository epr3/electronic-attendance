<script lang="ts" setup>
import { ModalActionSymbol } from "~/components/organisms/ModalContext.vue";

const actions = inject(ModalActionSymbol);
</script>

<template>
  <div
    class="absolute right-4 top-4 cursor-pointer"
    @click="actions?.closeModal"
  >
    <div class="i-heroicons-x-mark" />
  </div>
</template>
