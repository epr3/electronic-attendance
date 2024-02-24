<script lang="ts" setup>
definePageMeta({
  middleware: ["protected"],
});

const user = useUser();

await navigateTo(routes.school.get(user.value!.schools[0].schoolId), {
  replace: true,
});
</script>
