"use client";

import React, { useEffect, useState } from "react";
import SectionTitle from "./SectionTitle";
import { useLanguage } from "../context/LanguageContext";
import Translator from "../commonComponents/Translator";

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
  color = "#E57717", // Defaulting to Maharashtra Saffron
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
        await import("leaflet/dist/leaflet.css");
        const L = (await import("leaflet")).default;
        const RL = await import("react-leaflet");
        const { MapContainer, TileLayer, Marker, Popup, useMap } = RL;

        // ✅ LOGO ICON: Custom Saffron Teardrop with White Center
        const customIcon = L.divIcon({
          className: "branded-marker",
          html: `
            <div style="
              background-color: ${color};
              width: 45px;
              height: 45px;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              display: flex;
              align-items: center;
              justify-content: center;
              border: 2px solid white;
              box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            ">
              <div style="
                width: 25px;
                height: 25px;
                background: white;
                border-radius: 50%;
                transform: rotate(45deg);
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 10px;
                color: ${color};
              ">
                <i class="fas fa-map-marker-alt"></i>
              </div>
            </div>
          `,
          iconSize: [45, 45],
          iconAnchor: [22, 45],
          popupAnchor: [0, -45],
        });

        const RecenterMap = ({ lat, lng }: { lat: number; lng: number }) => {
          const map = useMap();
          useEffect(() => {
            map.setView([lat, lng], map.getZoom(), { animate: true });
            // ✅ FIX: InvalidateSize prevents the grey box map error
            setTimeout(() => map.invalidateSize(), 400);
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
      window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank");
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
        {/* 🗺️ MAP */}
        {hasCoordinates && (
          <div className="col-lg-4 p-0 bg-light border-end">
            <div className="map-wrapper-fixed h-100 position-relative" style={{ minHeight: "450px" }}>
              {!MapComponents ? (
                <div className="h-100 d-flex align-items-center justify-content-center bg-light">
                  <div className="spinner-border text-warning" role="status"></div>
                </div>
              ) : (
                <MapComponents.MapContainer
                  key={`${lat}-${lng}`}
                  center={[lat, lng]}
                  zoom={12}
                  scrollWheelZoom={false}
                  style={{ height: "100%", width: "100%", minHeight: "450px", zIndex: 1 }}
                >
                  <MapComponents.TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    attribution="© OpenStreetMap"
                  />
                  <MapComponents.RecenterMap lat={lat} lng={lng} />
                  <MapComponents.Marker position={[lat, lng]} icon={MapComponents.customIcon}>
                    <MapComponents.Popup>
                      <div className="text-center fw-bold py-1">
                        Explore Maharashtra
                      </div>
                    </MapComponents.Popup>
                  </MapComponents.Marker>
                </MapComponents.MapContainer>
              )}
            </div>
          </div>
        )}

        {/* 📄 CONTENT */}
        <div className={hasCoordinates ? "col-lg-8" : "col-12"}>
             <div className="p-3 p-md-4">
            
            <div className="mini-pill mb-2" style={{ color: color, backgroundColor: `${color}10` }}>
              <i className="fas fa-map-marked-alt me-2"></i>
              <Translator text="Characteristics" targetLang={language} />
            </div>

            <div className="intro-compact mb-3">
               {renderParagraphs(content.intro, true)}
            </div>

            {/* 📋 STATS GRID */}
            {content.details?.length ? (
              <div className="stats-grid-compact mb-3">
                {content.details.map((detail: DetailItem, idx: number) => (
                  <div key={idx} className="stat-card-mini border">
                    <div className="stat-icon-mini" style={{ color: color }}>
                      <i className={detail.icon || "fas fa-info-circle"}></i>
                    </div>
                    <div className="stat-text-mini">
                      <small className="text-muted text-uppercase fw-bold">
                        <Translator text={detail.label || ""} targetLang={language} />
                      </small>
                      <p className="fw-bold mb-0">
                        <Translator text={detail.value || ""} targetLang={language} />
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            {/* 🌤️ CLIMATE BOX */}
            {content.climate && (
              <div className="climate-card-compact p-3 rounded-3" style={{ borderLeft: `4px solid ${color}`, background: '#f8faff' }}>
                <h6 className="fw-bold mb-1 small d-flex align-items-center">
                  <i className="fas fa-cloud-sun me-2" style={{ color }}></i>
                  <Translator text="Climate" targetLang={language} />
                </h6>
                <div className="small-desc mb-2">
                  {renderParagraphs(content.climate.description)}
                </div>

                <div className="d-flex flex-wrap gap-2">
                  {content.climate.seasons?.map((season: Season, i: number) => (
                    <div key={i} className="season-pill-mini">
                      <i className={season.icon || "fas fa-sun"} style={{ color, fontSize: '0.7rem' }}></i>
                      <span><Translator text={season.text || ""} targetLang={language} /></span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 🏞️ CONCLUSION */}
            {content.conclusion && (
              <div className="mt-3 pt-2 border-top italic-conclusion-compact">
                 {renderParagraphs(content.conclusion)}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .sticky-media-compact {
          position: sticky;
          top: 0;
          height: 100%;
          min-height: 420px;
          overflow: hidden;
        }
        .image-label-mini { 
          position: absolute; 
          bottom: 12px; 
          left: 12px; 
          background: rgba(0,0,0,0.7); 
          padding: 4px 10px; 
          border-radius: 4px; 
          border: 1px solid rgba(255,255,255,0.1);
        }
        .badge-text-mini { color: #fff; font-weight: 700; font-size: 0.65rem; font-family: monospace; }

        .lead-text-compact { font-size: 0.95rem; font-weight: 600; color: #333; line-height: 1.4; }
        .body-text-compact { color: #666; line-height: 1.4; font-size: 0.85rem; }

        .mini-pill { display: inline-flex; padding: 2px 10px; border-radius: 4px; font-weight: 700; font-size: 0.65rem; text-transform: uppercase; }

        .stats-grid-compact {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 10px;
        }
        .stat-card-mini { display: flex; align-items: center; padding: 8px 12px; background: #fff; border-radius: 10px; border: 1px solid #f0f0f0 !important; }
        .stat-icon-mini { font-size: 0.9rem; margin-right: 10px; }
        .stat-text-mini small { font-size: 0.55rem; display: block; line-height: 1; margin-bottom: 3px; }
        .stat-text-mini p { font-size: 0.75rem; line-height: 1.1; margin-bottom: 0; }

        .season-pill-mini { display: flex; align-items: center; gap: 5px; padding: 4px 10px; background: white; border-radius: 6px; font-size: 0.65rem; font-weight: 600; border: 1px solid #eee; }
        .italic-conclusion-compact { font-style: italic; font-size: 0.8rem; opacity: 0.8; }

        @media (max-width: 991px) {
          .sticky-media-compact { height: 320px; position: relative; min-height: 320px; }
        }
      `}</style>
    </section>
  );
};

export default Geography;