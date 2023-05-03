<script lang="ts" setup>
import { TRPCClientError } from "@trpc/client";
import { object, string } from "zod";

const { $client } = useNuxtApp();

const generalError = ref("");

const { handleSubmit, isSubmitting, errors } = useForm({
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
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      telephone,
      schoolAcronym,
      schoolName,
    } = values;
    await $client.auth.register.mutate({
      email,
      password,
      firstName,
      lastName,
      telephone,
      schoolName,
      schoolAcronym,
    });
    await navigateTo("/register/success");
  } catch (e) {
    if (e instanceof TRPCClientError) {
      if (e.data.code === "BAD_REQUEST") {
        const fieldErrors = Object.keys(e.data.zodError.fieldErrors).reduce(
          (acc, val) => {
            acc[val as keyof typeof errors.value] = (
              e as TRPCClientError<any>
            ).data.zodError.fieldErrors[val][0];
            return acc;
          },
          {} as Record<keyof typeof errors.value, string>
        );
        generalError.value = Object.keys(fieldErrors)
          .map((item) => fieldErrors[item as keyof typeof fieldErrors])
          .join(",");
      } else {
        generalError.value = e.message;
      }
    }
  }
});
</script>

<template>
  <Card>
    <p v-if="generalError">{{ generalError }}</p>
    <div class="space-y-4 p-4 lg:p-8 xl:w-128">
      <h4 class="text-2xl font-bold">Enroll Now</h4>
      <form class="flex flex-col space-y-4 items-stretch" @submit="onSubmit">
        <div class="flex space-x-4">
          <FormElement :error="errors.firstName">
            <Input label="First Name" name="firstName" />
          </FormElement>

          <FormElement :error="errors.lastName">
            <Input label="Last Name" name="lastName" />
          </FormElement>
        </div>
        <FormElement :error="errors.email">
          <Input label="Email" type="email" name="email" />
        </FormElement>

        <FormElement :error="errors.telephone">
          <Input label="Telephone" type="telephone" name="telephone" />
        </FormElement>

        <FormElement :error="errors.password">
          <Input label="Password" type="password" name="password" />
        </FormElement>
        <FormElement :error="errors.schoolName">
          <Input label="School Name" name="schoolName" />
        </FormElement>

        <FormElement :error="errors.schoolAcronym">
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
