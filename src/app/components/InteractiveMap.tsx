'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

// ❌ NO LEAFLET IMPORTS AT THE TOP LEVEL

const InteractiveMap = () => {
  const [locations, setLocations] = useState<any[]>([])
  const [filter, setFilter] = useState('all')
  const [MapComponents, setMapComponents] = useState<any>(null)

  useEffect(() => {
    // 1. Fetch Location Data
    fetch('/api/locations')
      .then(res => res.json())
      .then(data => setLocations(data))

    // 2. Load Leaflet Dynamically (Client-side only)
    const initMap = async () => {
      try {
        const L = (await import('leaflet')).default;
        await import('leaflet/dist/leaflet.css');
        const { MapContainer, TileLayer, Marker, Popup } = await import('react-leaflet');

        // Helper for Custom Icons
        const createIcon = (color: string) => new L.DivIcon({
          html: `<div style="background: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.3);"></div>`,
          className: 'custom-marker',
          iconSize: [16, 16]
        });

        setMapComponents({ MapContainer, TileLayer, Marker, Popup, createIcon });
      } catch (error) {
        console.error("Leaflet failed to load:", error);
      }
    };

    initMap();
  }, [])

  const filtered = filter === 'all' ? locations : locations.filter(l => l.category === filter)

  // 🛡️ Guard against SSR
  if (!MapComponents) {
    return (
      <div className="magazine-map-section pb-4">
        <div className="container text-center py-5">
           <div className="spinner-border text-dark" role="status"></div>
           <p className="mt-3 text-muted">Loading Interactive Map...</p>
        </div>
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup, createIcon } = MapComponents;

  return (
    <div className="magazine-map-section pb-4">
      <div className="container">
        {/* Category Filters */}
        <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
          {['all', 'beaches', 'hills', 'forts', 'nature', 'religious'].map(cat => (
            <button 
              key={cat}
              onClick={() => setFilter(cat)}
              className={`mag-pill ${filter === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="map-canvas-wrapper mb-5">
          <MapContainer center={[19.0, 74.5]} zoom={6.5} style={{ height: '450px', width: '100%', zIndex: 1 }}>
            <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
            
            {filtered.map((loc) => (
              loc.coordinates && (
                <Marker 
                  key={loc.id} 
                  position={[loc.coordinates.lat, loc.coordinates.lng]} 
                  icon={createIcon(loc.color)}
                >
                  <Popup className="mag-popup">
                    <div className="popup-card">
                      <img src={loc.image} alt={loc.name} className="popup-img" />
                      <div className="popup-body">
                        <span className="cat-tag" style={{ color: loc.color }}>{loc.category}</span>
                        <h5 className="fw-bold m-0">{loc.name}</h5>
                        <p className="small text-muted mb-2">{loc.subtitle}</p>
                        <Link href={`/${loc.category}/${loc.id}`} className="btn-view">
                          Read Feature →
                        </Link>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              )
            ))}
          </MapContainer>
        </div>
      </div>

      <style jsx global>{`
        .mag-pill { 
          padding: 10px 24px; border-radius: 100px; border: 1px solid #eee; 
          background: #fff; font-weight: 800; text-transform: uppercase; 
          font-size: 0.7rem; letter-spacing: 1px; transition: 0.3s;
        }
        .mag-pill.active { background: #111; color: #fff; border-color: #111; }

        .map-canvas-wrapper { 
          border: 5px solid #111; border-radius: 0rem; 
          overflow: hidden; box-shadow: unset;
        }

        .leaflet-popup-content-wrapper { padding: 0; overflow: hidden; border-radius: 20px; }
        .leaflet-popup-content { margin: 0; width: 240px !important; }
        .popup-img { width: 100%; height: 120px; object-fit: cover; }
        .popup-body { padding: 15px; }
        .cat-tag { font-size: 9px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; display: block; }
        .btn-view { 
          font-size: 11px; font-weight: 800; color: #111; 
          text-decoration: none; border-bottom: 2px solid #111; 
          display: inline-block; margin-top: 5px;
        }
      `}</style>
    </div>
  )
}

export default InteractiveMap