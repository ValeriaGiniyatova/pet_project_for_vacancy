export const ENDPOINTS = {
  posts: '/posts',
  post: (id: number) => `/posts/${id}`,
} as const;

export const STATUS = {
  OK: 200,
  CREATED: 201,
  NOT_FOUND: 404,
} as const;

export const EXISTING_POST_ID = 1;
export const MISSING_POST_ID = 999999;

export const NEW_POST = { title: 'qa', body: 'autotest', userId: 1 } as const;
