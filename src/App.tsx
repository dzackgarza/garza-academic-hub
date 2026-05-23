import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import CompiledPage from './pages/CompiledPage.tsx';
import BlogPost from './pages/BlogPost.tsx';
import NotFound from './pages/NotFound.tsx';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CompiledPage />} />
          <Route path="/teaching" element={<CompiledPage />} />
          <Route path="/activities" element={<CompiledPage />} />
          <Route path="/writing" element={<CompiledPage />} />
          <Route path="/gallery" element={<CompiledPage />} />
          <Route path="/blog" element={<CompiledPage />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
