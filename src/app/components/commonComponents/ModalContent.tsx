'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Translator from './Translator';
import { useLanguage } from '../context/LanguageContext';
import type { ModalData, ModalSection } from '@/type/types';

// Updated Interface to accept an optional 'image' prop
interface ModalContentProps {
  modal: ModalData;
  image?: string | null; // NEW: optional image prop
}

const ModalContent: React.FC<ModalContentProps> = ({ modal, image }) => {
  const { language } = useLanguage();

  if (!modal) return null;

  const sections: ModalSection[] =
    modal.sections ??
    Object.keys(modal)
      .filter((key) => key.startsWith('content'))
      .map((key) => ({ type: 'html', html: (modal as any)[key] }));

  // Logic to determine which image to show: 
  // 1. The passed 'image' prop (from parent)
  // 2. The 'mainImage' inside the modal data (if exists)
  // 3. Fallback to null (which triggers gradient)
  const heroImage = image 
    ? `/assets/images/bannerImages/${image}` // Construct path if filename passed
    : modal.mainImage;

  return (
    <div className="modal-premium-layout">
      {/* 1. Cinematic Hero Section */}
      <div className="modal-hero-container">
        {heroImage ? (
          <img src={heroImage} alt={modal.title} className="hero-bg" />
        ) : (
          <div className="hero-bg-gradient" />
        )}
        
        {/* Overlay for text readability */}
        <div className="hero-glass-overlay">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hero-content-text"
          >
            <span className="category-badge mb-2">
              <Translator text="Historical Discovery" targetLang={language} />
            </span>
            <h2 className="modal-main-title">
              <Translator text={modal.title} targetLang={language} />
            </h2>
          </motion.div>
        </div>
      </div>

      <div className="container-fluid px-4 px-lg-4 py-4">
        <div className="row g-4">
          {/* 2. Main Narrative (Left) */}
          <div className="col-lg-12 order-2 order-lg-1">
            <div className="article-body">
              {sections.map((section, index) => {
                switch (section.type) {
                  case 'h4':
                    return (
                      <h4 key={index} className={`accent-heading ${section.class || ''}`}>
                        <Translator text={section.text ?? ''} targetLang={language} />
                      </h4>
                    );
                  case 'p':
                    return (
                      <p key={index} className={`article-para ${section.class || ''}`}>
                        <Translator text={section.text ?? ''} targetLang={language} />
                      </p>
                    );
                  case 'ul':
                    return (
                      <ul key={index} className="premium-list">
                        {section.items?.map((item, i) => (
                          <li key={i}>
                            <i className="fas fa-arrow-right text-orange me-2"></i>
                            <Translator text={item} targetLang={language} />
                          </li>
                        ))}
                      </ul>
                    );
                  case 'html':
                    return (
                      <div
                        key={index}
                        className="custom-html-wrapper"
                        dangerouslySetInnerHTML={{ __html: section.html ?? '' }}
                      />
                    );
                  default:
                    return null;
                }
              })}
            </div>
          </div>

          {/* 3. Quick Stats Sidebar (Right) */}
          {/* <div className="col-lg-4 order-1 order-lg-2">
            <div className="stats-sidebar shadow-sm p-4">
              <h6 className="sidebar-label">
                <Translator text="Timeline & Details" targetLang={language} />
              </h6>
              <div className="detail-row">
                <i className="fas fa-hourglass-start"></i>
                <div>
                  <label><Translator text="Period" targetLang={language} /></label>
                  <p>{modal.year || 'N/A'}</p>
                </div>
              </div>
              <div className="detail-row">
                <i className="fas fa-map-marker-alt"></i>
                <div>
                  <label><Translator text="Region" targetLang={language} /></label>
                  <p>{modal.location || 'Maharashtra'}</p>
                </div>
              </div>
              <button className="cta-button-orange w-100 mt-3">
                 <Translator text="Plan a Visit" targetLang={language} />
              </button>
            </div>
          </div> */}
        </div>
      </div>

      <style jsx>{`
        .modal-hero-container {
          height: 380px;
          position: relative;
          background: #000;
          overflow: hidden; /* Ensure image doesn't bleed out */
        }
        .hero-bg { 
          width: 100%; 
          height: 100%; 
          object-fit: cover; 
          opacity: 0.8; 
        }
        .hero-bg-gradient { width: 100%; height: 100%; background: linear-gradient(135deg, #1a1a1a, #ff5722); }
        
        .hero-glass-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 60%, transparent 100%);
          display: flex; align-items: flex-end; padding: 30px;
        }
        .modal-main-title { color: white; font-weight: 800; font-size: 2rem; letter-spacing: -1px; text-shadow: 0 2px 10px rgba(0,0,0,0.5); margin-top: 10px; }
        .category-badge { 
          display: inline-block; background: #ff5722; color: white; 
          padding: 4px 12px; border-radius: 4px; font-size: 0.75rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.5px;
        }

        .accent-heading { 
          font-weight: 700; color: var(--primary-color) !important; margin-top: 1rem; 
          border-left: 4px solid var(--primary-color) !important; padding-left: 1rem; 
        }
        .article-para { color: #555; line-height: 1.8; font-size: 1rem; margin-bottom: 1.5rem; }
        .premium-list { list-style: none; padding-left: 0; }
        .premium-list li { padding: 8px 0; border-bottom: 1px solid #f0f0f0; color: #444; font-size: 1rem !important; }

        .stats-sidebar { 
          background: #fff; border: 1px solid #eee; border-radius: 16px; 
          position: sticky; top: 20px; 
        }
        .sidebar-label { color: #999; text-transform: uppercase; font-size: 0.7rem; font-weight: 800; letter-spacing: 1px; margin-bottom: 1.5rem; }
        .detail-row { display: flex; gap: 15px; margin-bottom: 20px; }
        .detail-row i { color: #ff5722; font-size: 1.2rem; margin-top: 3px; }
        .detail-row label { display: block; font-size: 0.75rem; color: #888; margin: 0; text-transform: uppercase; }
        .detail-row p { font-weight: 700; color: #333; margin: 0; font-size: 1.1rem; }

        .cta-button-orange {
          background: #ff5722; color: white; border: none; padding: 12px;
          border-radius: 8px; font-weight: 700; transition: 0.3s;
        }
        .cta-button-orange:hover { background: #e64a19; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(230, 74, 25, 0.3); }
        
        @media (max-width: 768px) {
            .modal-hero-container { height: 250px; }
            .hero-glass-overlay { padding: 20px; }
            .modal-main-title { font-size: 1.8rem; }
        }
      `}</style>
    </div>
  );
};

export default ModalContent;