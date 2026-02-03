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
      <p key={i} className={`mb-2 ${isLead ? 'lead-text' : 'text-secondary'}`} style={{ lineHeight: '1.6', fontSize: isLead ? '0.95rem' : '0.85rem' }}>
        <Translator text={p} targetLang={language} />
      </p>
    ));
  };

  return (
    <section id="universal-features" className="mb-5 position-relative">
      
      {/* --- HEADER --- */}
      {content.title && (
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
            <i className="fas fa-list-ul fs-6"></i>
            </div>
            <div>
            <h2 className="h5 fw-bold mb-0 text-dark">
                <Translator text={content.title} targetLang={language} />
            </h2>
            <span className="text-uppercase fw-bold text-muted" style={{ fontSize: '0.65rem', letterSpacing: '0.5px' }}>
                <Translator text="Key Features" targetLang={language} />
            </span>
            </div>
        </div>
      )}

      <div className="row g-0 rounded-3 overflow-hidden shadow-sm bg-white border flex-lg-row-reverse">
        
        {/* 📸 RIGHT: STICKY IMAGE SIDEBAR */}
        <div className="col-lg-5 p-0 bg-light border-start">
          <div className="sticky-media-wrapper h-100 position-relative">
            <Image
              src={"/assets/images/nature-placeholder.jpg"}
              alt={content.title || "Feature Image"}
              fill
              className="object-cover"
              sizes="(max-width: 991px) 100vw, 40vw"
              priority
            />
            <div className="position-absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-50" />
            
            {content.items && (
                <div className="position-absolute bottom-0 end-0 m-3">
                    <span className="badge bg-black/50 backdrop-blur border border-white/20 text-white rounded-pill px-3 py-1" style={{fontSize: '0.7rem'}}>
                        {content.items.length} <Translator text="Points" targetLang={language} />
                    </span>
                </div>
            )}
          </div>
        </div>

        {/* 📝 LEFT: CONTENT LIST */}
        <div className="col-lg-7">
          <div className="p-0 h-100">
            
            {/* Intro Section */}
            {content.intro && (
                <div className="p-3 p-md-4 border-bottom">
                    {renderParagraphs(content.intro, true)}
                </div>
            )}

            {/* Feature List */}
            {content.items?.map((item: FeatureItem, idx: number) => {
                const isEven = idx % 2 === 0;
                return (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    
                    className={`feature-row p-3 position-relative ${isEven ? 'bg-white' : 'bg-light-subtle'}`}
                    style={{
                        borderLeft: isEven ? '4px solid transparent' : `4px solid ${color}`,
                        borderBottom: '1px solid #f0f0f0'
                    }}
                  >
                    <div className="d-flex align-items-start">
                      
                      {/* Index Number */}
                      <div className="me-3 mt-1 opacity-25 fw-black font-monospace d-none d-sm-block" style={{ fontSize: '1.2rem', lineHeight: 1 }}>
                        {String(idx + 1).padStart(2, '0')}
                      </div>

                      {/* Icon */}
                      <div className="flex-shrink-0 mt-1 me-3">
                        <div 
                            className="compact-icon shadow-sm" 
                            style={{ 
                                color: isEven ? color : '#fff', 
                                backgroundColor: isEven ? `${color}15` : color 
                            }}
                        >
                          <i className={item.icon || 'fas fa-check-circle'} />
                        </div>
                      </div>

                      <div className="flex-grow-1">
                        <h4 className="fw-bold mb-1 text-dark" style={{ fontSize: '0.9rem' }}>
                          <Translator text={item.title || ""} targetLang={language} />
                        </h4>
                        <p className="text-muted mb-0 lh-sm" style={{ fontSize: '0.8rem' }}>
                          <Translator text={item.description || ""} targetLang={language} />
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
            })}

            {/* Conclusion */}
            {content.conclusion && (
              <div className="p-3 p-md-4 bg-light-subtle border-top italic-conclusion">
                 {renderParagraphs(content.conclusion)}
              </div>
            )}
          </div>
        </div>

      </div>

      <style jsx>{`
        .sticky-media-wrapper {
          position: sticky;
          top: 0;
          height: 100%;
          min-height: 350px;
        }

        .object-cover { object-fit: cover; }
        .bg-light-subtle { background-color: #f8f9fa; }
        .lead-text { font-weight: 600; color: #333; }

        /* Feature Row Hover */
        .feature-row { transition: background 0.2s ease; }
        .feature-row:hover { background-color: #f1f3f5 !important; }

        /* Compact Icon */
        .compact-icon {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          font-size: 0.8rem;
          transition: transform 0.2s;
        }
        .feature-row:hover .compact-icon { transform: scale(1.1); }

        .italic-conclusion { font-style: italic; font-size: 0.8rem; opacity: 0.8; }

        @media (max-width: 991px) {
          .sticky-media-wrapper { height: 200px; position: relative; min-height: 200px; }
        }
      `}</style>
    </section>
  );
};

export default UniversalContent;