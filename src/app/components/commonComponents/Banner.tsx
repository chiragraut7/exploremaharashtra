"use client";
import React from "react";
import { useLanguage } from "../context/LanguageContext";
import Translator from "../commonComponents/Translator";

// ✅ 1. Define your common images map here
const CATEGORY_BANNERS: Record<string, string> = {
  beaches: "/assets/images/beachHomeBanner.jpg",
  forts: "/assets/images/fortsHomeBanner.jpg",
  hills: "/assets/images/hillsHomeBanner.jpg",
  nature: "/assets/images/natureHomeBanner.jpg",
  religious: "/assets/images/religiousHomeBanner.jpg",
  culture: "/assets/images/culturalHomeBanner.jpg",
  
  // Aliases (just in case your data uses slightly different names)
  wildlife: "/assets/images/natureHomeBanner.jpg",
  "hill stations": "/assets/images/hillsHomeBanner.jpg",
};

interface BannerProps {
  title?: string;
  subtitle?: string;
  image?: string;
  category?: string; // ✅ Added category prop
  view?: "info" | "hotels";
  setView?: (v: "info" | "hotels") => void;
  color?: string;
}

const Banner: React.FC<BannerProps> = ({
  title = "No Title",
  subtitle = "",
  image = "",
  category = "", // ✅ Receive category
  view = "info",
  setView,
  color = "#000000",
}) => {
  const { language } = useLanguage();

  // ✅ Logic: Try to find a category image first. 
  // If not found, fall back to the 'image' prop, then a default placeholder.
  const categoryKey = category?.toLowerCase().trim() || "";
  const displayImage = CATEGORY_BANNERS[categoryKey] || image || "/assets/images/default-banner.jpg";

  return (
    <div
      className="banner position-relative"
      style={{
        // ✅ UNCOMMENTED and linked to our dynamic image
        backgroundImage: `url(${displayImage})`,
        
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        
        // ✅ Added minHeight so the banner is actually visible and looks good
        minHeight: "60vh", 
        display: "flex",
        alignItems: "flex-end",
      }}
    >
      {/* 🌓 Optional overlay */}
      <div className="position-absolute top-0 start-0 end-0 bottom-0 bg-black bg-opacity-50"></div>

      <div className="container position-relative z-10 pb-5">
        <div className="row justify-content-between align-items-end">
          {/* 🏖️ Title & Subtitle */}
          <div className="col-auto">
            <div
              className="text-white px-4 py-3 mb-4 d-inline-block rounded-4"
              style={{ 
                backgroundColor: `${color}95`, // increased opacity slightly for readability
                backdropFilter: "blur(4px)" // added blur for modern look
              }}
            >
              <h1 className="display-4 fw-bold mb-1">
                <Translator text={title} targetLang={language} />
              </h1>
              {subtitle && (
                <p className="lead mb-0">
                  <Translator text={subtitle} targetLang={language} />
                </p>
              )}
            </div>
          </div>

          {/* 🧭 Info / Hotels Buttons (Commented out as per your code) */}
          {/*<div className="col-auto">
            <div className="btn-group mb-4">
              <button
                onClick={() => setView && setView("info")}
                className="btn"
                style={{
                  borderColor: color,
                  backgroundColor: view === "info" ? color : "transparent",
                  color: view === "info" ? "#fff" : color,
                  fontWeight: 500,
                }}
              >
                <i className="fa-solid fa-compass me-1"></i>{" "}
                <Translator text="Info" targetLang={language} />
              </button>

              <button
                onClick={() => setView && setView("hotels")}
                className="btn"
                style={{
                  borderColor: color,
                  backgroundColor: view === "hotels" ? color : "transparent",
                  color: view === "hotels" ? "#fff" : color,
                  fontWeight: 500,
                }}
              >
                <i className="fa-solid fa-bed me-1"></i>{" "}
                <Translator text="Hotels" targetLang={language} />
              </button>
            </div>
          </div>*/}
        </div>
      </div>
    </div>
  );
};

export default Banner;