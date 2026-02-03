"use client";
import React from "react";
import Image from "next/image";
import SectionTitle from "./SectionTitle";
import { useLanguage } from "../context/LanguageContext";
import Translator from "../commonComponents/Translator";
import { motion } from "framer-motion";

// -------------------- Interfaces --------------------
interface DetailItem {
  icon?: string;
  label?: string;
  value?: string;
}

interface Activity {
  icon?: string;
  title?: string;
  description?: string;
  details?: DetailItem[];
  image?: string; 
}

interface ActivitiesProps {
  activities?: Activity[];
  color?: string;
  category?: string;
}

// -------------------- Image Mapping --------------------
const CATEGORY_THINGS_TO_DO_IMAGES: Record<string, string> = {
  beaches: "/assets/images/things-to-do-beach.png",
  forts: "/assets/images/things-to-do-fort.png",
  hills: "/assets/images/things-to-do-hill.png",
  nature: "/assets/images/things-to-do-wildlife.png",
  religious: "/assets/images/things-to-do-religious.png",
  culture: "/assets/images/things-to-do-cultural.png",
};

const Activities: React.FC<ActivitiesProps> = ({ activities = [], color = "#00aaff", category = "" }) => {
  const { language } = useLanguage();

  if (!activities.length) return null;

  const displayImage = 
    CATEGORY_THINGS_TO_DO_IMAGES[category.toLowerCase()] || 
    activities[0]?.image || 
    "/assets/images/activity-placeholder.jpg";

  return (
    <section id="activities" className="mb-5 position-relative">
      
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
          <i className="fas fa-person-running fs-6"></i>
        </div>
        <div>
          <h2 className="h5 fw-bold mb-0 text-dark">
            <Translator text="Things to Do" targetLang={language} />
          </h2>
          <span className="text-uppercase fw-bold text-muted" style={{ fontSize: '0.65rem', letterSpacing: '0.5px' }}>
            <Translator text="Experiences" targetLang={language} />
          </span>
        </div>
      </div>

      <div className="row g-0 rounded-3 overflow-hidden shadow-sm bg-white border flex-lg-row-reverse">
        
        {/* 🖼️ RIGHT: IMAGE */}
        <div className="col-lg-5 p-0 bg-light border-start">
          <div className="sticky-media-wrapper h-100 position-relative">
            <Image
              src={displayImage}
              alt="Activities"
              fill
              className="object-cover"
              sizes="(max-width: 991px) 100vw, 40vw"
              priority
            />
            <div className="position-absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-50" />
            <div className="position-absolute bottom-0 end-0 m-3">
                <span className="badge bg-black/50 backdrop-blur border border-white/20 text-white rounded-pill px-3 py-1" style={{fontSize: '0.7rem'}}>
                    {activities.length} <Translator text="Items" targetLang={language} />
                </span>
            </div>
          </div>
        </div>

        {/* 📝 LEFT: LIST */}
        <div className="col-lg-7">
          <div className="p-0 h-100">
            {activities.map((activity: Activity, idx: number) => {
              const isEven = idx % 2 === 0;

              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  
                  className={`activity-row p-3 position-relative ${isEven ? 'bg-white' : 'bg-light-subtle'}`}
                  style={{
                    borderLeft: isEven ? '4px solid transparent' : `4px solid ${color}`,
                    borderBottom: '1px solid #f0f0f0'
                  }}
                >
                  <div className="d-flex align-items-center">
                    
                    {/* Index Number (Visual Separator) */}
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
                      <i className={`${activity.icon || "fas fa-star"}`}></i>
                    </div>
                    
                    <div className="flex-grow-1 overflow-hidden">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                          {/* Title */}
                          <h3 className="fw-bold mb-0 text-dark text-truncate" style={{ fontSize: '0.95rem' }}>
                              <Translator text={activity.title || ""} targetLang={language} />
                          </h3>
                          
                          {/* Desktop Details */}
                          {activity.details && activity.details.length > 0 && (
                              <div className="d-none d-sm-flex gap-2">
                                  {activity.details.slice(0, 2).map((d, i) => (
                                      <span key={i} className="badge border fw-normal text-muted" style={{fontSize: '0.65rem', backgroundColor: '#fff'}}>
                                          <i className={d.icon} style={{color, marginRight: '4px'}}></i>
                                          <Translator text={d.value || ""} targetLang={language} />
                                      </span>
                                  ))}
                              </div>
                          )}
                      </div>
                      
                      {/* Description */}
                      <p className="text-secondary mb-0 text-truncate" style={{ fontSize: '0.8rem' }}>
                        <Translator text={activity.description || ""} targetLang={language} />
                      </p>
                      
                      {/* Mobile Details Row */}
                      {activity.details && activity.details.length > 0 && (
                          <div className="d-flex d-sm-none gap-2 mt-2">
                               {activity.details.slice(0, 2).map((d, i) => (
                                  <span key={i} className="text-muted small d-flex align-items-center gap-1" style={{fontSize: '0.65rem'}}>
                                      <i className={d.icon} style={{color}}></i>
                                      <Translator text={d.value || ""} targetLang={language} />
                                  </span>
                              ))}
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
        .activity-row {
            transition: background-color 0.2s ease;
        }
        .activity-row:hover {
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
        
        .activity-row:hover .compact-icon {
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

export default Activities;