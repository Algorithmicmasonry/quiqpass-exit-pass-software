import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useNavigation } from "react-router";
import type { Route } from "./+types/root";
import stylesheet from "./app.css?url";
import Loader from "./components/loader";

export const meta: Route.MetaFunction = () => [
  { title: "QuiqPass — Digital Exit Pass Management" },
  {
    name: "description",
    content:
      "QuiqPass is a digital exit pass management system for private universities. Students can apply for passes online and track approvals in real time.",
  },
  { name: "robots", content: "index, follow" },
  // Open Graph
  { property: "og:type", content: "website" },
  { property: "og:title", content: "QuiqPass — Digital Exit Pass Management" },
  {
    property: "og:description",
    content:
      "QuiqPass is a digital exit pass management system for private universities. Students can apply for passes online and track approvals in real time.",
  },
  { property: "og:image", content: "/icon-512.png" },
  // Twitter Card
  { name: "twitter:card", content: "summary" },
  { name: "twitter:title", content: "QuiqPass — Digital Exit Pass Management" },
  {
    name: "twitter:description",
    content:
      "QuiqPass is a digital exit pass management system for private universities.",
  },
  { name: "twitter:image", content: "/icon-512.png" },
];

export const links: Route.LinksFunction = () => [
  { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
  { rel: "icon", href: "/icon-192.png", type: "image/png", sizes: "192x192" },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Rethink+Sans:ital,wght@0,400..800;1,400..800&display=swap",
  },
  { rel: "stylesheet", href: stylesheet },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* PWA meta tags */}
        <meta name="application-name" content="QuiqPass" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="QuiqPass" />
        <meta
          name="description"
          content="Digital exit pass management for university students"
        />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#6366f1" />

        {/* PWA icons */}
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="manifest" href="/manifest.webmanifest" />

        <Meta />
        <Links />
      </head>
      <body>
        <Toaster position="bottom-right" reverseOrder={false} />
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const navigation = useNavigation();
  const isNavigating = Boolean(navigation.location);

  // Register service worker and reload when a new version takes over.
  // This prevents blank screens caused by stale cached JS chunks after deploy.
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .catch((err) => console.error("SW registration failed:", err));

    // When the SW controller changes (new SW activated via skipWaiting +
    // clientsClaim), reload the page so fresh assets are loaded from the
    // new precache instead of the stale old cache.
    let refreshing = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });
  }, []);

  return (
    <div>
      {isNavigating && <Loader />}
      <Outlet />
    </div>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
