<script setup lang="ts">
const props = defineProps<{
  apiUrl: string;
  editUrl: string;
}>();

const deleteEntity = () =>
  $fetch(props.apiUrl, {
    method: "DELETE",
  });
</script>

<template>
  <ClientOnly>
    <RdxDialogRoot>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="default" size="icon">
            <span class="sr-only">Open menu</span>
            <div class="w-4 h-4 i-heroicons-ellipsis-horizontal" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuSeparator />
          <DropdownMenuItem as-child>
            <NuxtLink :to="editUrl">Edit</NuxtLink>
          </DropdownMenuItem>
          <RdxDialogTrigger as-child>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </RdxDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <RdxDialogPortal>
        <RdxDialogOverlay class="bg-black/40 fixed inset-0 z-30" />
        <RdxDialogContent
          class="fixed top-1/2 left-1/2 max-h-[85vh] w-[90vw] max-w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 focus:outline-none z-[100] flex flex-col gap-4"
        >
          <RdxDialogTitle class="text-2xl font-semibold text-gray9">
            Delete
          </RdxDialogTitle>
          <RdxDialogDescription>
            Are you sure you want to delete this entity?
          </RdxDialogDescription>
          <div class="flex gap-4 justify-end">
            <RdxDialogClose as-child>
              <Button variant="destructive" @click="deleteEntity"> Yes</Button>
            </RdxDialogClose>
            <RdxDialogClose as-child>
              <Button variant="default"> No</Button>
            </RdxDialogClose>
          </div>
        </RdxDialogContent>
      </RdxDialogPortal>
    </RdxDialogRoot></ClientOnly
  >
</template>
