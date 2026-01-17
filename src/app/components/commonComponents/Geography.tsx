"use client";

import React, { useEffect, useState } from "react";
import SectionTitle from "./SectionTitle";
import { useLanguage } from "../context/LanguageContext";
import Translator from "../commonComponents/Translator";

// Import Leaflet CSS at the top level to prevent Vercel Build Errors
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
        // We only import the JS modules dynamically to avoid SSR issues
        const L = (await import("leaflet")).default;
        const RL = await import("react-leaflet");
        const { MapContainer, TileLayer, Marker, Popup, useMap } = RL;

        // ✅ LOGO ICON: Custom Branded Marker
        const customIcon = L.divIcon({
          className: "branded-marker",
          html: `
            <div style="
              background-color: ${color};
              width: 40px;
              height: 40px;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              display: flex;
              align-items: center;
              justify-content: center;
              border: 2px solid white;
              box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            ">
              <div style="
                width: 22px;
                height: 22px;
                background: white;
                border-radius: 50%;
                transform: rotate(45deg);
                display: flex;
                align-items: center;
                justify-content: center;
                color: ${color};
              ">
                <i class="fas fa-map-marker-alt" style="font-size: 12px;"></i>
              </div>
            </div>
          `,
          iconSize: [40, 40],
          iconAnchor: [20, 40],
          popupAnchor: [0, -40],
        });

        const RecenterMap = ({ lat, lng }: { lat: number; lng: number }) => {
          const map = useMap();
          useEffect(() => {
            if (map) {
              map.setView([lat, lng], map.getZoom(), { animate: true });
              // Small delay ensures the container is fully rendered before resizing
              const timer = setTimeout(() => {
                map.invalidateSize();
              }, 500);
              return () => clearTimeout(timer);
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

  // Fix Google Maps URL
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
      <p key={i} className={`${isLead ? "lead-text-compact" : "body-text-compact"} mb-2`}>
        <Translator text={p.trim()} targetLang={language} />
      </p>
    ));
  };

  return (
    <section id="geography" className="mb-5">
      <SectionTitle title="Geography" color={color} />

      <div className="row g-0 rounded-4 overflow-hidden shadow-sm bg-white border content-box-compact">
        {/* 🗺️ MAP COLUMN */}
        {hasCoordinates && (
          <div className="col-lg-5 p-0 bg-light border-end">
            <div className="map-wrapper-fixed h-100 position-relative" style={{ minHeight: "450px" }}>
              {!MapComponents ? (
                <div className="h-100 d-flex flex-column align-items-center justify-content-center bg-light">
                  <div className="spinner-border mb-3" style={{ color }} role="status"></div>
                  <span className="small text-muted fw-bold">Loading Interactive Map...</span>
                </div>
              ) : (
                <MapComponents.MapContainer
                  center={[lat, lng]}
                  zoom={13}
                  scrollWheelZoom={false}
                  style={{ height: "100%", width: "100%", zIndex: 1 }}
                >
                  <MapComponents.TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <MapComponents.RecenterMap lat={lat} lng={lng} />
                  <MapComponents.Marker position={[lat, lng]} icon={MapComponents.customIcon}>
                    <MapComponents.Popup>
                      <div className="text-center p-1">
                        <div className="fw-bold mb-1">Destination Location</div>
                        <button 
                          onClick={handleDirections}
                          className="btn btn-sm text-white px-3" 
                          style={{ backgroundColor: color, fontSize: '10px', borderRadius: '20px' }}
                        >
                          Get Directions
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
          <div className="p-4 p-md-5">
            <div className="mini-pill mb-3" style={{ color: color, backgroundColor: `${color}15` }}>
              <i className="fas fa-mountain-sun me-2"></i>
              <Translator text="Regional Characteristics" targetLang={language} />
            </div>

            <div className="intro-compact mb-4">
               {renderParagraphs(content.intro, true)}
            </div>

            {/* STATS GRID */}
            {content.details?.length ? (
              <div className="stats-grid-compact mb-4">
                {content.details.map((detail: DetailItem, idx: number) => (
                  <div key={idx} className="stat-card-mini border shadow-none">
                    <div className="stat-icon-mini" style={{ color: color }}>
                      <i className={detail.icon || "fas fa-info-circle"}></i>
                    </div>
                    <div className="stat-text-mini">
                      <small className="text-muted text-uppercase fw-bold">
                        <Translator text={detail.label || ""} targetLang={language} />
                      </small>
                      <p className="fw-bold mb-0 text-dark">
                        <Translator text={detail.value || ""} targetLang={language} />
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            {/* CLIMATE BOX */}
            {content.climate && (
              <div className="climate-card-compact p-4 rounded-4" style={{ borderLeft: `5px solid ${color}`, background: '#f8f9fa' }}>
                <h6 className="fw-bold mb-3 d-flex align-items-center text-dark">
                  <i className="fas fa-temperature-high me-2" style={{ color }}></i>
                  <Translator text="Climate & Seasons" targetLang={language} />
                </h6>
                <div className="body-text-compact mb-3">
                  {renderParagraphs(content.climate.description)}
                </div>

                <div className="d-flex flex-wrap gap-2">
                  {content.climate.seasons?.map((season: Season, i: number) => (
                    <div key={i} className="season-pill-mini border-0 shadow-sm bg-white">
                      <i className={season.icon || "fas fa-sun"} style={{ color }}></i>
                      <span><Translator text={season.text || ""} targetLang={language} /></span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CONCLUSION */}
            {content.conclusion && (
              <div className="mt-4 pt-3 border-top italic-conclusion-compact">
                 {renderParagraphs(content.conclusion)}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .lead-text-compact { font-size: 1.05rem; font-weight: 600; color: #222; line-height: 1.6; }
        .body-text-compact { color: #555; line-height: 1.6; font-size: 0.9rem; }
        .mini-pill { display: inline-flex; align-items: center; padding: 5px 15px; border-radius: 30px; font-weight: 800; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.5px; }

        .stats-grid-compact {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 12px;
        }
        .stat-card-mini { display: flex; align-items: center; padding: 12px 15px; background: #fff; border-radius: 12px; transition: transform 0.2s; }
        .stat-card-mini:hover { transform: translateY(-2px); }
        .stat-icon-mini { font-size: 1.1rem; margin-right: 12px; opacity: 0.9; }
        .stat-text-mini small { font-size: 0.6rem; display: block; letter-spacing: 0.5px; margin-bottom: 2px; }
        .stat-text-mini p { font-size: 0.85rem; line-height: 1.2; }

        .season-pill-mini { display: flex; align-items: center; gap: 8px; padding: 6px 14px; border-radius: 10px; font-size: 0.75rem; font-weight: 700; color: #444; }
        .italic-conclusion-compact { font-style: italic; font-size: 0.9rem; color: #777; }

        @media (max-width: 991px) {
          .map-wrapper-fixed { min-height: 350px !important; }
        }
      `}</style>
    </section>
  );
};

export default Geography;