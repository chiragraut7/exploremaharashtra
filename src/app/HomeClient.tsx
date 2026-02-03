"use client";

import React, { useEffect, useState } from "react";
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

// Animated Counter Hook/Component
const CountingNumber = ({ value }: { value: number }) => {
  const [displayValue, setDisplayValue] = useState(0);
  useEffect(() => {
    let start = 0;
    if (value === 0) return;
    const duration = 1500;
    const incrementTime = Math.max(duration / value, 30);
    const timer = setInterval(() => {
      start += 1;
      setDisplayValue(start);
      if (start >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      }
    }, incrementTime);
    return () => clearInterval(timer);
  }, [value]);
  return <>{displayValue}</>;
};

const InteractiveMap = dynamic(() => import("./components/InteractiveMap"), { ssr: false });
import useFastParallax from "@/hooks/useFastParallax";

export default function Home({ categoryData = {} }: { categoryData?: any }) {
  const { language } = useLanguage();

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  useFastParallax({ multiplier: 1.6, disableBelow: 768 });

  const sections = [
    { id: "beaches", title: "Beaches", icon: "fa-umbrella-beach", link: "/beaches", color: "#00aaff" },
    { id: "hill-stations", title: "Hill Stations", icon: "fa-mountain-sun", link: "/hills", color: "#4caf50" },
    { id: "forts", title: "Forts", icon: "fa-chess-rook", link: "/forts", color: "#795548" },
    { id: "wildlife", title: "Wildlife", icon: "fa-paw", link: "/nature", color: "#ff9800" },
    { id: "religious", title: "Religious", icon: "fa-gopuram", link: "/religious", color: "#e91e63" },
    { id: "culture", title: "Culture", icon: "fa-masks-theater", link: "/culture", color: "#673ab7" },
  ];

  return (
    <main className="bg-light-soft">
      {/* 1. HERO SECTION */}
      <header className="hero-editorial">
        <div className="hero-visual-pane">
          <div className="hero-bg-zoom">
            <Image src="/assets/images/maharashtra-hero.jpg" alt="Hero" fill priority className="object-cover" />
            <div className="hero-vignette"></div>
          </div>
        </div>
        <div className="hero-content-pane">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="content-wrapper">
            <div className="editorial-badge">
              <span className="dot"></span>
              <Translator text="The Great State" targetLang={language} />
            </div>
            <h1 className="display-1 fw-900 text-white mb-4">Explore <br /> <span className="text-outline">Maharashtra</span></h1>
          </motion.div>
        </div>
      </header>

      {/* 2. BENTO CATEGORY GRID */}
      <section className="container py-5 position-relative" id="overview" style={{ zIndex: 2 }}>
        <div className="text-center mb-5" data-aos="fade-up">
            <span className="badge bg-white border text-dark px-3 py-2 rounded-pill text-uppercase letter-spacing-2 fw-bold mb-3 shadow-sm">
                <Translator text="Discover by Interest" targetLang={language} />
            </span>
            <h2 className="display-5 fw-bold mt-2"><Translator text="Choose Your Adventure" targetLang={language} /></h2>
        </div>

        <div className="row row-cols-2 row-cols-md-3 row-cols-lg-6 g-3">
          {sections.map((section, idx) => (
            <div key={section.id} data-aos="fade-up" data-aos-delay={idx * 100}>
              <Link href={section.link} className="text-decoration-none">
                <motion.div whileHover={{ y: -10, scale: 1.02 }} className="category-card h-100">
                  <div className="card-blob" style={{ background: section.color }}></div>
                  <div className="card-content">
                      <div className="icon-squircle mb-2" style={{ backgroundColor: `${section.color}15`, color: section.color }}>
                        <i className={`fas ${section.icon} fs-4`}></i>
                      </div>

                      <div className="d-flex flex-column align-items-center mb-1">
                        <span className="fw-900 lh-1" style={{ color: section.color, fontSize: '2.4rem', letterSpacing: '-1.5px' }}>
                           <CountingNumber value={categoryData[section.id]?.count || 0} />
                        </span>
                        <span className="text-muted fw-bold text-uppercase" style={{ fontSize: '0.6rem', letterSpacing: '1px' }}>
                          <Translator text="Places" targetLang={language} />
                        </span>
                      </div>
                      
                      <h3 className="h6 fw-bold text-dark mb-1"><Translator text={section.title} targetLang={language} /></h3>

                      {/* <div className="mt-2 d-flex align-items-center gap-1" style={{ opacity: 0.5 }}>
                        <i className="far fa-clock" style={{ fontSize: '0.5rem' }}></i>
                        <span style={{ fontSize: '0.55rem', fontWeight: 600 }}>
                          Updated {categoryData[section.id]?.lastUpdated || 'Recently'}
                        </span>
                      </div> */}
                  </div>
                </motion.div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 3. MAP & LISTS */}
      <section className="container mb-5"><InteractiveMap /></section>
      <div className="content-staggered">
        <BeachList /> <HillList /> <FortList /> <NatureList /> <ReligiousList /> <CulturalList />
      </div>

      <style jsx global>{`
        .bg-light-soft { background-color: #f9f9f9; }
        .fw-900 { font-weight: 900; }
        .hero-editorial { position: relative; height: 100vh; display: flex; background: #0a0a0a; overflow: hidden; }
        .hero-visual-pane { position: absolute; inset: 0; width: 100%; z-index: 1; }
        .hero-bg-zoom { position: absolute; inset: 0; animation: slowZoom 40s infinite alternate linear; }
        .hero-vignette { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.8) 100%); z-index: 2; }
        @keyframes slowZoom { from { transform: scale(1); } to { transform: scale(1.15); } }
        .hero-content-pane { position: relative; z-index: 3; width: 100%; display: flex; align-items: center; justify-content: center; padding: 0 10%; }
        .editorial-badge { display: inline-flex; align-items: center; gap: 10px; background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(10px); padding: 8px 20px; border-radius: 100px; color: #fff; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; font-size: 0.75rem; border: 1px solid rgba(255,255,255,0.2); margin-bottom: 2rem; }
        .dot { width: 6px; height: 6px; background: #00aaff; border-radius: 50%; }
        .text-outline { color: transparent; -webkit-text-stroke: 1px rgba(255,255,255,0.9); font-style: italic; font-family: serif; }
        .category-card { position: relative; background: #ffffff; border-radius: 24px; padding: 1.5rem; text-align: center; border: 1px solid rgba(0,0,0,0.04); box-shadow: 0 10px 30px rgba(0,0,0,0.02); overflow: hidden; transition: all 0.4s ease; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .category-card:hover { box-shadow: 0 20px 40px rgba(0,0,0,0.08); border-color: transparent; }
        .card-blob { position: absolute; top: -20%; right: -20%; width: 120px; height: 120px; border-radius: 50%; opacity: 0.15; filter: blur(40px); transition: transform 0.5s ease; }
        .category-card:hover .card-blob { transform: scale(1.5); }
        .icon-squircle { width: 64px; height: 64px; border-radius: 20px; display: flex; align-items: center; justify-content: center; margin-bottom: 0.5rem; transition: transform 0.4s ease; }
        .category-card:hover .icon-squircle { transform: rotate(-10deg) scale(1.1); }
      `}</style>
    </main>
  );
}