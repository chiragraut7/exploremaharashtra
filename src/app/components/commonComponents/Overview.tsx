"use client";
import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import Translator from "../commonComponents/Translator";

interface OverviewContent {
  title?: string;
  description?: string | string[];
}

interface OverviewProps {
  content?: OverviewContent | string[];
  color?: string;
}

const Overview: React.FC<OverviewProps> = ({ content, color = "#00aaff" }) => {
  const { language } = useLanguage();

  if (!content) return null;

  // 🧠 Normalize data
  const paragraphs = Array.isArray(content)
    ? content
    : typeof content?.description === "string"
    ? [content.description]
    : Array.isArray(content?.description)
    ? content.description
    : [];

  const title = !Array.isArray(content) ? content.title || "Overview" : "Overview";

  return (
    <section id="overview" className="position-relative mb-0">
      
      {/* --- HEADER (OUTSIDE THE BOX) --- */}
      <div 
        className="d-flex align-items-center mb-3 pb-2" 
        style={{ borderBottom: `1px solid ${color}20` }}
      >
        {/* Icon Circle */}
        <div 
          className="d-flex align-items-center justify-content-center me-3 rounded-circle"
          style={{ 
            width: '40px', 
            height: '40px', 
            backgroundColor: `${color}15`, 
            color: color 
          }}
        >
          {/* Using binoculars as per your previous preference for Overview */}
          <i className="fas fa-binoculars fs-6"></i>
        </div>

        {/* Title Text */}
        <div>
          <h2 className="h4 fw-bold mb-0 text-dark text-start">
            <Translator text={title} targetLang={language} />
          </h2>
          <span 
            className="text-uppercase fw-bold text-muted" 
            style={{ fontSize: '0.65rem', letterSpacing: '0.5px' }}
          >
            <Translator text="About this destination" targetLang={language} />
          </span>
        </div>
      </div>

      {/* --- CONTENT BOX (WHITE CARD) --- */}
      <div className="overview-card bg-white p-4 rounded-4 shadow-sm border">
        <div className="overview-content">
          {paragraphs.map((para, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <p
                className={`mb-0 ${i === 0 ? "lead-text" : "text-secondary"}`}
                style={{ 
                  lineHeight: "1.8", 
                  fontSize: i === 0 ? "1rem" : "0.9rem", 
                  marginBottom: i !== paragraphs.length - 1 ? "1rem" : "0", // Add spacing between paragraphs
                  fontWeight: i === 0 ? 500 : 400,
                  color: i === 0 ? "#2c3e50" : undefined
                }}
              >
                <Translator text={para} targetLang={language} />
              </p>
            </motion.div>
          ))}
        </div>
      </div>

    </section>
  );
};

export default Overview;