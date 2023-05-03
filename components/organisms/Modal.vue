<script lang="ts" setup>
import { ModalStateSymbol } from "./ModalContext.vue";

const state = inject(ModalStateSymbol);
</script>

<template>
  <Teleport to="body">
    <div v-if="!!state">
      <slot />
    </div>
  </Teleport>
</template>
