import { test } from '@playwright/test';
import { TodoPage } from '../pages/TodoPage';
import { TITLES, itemsLeft, FILTERS } from '../test-data/todos';


//Один тест проходит по всем возможностям списка задач.
//Мягкие проверки  при ошибке тест не останавливается, а все провалы показываются в отчете с названием шага

test('Работа со списком задач', async ({ page }) => {
  const todo = new TodoPage(page, true);

  await test.step('Открыть приложение: список пуст', async () => {
    await todo.open();
    await todo.expectNoItems();
  });

  await test.step('Пустая задача не добавляется', async () => {
    await todo.add('');
    await todo.expectNoItems();
  });

  await test.step('Добавить три задачи: порядок, счётчик, очистка поля', async () => {
    await todo.add(TITLES.first, TITLES.second, TITLES.third);
    await todo.expectTitles([TITLES.first, TITLES.second, TITLES.third]);
    await todo.expectCounter(itemsLeft(3));
    await todo.expectInputCleared();
  });

  await test.step('Выполнить первую задачу: отметка и счётчик', async () => {
    await todo.toggle(0);
    await todo.expectCompleted(0);
    await todo.expectCounter(itemsLeft(2));
  });

  await test.step('Переименовать вторую задачу', async () => {
    await todo.rename(1, TITLES.coffee);
    await todo.expectTitles([TITLES.first, TITLES.coffee, TITLES.third]);
  });

  await test.step('Фильтры Active, Completed, All', async () => {
    await todo.filter(FILTERS.active);
    await todo.expectTitles([TITLES.coffee, TITLES.third]);
    await todo.filter(FILTERS.completed);
    await todo.expectTitles([TITLES.first]);
    await todo.filter(FILTERS.all);
    await todo.expectTitles([TITLES.first, TITLES.coffee, TITLES.third]);
  });

  await test.step('Удалить третью задачу', async () => {
    await todo.remove(2);
    await todo.expectTitles([TITLES.first, TITLES.coffee]);
    await todo.expectCounter(itemsLeft(1));
  });

  await test.step('Clear completed удаляет только выполненные', async () => {
    await todo.clearCompleted();
    await todo.expectTitles([TITLES.coffee]);
  });

  await test.step('Перезагрузка страницы, задача сохранилась', async () => {
    await todo.reload();
    await todo.expectTitles([TITLES.coffee]);
    await todo.expectCounter(itemsLeft(1));
  });
});
