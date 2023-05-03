<script lang="ts">
export const ModalStateSymbol = Symbol("Modal state symbol") as InjectionKey<
  Readonly<Ref<boolean>>
>;
export const ModalActionSymbol = Symbol("Modal action symbol") as InjectionKey<{
  closeModal: () => void;
  openModal: () => void;
}>;
</script>

<script lang="ts" setup>
const isOpen = ref(false);
const openModal = () => {
  isOpen.value = true;
};
const closeModal = () => {
  isOpen.value = false;
};
provide(ModalStateSymbol, readonly(isOpen));
provide(ModalActionSymbol, { openModal, closeModal });
</script>

<template>
  <slot></slot>
</template>
