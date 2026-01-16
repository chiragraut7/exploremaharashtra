"use client";
import React from "react";
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
}

// -------------------- Component --------------------
const Attractions: React.FC<AttractionsProps> = ({ items = [], color = "#00aaff" }) => {
  const { language } = useLanguage();

  if (!items.length) return null;

  return (
    <section id="attractions" className="mb-5">
      <SectionTitle title="Top Attractions" color={color} />

      <div className="row g-0 rounded-4 overflow-hidden shadow-sm bg-white border content-box-compact">
        
        {/* 📸 LEFT: STICKY FEATURE IMAGE */}
        <div className="col-lg-4 p-0 bg-light">
          <div className="sticky-media-compact">
            <Image
              src={items[0]?.image || "/assets/images/attraction-placeholder.jpg"}
              alt="Main Attraction"
              fill
              className="object-cover"
              sizes="(max-width: 991px) 100vw, 33vw"
              priority
            />
            <div className="image-overlay-subtle" />
            
            {/* Minimalist Floating Label */}
            <div className="image-label-mini">
              <span className="badge-text-mini text-uppercase">
                <Translator text="Must See" targetLang={language} />
              </span>
            </div>
          </div>
        </div>

        {/* 🏛️ RIGHT: CONDENSED SCROLLABLE LIST */}
        <div className="col-lg-8">
          <div className="p-3 p-md-4">
            {items.map((item: Attraction, idx: number) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: 15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={`py-2 ${idx !== items.length - 1 ? 'border-bottom' : ''}`}
              >
                <div className="d-flex align-items-center">
                  {/* Circle Thumbnail */}
                  {item.image && (
                    <div className="flex-shrink-0 me-3 d-none d-sm-block">
                      <div className="position-relative rounded-circle overflow-hidden border border-2" style={{ width: '50px', height: '50px', borderColor: `${color}20` }}>
                        <Image src={item.image} alt={item.title || ""} fill className="object-cover" />
                      </div>
                    </div>
                  )}

                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-center">
                      <h3 className="h6 fw-bold mb-0" style={{ fontSize: '0.9rem' }}>
                        <Translator text={item.title || ""} targetLang={language} />
                      </h3>
                      {item.value && (
                        <span className="dist-badge" style={{ color: color, backgroundColor: `${color}10` }}>
                          <Translator text={item.value} targetLang={language} />
                        </span>
                      )}
                    </div>

                    <p className="text-muted mb-1 lh-sm" style={{ fontSize: '0.8rem' }}>
                      <Translator text={item.description || ""} targetLang={language} />
                    </p>

                    {item.label && (
                      <div className="d-flex align-items-center opacity-75" style={{ fontSize: '0.7rem' }}>
                        <i className={`${item.icon || 'fas fa-map-marker-alt'} me-1`} style={{ color }}></i>
                        <span className="fw-bold">
                          <Translator text={item.label} targetLang={language} />
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .content-box-compact { border-color: #eee !important; }

        .sticky-media-compact {
          position: sticky;
          top: 0;
          height: 100%;
          min-height: 350px;
          overflow: hidden;
        }

        .image-overlay-subtle {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.2), transparent);
        }

        .image-label-mini {
          position: absolute;
          bottom: 12px;
          left: 12px;
          background: rgba(0,0,0,0.6);
          padding: 2px 8px;
          border-radius: 4px;
          backdrop-filter: blur(4px);
        }

        .badge-text-mini { color: white; font-weight: 700; font-size: 0.6rem; letter-spacing: 1px; }

        .lh-sm { line-height: 1.3 !important; }
        
        .dist-badge {
          font-size: 0.65rem;
          padding: 1px 6px;
          border-radius: 3px;
          font-weight: 700;
        }

        @media (max-width: 991px) {
          .sticky-media-compact { height: 200px; position: relative; min-height: 200px; }
        }
      `}</style>
    </section>
  );
};

export default Attractions;