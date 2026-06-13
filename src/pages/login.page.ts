import type { Page } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  readonly email = this.byTestId('email');
  readonly password = this.byTestId('password');
  readonly submit = this.byTestId('login-submit');
  readonly error = this.byTestId('login-error');
  readonly registerLink = this.byTestId('register-link');

  constructor(page: Page) {
    super(page);
  }

  async open(): Promise<void> {
    await this.goto('/auth/login');
  }

  async loginAs(email: string, password: string): Promise<void> {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.submit.click();
  }
}
