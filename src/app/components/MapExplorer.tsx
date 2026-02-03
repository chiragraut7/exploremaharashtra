"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Link from 'next/link';

export default function MapExplorer({ locations, category }: any) {
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const position: [number, number] = [19.7515, 75.7139]; // Maharashtra Center

  // ✅ Premium Radar Marker
  const createDestIcon = (color: string = "#ffc107") => {
    return new L.DivIcon({
      html: `
        <div class="radar-marker">
           <div class="radar-ring" style="border-color: ${color}"></div>
           <div class="radar-dot" style="background-color: ${color}"></div>
        </div>
      `,
      className: 'luxury-map-icon',
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      popupAnchor: [0, -20]
    });
  };

  function LocationButton() {
    const map = useMap();
    const handleLocate = () => {
      map.locate().on("locationfound", (e) => {
        setUserPos([e.latlng.lat, e.latlng.lng]);
        map.flyTo(e.latlng, 12, { animate: true });
      });
    };

    return (
      <div className="leaflet-bottom leaflet-right mb-5 me-3">
        <div className="leaflet-control">
          <button onClick={handleLocate} className="premium-gps-btn">
            <i className="fas fa-location-arrow"></i>
          </button>
        </div>
      </div>
    );
  }

  const openGoogleMaps = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  };

  return (
    <div className="w-100 h-100 map-luxury-container">
      <MapContainer center={position} zoom={7} zoomControl={false} style={{ height: "100%", width: "100%", background: '#0a0a0a' }}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; CARTO'
        />
        
        <LocationButton />

        {locations.map((loc: any) => (
          loc.coordinates && (
            <Marker 
              key={loc.id} 
              position={[loc.coordinates.lat, loc.coordinates.lng]} 
              icon={createDestIcon(loc.color || "#ffc107")}
            >
              <Popup className="luxury-glass-popup" minWidth={260} closeButton={false}>
                <div className="premium-popup-card">
                  <div className="popup-header-img">
                    <img src={loc.bannerImage || '/assets/images/placeholder.jpg'} alt={loc.title} />
                    <div className="popup-category-tag">{category}</div>
                  </div>
                  
                  <div className="popup-main-body">
                    <h6 className="popup-place-title">{loc.title}</h6>
                    <p className="popup-place-desc">{loc.subtitle}</p>
                    
                    <div className="d-flex gap-2 mt-3">
                        <Link href={`/${category}/${loc.slug || loc.id}`} className="flex-grow-1 popup-btn-guide">
                           GUIDE <i className="fas fa-book-open ms-1"></i>
                        </Link>
                        <button onClick={() => openGoogleMaps(loc.coordinates.lat, loc.coordinates.lng)} className="popup-btn-nav">
                           <i className="fas fa-directions"></i>
                        </button>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        ))}

        {userPos && (
          <Marker position={userPos} icon={new L.DivIcon({
            className: 'user-marker-glow',
            html: `<div class="user-beacon"></div>`
          })}>
            <Popup>You are currently here</Popup>
          </Marker>
        )}
      </MapContainer>

      <style jsx global>{`
        /* 📍 RADAR MARKER STYLES */
        .radar-marker { position: relative; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; }
        .radar-dot { width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 15px currentColor; z-index: 2; }
        .radar-ring { position: absolute; inset: 0; border: 2px solid; border-radius: 50%; animation: radarPing 2s ease-out infinite; opacity: 0; }
        
        @keyframes radarPing {
            0% { transform: scale(0.2); opacity: 0.8; }
            100% { transform: scale(1.5); opacity: 0; }
        }

        /* 🖼️ GLASS POPUP CARD */
        .luxury-glass-popup .leaflet-popup-content-wrapper { 
            background: rgba(20, 20, 20, 0.8) !important; 
            backdrop-filter: blur(20px) saturate(180%);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 24px; padding: 0; overflow: hidden; 
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
        }
        .luxury-glass-popup .leaflet-popup-content { margin: 0 !important; width: 260px !important; }
        .luxury-glass-popup .leaflet-popup-tip { background: rgba(20, 20, 20, 0.8); }

        .premium-popup-card { color: white; }
        .popup-header-img { height: 130px; position: relative; overflow: hidden; }
        .popup-header-img img { width: 100%; height: 100%; object-fit: cover; }
        .popup-category-tag { position: absolute; top: 12px; left: 12px; background: #ffc107; color: #000; padding: 3px 10px; border-radius: 100px; font-size: 0.6rem; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; }

        .popup-main-body { padding: 20px; }
        .popup-place-title { font-weight: 800; font-size: 1.1rem; color: #fff; margin-bottom: 4px; }
        .popup-place-desc { font-size: 0.75rem; color: rgba(255,255,255,0.6); line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

        /* 🔘 POPUP BUTTONS */
        .popup-btn-guide { background: white; color: black; border-radius: 12px; padding: 10px; font-size: 0.75rem; font-weight: 800; text-align: center; text-decoration: none; transition: 0.3s; }
        .popup-btn-guide:hover { background: #ffc107; transform: translateY(-2px); }
        
        .popup-btn-nav { background: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255,255,255,0.2); border-radius: 12px; width: 45px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; transition: 0.3s; }
        .popup-btn-nav:hover { background: #4285F4; border-color: #4285F4; transform: translateY(-2px); }

        /* 🧭 GPS BUTTON */
        .premium-gps-btn { width: 50px; height: 50px; background: var(--p-gradient); border: none; border-radius: 16px; color: white; font-size: 1.3rem; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 25px rgba(255, 87, 34, 0.4); transition: 0.4s; }
        .premium-gps-btn:hover { transform: scale(1.1) rotate(-10deg); }

        /* 🔵 USER BEACON */
        .user-beacon { width: 16px; height: 16px; background: #007bff; border: 3px solid #fff; border-radius: 50%; box-shadow: 0 0 20px #007bff; }
      `}</style>
    </div>
  );
}