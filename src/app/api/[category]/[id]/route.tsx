import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

interface IndexItem {
  id: string;
  slug: string;
}

export async function GET(req: Request, context: any) {
  // ✅ FIX: Await context.params
  const params = await context.params;
  const { category, id } = params;

  // Helper to check if a file exists
  async function fileExists(filePath: string) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  try {
    const basePath = path.join(process.cwd(), "public", "data", category);

    // Try direct file match (e.g., kelwa-beach.json)
    const slugFile = path.join(basePath, `${id}.json`);
    if (await fileExists(slugFile)) {
      const jsonData = await fs.readFile(slugFile, "utf-8");
      return NextResponse.json(JSON.parse(jsonData));
    }

    // Otherwise, check index.json mapping id -> slug
    const indexFile = path.join(basePath, "index.json");
    if (await fileExists(indexFile)) {
      const indexData: IndexItem[] = JSON.parse(await fs.readFile(indexFile, "utf-8"));
      const found = indexData.find(item => item.id === id);

      if (found) {
        const mappedFile = path.join(basePath, `${found.slug}.json`);
        if (await fileExists(mappedFile)) {
          const jsonData = await fs.readFile(mappedFile, "utf-8");
          return NextResponse.json(JSON.parse(jsonData));
        }
      }
    }

    return NextResponse.json(
      { error: `No data found for id "${id}" in category "${category}"` },
      { status: 404 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    console.error("Error in /api/[category]/[id]:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
