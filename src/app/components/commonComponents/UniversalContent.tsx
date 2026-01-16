"use client";
import React from "react";
import Image from "next/image";
import SectionTitle from "./SectionTitle";
import { useLanguage } from "../context/LanguageContext";
import Translator from "../commonComponents/Translator";
import { motion } from "framer-motion";

// -------------------- Interfaces --------------------
interface FeatureItem {
  icon?: string;
  title?: string;
  description?: string;
}

interface UniversalContentProps {
  content?: {
    title?: string;
    intro?: string | string[];
    items?: FeatureItem[];
    conclusion?: string | string[];
    mainImage?: string; 
  };
  color?: string;
}

const UniversalContent: React.FC<UniversalContentProps> = ({ content, color = "#00aaff" }) => {
  const { language } = useLanguage();

  if (!content) return null;

  const renderParagraphs = (text?: string | string[], isLead = false) => {
    if (!text) return null;
    const paragraphs = Array.isArray(text) ? text : [text];
    return paragraphs.map((p, i) => (
      <p key={i} className={`${isLead ? 'lead-text-compact' : 'body-text-compact'} mb-2`}>
        <Translator text={p} targetLang={language} />
      </p>
    ));
  };

  return (
    <section id="universal-features" className="mb-5">
      {/* 🏔️ Section Title */}
      {content.title && <SectionTitle title={content.title} color={color} />}

      <div className="row g-0 rounded-4 overflow-hidden shadow-sm bg-white border content-box-compact">
        
        {/* 📝 LEFT: CONDENSED LIST & NARRATIVE */}
        <div className="col-lg-8 order-2 order-lg-1">
          <div className="p-3 p-md-4">
            
            <div className="intro-compact mb-3">
               {renderParagraphs(content.intro, true)}
            </div>

            {content.items?.length ? (
              <div className="feature-list">
                {content.items.map((item: FeatureItem, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className={`py-2 ${idx !== content.items!.length - 1 ? 'border-bottom' : ''}`}
                  >
                    <div className="d-flex align-items-start">
                      <div className="flex-shrink-0 mt-1">
                        <div className="icon-mini-box" style={{ color: color, backgroundColor: `${color}15` }}>
                          <i className={item.icon || 'fas fa-check-circle'} />
                        </div>
                      </div>
                      <div className="flex-grow-1 ms-3">
                        <h4 className="fw-bold mb-1" style={{ fontSize: '0.9rem' }}>
                          <Translator text={item.title || ""} targetLang={language} />
                        </h4>
                        <p className="text-muted mb-0 lh-sm" style={{ fontSize: '0.8rem' }}>
                          <Translator text={item.description || ""} targetLang={language} />
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : null}

            {content.conclusion && (
              <div className="mt-4 pt-2 border-top italic-conclusion-compact">
                 {renderParagraphs(content.conclusion)}
              </div>
            )}
          </div>
        </div>

        {/* 📸 RIGHT: STICKY IMAGE SIDEBAR */}
        <div className="col-lg-4 p-0 order-1 order-lg-2">
          <div className="sticky-media-compact">
            <Image
              src={content.mainImage || "/assets/images/nature-placeholder.jpg"}
              alt={content.title || "Feature Image"}
              fill
              className="object-cover"
              sizes="(max-width: 991px) 100vw, 33vw"
              priority
            />
            <div className="image-overlay-subtle" />
            <div className="image-label-mini">
              <span className="badge-text-mini text-uppercase">
                <Translator text="Regional Data" targetLang={language} />
              </span>
            </div>
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
          background: linear-gradient(to right, rgba(0,0,0,0.1), transparent); 
        }

        .image-label-mini { 
          position: absolute; 
          bottom: 12px; 
          right: 12px; 
          background: rgba(0,0,0,0.6); 
          padding: 2px 8px; 
          border-radius: 4px; 
        }

        .badge-text-mini { color: white; font-weight: 700; font-size: 0.6rem; letter-spacing: 1px; }

        .lead-text-compact { font-size: 0.95rem; font-weight: 600; color: #333; line-height: 1.4; }
        .body-text-compact { color: #666; line-height: 1.4; font-size: 0.85rem; }

        .icon-mini-box {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          font-size: 0.8rem;
        }

        .lh-sm { line-height: 1.3 !important; }
        .italic-conclusion-compact { font-style: italic; font-size: 0.8rem; opacity: 0.7; }

        @media (max-width: 991px) {
          .sticky-media-compact { height: 200px; position: relative; min-height: 200px; }
        }
      `}</style>
    </section>
  );
};

export default UniversalContent;