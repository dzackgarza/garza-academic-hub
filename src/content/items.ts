import { parse } from "smol-toml";
import tomlSource from "./items.toml?raw";
import type { AcademicCardProps } from "@/components/AcademicCard";

export type ItemType = string;

export interface TypeDef {
  key: string;
  label: string;
  icon?: AcademicCardProps["icon"];
}

export interface ContentItem extends AcademicCardProps {
  type: ItemType;
}

interface ParsedToml {
  types?: TypeDef[];
  items: ContentItem[];
}

const parsed = parse(tomlSource) as unknown as ParsedToml;

export const types: TypeDef[] = parsed.types ?? [];

const typeMap = new Map(types.map((t) => [t.key, t]));

export const allItems: ContentItem[] = (parsed.items ?? []).map((item) => ({
  ...item,
  icon: item.icon ?? (typeMap.get(item.type)?.icon as AcademicCardProps["icon"]) ?? "paper",
}));

export const itemsByType = (type: ItemType) =>
  allItems.filter((item) => item.type === type);

export const getTypeLabel = (key: string) => typeMap.get(key)?.label ?? key;

/** All unique tags found across items, sorted alphabetically. */
export const allTags: string[] = Array.from(
  new Set(allItems.flatMap((i) => i.tags ?? [])),
).sort((a, b) => a.localeCompare(b));

/** Tag → count of items carrying it. */
export const tagCounts: Record<string, number> = allItems.reduce(
  (acc, item) => {
    for (const tag of item.tags ?? []) acc[tag] = (acc[tag] ?? 0) + 1;
    return acc;
  },
  {} as Record<string, number>,
);
