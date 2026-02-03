"use client";
import React from "react";
import SectionTitle from "./SectionTitle";
import { useLanguage } from "../context/LanguageContext";
import Translator from "../commonComponents/Translator";

interface Tip {
  icon?: string;
  title?: string;
  description?: string;
}

interface BookingTipsProps {
  tips?: Tip[];
  color?: string;
}

const BookingTips: React.FC<BookingTipsProps> = ({ tips = [], color = "#00aaff" }) => {
  const { language } = useLanguage();

  if (!tips.length) return null;

  return (
    <section id="booking-tips" className="mb-5">
      {/* 🏨 Section Title */}
      <SectionTitle title="Hotel Booking Tips" color={color} />

      {/* 💬 Tips List */}
      <div className="card p-4 bg-white shadow-sm rounded-lg">
        <div className="tips icon-list space-y-2">
          {tips.map((tip, idx) => (
            <div key={idx} className="flex items-start text-gray-800">
              {/* Icon */}
              {tip.icon && (
                <i
                  className={`${tip.icon} mt-1 attraction-icon mr-2`}
                  style={{ color }}
                ></i>
              )}

              {/* Translated Text */}
              <span className="leading-relaxed">
                {tip.title && (
                  <strong>
                    <Translator text={tip.title} targetLang={language} />:
                  </strong>
                )}{" "}
                {tip.description && (
                  <Translator text={tip.description} targetLang={language} />
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BookingTips;
