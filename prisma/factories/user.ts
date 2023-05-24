import { User, UserPassport, PASSPORT_TYPE } from "@prisma/client";
import { faker } from "@faker-js/faker";

export const userFactory = (override?: Partial<User>): Omit<User, "id"> => ({
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email(),
  verifiedAt: faker.date.past(),
  telephone: faker.phone.number("07########"),
  ...override,
});

export const userPassportFactory = (
  override?: Partial<UserPassport>
): Omit<UserPassport, "id" | "userId"> => {
  const password = faker.helpers.arrayElement([
    faker.internet.password({ length: 8 }),
    null,
  ]);
  const passportType = password ? PASSPORT_TYPE.PASSWORD : PASSPORT_TYPE.GOOGLE;
  return { password, passportType, ...override };
};
