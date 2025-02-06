import type { LoaderFunction, LoaderFunctionArgs } from '@remix-run/cloudflare';
import { json, redirect, type MetaFunction } from '@remix-run/cloudflare';
import { ClientOnly } from 'remix-utils/client-only';
import { BaseChat } from '~/components/chat/BaseChat';
import { GitUrlImport } from '~/components/git/GitUrlImport.client';
import { Header } from '~/components/header/Header';
import BackgroundRays from '~/components/ui/BackgroundRays';
import { getSession } from '~/utils/session.server';

export const meta: MetaFunction = () => {
  return [{ title: 'Prompt2UI' }, { name: 'description', content: 'Talk with Prompt2UI, an AI assistant By NxtWave' }];
};

export const loader: LoaderFunction = async ({ request, params }: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get('Cookie'));
  const accessToken = session.get('accessToken');

  if (!accessToken) {
    return redirect(`/`);
  }

  return json({ accessToken, url: params.url });
};

export default function Index() {
  return (
    <div className="flex flex-col h-full w-full bg-bolt-elements-background-depth-1">
      <BackgroundRays />
      <Header />
      <ClientOnly fallback={<BaseChat />}>{() => <GitUrlImport />}</ClientOnly>
    </div>
  );
}
