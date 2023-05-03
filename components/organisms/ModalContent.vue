<script lang="ts" setup>
import { vOnClickOutside } from "@vueuse/components";
import { ModalActionSymbol } from "./ModalContext.vue";

const actions = inject(ModalActionSymbol);
</script>

<template>
  <section
    class="flex items-start justify-center fixed w-screen h-screen top-0 left-0 z-30"
  >
    <div
      v-on-click-outside="() => actions?.closeModal()"
      class="relative w-full outline-transparent outline-2 my-36 max-w-md shadow-lg rounded-lg bg-white"
    >
      <slot />
    </div>
  </section>
</template>
