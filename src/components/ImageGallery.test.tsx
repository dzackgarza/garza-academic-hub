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
    it('renders all images in a grid', () => {
      const gallery: Gallery = {
        id: 'test',
        title: 'Test Gallery',
        images: [
          { src: '/a.jpg', caption: 'Alpha' },
          { src: '/b.jpg', caption: 'Beta' },
        ],
      };

      render(<ImageGallery gallery={gallery} layout="grid" />);

      expect(screen.getByText('Alpha')).toBeInTheDocument();
      expect(screen.getByText('Beta')).toBeInTheDocument();
    });
  });
});
