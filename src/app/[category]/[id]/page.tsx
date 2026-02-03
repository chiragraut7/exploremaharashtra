'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion'

// Components
import Banner from '../../components/commonComponents/Banner'
import Overview from '../../components/commonComponents/Overview'
import Highlights from '../../components/commonComponents/Highlights'
import Activities from '../../components/commonComponents/Activities'
import Attractions from '../../components/commonComponents/Attractions'
import MarineLife from '../../components/commonComponents/UniversalContent'
import HowToReach from '../../components/commonComponents/HowToReach'
import Gallery from '../../components/commonComponents/Gallery'
import ComingSoon from '../../components/commonComponents/ComingSoon'
import { useLanguage } from '../../components/context/LanguageContext'

// ✅ Leaflet dynamic import
const Geography = dynamic(
  () => import('../../components/commonComponents/Geography'),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-4 bg-light d-flex align-items-center justify-content-center border" style={{ height: '400px' }}>
        <div className="text-center">
          <div className="spinner-border text-secondary mb-2" role="status"></div>
          <p className="text-muted small fw-bold">Loading Interactive Map...</p>
        </div>
      </div>
    ),
  }
)

// -------------------- Types --------------------
type DetailItem = { icon?: string; label?: string; value?: string }
type GeographyContent = {
  image?: string
  intro?: string | string[]
  details?: DetailItem[]
  climate?: {
    description?: string | string[]
    seasons?: { icon?: string; text?: string }[]
  }
  conclusion?: string | string[]
}

type Destination = {
  title: string
  subtitle?: string
  bannerImage?: string
  insideBannerImage?: string
  color?: string
  coordinates?: { lat: number; lng: number }
  overview?: any
  highlights?: { icon?: string; title?: string; description?: string }[]
  geography?: GeographyContent
  activities?: any[]
  attractions?: any[]
  marineLife?: any
  gallery?: any[]
  howToReach?: any[]
}

export default function ItemPage() {
  const { language } = useLanguage()
  const params = useParams()
  const category = params?.category as string
  const id = params?.id as string

  const [data, setData] = useState<Destination | null>(null)
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'info' | 'hotels'>('info')
  const [activeSection, setActiveSection] = useState('overview')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Favorites state
  const [favorites, setFavorites] = useState<string[]>([])
  const storageKey = `favs_${category}`
  const isCurrentItemSaved = favorites.includes(id);

  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  useEffect(() => {
    if (!category || !id) return
    setLoading(true)

    // Load Data
    fetch(`/api/${category}/${id}`)
      .then(res => res.json())
      .then((json: Destination) => setData(json))
      .catch(err => console.error('Failed to fetch data', err))
      .finally(() => setLoading(false))

    // Load Favorites
    const savedFavs = localStorage.getItem(storageKey)
    if (savedFavs) setFavorites(JSON.parse(savedFavs))

  }, [category, id, storageKey])

  useEffect(() => {
    if (loading || view !== 'info') return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { rootMargin: '-20% 0px -70% 0px' }
    )
    const sections = ['overview', 'highlights', 'geography', 'activities', 'attractions', 'gallery', 'reach']
    sections.forEach((sid) => {
      const el = document.getElementById(sid)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [loading, view])

  // --- TOGGLE SINGLE ITEM ACTION ---
  const toggleCurrentItem = () => {
    let updatedFavs = [...favorites];
    if (isCurrentItemSaved) {
      updatedFavs = updatedFavs.filter(favId => favId !== id);
    } else {
      updatedFavs.push(id);
    }
    setFavorites(updatedFavs);
    localStorage.setItem(storageKey, JSON.stringify(updatedFavs));
    window.dispatchEvent(new Event('favoritesUpdated'));
  };

  if (loading) return (
    <div className="page-loader d-flex flex-column align-items-center justify-content-center min-vh-100 bg-white">
      <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
        <Image src="/assets/images/logo_icon.png" alt="Logo" width={100} height={100} priority />
      </motion.div>
    </div>
  )

  if (!data) return <div className="text-center py-5">Data not found</div>

  // ✅ UPDATED NAV LINKS (Overview Icon & Highlights Label)
  const navLinks = [
    { id: 'overview', label: 'Overview', icon: 'fa-binoculars' }, // Changed Icon
    { id: 'highlights', label: 'Trip Highlights', icon: 'fa-star' }, // Changed Label
    { id: 'geography', label: 'Geography', icon: 'fa-map-marked-alt' },
    { id: 'activities', label: 'Things to Do', icon: 'fa-person-running' },
    { id: 'attractions', label: 'Attractions', icon: 'fa-camera-retro' },
    { id: 'gallery', label: 'Gallery', icon: 'fa-images' },
    { id: 'reach', label: 'How to Reach', icon: 'fa-map-signs' },
  ]

  return (
    <>
      {/* 🔴 FIXED SINGLE SAVE BUTTON */}
      <div className="fav-single-btn">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleCurrentItem}
          className={`glass-heart-btn ${isCurrentItemSaved ? 'active' : ''}`}
          title={isCurrentItemSaved ? "Remove from saved" : "Save this place"}
        >
          <i className={`fas fa-heart ${isCurrentItemSaved ? 'text-danger' : 'text-white'}`}></i>
        </motion.button>
      </div>

      {/* --- PAGE CONTENT CONTAINER --- */}
      <div className="item-page-container bg-[#fcfaf8]">
        <motion.div
          className="fixed-top"
          style={{ scaleX, height: '4px', background: data.color || '#ff5722', zIndex: 10001 }}
        />

        <Banner
          title={data.title}
          subtitle={data.subtitle}
          category={category as string}
          image={data.insideBannerImage ?? data.bannerImage}
          color={data.color}
          view={view}
          setView={setView}
        />

        {/* Mobile FAB */}

        <div className="container-fluid py-5 px-lg-5">
          <div className="row g-4 justify-content-center">

            {/* ASIDE NAVIGATION */}
            {view === 'info' && (
              <aside className="col-lg-2 d-none d-lg-block">
                <div className="sticky-top" style={{ top: '100px' }}>
                  <nav className="bg-white p-3 rounded-4 shadow-sm border">
                    {navLinks.map((link) => (
                      <a
                        key={link.id}
                        href={`#${link.id}`}
                        className="nav-link-item mb-2"
                        style={{
                          color: activeSection === link.id ? data.color : '#666',
                          background: activeSection === link.id ? `${data.color}15` : 'transparent',
                          borderLeft: activeSection === link.id ? `4px solid ${data.color}` : '4px solid transparent',
                        }}
                      >
                        <i className={`fas ${link.icon} me-2`}></i>
                        <span className="small fw-bold">{link.label}</span>
                      </a>
                    ))}
                  </nav>
                </div>
              </aside>
            )}

            <div className={view === 'info' ? "col-lg-9" : "col-lg-10"}>
              

              <AnimatePresence mode="wait">
                {view === 'info' ? (
                  <motion.div key="info" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>

                    {/* 1. OVERVIEW */}
                    <div id="overview" className="mb-5">
                      <Overview content={data.overview} color={data.color} />
                    </div>

                    {/* 2. HIGHLIGHTS */}
                    <div id="highlights" className="mb-5">
                      <Highlights highlights={data.highlights} color={data.color} />
                    </div>

                    {/* 3. GEOGRAPHY */}
                    <div id="geography">
                      <Geography content={data.geography} coordinates={data.coordinates} color={data.color} />
                    </div>

                    {/* 4. ACTIVITIES */}
                    <div id="activities" className="mb-5">
                      <Activities
                        activities={data.activities}
                        color={data.color}
                        category={category}
                      />
                    </div>

                    {/* 5. ATTRACTIONS */}
                    <div id="attractions" className="mb-5">
                      <Attractions
                        items={data.attractions}
                        color={data.color}
                        category={category}
                      />

                      {/* 6. MARINE LIFE / UNIVERSAL CONTENT */}
                      {data.marineLife && (
                        <div className="mt-5">
                          <MarineLife
                            content={{
                              ...data.marineLife,
                              mainImage: data.insideBannerImage || data.bannerImage
                            }}
                            color={data.color}
                          />
                        </div>
                      )}
                    </div>

                    {/* 7. GALLERY */}
                    <div id="gallery" className="mb-5">
                      <Gallery images={data.gallery} color={data.color} />
                    </div>

                    {/* 8. HOW TO REACH */}
                    <div id="reach" className="mb-5">
                      <HowToReach
                        transport={data.howToReach}
                        color={data.color}
                        mainImage={data.geography?.image || data.insideBannerImage}
                      />
                    </div>

                  </motion.div>
                ) : (
                  <motion.div key="hotels" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <ComingSoon />
                  </motion.div>
                )}
              </AnimatePresence>
              {view === 'info' && (
                <div className="d-lg-none sticky-bottom p-3 d-flex justify-content-end" style={{ zIndex: 9999 }}>
                  <button
                    className="btn shadow-lg rounded-circle p-0 d-flex align-items-center justify-content-center"
                    style={{ background: data.color || '#ff5722', width: '56px', height: '56px', color: '#fff' }}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  >
                    <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-list-ul'} fs-4`}></i>
                  </button>

                  <AnimatePresence>
                    {isMobileMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="mobile-nav-popup shadow-lg bg-white rounded-4 p-2 mb-2 border"
                        style={{ position: 'absolute', bottom: '70px', right: '0', width: '220px' }}
                      >
                        {navLinks.map((link) => (
                          <a
                            key={link.id}
                            href={`#${link.id}`}
                            className="d-flex align-items-center p-3 text-decoration-none text-dark border-bottom small fw-bold"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <i className={`fas ${link.icon} me-3`} style={{ color: data.color }}></i>
                            {link.label}
                          </a>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>

        <style jsx global>{`
          .nav-link-item { display: flex; align-items: center; padding: 12px 15px; border-radius: 8px; text-decoration: none; transition: 0.3s ease; }
          .nav-link-item:hover { background: #f8f9fa; }
          div[id] { scroll-margin-top: 100px; }
          
          /* FIXED SINGLE FAVORITE BUTTON */
          .fav-single-btn { 
            position: fixed; 
            top: 100px; 
            right: 30px; 
            z-index: 10000; 
          }
          
          .glass-heart-btn {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          }

          .glass-heart-btn:hover {
            transform: scale(1.1);
            background: rgba(255, 255, 255, 0.25);
          }

          /* Active State (Saved) */
          .glass-heart-btn.active {
            background: #fff;
            border-color: #fff;
            box-shadow: 0 4px 20px rgba(255, 0, 0, 0.2);
          }
            .sticky-bottom {
  bottom: 100px;
  z-index: 1020; /* similar to bootstrap fixed */
}


          @media (max-width: 768px) {
            .fav-single-btn { top: 80px; right: 20px; }
            .glass-heart-btn { width: 45px; height: 45px; font-size: 1rem; }
          }
        `}</style>
      </div>
    </>
  )
}