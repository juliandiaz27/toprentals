import path from "path";

export function getRepoRoot(): string {
  return process.cwd();
}

export function dataFilePath(filename: string): string {
  return path.join(getRepoRoot(), filename);
}
