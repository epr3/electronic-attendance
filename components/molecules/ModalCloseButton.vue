<script lang="ts" setup>
import { ModalActionSymbol } from "~/components/organisms/ModalContext.vue";

const actions = inject(ModalActionSymbol);
</script>

<template>
  <div
    class="absolute right-3 top-3 cursor-pointer"
    @click="actions?.closeModal"
  >
    <div class="i-heroicons-x-mark w-6 h-6" />
  </div>
</template>
