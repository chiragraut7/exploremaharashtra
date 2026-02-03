"use client";
import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../context/LanguageContext"; // Added context
import Translator from "../commonComponents/Translator"; // Added translator

interface GalleryImage {
  src?: string;
  thumb?: string;
  alt?: string;
  author?: string;
  location?: string;
}

interface GalleryProps {
  images?: GalleryImage[];
  color?: string;
}

const FALLBACK_IMAGE = "/assets/images/FFFFFF.svg";

const Gallery: React.FC<GalleryProps> = ({ images = [], color = "#00aaff" }) => {
  const { language } = useLanguage(); // Use context for translations
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  const validImages = images.filter((img) => img.src || img.thumb);
  const displayImages = validImages.slice(0, 5);
  const remainingCount = validImages.length - 5;

  useEffect(() => {
    setMounted(true);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    if (selectedImageIndex !== null) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedImageIndex]);

  useEffect(() => {
    if (selectedImageIndex !== null && thumbnailsRef.current) {
      const activeThumb = thumbnailsRef.current.children[selectedImageIndex] as HTMLElement;
      if (activeThumb) {
        activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [selectedImageIndex]);

  if (validImages.length === 0) return null;

  // --- ACTIONS ---
  const openLightbox = (index: number) => setSelectedImageIndex(index);
  const closeLightbox = () => setSelectedImageIndex(null);

  const handleNext = (e?: any) => {
    e?.stopPropagation();
    setSelectedImageIndex((prev) => 
      prev === null ? null : (prev === validImages.length - 1 ? 0 : prev + 1)
    );
  };

  const handlePrev = (e?: any) => {
    e?.stopPropagation();
    setSelectedImageIndex((prev) => 
      prev === null ? null : (prev === 0 ? validImages.length - 1 : prev - 1)
    );
  };

  const handleImageError = (index: number) => {
    setImageErrors((prev) => ({ ...prev, [index]: true }));
  };

  const getImageSrc = (img: GalleryImage, index: number) => {
    if (imageErrors[index]) return FALLBACK_IMAGE;
    return img.src || img.thumb || FALLBACK_IMAGE;
  };

  // --- LIGHTBOX CONTENT ---
  const lightboxContent = (
    <AnimatePresence>
      {selectedImageIndex !== null && validImages[selectedImageIndex] && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="lightbox-overlay"
        >
          {/* --- TOP BAR --- */}
          <div className="lb-top-bar">
            <div className="lb-counter">
              {selectedImageIndex + 1} / {validImages.length}
            </div>
            <div className="lb-actions">
              <button className="action-btn close-btn" onClick={closeLightbox} title="Close">
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>

          {/* --- MAIN STAGE --- */}
          <div className="lb-main-stage" onClick={closeLightbox}>
            <button className="nav-arrow prev" onClick={(e) => { e.stopPropagation(); handlePrev(); }}>
              <i className="fas fa-arrow-left"></i>
            </button>

            <div className="lb-image-wrapper" onClick={(e) => e.stopPropagation()}>
              <motion.div
                key={selectedImageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="img-container"
              >
                <Image
                  src={getImageSrc(validImages[selectedImageIndex], selectedImageIndex)}
                  alt="Fullscreen view"
                  fill
                  className="object-contain"
                  quality={100}
                  priority
                  onError={() => handleImageError(selectedImageIndex)}
                />
              </motion.div>
              
              <div className="lb-caption">
                <p className="caption-line">
                  <span className="text-white-50">Photo by - </span> 
                  {validImages[selectedImageIndex].author || "Unknown"}
                </p>
                <p className="caption-line">
                  <span className="text-white-50">Location - </span> 
                  {validImages[selectedImageIndex].location || validImages[selectedImageIndex].alt || "Unknown"}
                </p>
              </div>
            </div>

            <button className="nav-arrow next" onClick={(e) => { e.stopPropagation(); handleNext(); }}>
              <i className="fas fa-arrow-right"></i>
            </button>
          </div>

          {/* --- BOTTOM THUMBNAIL STRIP --- */}
          <div className="lb-bottom-strip" onClick={(e) => e.stopPropagation()}>
            <div className="thumbnails-track" ref={thumbnailsRef}>
              {validImages.map((img, idx) => (
                <div 
                  key={idx} 
                  className={`thumb-item ${selectedImageIndex === idx ? 'active' : ''}`}
                  onClick={() => setSelectedImageIndex(idx)}
                >
                  <Image 
                    src={getImageSrc(img, idx)} 
                    alt={`Thumb ${idx}`} 
                    width={100} 
                    height={70} 
                    className="thumb-img" 
                  />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <section id="gallery" className="mb-5 position-relative">
        
        {/* --- PREMIUM HEADER --- */}
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
            <i className="fas fa-images fs-6"></i>
          </div>
          <div>
            <h2 className="h5 fw-bold mb-0 text-dark">
              <Translator text="Visual Experience" targetLang={language} />
            </h2>
            <span className="text-uppercase fw-bold text-muted" style={{ fontSize: '0.65rem', letterSpacing: '0.5px' }}>
              <Translator text="Gallery & Moments" targetLang={language} />
            </span>
          </div>
        </div>

        <div className="container-fluid px-0">
          <div className="row g-2">
            
            {/* LEFT: Featured Image */}
            <div className="col-md-6">
              {displayImages[0] && (
                <motion.div 
                  whileHover={{ scale: 0.995 }} 
                  className="gallery-item-wrapper h-100" 
                  onClick={() => openLightbox(0)}
                >
                  <div className="gallery-box featured-box rounded-4 border overflow-hidden position-relative" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <Image 
                      src={getImageSrc(displayImages[0], 0)} 
                      alt="Featured" 
                      fill 
                      className="object-cover" 
                      sizes="(max-width: 768px) 100vw, 50vw" 
                      priority 
                      onError={() => handleImageError(0)}
                    />
                    <div className="hover-overlay">
                      <div className="icon-circle bg-white/20 backdrop-blur">
                        <i className="fas fa-expand-alt text-white"></i>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* RIGHT: Grid Images */}
            <div className="col-md-6">
              <div className="row g-2 h-100">
                {displayImages.slice(1).map((img, idx) => {
                  const actualIndex = idx + 1;
                  const isLastVisible = idx === 3;
                  return (
                    <div key={actualIndex} className="col-6">
                      <motion.div 
                        whileHover={{ scale: 0.98 }} 
                        className="h-100" 
                        onClick={() => openLightbox(actualIndex)}
                      >
                        <div className="gallery-box sub-box rounded-4 border overflow-hidden position-relative" style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                          <Image 
                            src={getImageSrc(img, actualIndex)} 
                            alt="Thumb" 
                            fill 
                            className="object-cover" 
                            sizes="(max-width: 768px) 50vw, 25vw" 
                            onError={() => handleImageError(actualIndex)}
                          />
                          <div className="hover-overlay">
                            <i className="fas fa-plus text-white fs-5"></i>
                          </div>
                          
                          {/* Counter Overlay for last item */}
                          {isLastVisible && remainingCount > 0 && (
                            <div className="more-images-overlay">
                              <span className="h4 mb-0 fw-bold">+{remainingCount}</span>
                              <span className="small text-uppercase"><Translator text="More" targetLang={language} /></span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </div>
                  );
                })}
                {/* Empty State Fillers */}
                {Array.from({ length: Math.max(0, 4 - (displayImages.length - 1)) }).map((_, i) => (
                    <div key={`fill-${i}`} className="col-6">
                      <div className="gallery-box sub-box rounded-4 border bg-light opacity-25"></div>
                    </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Render Lightbox via Portal */}
      {mounted && createPortal(lightboxContent, document.body)}

      <style jsx>{`
        /* --- MAIN GALLERY GRID --- */
        .gallery-box { position: relative; width: 100%; background-color: #f0f0f0; cursor: pointer; }
        .featured-box { height: 416px; }
        .sub-box { height: 204px; }
        
        .object-cover { object-fit: cover; transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
        .gallery-box:hover .object-cover { transform: scale(1.1); }
        
        .hover-overlay { 
          position: absolute; inset: 0; 
          background: rgba(0, 0, 0, 0.3); 
          display: flex; align-items: center; justify-content: center; 
          opacity: 0; transition: opacity 0.3s; z-index: 2; 
        }
        .gallery-box:hover .hover-overlay { opacity: 1; }

        .more-images-overlay { 
          position: absolute; inset: 0; 
          background: rgba(0, 0, 0, 0.6); 
          color: white; 
          display: flex; flex-direction: column; align-items: center; justify-content: center; 
          z-index: 3; backdrop-filter: blur(2px); 
        }

        /* ========================================= */
        /* LIGHTBOX STYLES                         */
        /* ========================================= */
        
        .lightbox-overlay {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
          background: #000;
          z-index: 999999;
          display: flex; flex-direction: column;
        }

        /* TOP BAR */
        .lb-top-bar {
          height: 60px; width: 100%;
          display: flex; justify-content: space-between; align-items: center;
          padding: 0 20px;
          color: #fff;
          background: rgba(0,0,0,0.3);
          z-index: 1000;
        }
        .lb-counter { font-size: 1rem; font-weight: 500; opacity: 0.9; }
        .action-btn { background: none; border: none; color: #fff; opacity: 0.8; font-size: 1.5rem; cursor: pointer; transition: 0.2s; }
        .action-btn:hover { opacity: 1; transform: scale(1.1); }

        /* MAIN STAGE */
        .lb-main-stage {
          flex: 1;
          position: relative;
          display: flex; align-items: center; justify-content: center;
          overflow: hidden;
        }

        .nav-arrow {
          position: absolute; background: transparent; border: none;
          color: rgba(255,255,255,0.7); font-size: 1.5rem; padding: 20px;
          cursor: pointer; z-index: 100; transition: 0.2s;
        }
        .nav-arrow:hover { color: #fff; transform: scale(1.2); }
        .prev { left: 10px; }
        .next { right: 10px; }

        .lb-image-wrapper {
          position: relative; width: 100%; height: 100%;
          max-width: 90vw; max-height: calc(100vh - 180px);
          display: flex; flex-direction: column; align-items: center; justify-content: center;
        }
        .img-container { position: relative; width: 100%; height: 100%; }
        .object-contain { object-fit: contain; }

        .lb-caption { margin-top: 15px; text-align: center; color: #fff; font-size: 0.9rem; }
        .caption-line { margin: 0; line-height: 1.4; }

        /* BOTTOM STRIP */
        .lb-bottom-strip {
          height: 100px; width: 100%;
          background: #000; border-top: 1px solid #222;
          display: flex; align-items: center; justify-content: center;
          padding: 10px 0; z-index: 1000;
        }
        .thumbnails-track {
          display: flex; gap: 2px; overflow-x: auto; height: 100%; max-width: 95vw;
          align-items: center; scrollbar-width: none;
        }
        .thumbnails-track::-webkit-scrollbar { display: none; }

        .thumb-item {
          width: 80px; height: 60px; flex-shrink: 0; cursor: pointer;
          opacity: 0.5; transition: all 0.2s ease; border: 2px solid transparent;
        }
        .thumb-item:hover { opacity: 0.8; }
        .thumb-item.active { opacity: 1; border: 2px solid #e74c3c; transform: scale(1.05); z-index: 10; }
        .thumb-img { width: 100%; height: 100%; object-fit: cover; }

        @media (max-width: 767px) {
          .featured-box { height: 300px; }
          .sub-box { height: 140px; }
          .nav-arrow { font-size: 1.2rem; padding: 10px; }
          .lb-bottom-strip { height: 70px; }
          .thumb-item { width: 60px; height: 45px; }
        }
      `}</style>
    </>
  );
};

export default Gallery;