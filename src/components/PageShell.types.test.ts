import { describe, it, expectTypeOf } from 'vitest';
import type { CollectionSlotData, SlotItem } from './PageShell';

describe('PageShell slot data types', () => {
  it('SlotItem allows the known fields', () => {
    // These are the fields used by collection, card-grid, and scroll-gallery renderers.
    expectTypeOf<{ type: string }>().toMatchTypeOf<SlotItem>();
    expectTypeOf<{ tags: string[] }>().toMatchTypeOf<SlotItem>();
  });

  it('CollectionSlotData groups items, types, and groups', () => {
    // CollectionSlotData wraps the parsed TOML data shapes passed to renderers.
    expectTypeOf<{ items: SlotItem[] }>().toMatchTypeOf<CollectionSlotData>();
    expectTypeOf<{
      types: { key: string; label: string; icon?: string }[];
    }>().toMatchTypeOf<CollectionSlotData>();
    expectTypeOf<{ groups: { id: string }[] }>().toMatchTypeOf<CollectionSlotData>();
  });

  it('CollectionSlotData allows an empty object (no data source)', () => {
    // BlogListing and other self-contained islands receive no source data.
    expectTypeOf<{}>().toMatchTypeOf<CollectionSlotData>();
  });
});
