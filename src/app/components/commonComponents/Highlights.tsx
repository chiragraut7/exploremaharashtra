"use client";
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { motion } from "framer-motion";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { useLanguage } from "../context/LanguageContext";
import Translator from "../commonComponents/Translator";

interface HighlightItem {
  icon?: string;
  title?: string;
  description?: string;
}

interface HighlightsProps {
  highlights?: HighlightItem[];
  color?: string;
}

const Highlights: React.FC<HighlightsProps> = ({
  highlights = [],
  color = "#00aaff",
}) => {
  const { language } = useLanguage();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (!highlights.length) return null;

  return (
    <section id="highlights" className="py-4">
      {/* Compact Header */}
      <div className="d-flex align-items-center mb-3">
        <div 
          className="me-2" 
          style={{ width: '3px', height: '24px', backgroundColor: color, borderRadius: '2px' }} 
        />
        <h2 className="h5 fw-bold mb-0 text-uppercase letter-spacing-1">
          <Translator text="Trip Highlights" targetLang={language} />
        </h2>
      </div>

      <div className="highlight-swiper-container">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={16}
          slidesPerView={1.2}
          grabCursor={true}
          autoplay={{ delay: 4000, disableOnInteraction: true }}
          breakpoints={{
            768: { slidesPerView: 2.2 },
            1024: { slidesPerView: 3 },
            1200: { slidesPerView: 4 },
          }}
          className="pb-4"
        >
          {highlights.map((item, index) => (
            <SwiperSlide key={index} className="h-auto">
              <motion.div
                className="h-100 p-3 rounded-4 bg-white border position-relative highlight-mini-card"
                style={{ borderColor: '#f0f0f0' }}
              >
                <div className="d-flex gap-3">
                  {/* Small Circular Icon */}
                  <div 
                    className="flex-shrink-0 d-flex align-items-center justify-content-center"
                    style={{ 
                      width: '42px', 
                      height: '42px', 
                      backgroundColor: `${color}10`, 
                      borderRadius: '50%',
                      color: color
                    }}
                  >
                    <i className={`${item.icon || 'fas fa-star'} fs-5`} />
                  </div>
                  
                  <div className="flex-grow-1">
                    <h4 className="fw-bold mb-1" style={{ fontSize: '0.9rem', color: '#222' }}>
                      <Translator text={item.title || ""} targetLang={language} />
                    </h4>
                    
                    <div className="description-area">
                      <p className={`text-muted mb-0 ${expandedIndex !== index ? 'line-clamp-2' : ''}`} style={{ fontSize: '0.8rem', lineHeight: '1.4' }}>
                        <Translator text={item.description || ""} targetLang={language} />
                      </p>
                      
                      {item.description && item.description.length > 60 && (
                        <button 
                          className="btn btn-link p-0 mt-1 text-decoration-none fw-bold"
                          style={{ color: color, fontSize: '0.7rem' }}
                          onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                        >
                          <Translator 
                            text={expandedIndex === index ? "Less" : "More"} 
                            targetLang={language} 
                          />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Subtle Accent Bar */}
                {/*<div 
                  className="position-absolute bottom-0 start-0 rounded-bottom" 
                  style={{ height: '3px', width: '30%', backgroundColor: color }} 
                />*/}
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style jsx global>{`
        .letter-spacing-1 { letter-spacing: 1px; }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;  
          overflow: hidden;
        }

        .highlight-mini-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          border: 1px solid #eee !important;
        }

        .highlight-mini-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.05) !important;
          border-color: ${color}33 !important;
        }

        /* Minimalist Pagination */
        .highlight-swiper-container .swiper-pagination-bullet {
          width: 6px;
          height: 6px;
          background: #ccc;
          opacity: 1;
        }

        .highlight-swiper-container .swiper-pagination-bullet-active {
          width: 18px;
          border-radius: 4px;
          background: ${color} !important;
          transition: width 0.3s ease;
        }

        .highlight-swiper-container .swiper-button-next,
        .highlight-swiper-container .swiper-button-prev {
          display: none; /* Removed for a cleaner, compact look on auto-play */
        }
      `}</style>
    </section>
  );
};

export default Highlights;