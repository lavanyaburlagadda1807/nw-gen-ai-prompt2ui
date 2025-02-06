import { json, type LoaderFunction } from '@remix-run/cloudflare';
import { default as IndexRoute } from './_index';
import { requireAuth } from '~/utils/auth.loader';

export const loader: LoaderFunction = async ({ request, params }) => {
  const auth = await requireAuth(request);
  return json({ ...auth, id: params.id });
};

export default IndexRoute;
