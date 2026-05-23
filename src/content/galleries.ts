import tomlSource from '@content/databases/galleries.toml?raw';
import { parseToml } from './_toml';

export interface GalleryImageItem {
  type?: 'image';
  src: string;
  caption: string;
}

export interface GalleryYouTubeItem {
  type: 'youtube';
  url: string;
  caption: string;
}

export type GalleryItem = GalleryImageItem | GalleryYouTubeItem;

/** @deprecated Use `GalleryImageItem` instead. */
export type GalleryImage = GalleryImageItem;

export interface Gallery {
  id: string;
  title: string;
  description?: string;
  images: GalleryItem[];
}

const parsed = parseToml<{ items: Gallery[] }>(tomlSource);

export const galleries: Gallery[] = parsed.items ?? [];
