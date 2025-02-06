import 'virtual:uno.css';
import { useEffect } from 'react';
import { createHead } from 'remix-island';
import { useStore } from '@nanostores/react';
import xtermStyles from '@xterm/xterm/css/xterm.css?url';
import type { LinksFunction } from '@remix-run/cloudflare';
import tailwindReset from '@unocss/reset/tailwind-compat.css?url';
import { redirect, json, type LoaderFunction } from '@remix-run/node';
import reactToastifyStyles from 'react-toastify/dist/ReactToastify.css?url';
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useRouteError } from '@remix-run/react';
import { getSession, commitSessionWithExpiry } from './utils/session.server';
import { fetchAuthenticationDetails } from './utils/auth.server';
import { stripIndents } from './utils/stripIndent';
import globalStyles from './styles/index.scss?url';
import { themeStore } from './lib/stores/theme';
import { logStore } from './lib/stores/logs';

export const LOGIN_MODE = 'mode';
export const WINDOW_MODE = 'WINDOW_MODE';
export const WindowMode = {
  IN_APP: 'IN_APP',
  POP_UP: 'POP_UP',
};

export interface Tokens {
  access_token: string;
  refresh_token: string;
  expires_in: string;
  user_id: string;
}

export const getTheFormmattedURLWithoutHash = (windowLocation: any, queryParameters: any = undefined) => {
  queryParameters = queryParameters ?? new URLSearchParams(windowLocation.search);

  if (queryParameters.toString().length > 0) {
    return `${windowLocation.origin}${windowLocation.pathname}?${queryParameters.toString()}`;
  } else {
    return `${windowLocation.origin}${windowLocation.pathname}`;
  }
};

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));

  let accessToken = session.get('accessToken');

  if (!accessToken) {
    const url = new URL(request.url);
    const authCode = url.searchParams.get('auth_code');

    const redirectUrl = getTheFormmattedURLWithoutHash(url);

    if (!authCode) {
      return redirect(
        `${process.env.AUTH_SDK_BASE_URL}/login?client_id=${process.env.AUTH_SDK_CLIENT_ID}&call_back_url=${redirectUrl}&${LOGIN_MODE}=${'otp'}&${WINDOW_MODE}=${WindowMode.IN_APP}${url.hash}`,
      );
    }

    try {
      const authData: Tokens = await fetchAuthenticationDetails(authCode);

      accessToken = authData.access_token;
      session.set('accessToken', accessToken);

      return redirect(url.pathname, {
        headers: {
          'Set-Cookie': await commitSessionWithExpiry(session, parseInt(authData.expires_in)),
        },
      });
    } catch (error) {
      throw error;
    }
  }

  return json({ accessToken });
};

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: tailwindReset },
  {
    rel: 'icon',
    href: '/nxtwave-touch-icon-ipad-retina.png',
    type: 'image/svg+xml',
  },
  { rel: 'stylesheet', href: reactToastifyStyles },
  { rel: 'stylesheet', href: globalStyles },
  { rel: 'stylesheet', href: xtermStyles },
  {
    rel: 'preconnect',
    href: 'https://fonts.googleapis.com',
  },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
  },
];

const inlineThemeCode = stripIndents`
  setTutorialKitTheme();

  function setTutorialKitTheme() {

    document.querySelector('html')?.setAttribute('data-theme', 'light');
  }
`;

export const Head = createHead(() => (
  <>
    <meta charSet="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <Meta />
    <Links />
    <script dangerouslySetInnerHTML={{ __html: inlineThemeCode }} />
  </>
));

export function ErrorBoundary() {
  const error = useRouteError();
  const theme = useStore(themeStore);

  useEffect(() => {
    const url = new URL(window.location.href);

    if (url.searchParams.has('auth_code')) {
      url.searchParams.delete('auth_code');
      window.history.replaceState({}, '', url.pathname + url.search);
    }
  }, []);

  useEffect(() => {
    document.querySelector('html')?.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-unset">
        <div className="flex items-center justify-center bg-bolt-elements-background-depth-1">
          <div className="text-center p-8 rounded-lg">
            <h1 className="text-2xl font-bold mb-4">Oops! Something went wrong</h1>
            <p className="text-gray-600">{error instanceof Error ? error.message : 'An unexpected error occurred'}</p>
          </div>
        </div>
        <Scripts />
      </body>
    </html>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const theme = useStore(themeStore);

  useEffect(() => {
    document.querySelector('html')?.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <>
      {children}
      <ScrollRestoration />
      <Scripts />
    </>
  );
}

export default function App() {
  const theme = useStore(themeStore);

  useEffect(() => {
    const url = new URL(window.location.href);

    if (url.searchParams.has('auth_code')) {
      url.searchParams.delete('auth_code');
      window.history.replaceState({}, '', url.pathname + url.search);
    }

    logStore.logSystem('Application initialized', {
      theme,
      platform: navigator.platform,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    });
  }, []);

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
