import { parse } from "smol-toml";
import tomlSource from "./items.toml?raw";
import type { AcademicCardProps } from "@/components/AcademicCard";

export type ItemType = "paper" | "talk" | "notes";

export interface ContentItem extends AcademicCardProps {
  type: ItemType;
}

interface ParsedToml {
  items: ContentItem[];
}

const parsed = parse(tomlSource) as unknown as ParsedToml;

export const allItems: ContentItem[] = (parsed.items ?? []).map((item) => ({
  ...item,
  icon: item.icon ?? item.type,
}));

export const itemsByType = (type: ItemType) =>
  allItems.filter((item) => item.type === type);
