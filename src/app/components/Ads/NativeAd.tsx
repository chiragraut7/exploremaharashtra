"use client";

import { useEffect } from "react";
import Translator from "../commonComponents/Translator";
import { useLanguage } from "../context/LanguageContext";

interface NativeAdProps {
  slot: string;
}

export default function NativeAd({ slot }: NativeAdProps) {
  const { language } = useLanguage();

  useEffect(() => {
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense Error:", e);
    }
  }, []);

  return (
    <div className="native-ad-container mx-auto my-5 w-100">
      <div className="ad-header-ui">
        <div className="ad-pill">
          <i className="fas fa-crown me-2"></i>
          <Translator text="Travel Partner" targetLang={language} />
        </div>
      </div>

      <div className="ad-frame shadow-lg rounded-5 overflow-hidden border border-light bg-white">
        <ins
          className="adsbygoogle"
          style={{ display: "block", textAlign: "center" }}
          data-ad-layout="in-article"
          data-ad-format="fluid"
          data-ad-client="ca-pub-8239510590682431"
          data-ad-slot={slot}
        ></ins>
        
        <div className="ad-skeleton-bg">
           <p className="small fw-bold text-muted opacity-50 tracking-widest text-uppercase">
             Curating Heritage Content...
           </p>
        </div>
      </div>

      <style jsx>{`
        .native-ad-container { max-width: 850px; position: relative; }
        .ad-header-ui { display: flex; justify-content: center; margin-bottom: -15px; position: relative; z-index: 10; }
        .ad-pill { background: #ff5722; color: white; font-size: 0.65rem; font-weight: 900; letter-spacing: 2px; padding: 6px 20px; border-radius: 100px; text-transform: uppercase; box-shadow: 0 10px 20px rgba(255, 87, 34, 0.2); }
        .ad-frame { min-height: 250px; position: relative; display: flex; align-items: center; justify-content: center; }
        .ad-skeleton-bg { position: absolute; inset: 0; z-index: 1; display: flex; align-items: center; justify-content: center; background: #f8f9fa; }
        .adsbygoogle { position: relative; z-index: 5; width: 100%; }
      `}</style>
    </div>
  );
}