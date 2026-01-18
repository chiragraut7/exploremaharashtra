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

export default function CategoryPage() {
  const { language } = useLanguage();
  const { category } = useParams() as { category: string };
  
  // DATA STATES
  const [items, setItems] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // UI STATES
  const [activeShare, setActiveShare] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState<number | null>(null);
  
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const bannerY = useTransform(scrollYProgress, [0, 0.5], [0, 120]);

  // --- DYNAMIC STORAGE KEY ---
  const storageKey = `favs_${category}`;

  // --- ASSET PATHS ---
  // IMPORTANT: Place your common image here: /public/assets/images/common-things-to-do.jpg
  const commonThingsToDoImage = "/assets/images/common-things-to-do.jpg";

 const getBannerImage = (cat: string) => {
    const images: Record<string, string> = {
      beaches: "/assets/images/beachHomeBanner.jpg",
      forts: "/assets/images/fortsHomeBanner.jpg",
      hills: "/assets/images/hillsHomeBanner.jpg",
      nature: "/assets/images/natureHomeBanner.jpg",
      religious: "/assets/images/religiousHomeBanner.jpg",
      culture: "/assets/images/culturalHomeBanner.jpg",
    };
    return images[cat?.toLowerCase()] || "/assets/images/beachHomeBanner.jpg";
  };

  const getCategoryIcon = (cat: string) => {
    const icons: Record<string, string> = {
      beaches: "fa-umbrella-beach",
      hills: "fa-mountain-sun",
      forts: "fa-chess-rook",
      nature: "fa-paw",
      religious: "fa-om",
      culture: "fa-masks-theater",
    };
    return icons[cat?.toLowerCase()] || "fa-map-marked-alt"; 
  };

  useEffect(() => {
    const savedFavs = localStorage.getItem(storageKey);
    if (savedFavs) setFavorites(JSON.parse(savedFavs));
    
    AOS.init({ duration: 800, once: false });
    
    async function fetchItems() {
      try {
        const res = await fetch(`/api/${category}`);
        const json = await res.json();
        setItems(json.success ? json.data : []);
      } catch(e) {}
    }
    if (category) fetchItems();
  }, [category, storageKey]);

  // --- TOGGLE FAVORITE ---
  const toggleFavorite = (e: React.MouseEvent, itemId: string) => {
    e.stopPropagation();
    const uniqueId = itemId; 
    let updatedFavs = [...favorites];
    if (updatedFavs.includes(uniqueId)) {
      updatedFavs = updatedFavs.filter(id => id !== uniqueId);
    } else {
      updatedFavs.push(uniqueId);
    }
    setFavorites(updatedFavs);
    localStorage.setItem(storageKey, JSON.stringify(updatedFavs));
  };

  const removeAllFavorites = () => {
    if (window.confirm(`Clear all saved ${category}?`)) {
        setFavorites([]);
        localStorage.removeItem(storageKey);
    }
  };

  const handleShare = (platform: string, item: any) => {
    const url = typeof window !== 'undefined' ? `${window.location.origin}/${category}/${item.slug || item.id}` : '';
    if (platform === 'whatsapp') window.open(`https://wa.me/?text=${encodeURIComponent(url)}`);
    if (platform === 'copy') { 
        navigator.clipboard.writeText(url);
        alert("Link copied!");
    }
    setActiveShare(null);
  };

  const filteredItems = items.filter(item => 
    (item.title || item.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-vh-100 bg-dot-pattern" ref={containerRef}>
      <motion.div className="fixed-top" style={{ scaleX: scrollYProgress, height: '4px', background: 'var(--primary-color)', transformOrigin: '0%', zIndex: 9999 }} />

      <header className="category-hero-container">
        
        {/* FAVORITES HUD */}
        <div className="fav-hud-top d-flex gap-2">
            <AnimatePresence mode="wait">
                <motion.div 
                    key={favorites.length}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="backdrop-blur-md bg-white/10 border border-white/20 rounded-pill px-3 py-2 d-flex align-items-center gap-2 text-white shadow-lg"
                >
                    <i className={`fas fa-heart ${favorites.length > 0 ? 'text-danger animate-pulse' : 'text-white/50'}`}></i>
                    <span className="fw-bold">{favorites.length}</span>
                    <span style={{ fontSize: '0.7rem' }}>
                        <Translator text="Saved" targetLang={language}/> 
                        <span className="ms-1 opacity-50 text-uppercase" style={{fontSize: '0.6rem'}}>({category})</span>
                    </span>
                </motion.div>
            </AnimatePresence>
            
            {favorites.length > 0 && (
                <button onClick={removeAllFavorites} className="btn-clear-favs backdrop-blur-md">
                   <i className="fas fa-trash-alt"></i>
                </button>
            )}
        </div>

        <motion.div style={{ y: bannerY }} className="hero-image-wrapper">
          <Image src={getBannerImage(category)} alt={category} fill priority className="object-fit-cover" />
          <div className="hero-overlay-dark" />
        </motion.div>

        <div className="container text-center z-10 position-relative pt-5">
           <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
             <span className="category-label mb-2 d-inline-block">
               <Translator text="Maharashtra Tourism" targetLang={language} />
             </span>
             <h1 className="display-3 text-white fw-black text-uppercase tracking-tighter mb-4">
               <Translator text={category} targetLang={language}/>
             </h1>
           </motion.div>
           
           <div className="row justify-content-center px-3">
              <div className="col-md-6 backdrop-blur-md bg-white/10 border border-white/20 rounded-pill p-1 shadow-lg d-flex align-items-center">
                <i className="fas fa-search text-white ms-3 opacity-75"></i>
                <input type="text" className="form-control bg-transparent border-0 text-white placeholder-white shadow-none px-3" placeholder={`Search in ${category}...`} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
           </div>
        </div>

        <div className="hero-curve-mask">
            <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 120L1440 120L1440 0C1440 0 1110 90 720 90C330 90 0 0 0 0L0 120Z" fill="#fcfaf8"/>
            </svg>
        </div>
      </header>

      {/* --- MAIN TIMELINE SECTION --- */}
      <section className="container position-relative py-5 z-10">
        <div className="timeline-line-container d-none d-md-block">
            <div className="timeline-track" />
            <motion.div className="timeline-progress" style={{ scaleY, originY: 0 }} />
        </div>

        <div className="row g-0 justify-content-center">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => {
              const rawId = item.slug || item.id || `item-${index}`;
              const isFav = favorites.includes(rawId);
              
              return (
                <motion.div key={rawId} className="col-12 mb-5 position-relative" onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)} >
                  <div className="d-none d-md-flex position-absolute start-50 translate-middle timeline-node">
                    <motion.div animate={{ scale: isFav ? 1.3 : 1, borderColor: isFav ? '#ff4d4d' : 'rgba(0,0,0,0.1)' }} className="outer-node" >
                        <div className="inner-node" style={{ backgroundColor: isFav ? '#ff4d4d' : '#ccc' }}></div>
                    </motion.div>
                  </div>

                  <div className={`row justify-content-center align-items-center ${index % 2 !== 0 ? 'flex-md-row-reverse' : ''}`}>
                    <div className="col-md-5 col-lg-4 px-3" data-aos={index % 2 === 0 ? "fade-right" : "fade-left"}>
                      <div className="group position-relative overflow-hidden rounded-4 shadow-lg border-0 card-main-container" style={{ height: '270px', cursor: 'pointer' }} onClick={() => setIsZoomed(isZoomed === index ? null : index)} >
                        <Image src={item.bannerImage || '/assets/images/placeholder.jpg'} alt="img" fill className={`object-fit-cover transition-transform duration-1000 ${isZoomed === index ? 'scale-125' : 'group-hover:scale-110'}`} />
                        
                        <div className="position-absolute top-0 w-100 p-3 z-3 d-flex justify-content-between align-items-start">
                           <div className="d-flex gap-2">
                              {/* HEART ACTION */}
                              <button 
                                onClick={(e) => toggleFavorite(e, rawId)} 
                                className={`rounded-circle border-0 d-flex align-items-center justify-content-center backdrop-blur-md text-white action-trigger ${isFav ? 'bg-danger' : 'bg-black/40'}`} 
                                style={{ width: '34px', height: '34px', transition: '0.3s' }}
                              >
                                 <i className={`${isFav ? 'fas fa-heart text-white' : 'far fa-heart'} small`}></i>
                              </button>
                              
                              <div className="d-flex align-items-center">
                                 <button onClick={(e) => { e.stopPropagation(); setActiveShare(activeShare === index ? null : index); }} className="rounded-circle border-0 d-flex align-items-center justify-content-center backdrop-blur-md bg-black/40 text-white action-trigger" style={{ width: '34px', height: '34px' }}>
                                   <i className="fas fa-share-alt small"></i>
                                 </button>
                                 <AnimatePresence>
                                   {activeShare === index && (
                                     <motion.div initial={{ x: -10, opacity: 0 }} animate={{ x: 10, opacity: 1 }} exit={{ x: -10, opacity: 0 }} className="d-flex gap-2 p-1 ms-2 rounded-pill bg-white/20 backdrop-blur-md border border-white/30">
                                       <button onClick={() => handleShare('whatsapp', item)} className="btn-share-sm text-success"><i className="fab fa-whatsapp"></i></button>
                                       <button onClick={() => handleShare('copy', item)} className="btn-share-sm text-white"><i className="fas fa-link"></i></button>
                                     </motion.div>
                                   )}
                                 </AnimatePresence>
                              </div>
                           </div>
                           <div className="rounded-circle d-flex align-items-center justify-content-center backdrop-blur-md bg-white/10 border border-white/30" style={{ width: '36px', height: '36px' }}>
                               <i className={`fas ${getCategoryIcon(category)} text-white small`}></i>
                           </div>
                        </div>

                        <div className="position-absolute inset-0 bg-gradient-to-t from-black/95 via-black/10 to-transparent" />
                        
                        <div className="position-absolute bottom-0 start-0 end-0 m-3 p-3 rounded-4 backdrop-blur-lg bg-white/5 border border-white/10 transition-all duration-500 group-hover:-translate-y-2">
                           <div className="d-flex justify-content-between align-items-center mb-1">
                              <h3 className="fw-bold h6 mb-0 text-white"><Translator text={item.title || item.name} targetLang={language} /></h3>
                              {item.distance && (
                                <span className="badge rounded-pill bg-primary/20 border border-primary/30" style={{ fontSize: '0.6rem' }}>
                                  <i className="fas fa-car me-1"></i>{item.distance}
                                </span>
                              )}
                           </div>
                           
                           <div className="max-h-0 overflow-hidden transition-all duration-500 group-hover:max-h-[140px] group-hover:opacity-100">
                              <p className="text-white-50 mb-3 line-clamp-2" style={{ fontSize: '0.75rem' }}><Translator text={item.subtitle} targetLang={language} /></p>
                              <Link href={`/${category}/${rawId}`} className="premium-btn">
                                 <span className="btn-content"><Translator text="Explore Now" targetLang={language} /><i className="fas fa-arrow-right ms-2"></i></span>
                                 <div className="btn-shine"></div>
                              </Link>
                           </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-5 col-lg-4 d-none d-md-block"></div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </section>

      {/* --- NEW COMMON "THINGS TO DO" SECTION --- */}
      <section className="container pb-5 position-relative z-10 mt-5">
           <div className="row justify-content-center" data-aos="fade-up">
              <div className="col-lg-10">
                 <div className="things-to-do-card position-relative rounded-5 overflow-hidden shadow-lg" style={{height: '400px'}}>
                    <Image
                       src={commonThingsToDoImage} // Uses the common image defined at the top
                       alt="Things to Do"
                       fill
                       className="object-fit-cover"
                    />
                    <div className="hero-overlay-dark" style={{background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)'}} />
                    
                    <div className="position-absolute bottom-0 start-0 p-5 text-white z-20">
                       <h2 className="display-6 fw-bold mb-3">
                          <Translator text="Things to Do" targetLang={language} />
                       </h2>
                       <p className="lead mb-4 opacity-75" style={{maxWidth: '600px'}}>
                          <Translator text={`Discover exciting activities, hidden gems, and must-do experiences in ${category}.`} targetLang={language} />
                       </p>
                       <div>
                          <button className="premium-btn border-0">
                             <span className="btn-content"><Translator text="View Activities" targetLang={language} /></span>
                             <div className="btn-shine"></div>
                          </button>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
      </section>

      <style jsx global>{`
        .bg-dot-pattern { background-color: #fcfaf8; background-image: radial-gradient(#d5d5d5 0.7px, transparent 0.7px); background-size: 20px 20px; }
        .bg-dot-pattern header { margin-bottom: -2rem; }
        
        .category-hero-container { height: 70vh; position: relative; overflow: hidden; display: flex; align-items: center; background: #000; }
        .hero-image-wrapper { position: absolute; inset: 0; z-index: 1; }
        .hero-overlay-dark { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.8)); z-index: 2; }
        
        /* FAVORITES HUD */
        .fav-hud-top { position: absolute; top: 80px; right: 25px; z-index: 100; }
        .btn-clear-favs { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.2); color: #fff; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; transition: 0.3s; }
        .btn-clear-favs:hover { background: #dc3545; border-color: #dc3545; }

        .category-label { text-transform: uppercase; letter-spacing: 6px; font-size: 0.75rem; color: var(--primary-color); font-weight: 800; border-bottom: 2px solid var(--primary-color); }
        .fw-black { font-weight: 900; }
        .tracking-tighter { letter-spacing: -2px; }
        .hero-curve-mask { position: absolute; bottom: -1px; left: 0; width: 100%; z-index: 5; }
        .hero-curve-mask svg { width: 100%; height: auto; display: block; }
        
        /* TIMELINE CSS */
        .timeline-line-container { width: 2px; top: 50px; bottom: 50px; height: auto; position: absolute; left: 50%; transform: translateX(-50%); z-index: 1; }
        .timeline-track { position: absolute; inset: 0; background: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.05) 5%, rgba(0,0,0,0.05) 95%, transparent 100%); }
        .timeline-progress { position: absolute; top: 0; width: 100%; height: 100%; background: var(--primary-color); }
        
        .timeline-node { top: 50%; z-index: 10; }
        .outer-node { width: 14px; height: 14px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(0,0,0,0.08); transition: 0.3s ease-out; }
        .inner-node { width: 5px; height: 5px; border-radius: 50%; transition: 0.3s; }

        .premium-btn { position: relative; display: inline-flex; align-items: center; padding: 8px 24px; background: var(--primary-color); color: white !important; border-radius: 50px; font-weight: 700; font-size: 0.6rem; text-transform: uppercase; letter-spacing: 1.2px; overflow: hidden; transition: 0.4s; box-shadow: 0 4px 15px rgba(0,0,0,0.1); text-decoration: none; border: none; }
        .btn-shine { position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(120deg, transparent, rgba(255,255,255,0.3), transparent); transition: 0.6s; }
        .premium-btn:hover .btn-shine { left: 100%; }

        .action-trigger { transition: 0.3s; cursor: pointer; }
        .action-trigger:hover { transform: scale(1.05); }
        .btn-share-sm { background: transparent; border: none; font-size: 0.8rem; padding: 0 6px; transition: 0.2s; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .hover-danger:hover { background-color: #dc3545 !important; border-color: #dc3545 !important; }

        @media (max-width: 768px) { 
            .category-hero-container { height: 60vh; } 
            .timeline-line-container { display: none; } 
            .fav-hud-top { top: 20px; }
            .things-to-do-card { height: 300px !important; }
            .things-to-do-card .p-5 { padding: 1.5rem !important; }
        }
        .category-hero-container .top-0 {top:50px !important}
      `}</style>
    </div>
  );
}