import { test } from '@playwright/test';
import { TodoPage } from '../pages/TodoPage';
import { TITLES, itemsLeft, FILTERS } from '../test-data/todos';

test.describe('TodoMVC', () => {
  let todo: TodoPage;

  test.beforeEach(async ({ page }) => {
    todo = new TodoPage(page);
    await todo.open();
  });

  test('Добавление одной задачи', async () => {
    await todo.add(TITLES.milk);
    await todo.expectTitles([TITLES.milk]);
    await todo.expectInputCleared();
    await todo.expectCounter(itemsLeft(1));
  });

  test('Добавление нескольких задач (сохранение порядка и счетчика)', async () => {
    await todo.add(TITLES.first, TITLES.second, TITLES.third);
    await todo.expectTitles([TITLES.first, TITLES.second, TITLES.third]);
    await todo.expectCounter(itemsLeft(3));
  });

  test('Пустая задача не добавляется', async () => {
    await todo.add('');
    await todo.expectNoItems();
  });

  test('Выполнение задачи уменьшает счетчик', async () => {
    await todo.add(TITLES.first, TITLES.second);
    await todo.toggle(0);
    await todo.expectCompleted(0);
    await todo.expectCounter(itemsLeft(1));
  });

  test('Редактирование названия', async () => {
    await todo.add(TITLES.milk);
    await todo.rename(0, TITLES.coffee);
    await todo.expectTitles([TITLES.coffee]);
  });

  test('Удаление задачи', async () => {
    await todo.add(TITLES.first, TITLES.second);
    await todo.remove(0);
    await todo.expectTitles([TITLES.second]);
  });

  test('Clear completed удаляет только выполненные', async () => {
    await todo.add(TITLES.first, TITLES.second);
    await todo.toggle(0);
    await todo.clearCompleted();
    await todo.expectTitles([TITLES.second]);
  });

  test('Фильтр Active показывает только невыполненные', async () => {
    await todo.add(TITLES.first, TITLES.second);
    await todo.toggle(0);
    await todo.filter(FILTERS.active);
    await todo.expectTitles([TITLES.second]);
  });

  test('Фильтр Completed показывает только выполненные', async () => {
    await todo.add(TITLES.first, TITLES.second);
    await todo.toggle(0);
    await todo.filter(FILTERS.completed);
    await todo.expectTitles([TITLES.first]);
  });

  test('Задачи сохраняются после перезагрузки', async () => {
    await todo.add(TITLES.persisted);
    await todo.reload();
    await todo.expectTitles([TITLES.persisted]);
  });
});
