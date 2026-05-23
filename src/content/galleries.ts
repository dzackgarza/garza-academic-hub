import tomlSource from '@content/databases/galleries.toml?raw';
import { parseToml } from './_toml';

export interface GalleryImage {
  src: string;
  caption: string;
}

export interface Gallery {
  id: string;
  title: string;
  description?: string;
  images: GalleryImage[];
}

const parsed = parseToml<{ galleries: Gallery[] }>(tomlSource);

export const galleries: Gallery[] = parsed.galleries ?? [];
