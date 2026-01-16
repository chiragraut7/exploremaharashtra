"use client";

import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

// Context & Components
import { useLanguage } from "./components/context/LanguageContext";
import BeachList from "./components/beaches/BeachList";
import HillList from "./components/HillList";
import FortList from "./components/FortList";
import NatureList from "./components/NatureList";
import ReligiousList from "./components/ReligiousList";
import CulturalList from "./components/CulturalList";
import Translator from "./components/commonComponents/Translator";
import MaharashtraChat from "./components/MaharashtraChat";

// ✅ CRITICAL FIX: Load the Map with SSR disabled to prevent build crashes
const InteractiveMap = dynamic(() => import("./components/InteractiveMap"), { 
  ssr: false,
  loading: () => (
    <div className="container py-5 text-center bg-light rounded-4" style={{ height: '450px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div>
        <div className="spinner-border text-primary mb-2" role="status"></div>
        <p className="text-muted small fw-bold">Mapping the Great State...</p>
      </div>
    </div>
  )
});

// Custom Hooks
import useFastParallax from "@/hooks/useFastParallax";

export default function Home() {
  const { language } = useLanguage();

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  // Parallax hook for smooth editorial movement
  useFastParallax({ multiplier: 1.6, disableBelow: 768 });

  const sections = [
    { id: "beaches", title: "Beaches", image: "/assets/images/home_iocn/beach-umbrella.svg", link: "/beaches", color: "#e6f7ff" },
    { id: "hill-stations", title: "Hill Stations", image: "/assets/images/home_iocn/hills.svg", link: "/hills", color: "#f6ffed" },
    { id: "forts", title: "Forts", image: "/assets/images/home_iocn/castle-3.svg", link: "/forts", color: "#fff7e6" },
    { id: "wildlife", title: "Wildlife & Nature", image: "/assets/images/home_iocn/tree.svg", link: "/nature", color: "#f9f0ff" },
    { id: "religious", title: "Religious Places", image: "/assets/images/home_iocn/temple.svg", link: "/religious", color: "#fff1f0" },
    { id: "culture", title: "Cultural & Unique", image: "/assets/images/home_iocn/castle.svg", link: "/culture", color: "#fcffe6" },
  ];

  return (
    <main className="bg-light-soft">
      {/* 🎭 LUXURY HERO SECTION */}
      <header className="hero-editorial">
        <div className="hero-visual-pane">
          <div className="hero-bg-zoom">
            <Image 
              src="/assets/images/hero-maharashtra.png" 
              alt="Maharashtra Landscape" 
              fill 
              priority 
              className="object-cover"
            />
            <div className="hero-vignette"></div>
          </div>
        </div>

        <div className="hero-content-pane">
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="content-wrapper"
          >
            <div className="editorial-badge">
              <span className="dot"></span>
              <Translator text="The Great State" targetLang={language} />
            </div>
            
            <h1 className="display-1 fw-black text-white mb-4">
              Explore <br /> 
              <span className="text-outline">Maharashtra</span>
            </h1>

            <p className="description-text">
              <Translator text="Uncover history, nature, and spirit across India's most diverse landscape. From the Sahyadri peaks to the Konkan shores." targetLang={language} />
            </p>

            <div className="action-area mt-5">
              <a href="#overview" className="btn-luxury">
                <span className="btn-text"><Translator text="Start Your Journey" targetLang={language} /></span>
                <span className="btn-arrow">→</span>
              </a>
            </div>
          </motion.div>
        </div>

        <div className="hero-floating-footer d-none d-md-flex">
          <div className="stat-item"><strong>720km</strong> Coastline</div>
          <div className="stat-item"><strong>350+</strong> Forts</div>
          <div className="stat-item"><strong>UNESCO</strong> Heritage Sites</div>
        </div>
      </header>

      {/* 🧩 BENTO CATEGORY GRID */}
      <section className="container py-5">
        <div className="row row-cols-2 row-cols-md-3 row-cols-lg-6 g-4">
          {sections.map((section, idx) => (
            <div key={section.id} data-aos="fade-up" data-aos-delay={idx * 100}>
              <Link href={section.link} className="text-decoration-none">
                <div className="magazine-card" style={{ backgroundColor: section.color }}>
                  <div className="magazine-icon-box">
                    <Image src={section.image} alt={section.title} width={60} height={60} />
                  </div>
                  <h3 className="magazine-card-title">
                    <Translator text={section.title} targetLang={language} />
                  </h3>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 🗺️ GEOGRAPHICAL INTERACTIVE MAP */}
      {/* Wrapped in a container to maintain editorial spacing */}
      <section className="container mb-5" id="map-explorer" data-aos="fade-up">
         <div className="section-header mb-4 text-center">
            <h2 className="fw-bold"><Translator text="Explore the Map" targetLang={language} /></h2>
            <p className="text-muted"><Translator text="Navigate through the diverse regions of the Great State" targetLang={language} /></p>
         </div>
         <InteractiveMap />
      </section>

      {/* 🏔️ CONTENT LISTINGS (Horizontal Sliders) */}
      <div className="content-staggered">
        <div className="slider-item"><BeachList /></div>
        <div className="slider-item"><HillList /></div>
        <div className="slider-item"><FortList /></div>
        <div className="slider-item"><NatureList /></div>
        <div className="slider-item"><ReligiousList /></div>
        <div className="slider-item"><CulturalList /></div>
      </div>

      <style jsx>{`
        .bg-light-soft { background: #fff; }
        
        .hero-editorial {
          position: relative;
          height: 100vh;
          display: flex;
          background: #0a0a0a;
          overflow: hidden;
        }

        .hero-visual-pane {
          position: absolute;
          inset: 0;
          width: 100%;
          z-index: 1;
        }

        .hero-bg-zoom {
          position: absolute;
          inset: 0;
          animation: slowZoom 30s infinite alternate linear;
        }

        @keyframes slowZoom {
          from { transform: scale(1); }
          to { transform: scale(1.18); }
        }

        .hero-vignette {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.8) 100%);
          z-index: 2;
        }

        .hero-content-pane {
          position: relative;
          z-index: 3;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 10%;
        }

        .content-wrapper {
          max-width: 800px;
          text-align: center;
        }

        .fw-black { font-weight: 900; letter-spacing: -2px; }
        .text-outline {
          color: transparent;
          -webkit-text-stroke: 1px rgba(255,255,255,0.8);
          font-style: italic;
        }

        .editorial-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          padding: 8px 20px;
          border-radius: 100px;
          color: #00aaff;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          font-size: 0.75rem;
          margin-bottom: 2rem;
        }

        .description-text {
          font-size: 1.25rem;
          color: rgba(255,255,255,0.7);
          font-weight: 300;
          line-height: 1.6;
        }

        .btn-luxury {
          display: inline-flex;
          align-items: center;
          gap: 20px;
          background: #fff;
          color: #000;
          padding: 18px 40px;
          border-radius: 100px;
          text-decoration: none;
          font-weight: 800;
          transition: 0.4s;
        }

        .btn-luxury:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 170, 255, 0.3);
          background: #00aaff;
          color: white;
        }

        .hero-floating-footer {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 4;
          display: flex;
          gap: 40px;
          color: white;
          background: rgba(0,0,0,0.4);
          backdrop-filter: blur(10px);
          padding: 15px 40px;
          border-radius: 100px;
          border: 1px solid rgba(255,255,255,0.1);
        }

        .stat-item strong { color: #00aaff; margin-right: 5px; }

        .magazine-card {
          position: relative;
          padding: 1.5rem 0.5rem;
          border-radius: 1rem;
          text-align: center;
          transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
          height: 100%;
          border: 1px solid rgba(0,0,0,0.03);
          overflow: hidden;
        }

        .magazine-card:hover {
          transform: translateY(-15px) scale(1.02);
          box-shadow: 0 35px 70px rgba(0,0,0,0.08);
        }

        .magazine-icon-box {
          margin: 0 auto 1rem;
          transition: all .5s cubic-bezier(.175, .885, .32, 1.275);
        }

        .magazine-card:hover .magazine-icon-box {
          transform: scale(1.18) rotate(-10deg);
        }

        .magazine-card-title {
          font-size: 1rem;
          color: #333;
          font-weight: 700;
        }

        @media (max-width: 768px) {
          .display-1 { font-size: 3.5rem; }
          .hero-floating-footer { display: none; }
          .hero-editorial { height: 85vh; }
        }
      `}</style>
    </main>
  );
}