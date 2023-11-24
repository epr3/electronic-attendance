<template>
  <tfoot
    :class="
      cn('bg-brand-shade-light font-medium text-gray9', $attrs.class ?? '')
    "
  >
    <slot />
  </tfoot>
</template>
