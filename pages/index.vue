<script lang="ts" setup>
definePageMeta({
  middleware: ["protected"],
});

const session = useUserSession();

await navigateTo(routes.school.get(session.value!.user.schools[0].schoolId), {
  replace: true,
});
</script>