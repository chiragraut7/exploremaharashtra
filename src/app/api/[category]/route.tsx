import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ category?: string }> }
) {
  const { category } = await context.params;

  // 1️⃣ Validation: Ensure category exists
  if (!category) {
    return NextResponse.json(
      { success: false, error: "Category is required" },
      { status: 400 }
    );
  }

  try {
    // 2️⃣ Build path to your local data folder
    // This points to public/data/[category] on your disk
    const folderPath = path.join(
      process.cwd(),
      "public",
      "data",
      category
    );

    // 3️⃣ Read files from the directory
    let files: string[] = [];
    try {
      files = await fs.readdir(folderPath);
    } catch {
      // If folder doesn't exist, return empty data rather than crashing
      return NextResponse.json({
        success: true,
        count: 0,
        data: [],
      });
    }

    // 4️⃣ Read & parse JSON files found in that folder
    const items = await Promise.all(
      files
        .filter((file) => file.endsWith(".json"))
        .map(async (file) => {
          try {
            const filePath = path.join(folderPath, file);
            const content = await fs.readFile(filePath, "utf-8");
            const parsed = JSON.parse(content);
            
            // Normalize data: ensure it's always an array
            return Array.isArray(parsed) ? parsed : [parsed];
          } catch (err) {
            console.error(`❌ Error reading ${file}`, err);
            return [];
          }
        })
    );

    // 5️⃣ Flattened Response
    const allData = items.flat();

    return NextResponse.json({
      success: true,
      count: allData.length,
      data: allData,
    });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}