"use client";
import React from "react";
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

  // 🧠 Normalize data: handle both string[] and object formats
  const paragraphs =
    Array.isArray(content)
      ? content // JSON array
      : typeof content?.description === "string"
      ? [content.description] // single paragraph
      : Array.isArray(content?.description)
      ? content.description // already array
      : [];

  const title = !Array.isArray(content) ? content.title || "Overview" : "Overview";

  return (
    <section id="overview">
      <h2
        className="section-title mb-4"
        style={{
          borderColor: color,
          color,
          fontWeight: 600,
        }}
      >
        <Translator text={title} targetLang={language} />
      </h2>

      {paragraphs.map((para, i) => (
        <p
          key={i}
          className="text-gray-700"
          style={{ lineHeight: "1.7" }}
        >
          <Translator text={para} targetLang={language} />
        </p>
      ))}
    </section>
  );
};

export default Overview;
