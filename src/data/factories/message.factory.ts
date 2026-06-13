/** Contact-message factory for the contact form / messages API. */
import { faker } from '@faker-js/faker';

export interface ContactMessage {
  first_name: string;
  last_name: string;
  email: string;
  subject: string;
  message: string;
}

const VALID_SUBJECTS = [
  'customer-service',
  'webmaster',
  'return',
  'payments',
  'warranty',
  'status-of-order',
] as const;

export function buildContactMessage(overrides: Partial<ContactMessage> = {}): ContactMessage {
  return {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email().toLowerCase(),
    subject: faker.helpers.arrayElement(VALID_SUBJECTS),
    // Server requires >= 50 chars; generate comfortably above.
    message: faker.lorem.sentences(4).padEnd(60, '.'),
    ...overrides,
  };
}
