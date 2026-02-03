"use client";

import React, { useEffect, useState } from "react";
import SectionTitle from "./SectionTitle";
import { useLanguage } from "../context/LanguageContext";
import Translator from "../commonComponents/Translator";
import { motion } from "framer-motion";

// Import Leaflet CSS
import "leaflet/dist/leaflet.css";

// -------------------- Interfaces --------------------
interface DetailItem { icon?: string; label?: string; value?: string; }
interface Season { icon?: string; text?: string; }

interface GeographyContent {
  intro?: string | string[];
  details?: DetailItem[];
  climate?: {
    description?: string | string[];
    seasons?: Season[];
  };
  conclusion?: string | string[];
}

interface GeographyProps {
  content?: GeographyContent;
  coordinates?: { lat: number; lng: number };
  color?: string;
}

const Geography: React.FC<GeographyProps> = ({
  content,
  coordinates,
  color = "#E57717",
}) => {
  const { language } = useLanguage();
  const [MapComponents, setMapComponents] = useState<any>(null);

  const lat = coordinates?.lat;
  const lng = coordinates?.lng;
  const hasCoordinates = typeof lat === "number" && typeof lng === "number";

  useEffect(() => {
    if (!hasCoordinates) return;

    const loadLeaflet = async () => {
      try {
        const L = (await import("leaflet")).default;
        const RL = await import("react-leaflet");
        const { MapContainer, TileLayer, Marker, Popup, useMap } = RL;

        // Custom Marker Icon
        const customIcon = L.divIcon({
          className: "custom-geo-marker",
          html: `
            <div style="
              background-color: ${color};
              width: 32px; height: 32px;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              display: flex; align-items: center; justify-content: center;
              border: 2px solid white;
              box-shadow: 0 3px 8px rgba(0,0,0,0.3);
            ">
              <div style="transform: rotate(45deg); color: white; font-size: 12px;">
                <i class="fas fa-map-marker-alt"></i>
              </div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32],
        });

        const RecenterMap = ({ lat, lng }: { lat: number; lng: number }) => {
          const map = useMap();
          useEffect(() => {
            if (map) {
              map.setView([lat, lng], map.getZoom());
              setTimeout(() => map.invalidateSize(), 500);
            }
          }, [lat, lng, map]);
          return null;
        };

        setMapComponents({ MapContainer, TileLayer, Marker, Popup, RecenterMap, customIcon });
      } catch (err) {
        console.error("Leaflet failed to load:", err);
      }
    };

    loadLeaflet();
  }, [hasCoordinates, lat, lng, color]);

  const handleDirections = () => {
    if (typeof window !== "undefined" && lat && lng) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, "_blank");
    }
  };

  if (!content) return null;

  const renderParagraphs = (text?: string | string[], isLead = false) => {
    if (!text) return null;
    const paragraphs = Array.isArray(text) ? text : [text];
    return paragraphs.map((p, i) => (
      <p key={i} className={`mb-2 ${isLead ? "lead-text" : "text-secondary"}`} style={{ lineHeight: "1.6", fontSize: isLead ? "0.95rem" : "0.85rem" }}>
        <Translator text={p.trim()} targetLang={language} />
      </p>
    ));
  };

  return (
    <section id="geography" className="mb-5 position-relative">
      
      {/* --- HEADER --- */}
      <div 
        className="d-flex align-items-center mb-3 pb-2" 
        style={{ borderBottom: `1px solid ${color}20` }}
      >
        <div 
          className="d-flex align-items-center justify-content-center me-3 rounded-circle"
          style={{ 
            width: '40px', height: '40px', 
            backgroundColor: `${color}15`, color: color 
          }}
        >
          <i className="fas fa-map-marked-alt fs-6"></i>
        </div>
        <div>
          <h2 className="h5 fw-bold mb-0 text-dark">
            <Translator text="Geography & Climate" targetLang={language} />
          </h2>
          <span className="text-uppercase fw-bold text-muted" style={{ fontSize: '0.65rem', letterSpacing: '0.5px' }}>
            <Translator text="Location Details" targetLang={language} />
          </span>
        </div>
      </div>

      <div className="row g-0 rounded-4 overflow-hidden border shadow-sm bg-white">
        
        {/* 🗺️ MAP COLUMN */}
        {hasCoordinates && (
          <div className="col-lg-5 position-relative bg-light border-end">
            <div style={{ height: "100%", minHeight: "350px" }}>
              {!MapComponents ? (
                <div className="h-100 d-flex flex-column align-items-center justify-content-center">
                  <div className="spinner-border spinner-border-sm mb-2" style={{ color }} role="status"></div>
                  <small className="text-muted fw-bold" style={{fontSize: '0.7rem'}}>Loading Map...</small>
                </div>
              ) : (
                <MapComponents.MapContainer
                  center={[lat, lng]}
                  zoom={13}
                  scrollWheelZoom={false}
                  style={{ height: "100%", width: "100%" }}
                >
                  <MapComponents.TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    attribution='© OpenStreetMap'
                  />
                  <MapComponents.RecenterMap lat={lat} lng={lng} />
                  <MapComponents.Marker position={[lat, lng]} icon={MapComponents.customIcon}>
                    <MapComponents.Popup>
                      <div className="text-center p-1">
                        <strong className="d-block mb-1" style={{fontSize: '0.8rem'}}>Location</strong>
                        <button 
                          onClick={handleDirections}
                          className="btn btn-sm text-white px-3 fw-bold shadow-sm"
                          style={{ backgroundColor: color, borderRadius: '20px', fontSize: '0.7rem', padding: '2px 10px' }}
                        >
                          Directions
                        </button>
                      </div>
                    </MapComponents.Popup>
                  </MapComponents.Marker>
                </MapComponents.MapContainer>
              )}
            </div>
          </div>
        )}

        {/* 📄 CONTENT COLUMN */}
        <div className={hasCoordinates ? "col-lg-7" : "col-12"}>
          {/* Reduced Padding Here */}
          <div className="p-3 p-md-4">
            
            {/* Intro */}
            <div className="mb-3">
               {renderParagraphs(content.intro, true)}
            </div>

            {/* Stats Grid - 100% Width Pills */}
            {content.details?.length ? (
              <div className="geo-stats-grid mb-3">
                {content.details.map((detail, idx) => (
                  <div key={idx} className="stat-pill border px-2 py-2 rounded-3 d-flex align-items-center gap-2 bg-light w-100">
                    <div className="stat-icon flex-shrink-0" style={{ color: color }}>
                      <i className={detail.icon || "fas fa-info-circle"} style={{ fontSize: '0.9rem' }} />
                    </div>
                    <div className="overflow-hidden">
                        <small className="d-block text-uppercase text-muted fw-bold text-truncate" style={{ fontSize: '0.55rem', letterSpacing: '0.5px', lineHeight: 1.2 }}>
                            <Translator text={detail.label || ""} targetLang={language} />
                        </small>
                        <span className="fw-bold text-dark text-truncate d-block" style={{ fontSize: '0.8rem', lineHeight: 1.2 }}>
                            <Translator text={detail.value || ""} targetLang={language} />
                        </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            {/* Climate Box */}
            {content.climate && (
              <div className="p-3 rounded-3 mb-3 position-relative overflow-hidden" style={{ backgroundColor: `${color}08`, borderLeft: `3px solid ${color}` }}>
                <div className="d-flex align-items-center mb-2">
                    <i className="fas fa-cloud-sun me-2" style={{ color, fontSize: '0.9rem' }}></i>
                    <h6 className="fw-bold mb-0 text-dark" style={{ fontSize: '0.85rem' }}>
                        <Translator text="Climate & Seasons" targetLang={language} />
                    </h6>
                </div>
                
                <div className="mb-2 text-secondary" style={{fontSize: '0.8rem'}}>
                  {renderParagraphs(content.climate.description)}
                </div>

                <div className="d-flex flex-wrap gap-1">
                  {content.climate.seasons?.map((season, i) => (
                    <span key={i} className="badge bg-white text-dark border shadow-sm fw-normal py-1 px-2 d-flex align-items-center gap-1" style={{fontSize: '0.7rem'}}>
                      <i className={season.icon || "fas fa-sun"} style={{ color, fontSize: '0.7rem' }}></i>
                      <Translator text={season.text || ""} targetLang={language} />
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Conclusion */}
            {content.conclusion && (
                <div className="text-muted fst-italic border-top pt-2" style={{fontSize: '0.8rem'}}>
                    {renderParagraphs(content.conclusion)}
                </div>
            )}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .geo-stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr; /* Two columns equal width */
          gap: 10px;
        }
        @media (max-width: 576px) {
           .geo-stats-grid {
             grid-template-columns: 1fr; /* Full width on very small screens */
           }
        }
      `}</style>
    </section>
  );
};

export default Geography;