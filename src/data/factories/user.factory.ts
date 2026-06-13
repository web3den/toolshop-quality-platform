/**
 * User test-data factory.
 *
 * Factory = "give me a valid object with sensible randomized defaults".
 * Builder (see builders/) = "let me express intent-revealing variations".
 *
 * Defaults satisfy every server-side validation rule (field lengths, password
 * policy, age >= 18) so tests only override what they are actually about.
 */
import { faker } from '@faker-js/faker';
import type { components } from '../../api/generated/toolshop-schema';

export type UserRequest = components['schemas']['UserRequest'];

let sequence = 0;

/** Unique-enough address for parallel workers and repeated CI runs. */
function uniqueEmail(): string {
  sequence += 1;
  const slug = faker.string.alphanumeric(8).toLowerCase();
  return `tqp.${Date.now().toString(36)}.${process.pid}.${sequence}.${slug}@example.com`;
}

export function buildUser(overrides: Partial<UserRequest> = {}): UserRequest {
  const dob = faker.date.birthdate({ min: 21, max: 65, mode: 'age' });
  return {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    address: {
      street: faker.location.streetAddress().slice(0, 70),
      house_number: String(faker.number.int({ min: 1, max: 999 })),
      city: faker.location.city().slice(0, 40),
      state: faker.location.state().slice(0, 40),
      country: 'US',
      postal_code: faker.location.zipCode('#####'),
    },
    phone: faker.string.numeric(10),
    dob: dob.toISOString().slice(0, 10),
    // Satisfies policy: length, upper/lower, number, symbol.
    password: `Aa1!${faker.internet.password({ length: 12, pattern: /[a-zA-Z0-9]/ })}`,
    email: uniqueEmail(),
    ...overrides,
  };
}
