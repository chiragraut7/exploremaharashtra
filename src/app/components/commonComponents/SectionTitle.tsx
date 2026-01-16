"use client";
import React from "react";
import { useLanguage } from "../context/LanguageContext";
import Translator from "../commonComponents/Translator";

interface SectionTitleProps {
  title: string;           // plain English text (will auto-translate)
  color?: string;
  className?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  color = "#00aaff",
  className = "",
}) => {
  const { language } = useLanguage();

  return (
    <h2
      className={`section-title border-l-4 pl-3 font-semibold text-2xl mb-4 ${className}`}
      style={{
        borderColor: color,
      }}
    >
      {/* ✅ Automatically translated */}
      <Translator text={title} targetLang={language} />
    </h2>
  );
};

export default SectionTitle;
