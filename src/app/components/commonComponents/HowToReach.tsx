"use client";
import React, { useState } from "react"; // Added useState
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
  mainImage?: string; 
}

const FALLBACK_MAP = "/assets/images/map-placeholder.png";

const HowToReach: React.FC<HowToReachProps> = ({ 
  transport = [], 
  color = "#00aaff",
  mainImage = FALLBACK_MAP 
}) => {
  const { language } = useLanguage();
  
  // State to handle image loading errors
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  if (!transport.length) return null;

  return (
    <section id="reach" className="mb-5 position-relative">
      
      {/* --- HEADER --- */}
      <div 
        className="d-flex align-items-center mb-4 pb-2" 
        style={{ borderBottom: `1px solid ${color}20` }}
      >
        <div 
          className="d-flex align-items-center justify-content-center me-3 rounded-circle"
          style={{ 
            width: '40px', height: '40px', 
            backgroundColor: `${color}15`, color: color 
          }}
        >
          <i className="fas fa-map-signs fs-6"></i>
        </div>
        <div>
          <h2 className="h5 fw-bold mb-0 text-dark">
            <Translator text="How to Reach" targetLang={language} />
          </h2>
          <span className="text-uppercase fw-bold text-muted" style={{ fontSize: '0.65rem', letterSpacing: '0.5px' }}>
            <Translator text="Travel Guide & Routes" targetLang={language} />
          </span>
        </div>
      </div>

      <div className="row g-0 rounded-4 overflow-hidden border flex-lg-row-reverse" style={{boxShadow: '0 8px 30px rgba(0,0,0,0.04)'}}>
        
        {/* 🗺️ RIGHT: STICKY MAP IMAGE */}
        <div className="col-lg-5 p-0 bg-light border-start">
          <div className="sticky-media-wrapper h-100 position-relative">
            <Image
              src="/assets/images/map-placeholder.png" // Uses state if error, otherwise prop
              alt="Location Map"
              fill
              className="object-cover"
              sizes="(max-width: 991px) 100vw, 33vw"
              onError={() => setImgSrc(FALLBACK_MAP)} // ✅ Automatically switches on error
            />
            <div className="image-overlay-subtle" />
            
            <div className="position-absolute bottom-0 end-0 m-3">
                <span className="badge bg-black/50 backdrop-blur border border-white/20 text-white rounded-pill px-3 py-2 shadow-sm" style={{fontSize: '0.75rem'}}>
                    <i className="fas fa-location-arrow me-2"></i>
                    <Translator text="Getting There" targetLang={language} />
                </span>
            </div>
          </div>
        </div>

        {/* ✈️ LEFT: TIMELINE LIST */}
        <div className="col-lg-7 bg-white position-relative">
           {/* Vertical Connector Line */}
           <div className="position-absolute start-0 top-0 bottom-0 d-none d-sm-block" style={{left: '3.5rem', width: '1px', background: '#f0f0f0', zIndex: 0}}></div>

          <div className="p-0 h-100">
            {transport.map((item, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  
                  className={`transport-row p-3 p-md-4 position-relative ${isEven ? 'bg-white' : ''}`}
                  style={{
                    backgroundColor: isEven ? '#fff' : `${color}05`, // Subtle tint
                    borderBottom: '1px solid #f9f9f9',
                    borderLeft: isEven ? '4px solid transparent' : `4px solid ${color}`
                  }}
                >
                  <div className="d-flex align-items-start position-relative z-1">
                    
                    {/* Icon Box */}
                    <div 
                      className="compact-icon me-3 flex-shrink-0" 
                      style={{ 
                        color: color, 
                        backgroundColor: `${color}15`,
                        width: '40px', height: '40px',
                        borderRadius: '10px'
                      }}
                    >
                      <i className={`${item.icon || 'fas fa-route'} fs-6`} />
                    </div>

                    <div className="flex-grow-1">
                      <h3 className="h6 fw-bold mb-2 text-dark text-uppercase letter-spacing-1">
                        <Translator text={item.title || ""} targetLang={language} />
                      </h3>
                      
                      {item.details && (
                        <ul className="list-unstyled mb-0">
                          {item.details.map((line, lineIdx) => (
                            <li key={lineIdx} className="d-flex align-items-start mb-2 text-secondary small">
                              <i className="fas fa-check-circle me-2 mt-1 opacity-50" style={{ fontSize: '0.7rem', color }}></i>
                              <span className="lh-sm" style={{ fontSize: '0.85rem' }}>
                                <Translator text={line} targetLang={language} />
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Footer Note */}
            <div className="p-3 bg-light-subtle border-top">
                <p className="small mb-0 text-muted fst-italic d-flex align-items-center">
                    <i className="fas fa-info-circle me-2" style={{ color }}></i>
                    <Translator 
                        text="Travel times may vary based on weather & traffic." 
                        targetLang={language} 
                    />
                </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .sticky-media-wrapper {
          position: sticky;
          top: 0;
          height: 100%;
          min-height: 400px;
          overflow: hidden;
        }

        .object-cover { object-fit: cover; }
        .bg-light-subtle { background-color: #f8f9fa; }
        .letter-spacing-1 { letter-spacing: 0.5px; }

        .image-overlay-subtle {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.2), transparent);
        }

        /* Hover Effect */
        .transport-row {
            transition: all 0.2s ease;
        }
        .transport-row:hover {
            background-color: #fff !important;
            box-shadow: 0 4px 15px rgba(0,0,0,0.03);
            z-index: 2;
            transform: translateX(2px);
        }

        /* Icon Styling */
        .compact-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s;
        }
        .transport-row:hover .compact-icon {
            transform: scale(1.1);
            background-color: ${color} !important;
            color: #fff !important;
        }

        @media (max-width: 991px) {
          .sticky-media-wrapper { height: 220px; position: relative; min-height: 220px; }
        }
      `}</style>
    </section>
  );
};

export default HowToReach;