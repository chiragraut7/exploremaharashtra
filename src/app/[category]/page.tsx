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
  const [items, setItems] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeShare, setActiveShare] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState<number | null>(null);
  
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  // Parallax effect for the banner image
  const bannerY = useTransform(scrollYProgress, [0, 0.5], [0, 120]);

  // Asset Mapping
  const getBannerImage = (cat: string) => {
    const images: Record<string, string> = {
      beaches: "/assets/images/beachHomeBanner.jpg",
      forts: "/assets/images/fortHomeBanner.jpg",
      hillstations: "/assets/images/hillHomeBanner.jpg",
      wildlife: "/assets/images/wildlifeHomeBanner.jpg",
      religious: "/assets/images/religiousHomeBanner.jpg",
    };
    return images[cat?.toLowerCase()] || "/assets/images/beachHomeBanner.jpg";
  };

  useEffect(() => {
    const savedFavs = localStorage.getItem('travel_favs');
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
  }, [category]);

  const handleShare = (platform: string, item: any) => {
    const url = typeof window !== 'undefined' ? `${window.location.origin}/${category}/${item.slug || item.id}` : '';
    if (platform === 'whatsapp') window.open(`https://wa.me/?text=${encodeURIComponent(url)}`);
    if (platform === 'copy') {
        navigator.clipboard.writeText(url);
        alert("Link copied!");
    }
    setActiveShare(null);
  };

  const toggleFavorite = (e: React.MouseEvent, itemId: string) => {
    e.stopPropagation();
    const uniqueId = `${category}-${itemId}`;
    let updatedFavs = [...favorites];
    if (updatedFavs.includes(uniqueId)) {
      updatedFavs = updatedFavs.filter(id => id !== uniqueId);
    } else {
      updatedFavs.push(uniqueId);
    }
    setFavorites(updatedFavs);
    localStorage.setItem('travel_favs', JSON.stringify(updatedFavs));
  };

  const getCategoryIcon = (cat: string) => {
    const icons: Record<string, string> = {
      beaches: "fa-umbrella-beach",
      hillstations: "fa-mountain",
      forts: "fa-chess-rook",
      wildlife: "fa-paw",
      religious: "fa-om",
      cultural: "fa-masks-theater",
    };
    return icons[cat?.toLowerCase()] || "fa-map-marked-alt"; 
  };

  const filteredItems = items.filter(item => 
    (item.title || item.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-vh-100 bg-dot-pattern" ref={containerRef}>
      <motion.div className="fixed-top" style={{ scaleX: scrollYProgress, height: '4px', background: 'var(--primary-color)', transformOrigin: '0%', zIndex: 9999 }} />

      {/* --- NEW REPLACED BANNER --- */}
      <header className="category-hero-container">
        <motion.div style={{ y: bannerY }} className="hero-image-wrapper">
          <Image 
            src={getBannerImage(category)} 
            alt={category}
            fill
            priority
            className="object-fit-cover"
          />
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
                <input 
                  type="text" 
                  className="form-control bg-transparent border-0 text-white placeholder-white shadow-none px-3" 
                  placeholder={`Search in ${category}...`} 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                />
              </div>
           </div>
        </div>

        {/* Static Curve replaced the Waves */}
        <div className="hero-curve-mask">
            <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 120L1440 120L1440 0C1440 0 1110 90 720 90C330 90 0 0 0 0L0 120Z" fill="#fcfaf8"/>
            </svg>
        </div>
      </header>

      {/* --- TIMELINE SECTION (UNTOUCHED) --- */}
      <section className="container position-relative py-5 z-10">
        <div className="position-absolute start-50 translate-middle-x d-none d-md-block timeline-line-container">
            <div className="timeline-track" />
            <motion.div className="timeline-progress" style={{ scaleY, originY: 0 }} />
        </div>

        <div className="row g-0 justify-content-center">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => {
              const rawId = item.slug || item.id || `item-${index}`;
              const isFav = favorites.includes(`${category}-${rawId}`);
              const isHovered = hoveredIndex === index;

              return (
                <motion.div 
                  key={rawId} 
                  className="col-12 mb-5 position-relative"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => { setHoveredIndex(null); setActiveShare(null); setIsZoomed(null); }}
                >
                  <div className="d-none d-md-flex position-absolute start-50 translate-middle timeline-node">
                    <motion.div 
                      animate={{ 
                        scale: isHovered ? 1.2 : 1, 
                        boxShadow: isHovered ? `0 0 10px var(--primary-color)` : `0 0 0px transparent` 
                      }} 
                      className="outer-node"
                    >
                        <div className="inner-node" style={{ backgroundColor: isHovered ? 'var(--primary-color)' : '#ccc' }}></div>
                    </motion.div>
                  </div>

                  <div className={`row justify-content-center align-items-center ${index % 2 !== 0 ? 'flex-md-row-reverse' : ''}`}>
                    <div className="col-md-5 col-lg-4 px-3" data-aos={index % 2 === 0 ? "fade-right" : "fade-left"}>
                      
                      <div 
                        className="group position-relative overflow-hidden rounded-4 shadow-lg border-0 card-main-container" 
                        style={{ height: '270px', cursor: 'pointer' }}
                        onClick={() => setIsZoomed(isZoomed === index ? null : index)}
                      >
                        <Image 
                          src={item.bannerImage || '/assets/images/placeholder.jpg'} 
                          alt="img" 
                          fill 
                          className={`object-fit-cover transition-transform duration-1000 ${isZoomed === index ? 'scale-125' : 'group-hover:scale-110'}`} 
                        />
                        
                        <div className="position-absolute top-0 w-100 p-3 z-3 d-flex justify-content-between align-items-start">
                           <div className="d-flex gap-2">
                              <button onClick={(e) => toggleFavorite(e, rawId)} className="rounded-circle border-0 d-flex align-items-center justify-content-center backdrop-blur-md bg-black/40 text-white action-trigger" style={{ width: '34px', height: '34px' }}>
                                 <i className={`${isFav ? 'fas fa-heart text-danger' : 'far fa-heart'} small`}></i>
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

                           <motion.div 
                              className="rounded-circle d-flex align-items-center justify-content-center backdrop-blur-md bg-white/10 border border-white/30" 
                              style={{ width: '36px', height: '36px' }}
                            >
                               <i className={`fas ${getCategoryIcon(category)} text-white small`}></i>
                           </motion.div>
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

      <style jsx global>{`
        .bg-dot-pattern {
          background-color: #fcfaf8;
          background-image: radial-gradient(#d5d5d5 0.7px, transparent 0.7px);
          background-size: 20px 20px;
        }
        .bg-dot-pattern header {
    margin-bottom: calc(-2rem + -7px);
}

        /* NEW BANNER STYLES */
        .category-hero-container { height: 70vh; position: relative; overflow: hidden; display: flex; align-items: center; background: #000; }
        .hero-image-wrapper { position: absolute; inset: 0; z-index: 1; }
        .hero-overlay-dark { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.8)); z-index: 2; }
        .category-label { text-transform: uppercase; letter-spacing: 6px; font-size: 0.75rem; color: var(--primary-color); font-weight: 800; border-bottom: 2px solid var(--primary-color); }
        .fw-black { font-weight: 900; }
        .tracking-tighter { letter-spacing: -2px; }
        .placeholder-white::placeholder { color: rgba(255,255,255,0.7); }
        .hero-curve-mask { position: absolute; bottom: -1px; left: 0; width: 100%; z-index: 5; }
        .hero-curve-mask svg { width: 100%; height: auto; display: block; }

        /* TIMELINE STYLES */
        .timeline-line-container { width: 1.5px; height: 100%; top: 0; z-index: 1; }
        .timeline-track { position: absolute; inset: 0; background: rgba(0,0,0,0.05); }
        .timeline-progress { position: absolute; top: 0; width: 100%; height: 100%; background: var(--primary-color); }
        .timeline-node { top: 50%; z-index: 10; }
        .outer-node { width: 14px; height: 14px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(0,0,0,0.08); transition: 0.3s ease-out; }
        .inner-node { width: 5px; height: 5px; border-radius: 50%; transition: 0.3s; }

        .premium-btn { 
          position: relative; display: inline-flex; align-items: center; 
          padding: 8px 24px; background: var(--primary-color); color: white !important; 
          border-radius: 50px; font-weight: 700; font-size: 0.6rem; 
          text-transform: uppercase; letter-spacing: 1.2px; overflow: hidden; 
          transition: 0.4s; box-shadow: 0 4px 15px rgba(0,0,0,0.1); text-decoration: none;
        }
        .btn-shine { position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(120deg, transparent, rgba(255,255,255,0.3), transparent); transition: 0.6s; }
        .premium-btn:hover .btn-shine { left: 100%; }

        .action-trigger { transition: 0.3s; cursor: pointer; }
        .action-trigger:hover { transform: scale(1.05); background: var(--primary-color) !important; }
        .btn-share-sm { background: transparent; border: none; font-size: 0.8rem; padding: 0 6px; transition: 0.2s; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

        @media (max-width: 768px) {
          .category-hero-container { height: 60vh; }
          .timeline-line-container { display: none; }
        }
      `}</style>
    </div>
  );
}