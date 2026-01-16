"use client";
import React from "react";
import Image from "next/image";
import SectionTitle from "./SectionTitle";
import { motion } from "framer-motion";

interface GalleryImage {
  src?: string;
  thumb?: string;
  alt?: string;
}

interface GalleryProps {
  images?: GalleryImage[];
  color?: string;
}

const Gallery: React.FC<GalleryProps> = ({ images = [], color = "#00aaff" }) => {
  const validImages = images.filter(img => img.src || img.thumb);
  if (validImages.length === 0) return null;
  const displayImages = validImages.slice(0, 5);

  return (
    <section id="gallery" className="mb-5">
      <SectionTitle title="Visual Experience" color={color} />

      <div className="container-fluid px-0">
        <div className="row g-2">
          
          {/* 📸 LEFT: FEATURED IMAGE */}
          <div className="col-md-6">
            <motion.div 
              whileHover={{ scale: 0.99 }}
              className="gallery-item-wrapper"
            >
              <div className="aspect-ratio-box featured-box rounded-4 border overflow-hidden shadow-sm">
                <Image
                  src={displayImages[0].src || displayImages[0].thumb || ""}
                  alt={displayImages[0].alt || "Featured"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            </motion.div>
          </div>

          {/* 🧩 RIGHT: 4-IMAGE GRID */}
          <div className="col-md-6">
            <div className="row g-2">
              {displayImages.slice(1).map((img, idx) => (
                <div key={idx} className="col-6">
                  <motion.div whileHover={{ scale: 0.98 }}>
                    <div className="aspect-ratio-box sub-box rounded-4 border overflow-hidden shadow-sm">
                      <Image
                        src={img.src || img.thumb || ""}
                        alt={img.alt || `Gallery ${idx}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    </div>
                  </motion.div>
                </div>
              ))}
              
              {/* If fewer than 5 images, fill space with a placeholder */}
              {Array.from({ length: Math.max(0, 5 - displayImages.length) }).map((_, i) => (
                <div key={`fill-${i}`} className="col-6">
                  <div className="aspect-ratio-box sub-box rounded-4 border bg-light d-flex align-items-center justify-content-center opacity-50">
                    <i className="fas fa-image text-muted fa-2x"></i>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      <style jsx>{`
        /* The container determines the height */
        .gallery-item-wrapper {
          width: 100%;
          height: 100%;
        }

        .aspect-ratio-box {
          position: relative;
          width: 100%;
          background-color: #f5f5f5;
        }

        /* Large box height for Desktop */
        .featured-box {
          height: 412px;
        }

        /* Small box height for Desktop (202px * 2 + 8px gap = 412px) */
        .sub-box {
          height: 202px;
        }

        .object-cover {
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .aspect-ratio-box:hover .object-cover {
          transform: scale(1.08);
        }

        /* Responsive Fixes for Mobile */
        @media (max-width: 767px) {
          .featured-box {
            height: 280px;
          }
          .sub-box {
            height: 136px;
          }
        }
      `}</style>
    </section>
  );
};

export default Gallery;