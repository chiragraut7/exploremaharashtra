import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import fs from "fs";
import path from "path";

export const runtime = "nodejs"; // ✅ required for fs

export async function POST(req: Request) {
  const body = await req.json();

  /* -----------------------------
     ✅ MANUAL CONVERSION
     UI messages (parts[]) → Model messages (content)
  ------------------------------ */
  const messages = (body.messages || []).map((m: any) => {
    const text =
      m.parts?.find((p: any) => p.type === "text")?.text || "";

    return {
      role: m.role,          // "user" | "assistant"
      content: text,         // ✅ required by model
    };
  });

  /* -----------------------------
     Load Maharashtra JSON Data
  ------------------------------ */
  const baseDir = path.join(process.cwd(), "public", "data");
  const categories = [
    "beaches",
    "cultural",
    "forts",
    "hills",
    "nature",
    "religious",
  ];

  let context =
    "You are the Explore Maharashtra official tourism guide.\n" +
    "Answer ONLY from the data provided below.\n" +
    "If information is not found, say: 'Information not available in our records.'\n\n";

  for (const cat of categories) {
    const fullPath = path.join(baseDir, cat);

    if (fs.existsSync(fullPath)) {
      const files = fs.readdirSync(fullPath);

      for (const file of files) {
        if (file.endsWith(".json")) {
          const data = fs.readFileSync(path.join(fullPath, file), "utf-8");
          context += `\n[${cat.toUpperCase()} - ${file}]\n${data}\n`;
        }
      }
    }
  }

  /* -----------------------------
     AI Streaming Response
  ------------------------------ */
  const result = await streamText({
    model: google("gemini-1.5-flash"),
    system: `${context}
Tone: Friendly Maharashtra tourism guide.
Style: Heritage-focused, short helpful answers.
`,
    messages, // ✅ now valid ModelMessage[]
  });

  return result.toTextStreamResponse();
}
