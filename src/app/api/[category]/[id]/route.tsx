import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

interface IndexItem {
  id: string;
  slug: string;
}

export async function GET(req: Request, context: any) {
  // 1️⃣ Await dynamic route parameters
  const params = await context.params;
  const { category, id } = params;

  // 🛡️ Security Check (Optional Backup)
  // Even though middleware protects this, adding a server-side check 
  // ensures the category name doesn't contain path traversal hacks like "../"
  if (category.includes('..') || id.includes('..')) {
    return NextResponse.json({ error: "Invalid path segments" }, { status: 400 });
  }

  // Helper to check if a file exists on your local drive
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

    // 2️⃣ Try direct file match (e.g., /api/forts/raigad -> raigad.json)
    const slugFile = path.join(basePath, `${id}.json`);
    if (await fileExists(slugFile)) {
      const jsonData = await fs.readFile(slugFile, "utf-8");
      return NextResponse.json(JSON.parse(jsonData));
    }

    // 3️⃣ Otherwise, check index.json for an ID -> Slug mapping
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
      { error: `No heritage data found for "${id}" in "${category}"` },
      { status: 404 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    console.error("❌ API Error in [category]/[id]:", message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}