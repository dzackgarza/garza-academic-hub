import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useComponentMount } from '@/components/ComponentMount';
import '@/styles/academic-content.css';

import manifest from '../../.generated/site-manifest.json?raw';

interface SiteRoute {
  path: string;
  source: string;
  output: string;
  type: 'page' | 'post';
  title: string;
  template: string;
  sitemap: boolean;
  islands: unknown[];
}

interface SiteManifest {
  routes: SiteRoute[];
}

const htmlModules = import.meta.glob('../../.generated/**/*.html', {
  eager: true,
  query: 'raw',
  import: 'default',
}) as Record<string, string>;

function parseManifest(rawManifest: string): SiteManifest {
  const parsed = JSON.parse(rawManifest) as SiteManifest;
  if (!Array.isArray(parsed.routes)) {
    throw new Error('site manifest must define routes');
  }
  return parsed;
}

const siteManifest = parseManifest(manifest);

export const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center py-20 space-y-4">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    <p className="text-sm text-muted-foreground">Loading content...</p>
  </div>
);

export const ErrorMessage = ({ message }: { message: string }) => (
  <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center max-w-xl mx-auto my-12">
    <p className="text-sm text-destructive font-medium">{message}</p>
  </div>
);

export const NotFound = () => (
  <main className="min-h-screen flex items-center justify-center p-8">
    <div className="text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-3 text-muted-foreground">Page not found</p>
    </div>
  </main>
);

const CompiledPage = () => {
  const { pathname } = useLocation();
  const route = siteManifest.routes.find((entry) => entry.path === pathname);
  const moduleKey = route ? `../../${route.output}` : null;
  const html = moduleKey ? htmlModules[moduleKey] : null;
  const containerRef = useComponentMount();

  useEffect(() => {
    if (!route || !html) return;
    document.title = route.title;
  }, [html, route]);

  if (!route) return <NotFound />;
  if (!html) {
    return (
      <ErrorMessage
        message={`Compiled output missing for manifest route ${route.path}`}
      />
    );
  }
  return <div ref={containerRef} dangerouslySetInnerHTML={{ __html: html }} />;
};

export default CompiledPage;
