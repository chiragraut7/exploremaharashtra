"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Translator from "../commonComponents/Translator";
import { useLanguage } from "../context/LanguageContext";

interface ParallaxBannerProps {
  image?: string;
  title?: string;
  subtitle?: string;
}

const ParallaxBanner: React.FC<ParallaxBannerProps> = ({
  image = "/assets/images/beachBanner.png",
  title = "Konkan Coast",
  subtitle = "Discover the hidden gems of Maharashtra",
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);
  const { language } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || !imageRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how much of the banner is visible (0 to 1)
      const scrollFraction = Math.max(0, Math.min(1, (windowHeight - rect.top) / (windowHeight + rect.height)));
      
      // Window Closing Effect: Pinching the clip-path
      // At 0.5 (center of screen), it is fully open (0% and 100%)
      // As it leaves the screen, the percentages move toward the center (50%)
      const pinch = Math.abs(0.5 - scrollFraction) * 40; 
      const topEdge = pinch;
      const bottomEdge = 100 - pinch;

      // Apply the "Window Shutter" clip path
      imageRef.current.style.clipPath = `polygon(0% ${topEdge}%, 100% ${topEdge}%, 100% ${bottomEdge}%, 0% ${bottomEdge}%)`;
      
      // Subtle 3D tilt
      const rotation = (scrollFraction - 0.5) * 20;
      imageRef.current.style.transform = `scale(${1.1 - pinch/100}) rotateX(${rotation}deg)`;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="window-container" ref={containerRef}>
      <div className="window-shutter" ref={imageRef}>
        <Image
          src={image}
          alt={title}
          fill
          priority
          style={{ objectFit: "cover" }}
        />
        <div className="overlay-gradient" />
      </div>

      <div className="content-layer">
        <div className="editorial-badge">Maharashtra</div>
        <h1 className="main-title">
          <Translator text={title} targetLang={language} />
        </h1>
        <div className="orange-divider"></div>
        <p className="sub-text">
          <Translator text={subtitle} targetLang={language} />
        </p>
      </div>

      <style jsx>{`
        .window-container {
          position: relative;
          height: 60vh; /* Taller for better cinematic effect */
          margin: 0;
          // background: #fff;
          overflow: visible;
          display: flex;
          align-items: center;
          justify-content: center;
          perspective: 1200px;
        }

        .window-shutter {
          position: absolute;
          width: 90%;
          height: 100%;
          overflow: hidden;
          will-change: clip-path, transform;
          transition: transform 0.1s linear;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        .overlay-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(0,0,0,0.4) 0%,
            transparent 50%,
            rgba(0,0,0,0.6) 100%
          );
        }

        .content-layer {
          position: relative;
          z-index: 10;
          text-align: center;
          color: white;
          pointer-events: none;
        }

        .editorial-badge {
          font-size: 0.8rem;
          letter-spacing: 6px;
          text-transform: uppercase;
          margin-bottom: 15px;
          color: #FF6B00;
          font-weight: 800;
        }

        .main-title {
          font-size: clamp(3rem, 8vw, 6rem);
          font-weight: 900;
          text-transform: uppercase;
          line-height: 0.85;
          margin: 0;
          letter-spacing: -2px;
          text-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }

        .orange-divider {
          width: 60px;
          height: 4px;
          background: #FF6B00;
          margin: 25px auto;
        }

        .sub-text {
          font-size: 1.2rem;
          max-width: 500px;
          margin: 0 auto;
          font-weight: 300;
          letter-spacing: 1px;
          opacity: 0.9;
        }

        @media (max-width: 768px) {
          .window-container { height: 50vh; margin: 50px 0; }
          .window-shutter { width: 100%; clip-path: none !important; }
        }
      `}</style>
    </div>
  );
};

export default ParallaxBanner;