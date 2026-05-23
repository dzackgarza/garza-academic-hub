import tomlSource from '@content/databases/navigation.toml?raw';
import { parseToml } from './_toml';

export interface NavItem {
  label: string;
  path: string;
}

const parsed = parseToml<{ items: NavItem[] }>(tomlSource);

export const navItems: NavItem[] = parsed.items ?? [];
