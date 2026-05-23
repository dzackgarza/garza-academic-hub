import { useState, useEffect } from 'react';
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

const CompiledPage = () => {
  const { pathname } = useLocation();
  const config = ROUTE_CONFIG[pathname] ?? ROUTE_CONFIG['/'];
  const [html, setHtml] = useState('');

  useEffect(() => {
    import(`../content/compiled/pages/${config.html}.html?raw`).then((mod) => {
      setHtml(mod.default);
    });
  }, [config.html]);

  return (
    <AcademicLayout showSidebar={config.sidebar}>
      <PageShell html={html} />
    </AcademicLayout>
  );
};

export default CompiledPage;
