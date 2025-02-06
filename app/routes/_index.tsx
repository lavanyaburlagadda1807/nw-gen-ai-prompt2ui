import { json, type LoaderFunction } from '@remix-run/node';
import { type MetaFunction } from '@remix-run/cloudflare';
import { ClientOnly } from 'remix-utils/client-only';
import { BaseChat } from '~/components/chat/BaseChat';
import { Chat } from '~/components/chat/Chat.client';
import { Header } from '~/components/header/Header';
import BackgroundRays from '~/components/ui/BackgroundRays';
import { requireAuth } from '~/utils/auth.loader';

export const meta: MetaFunction = () => {
  return [{ title: 'Prompt2UI' }, { name: 'description', content: 'Talk with Prompt2UI, an AI assistant' }];
};

export const loader: LoaderFunction = async ({ request }) => {
  const auth = await requireAuth(request);
  return json(auth);
};

export default function Index() {
  return (
    <div className="flex flex-col h-full w-full bg-bolt-elements-background-depth-1">
      <BackgroundRays />
      <Header />
      <ClientOnly fallback={<BaseChat />}>{() => <Chat />}</ClientOnly>
    </div>
  );
}
