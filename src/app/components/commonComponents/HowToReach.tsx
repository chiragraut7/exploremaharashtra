"use client";
import React from "react";
import Image from "next/image";
import SectionTitle from "./SectionTitle";
import { useLanguage } from "../context/LanguageContext";
import Translator from "../commonComponents/Translator";
import { motion } from "framer-motion";

// -------------------- Interfaces --------------------
interface TransportItem {
  icon?: string;
  title?: string;
  details?: string[];
}

interface HowToReachProps {
  transport?: TransportItem[];
  color?: string;
  mainImage?: string; // Optional: Image of a map or the destination entrance
}

// -------------------- Component --------------------
const HowToReach: React.FC<HowToReachProps> = ({ 
  transport = [], 
  color = "#00aaff",
  mainImage = "/assets/images/map-placeholder.jpg" 
}) => {
  const { language } = useLanguage();

  if (!transport.length) return null;

  return (
    <section id="reach" className="mb-5">
      <SectionTitle title="How to Reach" color={color} />

      <div className="row g-0 rounded-4 overflow-hidden shadow-sm bg-white border content-box-compact">
        
        {/* 🗺️ LEFT: STICKY MAP/LOCATION IMAGE */}
        <div className="col-lg-4 p-0 bg-light">
          <div className="sticky-media-compact">
            <Image
              src={mainImage}
              alt="Location Map"
              fill
              className="object-cover grayscale-hover"
              sizes="(max-width: 991px) 100vw, 33vw"
            />
            <div className="image-overlay-subtle" />
            <div className="image-label-mini">
              <span className="badge-text-mini text-uppercase">
                <i className="fas fa-map-marked-alt me-1"></i>
                <Translator text="Travel Guide" targetLang={language} />
              </span>
            </div>
          </div>
        </div>

        {/* ✈️ RIGHT: TRANSPORT MODES LIST */}
        <div className="col-lg-8">
          <div className="p-3 p-md-4">
            {transport.map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className={`d-flex align-items-start mb-4 ${idx !== transport.length - 1 ? 'pb-4 border-bottom' : ''}`}
              >
                {/* Modern Icon Circle */}
                <div 
                  className="flex-shrink-0 d-flex align-items-center justify-content-center rounded-circle border border-2"
                  style={{ 
                    width: '50px', 
                    height: '50px', 
                    borderColor: `${color}30`,
                    color: color,
                    backgroundColor: `${color}05`
                  }}
                >
                  <i className={`${item.icon || 'fas fa-route'} fs-5`} />
                </div>

                <div className="ms-3 flex-grow-1">
                  <h3 className="h6 fw-bold mb-2 text-dark text-uppercase letter-spacing-1">
                    <Translator text={item.title || ""} targetLang={language} />
                  </h3>
                  
                  {item.details && (
                    <ul className="list-unstyled mb-0">
                      {item.details.map((line, lineIdx) => (
                        <li key={lineIdx} className="d-flex align-items-start mb-1 text-muted small">
                          <span className="me-2" style={{ color }}>•</span>
                          <span className="lh-sm">
                            <Translator text={line} targetLang={language} />
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.div>
            ))}
            
            {/* Helpful Note Footer */}
            <div className="mt-2 p-3 rounded-3 bg-light border-start border-4" style={{ borderColor: color }}>
              <p className="small mb-0 text-muted italic">
                <i className="fas fa-info-circle me-1" style={{ color }}></i>
                <Translator 
                  text="Travel times may vary based on weather conditions and local traffic." 
                  targetLang={language} 
                />
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .letter-spacing-1 { letter-spacing: 1px; }
        .content-box-compact { border-color: #eee !important; }

        .sticky-media-compact {
          position: sticky;
          top: 0;
          height: 100%;
          min-height: 400px;
          overflow: hidden;
        }

        .grayscale-hover {
          filter: grayscale(20%);
          transition: filter 0.5s ease;
        }
        .grayscale-hover:hover {
          filter: grayscale(0%);
        }

        .image-overlay-subtle {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.1), transparent);
        }

        .image-label-mini {
          position: absolute;
          bottom: 15px;
          left: 15px;
          background: rgba(0,0,0,0.7);
          padding: 4px 12px;
          border-radius: 6px;
          backdrop-filter: blur(4px);
        }

        .badge-text-mini { color: white; font-weight: 700; font-size: 0.65rem; letter-spacing: 1px; }

        @media (max-width: 991px) {
          .sticky-media-compact { height: 220px; position: relative; min-height: 220px; }
        }
      `}</style>
    </section>
  );
};

export default HowToReach;