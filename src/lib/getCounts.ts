import fs from 'fs';
import path from 'path';

export interface CategoryData {
  count: number;
  lastUpdated: string;
}

export function getCategoryData(): Record<string, CategoryData> {
  const dataRoot = path.join(process.cwd(), 'public', 'data');
  const mapping = [
    { id: "beaches", folder: "beaches" },
    { id: "hill-stations", folder: "hills" },
    { id: "forts", folder: "forts" },
    { id: "wildlife", folder: "nature" },
    { id: "religious", folder: "religious" },
    { id: "culture", folder: "culture" },
  ];

  const results: Record<string, CategoryData> = {};

  mapping.forEach(({ id, folder }) => {
    const dirPath = path.join(dataRoot, folder);
    try {
      if (fs.existsSync(dirPath)) {
        const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.json'));
        
        let latestDate = 0;
        files.forEach(file => {
          const stats = fs.statSync(path.join(dirPath, file));
          if (stats.mtimeMs > latestDate) latestDate = stats.mtimeMs;
        });

        results[id] = {
          count: files.length,
          lastUpdated: latestDate > 0 
            ? new Date(latestDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) 
            : 'Recently'
        };
      } else {
        results[id] = { count: 0, lastUpdated: 'N/A' };
      }
    } catch (e) {
      results[id] = { count: 0, lastUpdated: 'N/A' };
    }
  });

  return results;
}