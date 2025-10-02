import { NextRequest } from "next/server";
import { join } from "path";
import { readFileSync } from "fs";

export async function GET(request: NextRequest, { params }: { params: { filename: string } }) {
  const { filename } = params;
  
  const assetPath = join(process.cwd(), "..", "backend", "assets", filename);

  try {
    const file = readFileSync(assetPath);
    let contentType = "image/jpeg";
    if (filename.endsWith(".png")) contentType = "image/png";
    if (filename.endsWith(".jpg") || filename.endsWith(".jpeg")) contentType = "image/jpeg";

    return new Response(file, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400"
      }
    });
  } catch (e) {
    return new Response("Not found", { status: 404 });
  }
} 