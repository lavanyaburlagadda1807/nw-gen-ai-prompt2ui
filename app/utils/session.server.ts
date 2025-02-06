import { createCookieSessionStorage } from '@remix-run/node';

const ACCESS_TOKEN_COOKIE_NAME = 'wm7t2iXzhU0g';

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: ACCESS_TOKEN_COOKIE_NAME,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  },
});

export async function commitSessionWithExpiry(session: any, expiresIn: number) {
  return await sessionStorage.commitSession(session, {
    maxAge: expiresIn,
  });
}

export const { getSession, destroySession } = sessionStorage;
