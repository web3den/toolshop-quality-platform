import type { Page } from '@playwright/test';
import { BasePage } from './base.page';
import type { ContactMessage } from '../data/factories/message.factory';

export class ContactPage extends BasePage {
  readonly firstName = this.byTestId('first-name');
  readonly lastName = this.byTestId('last-name');
  readonly email = this.byTestId('email');
  readonly subject = this.byTestId('subject');
  readonly message = this.byTestId('message');
  readonly submit = this.byTestId('contact-submit');
  readonly messageError = this.byTestId('message-error');
  /** Post-submit confirmation banner (app renders a bootstrap alert). */
  readonly successAlert: ReturnType<Page['locator']>;

  constructor(page: Page) {
    super(page);
    this.successAlert = page.locator('.alert-success');
  }

  async open(): Promise<void> {
    await this.goto('/contact');
  }

  async fillForm(data: ContactMessage): Promise<void> {
    await this.firstName.fill(data.first_name);
    await this.lastName.fill(data.last_name);
    await this.email.fill(data.email);
    await this.subject.selectOption(data.subject);
    await this.message.fill(data.message);
  }
}
