<script lang="ts" setup>
const route = useRoute();
</script>

<template>
  <div class="flex flex-col gap-4">
    <Button
      color="success"
      class="self-start"
      :to="`/school/${route.params.id}/year/new`"
    >
      Add year
    </Button>
    <!-- <Table full-width>
	<thead>
		<TableRow>
			{#each data.columnHeaders as column}
				<TableHeadCell>{column.name}</TableHeadCell>
			{/each}
			<TableHeadCell>Actions</TableHeadCell>
		</TableRow>
	</thead>
	<TableBody>
		{#if users.length}
			{#each users as row}
				<TableRow>
					{#each data.columnHeaders as cell}
						<TableCell>
							{cell.value === "role"
								? row[cell.value].slice(0, 1).toUpperCase() + row[cell.value].slice(1).toLowerCase()
								: row[cell.value]}
						</TableCell>
					{/each}
					<TableCell>
						<span
							on:keypress={() => null}
							on:click={() => {
								editId = row.id;
							}}
						>
							Edit
						</span>
						|
						<span
							on:keypress={() => null}
							on:click={() => {
								deleteId = row.id;
							}}
						>
							Delete
						</span>
					</TableCell>
				</TableRow>
			{/each}
		{:else}
			<TableRow>
				<TableCell colspan={data.columnHeaders.length + 1}>No data to display.</TableCell>
			</TableRow>
		{/if}
	</TableBody>
</Table> -->
  </div>
</template>
