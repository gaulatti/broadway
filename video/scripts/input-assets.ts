import { realpath, stat } from "node:fs/promises";
import path from "node:path";
import type { ModoItalianoGiorgiaVideoInput } from "../src/types";

export async function assertInputAssets(
  input: ModoItalianoGiorgiaVideoInput,
  publicDirectory: string,
): Promise<void> {
  if (!input.audioAsset) return;

  try {
    const [publicRoot, assetPath] = await Promise.all([
      realpath(publicDirectory),
      realpath(path.resolve(publicDirectory, input.audioAsset)),
    ]);
    if (
      assetPath !== publicRoot &&
      !assetPath.startsWith(`${publicRoot}${path.sep}`)
    ) {
      throw new Error("asset resolves outside the public directory");
    }
    if (!(await stat(assetPath)).isFile())
      throw new Error("asset is not a regular file");
  } catch {
    throw new TypeError(
      `audioAsset "${input.audioAsset}" must resolve to a regular file inside video/public.`,
    );
  }
}
