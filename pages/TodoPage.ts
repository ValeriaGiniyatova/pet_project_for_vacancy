import { Page, Locator, expect } from '@playwright/test';
import { URLS } from '../test-data/urls';
import { Filter } from '../test-data/todos';

const PLACEHOLDER = 'What needs to be done?';
const TEST_ID = {
  item: 'todo-item',
  title: 'todo-title',
  counter: 'todo-count',
} as const;
const COMPLETED_CLASS = /completed/;

export class TodoPage {
  private readonly newTodo: Locator;
  private readonly items: Locator;
  private readonly check: typeof expect;

  constructor(private readonly page: Page, soft = false) {
    this.check = soft ? expect.configure({ soft: true }) : expect;
    this.newTodo = page.getByPlaceholder(PLACEHOLDER);
    this.items = page.getByTestId(TEST_ID.item);
  }

  async open() {
    await this.page.goto(URLS.todoMvc);
  }

  async reload() {
    await this.page.reload();
  }

  async add(...titles: string[]) {
    for (const title of titles) {
      await this.newTodo.fill(title);
      await this.newTodo.press('Enter');
    }
  }

  async toggle(index: number) {
    await this.item(index).getByRole('checkbox').check();
  }

  async rename(index: number, newTitle: string) {
    await this.item(index).getByTestId(TEST_ID.title).dblclick();
    const input = this.item(index).getByRole('textbox', { name: 'Edit' });
    await input.fill(newTitle);
    await input.press('Enter');
  }

  async remove(index: number) {
    await this.item(index).hover(); // кнопка удаления видна только при наведении
    await this.item(index).getByLabel('Delete').click();
  }

  async clearCompleted() {
    await this.page.getByRole('button', { name: 'Clear completed' }).click();
  }

  async filter(name: Filter) {
    await this.page.getByRole('link', { name }).click();
  }

  async expectTitles(titles: string[]) {
    await this.check(this.page.getByTestId(TEST_ID.title)).toHaveText(titles);
  }

  async expectCounter(text: string) {
    await this.check(this.page.getByTestId(TEST_ID.counter)).toHaveText(text);
  }

  async expectNoItems() {
    await this.check(this.items).toHaveCount(0);
  }

  async expectInputCleared() {
    await this.check(this.newTodo).toBeEmpty();
  }

  async expectCompleted(index: number) {
    await this.check(this.item(index)).toHaveClass(COMPLETED_CLASS);
  }

  private item(index: number): Locator {
    return this.items.nth(index);
  }
}
