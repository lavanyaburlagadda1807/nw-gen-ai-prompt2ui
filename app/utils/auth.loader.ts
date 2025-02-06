import { redirect } from '@remix-run/node';
import { getSession } from './session.server';

export async function requireAuth(request: Request) {
  const session = await getSession(request.headers.get('Cookie'));
  const accessToken = session.get('accessToken');

  if (!accessToken) {
    return redirect('/');
  }

  return { accessToken };
}
