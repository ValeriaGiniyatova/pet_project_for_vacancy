Pet-project с автотестами на **Playwright + TypeScript**

## Что тестируется

**UI: [TodoMVC](https://demo.playwright.dev/todomvc)**. Демо-приложение «список дел» от команды Playwright. Что в нем можно делать:
- ввести задачу и нажать Enter, и она появится в списке
- отметить задачу выполненной (она зачёркивается)
- смотреть счётчик невыполненных задач («2 items left»)
- переименовать задачу (двойной клик) или удалить (крестик при наведении)
- фильтровать список: All / Active / Completed
- удалить все выполненные кнопкой Clear completed

**API: [JSONPlaceholder](https://jsonplaceholder.typicode.com)**. Публичный тестовый REST-сервис: получение и создание постов.

> Демонстрационные сервисы, их можно безопасно использовать, проект не связан с коммерческим кодом

## Покрытые сценарии

| Область | Сценарий |
|---|---|
| UI | Добавление задачи |
| UI | Добавление нескольких задач: порядок и счётчик |
| UI | Пустая задача не добавляется |
| UI | Выполнение задачи и изменение счётчика |
| UI | Редактирование названия |
| UI | Удаление задачи |
| UI | `Clear completed` удаляет только выполненные |
| UI | Фильтр `Active` |
| UI | Фильтр `Completed` |
| UI | Сохранение задач после перезагрузки |
| UI | Сквозной пользовательский сценарий |
| API | `GET /posts/1` — статус 200 и данные ответа |
| API | `POST /posts` — статус 201 и `id` |
| API | `GET` несуществующего поста — статус 404 |

Всего 14 тестов: 10 отдельных UI, 1 сквозной UI-сценарий и 3 API.

## Структура проекта

```
playwright-todomvc-e2e/
├── .github/workflows/
│   └── playwright.yml        # CI: запуск тестов в GitHub Actions на каждый push
├── pages/
│   └── TodoPage.ts           # Page Object: локаторы, действия и проверки страницы
├── test-data/
│   ├── api.ts                # эндпоинты, статус-коды, тело запроса
│   ├── todos.ts              # названия задач, фильтры, формат счётчика
│   └── urls.ts               # адреса сервисов
├── tests/
│   ├── api.spec.ts           # API-тесты
│   ├── todo-journey.spec.ts  # сквозной UI-сценарий (один тест, шаги test.step)
│   └── todo.spec.ts          # UI-тесты (отдельные сценарии)
├── .gitignore                # что не отправлять в репозиторий
├── package.json              # зависимости и команды запуска
├── package-lock.json         # точные версии зависимостей (нужен для npm ci в CI)
├── playwright.config.ts      # настройки запуска: браузер, отчёт, trace
├── README.md                 # описание проекта и инструкция по запуску
└── tsconfig.json             # настройки TypeScript
```

Создаются автоматически и в репозиторий не попадают (указаны в `.gitignore`):

```
node_modules/        # установленные библиотеки (после npm install)
playwright-report/   # HTML-отчёт последнего запуска (npm run report)
test-results/        # trace и скриншоты упавших тестов
```

## Как устроены тесты

- **Page Object** (`pages/TodoPage.ts`) — локаторы и действия страницы собраны в одном классе. Тесты читаются как пользовательские сценарии: `add` → `toggle` → `filter` → `expectTitles`.
- **Test Data** (`test-data/`) — URL, тестовые данные, API endpoints и статус-коды вынесены отдельно, без дублирования в тестах.
- **Локаторы** — используются `getByRole`, `getByLabel`, placeholder и test id вместо хрупких CSS/XPath-селекторов.
- **Ожидания** — используются Playwright auto-waiting и web-first assertions; ручные `wait`/`sleep` не используются.
- **Изоляция** — тесты выполняются независимо друг от друга и не используют состояние предыдущего теста.
- **API** — проверки выполняются через встроенную Playwright fixture `request`, без запуска браузера.


## Требования

- [Node.js](https://nodejs.org) версии 18 или выше (рекомендуется LTS)
- Браузер: Microsoft Edge или Google Chrome

Проверка установки:
```bash
node -v
npm -v
```

## Установка

```bash
git clone [ссылочка]
cd playwright-todomvc-e2e
npm install
```

Если скачивание браузера Playwright доступно, дополнительно выполните:
```bash
npx playwright install chromium
```
Если нет (например, выдает ошибку 403), этот шаг можно пропустить: тесты запустятся в установленном Edge или Chrome.

## Запуск тестов

| Команда | Что делает |
|---|---|
| `npm test` | Запускает все тесты |
| `npm run test:todo` | Только UI-тесты |
| `npm run test:api` | Только API-тесты |
| `npm run test:headed` | Все тесты с видимым окном браузера |
| `npx playwright test --ui` | Интерактивный режим Playwright UI: можно запускать тесты по одному и смотреть шаги |
| `npm run test:debug` | Пошаговая отладка |
| `npm run report` | Открыть HTML-отчёт последнего запуска |

Запустить один тест по названию:
```bash
npx playwright test -g "Удаление задачи"
```

## Браузер

По умолчанию локально используется **Chrome**. Это можно поменять переменной окружения `BROWSER_CHANNEL`:

```bash
# Windows PowerShell
$env:BROWSER_CHANNEL="chrome"; npm test

# Windows cmd
set BROWSER_CHANNEL=chrome && npm test

# macOS / Linux
BROWSER_CHANNEL=chrome npm test
```

В CI используется Chromium, который скачивает сам Playwright.

## Отчёты и отладка

После запуска:
- `npm run report` открывает HTML-отчёт со списком тестов и временем выполнения
- для упавших тестов сохраняется **trace**: пошаговая запись действий, скриншоты и сеть. Открывается из HTML-отчёта или командой `npx playwright show-trace <путь к trace.zip>`

## CI

Тесты автоматически запускаются в **GitHub Actions** при `push` и `pull request` в `main`.

Workflow:
1. устанавливает Node.js и зависимости через `npm ci`;
2. устанавливает Chromium;
3. запускает тесты;
4. сохраняет HTML-отчёт как artifact.

Отчёт доступен в **Actions → нужный запуск → Artifacts**.

Для `npm ci` в репозитории хранится `package-lock.json`.


## Как добавить новый тест

1. Новое действие страницы → добавить метод в `pages/TodoPage.ts`.
2. Новые тестовые данные → добавить в `test-data/`.
3. Сценарий → описать в `tests/` через методы Page Object.
4. Запустить нужный тест:

```bash
npx playwright test -g "название теста"
```

## Возможные проблемы

| Проблема | Решение |
|---|---|
| `npm: command not found` | Установите Node.js и перезапустите терминал или IDE |
| `Executable doesn't exist ...` | Не скачан браузер Playwright. Используйте установленный Edge/Chrome (см. «Браузер») или выполните `npx playwright install chromium` |
| Ошибка 403 при `playwright install` | CDN недоступен в вашем регионе. Используйте установленный Edge/Chrome |
| `Cannot find package.json` | Команды выполняются не из корня проекта. Перейдите в папку с `package.json` |
| Ошибка про политику выполнения скриптов в PowerShell | Используйте cmd или выполните `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` |