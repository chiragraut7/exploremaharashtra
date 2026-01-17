"use client";
import React from "react";
import { useLanguage } from "../context/LanguageContext";
import Translator from "../commonComponents/Translator";

interface BannerProps {
  title?: string;
  subtitle?: string;
  image?: string;
  view?: "info" | "hotels";
  setView?: (v: "info" | "hotels") => void;
  color?: string; // coming from JSON
}

const Banner: React.FC<BannerProps> = ({
  title = "No Title",
  subtitle = "",
  image = "",
  view = "info",
  setView,
  color = "#000000", // fallback color
}) => {
  const { language } = useLanguage(); // ✅ get selected language

  return (
    <div
      className="banner position-relative"
      style={{
        backgroundImage: image ? `url(${image})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* 🌓 Optional overlay */}
      <div className="position-absolute top-0 start-0 end-0 bottom-0 bg-black bg-opacity-50"></div>

      <div className="container position-relative z-10">
        <div className="row justify-content-between align-items-end">
          {/* 🏖️ Title & Subtitle */}
          <div className="col-auto">
            <div
              className="text-white px-3 pt-3 pb-1 mb-4 d-inline-block rounded-lg"
              style={{ backgroundColor: `${color}80` }} // semi-transparent bg
            >
              <h1 className="display-5 fw-bold mb-1">
                <Translator text={title} targetLang={language} />
              </h1>
              {subtitle && (
                <p className="lead mb-0">
                  <Translator text={subtitle} targetLang={language} />
                </p>
              )}
            </div>
          </div>

          {/* 🧭 Info / Hotels Buttons */}
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
