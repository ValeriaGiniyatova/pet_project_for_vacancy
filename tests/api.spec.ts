import { test, expect } from '@playwright/test';
import { URLS } from '../test-data/urls';
import {
  ENDPOINTS,
  STATUS,
  EXISTING_POST_ID,
  MISSING_POST_ID,
  NEW_POST,
} from '../test-data/api';

test.use({ baseURL: URLS.jsonPlaceholder });

test.describe('Posts API', () => {
  test('GET /posts/:id возвращает пост с ожидаемыми полями', async ({ request }) => {
    const response = await request.get(ENDPOINTS.post(EXISTING_POST_ID));
    const body = await response.json();

    expect(response.status()).toBe(STATUS.OK);
    expect(body).toMatchObject({
      id: EXISTING_POST_ID,
      userId: 1,
    });
  });

  test('POST /posts создаёт пост и возвращает id', async ({ request }) => {
    const response = await request.post(ENDPOINTS.posts, {
      data: NEW_POST,
    });
    const body = await response.json();

    expect(response.status()).toBe(STATUS.CREATED);
    expect(body).toMatchObject({
      ...NEW_POST,
      id: expect.any(Number),
    });
  });

  test('GET /posts/:id для несуществующего поста возвращает 404', async ({ request }) => {
    const response = await request.get(ENDPOINTS.post(MISSING_POST_ID));

    expect(response.status()).toBe(STATUS.NOT_FOUND);
  });
});
