'use client';

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, useScroll, useSpring, AnimatePresence, useTransform } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import { useLanguage } from '../components/context/LanguageContext'
import Translator from "../components/commonComponents/Translator";
import dynamic from "next/dynamic";
import React from "react"; // Added for React.Fragment
import NativeAd from "../components/Ads/NativeAd";

// ✅ Dynamic import for Map to prevent SSR errors
const MapExplorer = dynamic(() => import("../components/MapExplorer"), { 
  ssr: false,
  loading: () => (
    <div className="map-skeleton d-flex align-items-center justify-content-center bg-dark rounded-5 h-100">
        <div className="text-center">
            <div className="spinner-grow text-warning mb-3"></div>
            <p className="text-white/50 small fw-bold tracking-widest uppercase">Initializing Atlas...</p>
        </div>
    </div>
  )
});

type ViewMode = 'timeline' | 'grid' | 'list' | 'map';

export default function CategoryPage() {
  const { language } = useLanguage();
  const { category } = useParams() as { category: string };
  
  const [items, setItems] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('timeline');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // 🏛️ Culture Check
  const isCulture = category?.toLowerCase() === 'culture';

  // ☁️ Weather & Location States
  const [weather, setWeather] = useState<{ temp: number; text: string; icon: string; forecast: any[] } | null>(null);
  const [showForecast, setShowForecast] = useState(false);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start 0%", "end 100%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  const storageKey = `favs_${category}`;
  const getBannerImage = (cat: string) => `/assets/images/bannerImages/${cat === 'beaches' ? 'beahces' : cat}.jpg`;

  /* --- DATA FETCHING & EFFECTS --- */
  useEffect(() => {
    // 🛡️ Safety: If user is on culture page, ensure they aren't stuck in map mode
    if (isCulture && viewMode === 'map') {
      setViewMode('timeline');
    }

    const savedFavs = localStorage.getItem(storageKey);
    if (savedFavs) setFavorites(JSON.parse(savedFavs));
    AOS.init({ duration: 800, once: false });
    
    async function fetchItems() {
      try {
        const res = await fetch(`/api/${category}`);
        const json = await res.json();
        const data = json.success ? json.data : [];
        setItems(data);
        
        if (data[0]?.coordinates) {
          fetchWeatherData(data[0].coordinates.lat, data[0].coordinates.lng);
        }
      } catch(e) { console.error("Fetch Error:", e); }
    }
    if (category) fetchItems();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    }
  }, [category, isCulture, storageKey]);

  /* --- WEATHER ENGINE --- */
  const fetchWeatherData = async (lat: number, lon: number) => {
    try {
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max&timezone=auto`);
      const data = await res.json();
      
      const forecastData = data.daily.time.slice(1, 4).map((time: string, i: number) => ({
        date: new Date(time).toLocaleDateString('en-US', { weekday: 'short' }),
        temp: Math.round(data.daily.temperature_2m_max[i + 1]),
      }));

      setWeather({
        temp: Math.round(data.current_weather.temperature),
        text: "Clear Sky",
        icon: "fa-cloud-sun",
        forecast: forecastData
      });
    } catch (e) { console.error("Weather error", e); }
  };

  /* --- GEOSPATIAL ENGINE --- */
  const calculateDistance = (lat2: number, lon2: number) => {
    if (!userCoords) return null;
    const R = 6371; 
    const dLat = (lat2 - userCoords.lat) * Math.PI / 180;
    const dLon = (lon2 - userCoords.lng) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(userCoords.lat * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  };

  const toggleFavorite = (e: React.MouseEvent, itemId: string) => {
    e.stopPropagation();
    const updatedFavs = favorites.includes(itemId) ? favorites.filter(id => id !== itemId) : [...favorites, itemId];
    setFavorites(updatedFavs);
    localStorage.setItem(storageKey, JSON.stringify(updatedFavs));
    window.dispatchEvent(new Event('favorites_updated'));
  };

  const handleShare = (e: React.MouseEvent, item: any) => {
    e.stopPropagation();
    const url = typeof window !== 'undefined' ? `${window.location.origin}/${category}/${item.slug || item.id}` : "";
    if (navigator.share) {
      navigator.share({ title: item.title, text: item.subtitle, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  const filteredItems = items.filter(item => 
    (item.title || item.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-vh-100 bg-page-gradient overflow-x-hidden" ref={containerRef} style={{ position: 'relative' }}>
      
      {/* --- HERO SECTION --- */}
      <header className={`category-hero-container ${viewMode === 'map' ? 'hero-map-mode' : ''}`}>
        <div className="hero-image-wrapper">
          <Image src={getBannerImage(category)} alt={category} fill priority className="object-fit-cover shadow-inner" />
          <div className="hero-overlay-gradient" />
        </div>

        <div className="container text-center z-10 position-relative hero-content-box">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="editorial-pill mb-3">
              <span className="dot"></span>
              <Translator text="Maharashtra Heritage Guide" targetLang={language} />
            </div>
            <h1 className={`${viewMode === 'map' ? 'h3 mb-3' : 'display-1 mb-4'} text-white fw-black text-uppercase hero-title transition-all duration-700`}>
              <Translator text={category} targetLang={language}/>
            </h1>
          </motion.div>
          
          <div className="row justify-content-center align-items-center g-3 px-3">
            <div className="col-md-5">
              <div className="luxury-search-bar shadow-2xl">
                <i className="fas fa-search me-3"></i>
                <input type="text" placeholder="Find a destination..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>
            
            <div className="col-auto">
              <div className="luxury-switcher">
                {[
                  { mode: 'timeline', icon: 'fa-route', label: 'Timeline' },
                  { mode: 'grid', icon: 'fa-th-large', label: 'Grid' },
                  { mode: 'list', icon: 'fa-list-ul', label: 'List' },
                  // 🗺️ Atlas Switcher: Only added if NOT culture
                  ...(!isCulture ? [{ mode: 'map', icon: 'fa-map-marked-alt', label: 'Atlas' }] : [])
                ].map((btn) => (
                  <button 
                    key={btn.mode}
                    onClick={() => setViewMode(btn.mode as ViewMode)} 
                    className={`switcher-btn ${viewMode === btn.mode ? 'active' : ''}`}
                  >
                    <i className={`fas ${btn.icon}`}></i>
                    <span className="btn-label">{btn.label}</span>
                    {viewMode === btn.mode && (
                      <motion.div layoutId="active-pill" className="active-bg" transition={{ type: "spring", bounce: 0.15, duration: 0.6 }} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- CONTENT AREA --- */}
      <section className={`${viewMode === 'map' ? 'map-section-active' : 'container py-5 position-relative'}`}>
        <AnimatePresence mode="wait">
           {viewMode !== 'map' && (
             <motion.div className="fixed-top" style={{ scaleX: scrollYProgress, height: '4px', background: 'linear-gradient(90deg, #ff5722, #ff9f43)', transformOrigin: '0%', zIndex: 9999 }} />
           )}

          {/* 🗺️ ATLAS VIEW (Hidden if Culture) */}
          {viewMode === 'map' && !isCulture && (
            <motion.div key="map" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="map-wrapper-premium shadow-2xl position-relative">
               {weather && (
                 <motion.div className={`weather-container-luxury ${showForecast ? 'expanded' : ''}`} onClick={() => setShowForecast(!showForecast)}>
                    <div className="d-flex align-items-center gap-3">
                        <div className="weather-main-icon"><i className={`fas ${weather.icon}`}></i></div>
                        <div className="text-start">
                            <div className="weather-temp-large text-white">{weather.temp}°C</div>
                            <div className="weather-label text-white/60">Forecast</div>
                        </div>
                    </div>
                 </motion.div>
               )}
               <MapExplorer locations={filteredItems} category={category} userCoords={userCoords} />
            </motion.div>
          )}

          {/* 🛣️ TIMELINE VIEW */}
          {viewMode === 'timeline' && (
            <motion.div key="timeline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="timeline-wrapper">
              <div className="timeline-track d-none d-md-block"><motion.div className="timeline-progress" style={{ scaleY }} /></div>
              {filteredItems.map((item, index) => {
                const isLeft = index % 2 === 0;
                const dist = item.coordinates ? calculateDistance(item.coordinates.lat, item.coordinates.lng) : null;
                return (
                  <React.Fragment key={item.id}>
                    {/* --- NATIVE AD INJECTION --- */}
                    {index > 0 && index % 3 === 0 && (
                      <div className="row justify-content-center mb-5" data-aos="fade-up">
                        <div className="col-lg-8">
                          <NativeAd slot="YOUR_AD_SLOT_ID" />
                        </div>
                      </div>
                    )}
                    <div className={`timeline-row d-flex w-100 mb-5 align-items-center ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
                      <div className="col-12 col-md-5">
                        <motion.div className="luxury-card shadow-xl rounded-5 overflow-hidden" onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)}>
                          <Image src={item.bannerImage || '/assets/images/placeholder.jpg'} alt="" fill className={`object-fit-cover transition-all duration-1000 ${hoveredIndex === index ? 'scale-110' : ''}`} />
                          <div className="card-overlay" />
                          <div className="card-actions">
                             <button onClick={(e) => toggleFavorite(e, item.slug || item.id)} className={`action-btn ${favorites.includes(item.slug || item.id) ? 'active' : ''}`}><i className="fas fa-heart"></i></button>
                             {dist && <span className="dist-badge">{dist} km away</span>}
                             <button onClick={(e) => handleShare(e, item)} className="action-btn"><i className="fas fa-share-alt"></i></button>
                          </div>
                          <div className="card-content text-white p-4">
                            <h3 className="fw-bold h4 mb-1">{item.title}</h3>
                            <div className={`hover-reveal-grid ${hoveredIndex === index ? 'show' : ''}`}>
                                  <div className="overflow-hidden">
                               <p className="small mb-3 opacity-80 line-clamp-2">{item.subtitle}</p>
                               <Link href={`/${category}/${item.slug || item.id}`} className="btn-luxury-action">EXPLORE GUIDE</Link>
                               </div>
                            </div>
                            <motion.div animate={{ width: hoveredIndex === index ? '100%' : '40px' }} className="h-1 bg-warning mt-3 rounded-full" />
                          </div>
                        </motion.div>
                      </div>
                      <div className="col-md-2 d-none d-md-flex justify-content-center">
                          <div className="timeline-node"><div className="timeline-dot" /></div>
                      </div>
                      <div className="col-md-5"></div>
                    </div>
                  </React.Fragment>
                );
              })}
            </motion.div>
          )}

          {/* 🖼️ GRID VIEW */}
          {viewMode === 'grid' && (
            <motion.div key="grid" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
               {filteredItems.map((item, index) => (
                 <React.Fragment key={item.id}>
                  {/* --- NATIVE AD INJECTION --- */}
                  {index > 0 && index % 3 === 0 && (
                    <div className="col-12 mb-4" data-aos="fade-up">
                      <NativeAd slot="YOUR_AD_SLOT_ID" />
                    </div>
                  )}
                  <div className="col">
                      <div className="luxury-card rounded-5 overflow-hidden shadow-sm position-relative" style={{ height: '400px' }} onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)}>
                        <Image src={item.bannerImage} alt="" fill className="object-fit-cover transition-transform duration-700" style={{ transform: hoveredIndex === index ? 'scale(1.1)' : 'scale(1)' }} />
                        <div className="card-overlay" />
                        <div className="card-content position-absolute bottom-0 w-100 p-4 text-white z-10">
                            <h4 className="fw-bold h5 mb-1">{item.title}</h4>
                            <div className={`hover-reveal-grid ${hoveredIndex === index ? 'show' : ''}`}>
                             
                                 <div className="overflow-hidden">
                               <p className="small opacity-75 mb-3 line-clamp-2">{item.subtitle}</p>
                               <div className="d-flex gap-2">
                                 <Link href={`/${category}/${item.slug || item.id}`} className="btn-luxury-action flex-grow-1">DETAILS</Link>
                                 <button onClick={(e) => handleShare(e, item)} className="action-btn"><i className="fas fa-share-alt"></i></button>
                               </div>
                               </div>
                            </div>
                        </div>
                      </div>
                  </div>
                 </React.Fragment>
               ))}
            </motion.div>
          )}

          {/* 📜 LIST VIEW */}
          {viewMode === 'list' && (
            <motion.div key="list" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="d-flex flex-column gap-3">
               {filteredItems.map((item, index) => {
                 const dist = item.coordinates ? calculateDistance(item.coordinates.lat, item.coordinates.lng) : null;
                 return (
                  <React.Fragment key={item.id}>
                    {/* --- NATIVE AD INJECTION --- */}
                    {index > 0 && index % 6 === 0 && (
                      <div className="w-100 my-2" data-aos="fade-up">
                        <NativeAd slot="YOUR_AD_SLOT_ID" />
                      </div>
                    )}
                    <motion.div whileHover={{ x: 10 }} className="list-card-premium d-flex align-items-center gap-3 p-2 bg-white rounded-4 shadow-sm border border-light">
                      <div className="position-relative rounded-3 overflow-hidden shadow-sm" style={{ width: '110px', height: '75px', flexShrink: 0 }}>
                        <Image src={item.bannerImage} alt={item.title} fill className="object-fit-cover" />
                      </div>
                      <div className="flex-grow-1 min-w-0 text-start">
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <h6 className="mb-0 fw-bold text-dark text-truncate">{item.title}</h6>
                          {dist && <span className="badge bg-light text-dark border small">{dist} km</span>}
                        </div>
                        <p className="text-muted small mb-0 line-clamp-1 opacity-75">{item.subtitle}</p>
                      </div>
                      <div className="pe-2">
                        <Link href={`/${category}/${item.slug || item.id}`} className="btn-view-premium">VIEW</Link>
                      </div>
                    </motion.div>
                  </React.Fragment>
                 );
               })}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
      <style jsx global>{`
        :root { --p-gradient: linear-gradient(135deg, #ff5722 0%, #ff9f43 100%); }
        .bg-page-gradient { background: #fdfdfd; }
        
        .category-hero-container { height: 75vh; transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1); position: relative; display: flex; align-items: center; justify-content: center; overflow: hidden; background: #000; }
        .hero-map-mode { height: 35vh; border-bottom: 3px solid rgba(255, 193, 7, 0.3); }
        .hero-image-wrapper { position: absolute; inset: 0; z-index: 1; }
        .hero-overlay-gradient { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.9)); z-index: 2; }
        .hero-title { font-size: clamp(2.5rem, 8vw, 6rem); letter-spacing: -3px; }
        
        .luxury-search-bar { background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.2); border-radius: 100px; padding: 12px 25px; display: flex; align-items: center; color: white; }
        .luxury-search-bar input { background: transparent; border: none; color: white; outline: none; width: 100%; font-weight: 500; }
        
        .luxury-switcher { background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(15px); padding: 6px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.15); display: flex; gap: 4px; }
        .switcher-btn { position: relative; border: none; background: transparent; padding: 10px 18px; border-radius: 14px; color: rgba(255,255,255,0.6); display: flex; align-items: center; gap: 10px; font-size: 0.8rem; font-weight: 700; transition: 0.3s; z-index: 1; text-transform: uppercase; }
        .switcher-btn.active { color: #000; }
        .active-bg { position: absolute; inset: 0; background: #ff5722; border-radius: 14px; z-index: -1; box-shadow: 0 4px 15px rgba(255, 193, 7, 0.3); }

        /* 🌤️ WEATHER INTERACTIVE WIDGET */
        .weather-container-luxury { position: absolute; top: 25px; left: 25px; z-index: 1100; background: rgba(10, 10, 10, 0.75); backdrop-filter: blur(15px); padding: 12px 20px; border-radius: 24px; border: 1px solid rgba(255, 255, 255, 0.15); color: white; cursor: pointer; transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1); }
        .weather-main-icon { width: 40px; height: 40px; background: var(--p-gradient); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; }
        .weather-temp-large { font-size: 1.6rem; font-weight: 900; line-height: 1; }
        .weather-label { font-size: 0.65rem; text-transform: uppercase; opacity: 0.6; }
        .forecast-day .day-name { font-size: 0.6rem; text-transform: uppercase; opacity: 0.5; font-weight: 700; }
        .forecast-day .day-temp { font-size: 1rem; font-weight: 800; color: #ff5722; }

        .map-wrapper-premium { height: 70vh; border-radius: 40px; border: 10px solid #fff; position: relative; overflow: hidden; background:#111 }
        .map-section-active { padding: 20px; }

        .luxury-card { height: 400px; position: relative; z-index: 5; }
        .card-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.95) 10%, transparent 60%); z-index: 2; }
        .dist-badge { background: rgba(255,255,255,0.2); backdrop-filter: blur(5px); color: rgba(0,0,0,0.95); padding: 4px 12px; border-radius: 100px; font-size: 0.7rem; font-weight: 700; }
        
        .hover-reveal-grid { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.4s ease-in-out, opacity 0.3s; opacity: 0; }
        .hover-reveal-grid.show { grid-template-rows: 1fr; opacity: 1; margin-top: 12px; }
        
        /* 📜 LIST ITEM UI */
        .list-card-premium { border-left: 5px solid #ff5722 !important; transition: 0.3s; }
        .btn-action-glass { width: 36px; height: 36px; border-radius: 50%; background: #f8f9fa; color: #666; display: flex; align-items: center; justify-content: center; border:none; }
        .btn-view-premium { background: #111; color: #fff; border-radius: 100px; padding: 7px 18px; font-size: 0.7rem; font-weight: 800; text-decoration: none; display: flex; align-items: center; }

        .timeline-track { position: absolute; left: 50%; top: 0; bottom: 0; transform: translateX(-50%); width: 2px; background: #e9ecef; }
        .timeline-progress { width: 100%; height: 100%; background: #ff5722; transform-origin: top; }
        .timeline-dot { width: 22px; height: 22px; border-radius: 50%; background: white; border: 4px solid #ff5722; }

        .line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        /* --- LUXURY CARD BASE --- */
.luxury-card {
    height: 420px;
    position: relative;
    z-index: 5;
    transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
    cursor: pointer;
    box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
}

/* --- OVERLAY GRADIENTS --- */
.card-overlay {
    position: absolute;
    inset: 0;
    /* Layer 1: Dark base */
    background: linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.2) 50%, transparent 100%);
    z-index: 2;
    transition: opacity 0.5s ease;
}

.luxury-card:hover .card-overlay {
    /* Layer 2: Deeper focus on hover */
    background: linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.4) 60%, transparent 100%);
}

/* --- ICON BUTTONS (Glassmorphism) --- */
.card-actions {
    position: absolute;
    top: 20px;
    left: 20px;
    right: 20px;
    z-index: 10;
    display: flex;
    justify-content: space-between;
    align-items: center;
    pointer-events: none; /* Allows hover to trigger card underneath */
}

.action-btn {
    pointer-events: auto;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    width: 44px;
    height: 44px;
    border-radius: 50%;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.action-btn:hover {
    background: #ff5722;
    color: #000;
    transform: scale(1.1) rotate(10deg);
    border-color: #ff5722;
}

.action-btn.active {
    background: #ff5722;
    border-color: #ff5722;
    animation: heartPulse 1.5s infinite;
}

/* --- CONTENT REVEAL --- */
.card-content {
    position: absolute;
    bottom: 0;
    width: 100%;
    z-index: 10;
    transition: transform 0.5s ease;
}

.card-content h3 {
    text-shadow: 0 2px 10px rgba(0,0,0,0.8);
    letter-spacing: -0.5px;
    margin-bottom: 5px;
}

.expandable-content {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease;
    opacity: 0;
}

.expandable-content.show {
    grid-template-rows: 1fr;
    opacity: 1;
}

/* --- EXPLORE BUTTON --- */
.btn-luxury-action {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 14px;
    margin-top: 15px;
    background: var(--p-gradient);
    border-radius: 14px;
    color: white;
    font-weight: 800;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    text-decoration: none;
    transition: all 0.3s ease;
    border: none;
}

.btn-luxury-action:hover {
    letter-spacing: 3px;
    box-shadow: 0 10px 25px rgba(255, 87, 34, 0.4);
    transform: translateY(-2px);
}

/* --- THE GLOW LINE --- */
.luxury-card .h-1.bg-warning {
    height: 3px !important;
    background: var(--p-gradient) !important;
    box-shadow: 0 0 15px rgba(255, 159, 67, 0.6);
    transition: width 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}

/* --- ANIMATIONS --- */
@keyframes heartPulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.15); }
    100% { transform: scale(1); }
}

/* Hover State for the whole card */
.luxury-card:hover {
    transform: translateY(-12px);
    box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.6);
    border-color: rgba(255, 193, 7, 0.5);
}
    /* --- HERO CONTAINER BASE --- */
.category-hero-container {
    height: 75vh;
    transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: #050505; /* Deep luxury black */
}

/* --- DYNAMIC MODES --- */
.hero-map-mode {
    height: 35vh;
    border-bottom: 2px solid rgba(255, 193, 7, 0.3);
}

/* --- THE IMAGE ENGINE --- */
.hero-image-wrapper {
    position: absolute;
    inset: 0;
    z-index: 1;
    transform: scale(1.1); /* Prevents white edges during parallax */
}

.hero-overlay-gradient {
    position: absolute;
    inset: 0;
    /* Layer 1: Dark base for readability */
    background: linear-gradient(
        to bottom, 
        rgba(0,0,0,0.1) 0%, 
        rgba(0,0,0,0.4) 50%, 
        rgba(0,0,0,0.9) 100%
    );
    /* Layer 2: Side vignettes for cinematic focus */
    box-shadow: inset 0 0 150px rgba(0,0,0,0.6);
    z-index: 2;
}

/* --- TYPOGRAPHY: THE TITLE --- */
.hero-title {
    font-size: clamp(3rem, 10vw, 7rem); /* Responsive fluid font */
    font-weight: 950;
    letter-spacing: -4px;
    text-transform: uppercase;
    color: #fff;
    margin-bottom: 0;
    line-height: 0.9;
    /* Cinematic Text Shadow */
    text-shadow: 0 15px 40px rgba(0,0,0,0.6);
    background: linear-gradient(to bottom, #fff 40%, #ccc 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

/* --- EDITORIAL BADGE --- */
.editorial-pill {
    display: inline-flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    padding: 8px 24px;
    border-radius: 100px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: rgba(255, 255, 255, 0.9);
    font-size: 0.75rem;
    letter-spacing: 4px;
    font-weight: 800;
    text-transform: uppercase;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.editorial-pill .dot {
    width: 8px;
    height: 8px;
    background: #ff5722;
    border-radius: 50%;
    margin-right: 12px;
    box-shadow: 0 0 10px #ff5722;
    animation: pulse 2s infinite;
}

/* --- LUXURY SEARCH BAR --- */
.luxury-search-bar {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(25px);
    -webkit-backdrop-filter: blur(25px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 100px;
    padding: 14px 28px;
    display: flex;
    align-items: center;
    color: white;
    transition: all 0.4s ease;
    width: 100%;
    max-width: 450px;
    margin: 0 auto;
}

.luxury-search-bar:focus-within {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 193, 7, 0.5);
    transform: translateY(-2px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.4);
}

.luxury-search-bar i {
    color: #ff5722;
    font-size: 1.1rem;
}

.luxury-search-bar input {
    background: transparent;
    border: none;
    color: white;
    outline: none;
    width: 100%;
    font-weight: 500;
    font-size: 0.95rem;
    margin-left: 10px;
}

.luxury-search-bar input::placeholder {
    color: rgba(255, 255, 255, 0.4);
}

/* --- ANIMATIONS --- */
@keyframes pulse {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.4); opacity: 0.6; }
    100% { transform: scale(1); opacity: 1; }
}

/* Optional: Subtle mask at the bottom for smooth scroll transition */
.hero-curve-mask {
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    z-index: 5;
    transform: rotate(180deg);
}
      `}</style>
    </div>
  );
}