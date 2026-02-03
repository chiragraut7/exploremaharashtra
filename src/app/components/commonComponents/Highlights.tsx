"use client";
import React, { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { Swiper as SwiperType } from "swiper";
import { motion } from "framer-motion";

import "swiper/css";
import "swiper/css/navigation";

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
  const swiperRef = useRef<SwiperType | null>(null);

  const [navStatus, setNavStatus] = useState({
    isBeginning: true,
    isEnd: false,
    showArrows: false,
  });

  if (!highlights.length) return null;

  return (
    <section id="highlights" className="position-relative">
      
      {/* --- HEADER (Matches Overview Style) --- */}
      <div 
        className="d-flex align-items-center justify-content-between mb-4 pb-3"
        style={{ borderBottom: `1px solid ${color}20` }}
      >
        <div className="d-flex align-items-center">
          {/* Icon Circle */}
          <div 
            className="d-flex align-items-center justify-content-center me-3 rounded-circle"
            style={{ 
              width: '48px', 
              height: '48px', 
              backgroundColor: `${color}15`, 
              color: color 
            }}
          >
            <i className="fas fa-star fs-5"></i>
          </div>

          <div>
            <h2 className="h4 fw-bold mb-0 text-dark">
              <Translator text="Trip Highlights" targetLang={language} />
            </h2>
            <span 
              className="text-uppercase fw-bold" 
              style={{ fontSize: '0.7rem', color: '#999', letterSpacing: '1px' }}
            >
              <Translator text="Best Experiences" targetLang={language} />
            </span>
          </div>
        </div>

        {/* Navigation Arrows */}
        {navStatus.showArrows && (
          <div className="d-flex gap-2">
            <button
              className="nav-btn"
              onClick={() => swiperRef.current?.slidePrev()}
              disabled={navStatus.isBeginning}
              aria-label="Previous"
            >
              <i className="fas fa-chevron-left" />
            </button>
            <button
              className="nav-btn"
              onClick={() => swiperRef.current?.slideNext()}
              disabled={navStatus.isEnd}
              aria-label="Next"
            >
              <i className="fas fa-chevron-right" />
            </button>
          </div>
        )}
      </div>

      <div className="highlight-swiper-container">
        <Swiper
          modules={[Navigation, Autoplay]}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            setNavStatus({
              isBeginning: swiper.isBeginning,
              isEnd: swiper.isEnd,
              showArrows: !swiper.isBeginning || !swiper.isEnd,
            });
          }}
          onSlideChange={(swiper) => {
            setNavStatus({
              isBeginning: swiper.isBeginning,
              isEnd: swiper.isEnd,
              showArrows: !swiper.isBeginning || !swiper.isEnd,
            });
          }}
          spaceBetween={20}
          slidesPerView={1.1} 
          grabCursor={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true, 
          }}
          breakpoints={{
            640: { slidesPerView: 2.2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          className="pb-2"
        >
          {highlights.map((item, index) => (
            <SwiperSlide key={index} className="h-auto">
              <motion.div
                className="h-100 p-4 rounded-4 bg-white position-relative highlight-mini-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="d-flex flex-column h-100">
                  <div className="d-flex align-items-start gap-3 mb-3">
                    {/* Icon Container */}
                    <div
                      className="icon-box flex-shrink-0"
                      style={{
                        backgroundColor: `${color}15`, 
                        color: color,
                      }}
                    >
                      <i className={`${item.icon || "fas fa-star"} fs-5`} />
                    </div>

                    <h4
                      className="fw-bold mb-0 mt-1 text-dark"
                      style={{ fontSize: "1rem", lineHeight: "1.3" }}
                    >
                      <Translator text={item.title || ""} targetLang={language} />
                    </h4>
                  </div>

                  <div className="description-area flex-grow-1">
                    <p
                      className="text-muted mb-0 small"
                      style={{ lineHeight: "1.6" }}
                    >
                      <Translator
                        text={item.description || ""}
                        targetLang={language}
                      />
                    </p>
                  </div>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style jsx global>{`
        .letter-spacing-1 { letter-spacing: 1px; }

        /* Card Styles */
        .highlight-mini-card {
          border: 1px solid #f0f0f0;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }

        .highlight-mini-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.06);
          border-color: ${color}40;
        }

        /* Icon Styling */
        .icon-box {
          width: 48px; height: 48px;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          transition: 0.3s ease;
        }
        .highlight-mini-card:hover .icon-box { transform: scale(1.1); }

        /* Navigation Buttons */
        .nav-btn {
          width: 36px; height: 36px;
          border-radius: 50%;
          border: 1px solid #e0e0e0;
          background: white;
          color: #555;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: 0.2s all;
          font-size: 0.9rem;
        }
        .nav-btn:hover:not(:disabled) {
          background: ${color};
          color: white;
          border-color: ${color};
        }
        .nav-btn:active:not(:disabled) { transform: scale(0.95); }
        .nav-btn:disabled { opacity: 0.4; cursor: default; background: #f5f5f5; border-color: #eee; }

        .text-muted {
          color: #666 !important;
          text-transform: none;
          letter-spacing: unset;
          font-size: 0.9rem;
        }
      `}</style>
    </section>
  );
};

export default Highlights;