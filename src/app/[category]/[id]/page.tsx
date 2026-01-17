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

// ✅ Leaflet dynamic import
const Geography = dynamic(
  () => import('../../components/commonComponents/Geography'),
  {
    ssr: false,
    loading: () => (
      <div
        className="section-card shadow-sm bg-light d-flex align-items-center justify-content-center"
        style={{ height: '450px' }}
      >
        <div className="text-center">
          <div className="spinner-border text-primary mb-2" role="status"></div>
          <p className="text-muted small fw-bold">Loading Map...</p>
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
  const params = useParams()
  const category = params?.category as string
  const id = params?.id as string

  const [data, setData] = useState<Destination | null>(null)
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'info' | 'hotels'>('info')
  const [activeSection, setActiveSection] = useState('overview')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  useEffect(() => {
    if (!category || !id) return
    setLoading(true)
    fetch(`/api/${category}/${id}`)
      .then(res => res.json())
      .then((json: Destination) => setData(json))
      .catch(err => console.error('Failed to fetch data', err))
      .finally(() => setLoading(false))
  }, [category, id])

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

  if (loading) return (
    <div className="page-loader d-flex flex-column align-items-center justify-content-center min-vh-100 bg-white">
      <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
        <Image src="/assets/images/logo_icon.png" alt="Logo" width={150} height={150} priority />
      </motion.div>
      <p className="mt-4 fw-bold">Loading {id?.replace(/-/g, ' ')}...</p>
    </div>
  )

  if (!data) return <div className="text-center py-5">Data not found</div>

  const navLinks = [
    { id: 'overview', label: 'Overview', icon: 'fa-info-circle' },
    { id: 'highlights', label: 'Highlights', icon: 'fa-star' },
    { id: 'geography', label: 'Geography', icon: 'fa-map' },
    { id: 'activities', label: 'Activities', icon: 'fa-swimmer' },
    { id: 'attractions', label: 'Attractions', icon: 'fa-camera' },
    { id: 'gallery', label: 'Gallery', icon: 'fa-images' },
    { id: 'reach', label: 'Reach', icon: 'fa-route' },
  ]

  return (
    <div className="item-page-container bg-[#fcfaf8]">
      <motion.div
        className="fixed-top"
        style={{ scaleX, height: '4px', background: data.color || '#ff5722', zIndex: 10001 }}
      />

      <Banner
        title={data.title}
        subtitle={data.subtitle}
        image={data.insideBannerImage ?? data.bannerImage}
        color={data.color}
        view={view}
        setView={setView}
      />

      {/* ✅ MOBILE FLOATING ACTION BUTTON (Restored) */}
      {view === 'info' && (
        <div className="d-lg-none fixed-bottom p-3 d-flex justify-content-end" style={{ zIndex: 9999 }}>
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

      <div className="container-fluid py-5 px-lg-5">
        <div className="row g-4 justify-content-center">

          {/* ✅ ASIDE ONLY FOR INFO VIEW */}
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
                  <div id="overview" className="section-card shadow-sm">
                    <Overview content={data.overview} color={data.color} />
                  </div>
                  <div id="highlights" className="mb-5">
                    <Highlights highlights={data.highlights} color={data.color} />
                  </div>
                  <div id="geography">
                    <Geography content={data.geography} coordinates={data.coordinates} color={data.color} />
                  </div>
                  <div id="activities" className="mb-5">
                    <Activities activities={data.activities} color={data.color} />
                  </div>
                  <div id="attractions" className="mb-5">
                    <Attractions items={data.attractions} color={data.color} />
                    {data.marineLife && <MarineLife content={data.marineLife} color={data.color} />}
                  </div>
                  <div id="gallery" className="mb-5">
                    <Gallery images={data.gallery} color={data.color} />
                  </div>
                  <div id="reach" className="mb-5">
                    <HowToReach transport={data.howToReach} color={data.color} />
                  </div>
                </motion.div>
              ) : (
                <motion.div key="hotels" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <ComingSoon />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .section-card { background: #fff; padding: 2rem; border-radius: 1.5rem; margin-bottom: 3.5rem; border: 1px solid #eee; }
        .nav-link-item { display: flex; align-items: center; padding: 12px 15px; border-radius: 8px; text-decoration: none; transition: 0.3s ease; }
        .nav-link-item:hover { background: #f8f9fa; }
        div[id] { scroll-margin-top: 120px; }
        @media (max-width: 768px) {
          .section-card { padding: 1.5rem; border-radius: 1rem; }
        }
      `}</style>
    </div>
  )
}