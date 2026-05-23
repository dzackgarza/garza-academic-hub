import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import AcademicLayout from '@/components/AcademicLayout';
import PageShell from '@/components/PageShell';

const ROUTE_CONFIG: Record<string, { html: string; sidebar: boolean }> = {
  '/': { html: 'home', sidebar: true },
  '/teaching': { html: 'teaching', sidebar: false },
  '/activities': { html: 'activities', sidebar: false },
  '/writing': { html: 'writing', sidebar: false },
  '/gallery': { html: 'gallery', sidebar: false },
  '/blog': { html: 'blog', sidebar: false },
};

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

const CompiledPage = () => {
  const { pathname } = useLocation();
  const config = ROUTE_CONFIG[pathname] ?? ROUTE_CONFIG['/'];
  const [html, setHtml] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    mountedRef.current = true;

    import(`../content/compiled/pages/${config.html}.html?raw`)
      .then((mod) => {
        if (!mountedRef.current) return;
        setHtml(mod.default);
        setIsLoading(false);
      })
      .catch((err: Error) => {
        if (!mountedRef.current) return;
        console.error(
          `[CompiledPage] Failed to load content for "${config.html}":`,
          err,
        );
        setError(
          `Failed to load page content. Check that the site has been compiled with \`bun run prebuild\`.`,
        );
        setIsLoading(false);
      });

    return () => {
      mountedRef.current = false;
    };
  }, [config.html]);

  return (
    <AcademicLayout showSidebar={config.sidebar}>
      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <PageShell html={html} />
      )}
    </AcademicLayout>
  );
};

export default CompiledPage;
