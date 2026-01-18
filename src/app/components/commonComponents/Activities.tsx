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
  category?: string; // Added category prop
}

// -------------------- Image Mapping --------------------
// Define your common images for each category here
const CATEGORY_THINGS_TO_DO_IMAGES: Record<string, string> = {
  beaches: "/assets/images/things-to-do-beach.png",
  forts: "/assets/images/things-to-do-fort.png",
  hills: "/assets/images/things-to-do-hill.png",
  nature: "/assets/images/things-to-do-wildlife.png",
  religious: "/assets/images/things-to-do-religious.png",
  culture: "/assets/images/things-to-do-cultural.png",
};

// -------------------- Component --------------------
const Activities: React.FC<ActivitiesProps> = ({ activities = [], color = "#00aaff", category = "" }) => {
  const { language } = useLanguage();

  if (!activities.length) return null;

  // Logic: Use mapped category image -> fall back to first activity image -> fall back to placeholder
  const displayImage = 
    CATEGORY_THINGS_TO_DO_IMAGES[category.toLowerCase()] || 
    activities[0]?.image || 
    "/assets/images/activity-placeholder.jpg";

  return (
    <section id="activities" className="mb-4">
      <SectionTitle title="Things to Do" color={color} />

      <div className="row g-0 rounded-4 overflow-hidden shadow-sm bg-white border flex-row-reverse">
        
        {/* 🏄‍♂️ RIGHT: COMPACT STICKY IMAGE */}
        <div className="col-lg-4 p-0 bg-dark">
          <div className="sticky-media-wrapper">
            <Image
              src={displayImage} // Using the dynamic image here
              alt="Activities"
              fill
              className="object-cover opacity-90"
              sizes="(max-width: 991px) 100vw, 33vw"
              priority
            />
            <div className="image-vignette" />
          </div>
        </div>

        {/* 📝 LEFT: CONDENSED LIST */}
        <div className="col-lg-8">
          <div className="p-3 p-md-4">
            {activities.map((activity: Activity, idx: number) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className={`py-2 ${idx !== activities.length - 1 ? 'border-bottom' : ''}`}
              >
                <div className="d-flex align-items-start">
                  {/* Small Activity Icon */}
                  <div className="activity-mini-icon me-3 mt-1" style={{ color, backgroundColor: `${color}10` }}>
                    <i className={`${activity.icon || "fas fa-star"} fs-6`}></i>
                  </div>
                  
                  <div className="flex-grow-1">
                    <h3 className="h6 fw-bold mb-1" style={{ fontSize: '0.95rem' }}>
                      <Translator text={activity.title || ""} targetLang={language} />
                    </h3>
                    
                    <p className="small text-muted mb-2 lh-sm" style={{ fontSize: '0.85rem' }}>
                      <Translator text={activity.description || ""} targetLang={language} />
                    </p>

                    {/* Ultra-Compact Detail Row */}
                    {activity.details?.length ? (
                      <div className="d-flex flex-wrap gap-x-3 gap-y-1">
                        {activity.details.map((detail: DetailItem, dIdx: number) => (
                          <div key={dIdx} className="d-flex align-items-center me-3" style={{ fontSize: '0.75rem' }}>
                            <i className={`${detail.icon} me-1 opacity-75`} style={{ color }}></i>
                            <span className="fw-bold me-1">
                              <Translator text={detail.label || ""} targetLang={language} />:
                            </span>
                            <span className="text-muted">
                              <Translator text={detail.value || ""} targetLang={language} />
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .sticky-media-wrapper {
          position: sticky;
          top: 0;
          height: 100%;
          min-height: 400px;
        }

        .image-vignette {
          position: absolute;
          inset: 0;
          background: linear-gradient(to left, rgba(0,0,0,0.2), transparent);
        }

        .activity-mini-icon {
          width: 28px;
          height: 28px;
          min-width: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
        }

        .lh-sm { line-height: 1.4 !important; }

        @media (max-width: 991px) {
          .sticky-media-wrapper { height: 200px; position: relative; }
        }
      `}</style>
    </section>
  );
};

export default Activities;