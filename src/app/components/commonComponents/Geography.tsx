"use client";
import React, { useEffect, useState } from "react";
import SectionTitle from "./SectionTitle";
import { useLanguage } from "../context/LanguageContext";
import Translator from "../commonComponents/Translator";

// DO NOT IMPORT LEAFLET HERE

interface GeographyProps {
  content?: any;
  color?: string;
}

const Geography: React.FC<GeographyProps> = ({ content, color = "#1a2a3a" }) => {
  const { language } = useLanguage();
  const [isMounted, setIsMounted] = useState(false);
  const [MapLib, setMapLib] = useState<any>(null);

  useEffect(() => {
    // This ONLY runs in the browser
    setIsMounted(true);

    if (typeof window !== "undefined") {
      const init = async () => {
        try {
          // Dynamic imports inside useEffect are invisible to the Vercel build server
          const L = (await import("leaflet")).default;
          // @ts-ignore
          await import("leaflet/dist/leaflet.css");
          const { MapContainer, TileLayer, Marker, Popup } = await import("react-leaflet");

          delete (L.Icon.Default.prototype as any)._getIconUrl;
          L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
          });

          setMapLib({ MapContainer, TileLayer, Marker, Popup });
        } catch (e) {
          console.error("Map load error", e);
        }
      };
      init();
    }
  }, []);

  if (!isMounted || !MapLib || !content) {
    return (
      <div className="section-card shadow-sm bg-light d-flex align-items-center justify-content-center" style={{ height: '450px' }}>
         <p className="text-muted small">Loading Geography...</p>
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup } = MapLib;
  const lat = content.coordinates?.lat || 16.06;
  const lng = content.coordinates?.lng || 73.46;

  return (
    <section id="geography" className="mb-5">
      <SectionTitle title="Geography" color={color} />
      <div className="row g-0 rounded-4 overflow-hidden shadow-sm bg-white border">
        <div className="col-lg-5 p-0 bg-light border-end">
          <div style={{ height: '420px' }}>
            <MapContainer center={[lat, lng]} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
              <Marker position={[lat, lng]}>
                <Popup>Location Coordinate: {lat}, {lng}</Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
        <div className="col-lg-7 p-4">
           {/* Text content here */}
           <a 
             href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`} 
             target="_blank" 
             className="btn btn-sm mt-3 text-white" 
             style={{backgroundColor: color}}
           >
             <i className="fas fa-location-arrow me-2"></i>
             <Translator text="Get Directions" targetLang={language} />
           </a>
        </div>
      </div>
    </section>
  );
};

export default Geography;
