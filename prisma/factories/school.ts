import { ROLE, School, SchoolUser } from "@prisma/client";
import { faker } from "@faker-js/faker";

export const schoolFactory = (
  override?: Partial<School>
): Omit<School, "id"> => ({
  name: faker.company.name(),
  acronym: faker.word.sample(4),
  logo: null,
  ...override,
});

export const schoolUserFactory = (
  override?: Partial<SchoolUser>
): Partial<SchoolUser> => ({
  role: faker.helpers.arrayElement(Object.keys(ROLE)) as ROLE,
  ...override,
});
