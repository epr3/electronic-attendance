<template>
  <div class="w-full overflow-auto rounded-md border border-gray-6">
    <table :class="cn('w-full table-auto border-collapse', $attrs.class ?? '')">
      <slot />
    </table>
  </div>
</template>
