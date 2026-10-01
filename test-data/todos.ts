export const TITLES = {
  milk: 'Купить молоко',
  coffee: 'Купить кофе',
  first: 'Первая',
  second: 'Вторая',
  third: 'Третья',
  persisted: 'Не потеряться',
} as const;

// Cтрелочная функция, принимает number, а возвращает string
export const itemsLeft = (count: number): string =>
  `${count} ${count === 1 ? 'item' : 'items'} left`;

export const FILTERS = {
  all: 'All',
  active: 'Active',
  completed: 'Completed',
} as const;

export type Filter = (typeof FILTERS)[keyof typeof FILTERS];