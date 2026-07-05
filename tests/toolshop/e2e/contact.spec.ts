import { test, expect } from '../../../src/fixtures/test.fixtures';
import { buildContactMessage } from '../../../src/data/factories/message.factory';

test.describe('Contact form', () => {
  test('submits a valid message @regression', async ({ contact }) => {
    await contact.open();
    await contact.fillForm(buildContactMessage());
    await contact.submit.click();
    await expect(contact.successAlert).toBeVisible();
  });

  test('rejects a message that is too short @regression', async ({ contact }) => {
    await contact.open();
    await contact.fillForm(buildContactMessage({ message: 'too short' }));
    await contact.submit.click();
    await expect(contact.messageError).toBeVisible();
  });
});
