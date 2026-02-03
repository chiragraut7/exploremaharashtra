"use client";
import React, { useState } from "react";
import Image from "next/image";
import SectionTitle from "./SectionTitle";
import { useLanguage } from "../context/LanguageContext";
import Translator from "../commonComponents/Translator";
import { motion } from "framer-motion";

// -------------------- Interfaces --------------------
interface Attraction {
  image?: string;
  title?: string;
  description?: string;
  icon?: string;
  label?: string;
  value?: string;
}

interface AttractionsProps {
  items?: Attraction[];
  color?: string;
  category?: string;
}

// -------------------- Constants --------------------
// Robust online fallback to ensure image always shows
const FALLBACK_IMAGE = "/assets/images/attractions.png";

// Define your common attraction feature images here
// Make sure these files exist in your 'public' folder
const CATEGORY_ATTRACTION_IMAGES: Record<string, string> = {
  // Ensure these files exist in public/assets/images/
  beaches: "/assets/images/attractions.png",
  forts: "/assets/images/attractions.png",
  
  // Note the extension .png based on your previous preference
  hills: "/assets/images/attractions.png", 
  
  nature: "/assets/images/attractions.png",
  religious: "/assets/images/attractions.png",
  culture: "/assets/images/attractions.png",
};

// -------------------- Component --------------------
const Attractions: React.FC<AttractionsProps> = ({ items = [], color = "#00aaff", category = "" }) => {
  const { language } = useLanguage();
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  if (!items.length) return null;

  // Logic: 
  // 1. Check if we have a specific image for this Category
  // 2. Else use the image of the first item
  // 3. Else use the Fallback
  const initialImage = 
    (category && CATEGORY_ATTRACTION_IMAGES[category.toLowerCase()]) || 
    items[0]?.image || 
    FALLBACK_IMAGE;

  return (
    <section id="attractions" className="mb-5 position-relative">
      
      {/* --- HEADER --- */}
      <div 
        className="d-flex align-items-center mb-3 pb-2" 
        style={{ borderBottom: `1px solid ${color}20` }}
      >
        <div 
          className="d-flex align-items-center justify-content-center me-3 rounded-circle"
          style={{ 
            width: '36px', height: '36px', 
            backgroundColor: `${color}15`, color: color 
          }}
        >
          <i className="fas fa-camera-retro fs-6"></i>
        </div>
        <div>
          <h2 className="h5 fw-bold mb-0 text-dark">
            <Translator text="Top Attractions" targetLang={language} />
          </h2>
          <span className="text-uppercase fw-bold text-muted" style={{ fontSize: '0.65rem', letterSpacing: '0.5px' }}>
            <Translator text="Must-See Spots" targetLang={language} />
          </span>
        </div>
      </div>

      <div className="row g-0 rounded-3 overflow-hidden shadow-sm bg-white border">
        
        {/* 📸 LEFT: STICKY IMAGE */}
        <div className="col-lg-5 p-0 bg-light border-end">
          <div className="sticky-media-wrapper h-100 position-relative">
            <Image
              src={imgSrc || initialImage} // Uses state if error occurs, else initial
              alt={`${category} Attractions`}
              fill
              className="object-cover"
              sizes="(max-width: 991px) 100vw, 40vw"
              priority
              onError={() => setImgSrc(FALLBACK_IMAGE)} // Failsafe: Loads fallback on error
            />
            <div className="position-absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-50" />
            
            <div className="position-absolute bottom-0 start-0 m-3">
                <span className="badge bg-black/50 backdrop-blur border border-white/20 text-white rounded-pill px-3 py-1" style={{fontSize: '0.7rem'}}>
                    {items.length} <Translator text="Attractions" targetLang={language} />
                </span>
            </div>
          </div>
        </div>

        {/* 🏛️ RIGHT: TIMELINE LIST */}
        <div className="col-lg-7">
          <div className="p-0 h-100">
            {items.map((item: Attraction, idx: number) => {
              const isEven = idx % 2 === 0;

              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  
                  className={`attraction-row p-3 position-relative ${isEven ? 'bg-white' : 'bg-light-subtle'}`}
                  style={{
                    borderLeft: isEven ? '4px solid transparent' : `4px solid ${color}`,
                    borderBottom: '1px solid #f0f0f0'
                  }}
                >
                  <div className="d-flex align-items-center">
                    
                    {/* Index Number */}
                    <div className="me-3 opacity-25 fw-black font-monospace d-none d-sm-block" style={{ fontSize: '1.5rem', lineHeight: 1 }}>
                      {String(idx + 1).padStart(2, '0')}
                    </div>

                    {/* Small Icon Box */}
                    <div 
                      className="compact-icon me-3 flex-shrink-0 shadow-sm" 
                      style={{ 
                        color: isEven ? color : '#fff', 
                        backgroundColor: isEven ? `${color}15` : color 
                      }}
                    >
                      <i className={`${item.icon || 'fas fa-map-marker-alt'}`}></i>
                    </div>
                    
                    <div className="flex-grow-1 overflow-hidden">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                          <h3 className="fw-bold mb-0 text-dark text-truncate" style={{ fontSize: '0.95rem' }}>
                              <Translator text={item.title || ""} targetLang={language} />
                          </h3>
                          
                          {/* Value Badge */}
                          {item.value && (
                            <span className="badge border fw-normal text-muted d-none d-sm-inline-flex align-items-center gap-1" style={{fontSize: '0.65rem', backgroundColor: '#fff'}}>
                                <i className="fas fa-location-arrow" style={{color, opacity: 0.8, fontSize: '0.6rem'}}></i>
                                <Translator text={item.value} targetLang={language} />
                            </span>
                          )}
                      </div>
                      
                      <p className="text-secondary mb-0 text-truncate" style={{ fontSize: '0.8rem' }}>
                        <Translator text={item.description || ""} targetLang={language} />
                      </p>
                      
                      {/* Mobile Label */}
                      {item.label && (
                         <div className="mt-1 d-flex align-items-center opacity-75 small" style={{fontSize: '0.65rem'}}>
                            <i className="fas fa-tag me-1" style={{color: color, fontSize: '0.6rem'}}></i>
                            <span className="fw-bold text-muted text-uppercase">
                                <Translator text={item.label} targetLang={language} />
                            </span>
                         </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        .sticky-media-wrapper {
          position: sticky;
          top: 0;
          height: 100%;
          min-height: 300px;
        }

        .object-cover { object-fit: cover; }

        .bg-light-subtle {
            background-color: #f8f9fa;
        }

        /* Hover Effect */
        .attraction-row {
            transition: background-color 0.2s ease;
        }
        .attraction-row:hover {
            background-color: #f1f3f5 !important;
        }

        /* Compact Icon */
        .compact-icon {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          transition: transform 0.2s;
        }
        
        .attraction-row:hover .compact-icon {
            transform: scale(1.1);
        }

        @media (max-width: 991px) {
          .sticky-media-wrapper { 
            height: 180px; 
            min-height: auto; 
            position: relative; 
          }
        }
      `}</style>
    </section>
  );
};

export default Attractions;