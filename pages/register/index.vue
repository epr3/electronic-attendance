<script lang="ts" setup>
import { object, string } from "zod";

const generalError = ref("");

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(
    object({
      email: string().email(),
      password: string().min(8),
      firstName: string().min(1),
      lastName: string().min(1),
      telephone: string().min(1),
      schoolName: string().min(1),
      schoolAcronym: string().min(1),
    })
  ),
});

const onSubmit = handleSubmit(async (values) => {
  const {
    email,
    password,
    firstName,
    lastName,
    telephone,
    schoolAcronym,
    schoolName,
  } = values;

  const { error } = await useAsyncData<
    void,
    { data: { data: { message: string } } }
  >("register", () =>
    $fetch("/api/auth/register", {
      method: "POST",
      body: {
        email,
        password,
        firstName,
        lastName,
        telephone,
        schoolAcronym,
        schoolName,
      },
    })
  );

  if (error) {
    generalError.value = error.value?.data?.data?.message ?? "";
    return;
  }

  return await navigateTo(`/register/success?email=${email}`);
});
</script>

<template>
  <Card>
    <p v-if="generalError">{{ generalError }}</p>
    <div class="space-y-4 p-4 lg:p-8 xl:w-128">
      <h4 class="text-2xl font-bold">Enroll Now</h4>
      <form class="flex flex-col space-y-4 items-stretch" @submit="onSubmit">
        <div class="flex space-x-4">
          <FormElement name="firstName">
            <Input label="First Name" name="firstName" />
          </FormElement>

          <FormElement name="lastName">
            <Input label="Last Name" name="lastName" />
          </FormElement>
        </div>
        <FormElement name="email">
          <Input label="Email" type="email" name="email" />
        </FormElement>

        <FormElement name="telephone">
          <Input label="Telephone" type="telephone" name="telephone" />
        </FormElement>

        <FormElement name="password">
          <Input label="Password" type="password" name="password" />
        </FormElement>
        <FormElement name="schoolName">
          <Input label="School Name" name="schoolName" />
        </FormElement>

        <FormElement name="schoolAcronym">
          <Input label="School Acronym" name="schoolAcronym" />
        </FormElement>
        <Button :disabled="isSubmitting" type="submit">Submit</Button>
      </form>
      <p>
        Already have an account? Log in
        <StyledLink to="/login">here</StyledLink>!
      </p>
    </div>
  </Card>
</template>
