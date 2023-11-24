<template>
  <tr :class="cn('border-b border-gray-6', $attrs.class ?? '')">
    <slot />
  </tr>
</template>
