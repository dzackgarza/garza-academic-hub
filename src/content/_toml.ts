/** Shared TOML parser entrypoint so every config file uses the same loader. */
import { parse } from "smol-toml";

export const parseToml = <T,>(source: string): T => parse(source) as unknown as T;
