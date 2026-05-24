import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ImageGallery from '@/components/ImageGallery';
import type { Gallery } from '@/content/galleries';

describe('ImageGallery', () => {
  describe('scroller layout', () => {
    it('renders with configurable columns and rows props', () => {
      const gallery: Gallery = {
        id: 'test',
        title: 'Test Gallery',
        images: Array.from({ length: 5 }, (_, i) => ({
          src: `/img-${i}.jpg`,
          caption: `Image ${i + 1}`,
        })),
      };

      render(<ImageGallery gallery={gallery} layout="scroller" columns={2} rows={1} />);

      // With columns=2 rows=1, each page has 2 items.
      // 5 items → 3 pages of snap-start wrappers.
      // Before the fix (hardcoded 4 columns), pageSize=4 → 2 pages.
      const scrollContainer = document.querySelector('.overflow-x-auto');
      const pageWrappers =
        scrollContainer?.querySelectorAll(':scope > .snap-start') ?? [];
      expect(pageWrappers.length).toBe(3);

      // All images should render
      expect(screen.getByText('Image 1')).toBeInTheDocument();
      expect(screen.getByText('Image 5')).toBeInTheDocument();
    });
  });

  describe('grid layout', () => {
    it('renders a YouTube card when an item has type=youtube', () => {
      const gallery: Gallery = {
        id: 'test',
        title: 'Test Gallery',
        images: [
          {
            type: 'youtube',
            url: 'https://www.youtube.com/watch?v=PuH5VKlhH_Y',
            caption: 'Research Talk',
          },
        ],
      };

      render(<ImageGallery gallery={gallery} layout="grid" />);

      // Grid container renders with correct CSS class
      expect(document.querySelector('div.grid')).not.toBeNull();

      // Caption renders
      expect(screen.getByText('Research Talk')).toBeInTheDocument();

      // Link points to YouTube
      const link = screen.getByTitle('Research Talk');
      expect(link).toHaveAttribute(
        'href',
        'https://www.youtube.com/watch?v=PuH5VKlhH_Y',
      );

      // Thumbnail img points to YouTube thumbnail
      const img = link.querySelector('img');
      expect(img).not.toBeNull();
      expect(img!.getAttribute('src')).toContain('img.youtube.com/vi/PuH5VKlhH_Y');
    });
  });
});
