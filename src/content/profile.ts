import tomlSource from "@content/databases/profile.toml?raw";
import { parseToml } from "./_toml";

export interface ProfileLink {
  icon: string;
  label: string;
  href?: string;
}

export interface Profile {
  name: string;
  pronouns: string;
  affiliation: string;
  office: string;
  email: string;
  avatar_text: string;
  links: ProfileLink[];
}

const parsed = parseToml<Profile>(tomlSource);

export const profile: Profile = parsed;
