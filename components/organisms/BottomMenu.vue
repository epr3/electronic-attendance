<script lang="ts" setup>
defineProps<{
  navItems: { path: string; name: string; icon: string }[];
}>();
</script>
<template>
  <div
    class="grid w-screen bg-brand-shade-dark fixed bottom-0 left-0 justify-center border-t border-brand-shade-dark"
    :class="{
      'grid-cols-3': navItems.length === 3,
      'grid-cols-4': navItems.length === 4,
      'grid-cols-5': navItems.length === 5,
    }"
  >
    <NuxtLink
      v-for="item in navItems"
      :key="item.path"
      :to="item.path"
      exact-active-class="bg-brand-shade-light !text-gray9"
      :class="
        cn(
          'p-4 flex flex-col text-white items-center justify-center border-l last:border-r border-brand-shade-light hover:(bg-brand-shade-light text-gray9)'
        )
      "
    >
      <div :class="cn('square-8', item.icon)" />
      <span>{{ item.name }}</span>
    </NuxtLink>
  </div>
</template>
