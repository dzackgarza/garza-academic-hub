import tomlSource from "@content/databases/links.toml?raw";
import { parseToml } from "./_toml";

export interface LinkEntry {
  label: string;
  href: string;
  note?: string;
}

export interface LinkGroup {
  id: string;
  title: string;
  description?: string;
  links: LinkEntry[];
}

const parsed = parseToml<{ groups: LinkGroup[] }>(tomlSource);

export const linkGroups: LinkGroup[] = parsed.groups ?? [];

export const getLinkGroup = (id: string): LinkGroup | undefined =>
  linkGroups.find((g) => g.id === id);
