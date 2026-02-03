import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const categories = ['beaches', 'cultural', 'forts', 'hills', 'nature', 'religious'];
  let allData: any[] = [];

  try {
    categories.forEach((cat) => {
      const dirPath = path.join(process.cwd(), 'public', 'data', cat);
      
      if (fs.existsSync(dirPath)) {
        const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.json'));
        
        files.forEach((file) => {
          try {
            const filePath = path.join(dirPath, file);
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const item = JSON.parse(fileContent);
            
            // We map your JSON fields to the Map's requirements
            allData.push({
              id: item.id,
              name: item.title, // Using 'title' from your JSON
              subtitle: item.subtitle,
              image: item.bannerImage,
              coordinates: item.coordinates, // Ensure this exists in JSON
              category: cat,
              color: item.color || '#333' // Using the 'color' defined in your JSON
            });
          } catch (err) {
            console.error(`Error in ${file}:`, err);
          }
        });
      }
    });

    return NextResponse.json(allData);
  } catch (error) {
    return NextResponse.json({ error: "Data fetch failed" }, { status: 500 });
  }
}