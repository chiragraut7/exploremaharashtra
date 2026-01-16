import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'public', 'data');
const CATEGORIES = ['beaches', 'cultural', 'forts', 'hills', 'nature', 'religious'];

async function geocode(name) {
  const query = encodeURIComponent(`${name}, Maharashtra, India`);
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`;
  
  try {
    const response = await fetch(url, { headers: { 'User-Agent': 'ExploreMaharashtraApp' } });
    const data = await response.json();
    if (data.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
  } catch (error) {
    console.error(`Error geocoding ${name}:`, error);
  }
  return null;
}

async function processFolders() {
  for (const cat of CATEGORIES) {
    const dir = path.join(DATA_DIR, cat);
    if (!fs.existsSync(dir)) continue;

    const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
    console.log(`Processing ${cat}...`);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));

      // Only geocode if coordinates are missing or zero
      if (!content.coordinates || content.coordinates.lat === 0) {
        console.log(`Finding coordinates for: ${content.name}`);
        const coords = await geocode(content.name);
        
        if (coords) {
          content.coordinates = coords;
          fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
          // Wait to respect OpenStreetMap usage policy
          await new Promise(r => setTimeout(r, 1000));
        }
      }
    }
  }
  console.log("Geocoding Complete!");
}

processFolders();