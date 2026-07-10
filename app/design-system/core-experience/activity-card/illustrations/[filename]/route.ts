import { readFile } from "node:fs/promises";
import path from "node:path";

import { NextResponse } from "next/server";

const illustrationDirectory = path.join(
  process.cwd(),
  "assets",
  "illustrations",
  "activity",
  "_processed"
);

const mimeTypes: Record<string, string> = {
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp"
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  const decodedFilename = decodeURIComponent(filename);
  const safeFilename = path.basename(decodedFilename);

  if (safeFilename !== decodedFilename) {
    return new NextResponse("Invalid illustration path.", { status: 400 });
  }

  const extension = path.extname(safeFilename).toLowerCase();
  const contentType = mimeTypes[extension];

  if (!contentType) {
    return new NextResponse("Unsupported illustration type.", { status: 415 });
  }

  try {
    const file = await readFile(path.join(illustrationDirectory, safeFilename));

    return new NextResponse(new Uint8Array(file), {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Type": contentType
      }
    });
  } catch {
    return new NextResponse("Illustration not found.", { status: 404 });
  }
}
