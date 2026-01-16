'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'

import BeachSlider from './beaches/BeachSlider'
import ParallaxBanner from './commonComponents/ParallaxBanner'
import Translator from './commonComponents/Translator'
import { useLanguage } from './context/LanguageContext'

interface Cultural {
  id: string
  title: string
  subtitle?: string
  bannerImage?: string
  color?: string
}

const CulturalList: React.FC = () => {
  const [items, setItems] = useState<Cultural[]>([])
  const { language } = useLanguage()
  const { scrollYProgress } = useScroll()

  // Dynamic movement for an editorial "pop"
  const yImage = useTransform(scrollYProgress, [0, 1], [0, -110])
  const yText = useTransform(scrollYProgress, [0, 1], [0, 70])

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch('/api/culture')
        const json = await res.json()
        if (json.success) setItems(json.data.slice(0, 5))
      } catch (err) {
        console.error('Failed to fetch culture data', err)
      }
    }
    fetchItems()
  }, [])

  const generateSlug = (id?: string) =>
    (id || '').toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')

  return (
    <section className="cultural-magazine-section">
      {/* 🎭 HERO BANNER */}
      <div className="banner-wrapper mb-5">
        <ParallaxBanner
          image="/assets/images/culturalHomeBanner.jpg"
          title="Cultural & Unique"
        />
        <div className="banner-bottom-fade"></div>
      </div>

      <div className="container py-5">
        <div className="row align-items-center g-5">
          
          {/* 🖼️ LEFT: ART & TRADITION STACK */}
          <div className="col-lg-6 position-relative mb-5 mb-lg-0">
            <motion.div style={{ y: yImage }} className="culture-main-frame shadow-lg">
              <Image
                src="/assets/images/culturalHomeImg1.jpg"
                alt="Traditional Maharashtrian Arts"
                width={800}
                height={1000}
                className="img-fluid heritage-img"
              />
              {/* Floating Culture Badge (Mask Icon) */}
              <div className="culture-badge">
                <i className="fas fa-theater-masks"></i>
              </div>
            </motion.div>
            
            <div className="culture-sub-frame shadow-2xl d-none d-md-block">
              <Image
                src="/assets/images/culturalHomeImg.jpg"
                alt="Local Craftsmanship"
                width={450}
                height={350}
                className="img-fluid shadow-sm"
              />
            </div>
          </div>

          {/* ✍️ RIGHT: EDITORIAL CONTENT */}
          <div className="col-lg-6 ps-lg-5">
            <motion.div style={{ y: yText }} className="content-editorial">
              <span className="top-category-label">
                <Translator text="Arts, Folk & Identity" targetLang={language} />
              </span>
              
              <h2 className="display-4 fw-bold culture-title mb-4">
                Tradition, <span className="text-royal">Art</span> <br />
                & Living <span className="text-secondary-brand">Spirit</span>
              </h2>
              
              <div className="heritage-divider mb-4"></div>
              
              <p className="lead text-dark fw-medium mb-4">
                <Translator
                  text="Maharashtra’s cultural heritage is a vibrant mix of traditional arts, colorful festivals, and historic customs that define its soul."
                  targetLang={language}
                />
              </p>
              
              <p className="text-muted fs-5 mb-5">
                <Translator
                  text="From the intricate lines of Warli paintings and the energetic beats of Lavani to the grandeur of Ganesh Chaturthi, witness a culture that breathes through its people."
                  targetLang={language}
                />
              </p>

              <div className="cta-wrapper">
                <Link href="/culture" className="culture-magazine-btn">
                  <Translator text="Discover The Heritage" targetLang={language} />
                  <span className="ms-3">→</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* 🎢 THE SLIDER: Vibrant Background Accent */}
        <div className="mt-10 slider-block-heritage">
          <div className="d-flex justify-content-between align-items-end mb-5 px-2">
             <div>
                <h3 className="fw-bold h2 text-secondary-brand m-0">
                  <Translator text="Cultural Gems" targetLang={language} />
                </h3>
                <p className="text-muted m-0">Explore the unique identity of the Konkan and Desh regions</p>
             </div>
          </div>
          
          <div className="slider-bg-accent rounded-4 p-4 p-md-4 shadow-sm">
            {items.length > 0 ? (
              <BeachSlider
                beaches={items}
                category="culture"
                generateSlug={generateSlug}
              />
            ) : (
              <div className="text-center py-5 opacity-50">Curating Experiences...</div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .cultural-magazine-section {
          background-color: rgb(252, 255, 230);
          overflow: hidden;
          padding-bottom: 2rem;
        }

        .text-royal { color: #6a0dad; } /* Royal Purple */
        .text-secondary-brand { color: var(--secondary-color); }

        /* Typography */
        .top-category-label {
          color: #d10068; /* Magenta accent */
          font-weight: 800;
          letter-spacing: 3px;
          text-transform: uppercase;
          font-size: 0.85rem;
        }

        .culture-title {
          line-height: 1.1;
          color: #1a1a1a;
          letter-spacing: -1.5px;
        }

        /* Image Stack Styling */
        .culture-main-frame {
          position: relative;
          z-index: 2;
          border-left: 12px solid #6a0dad; /* Purple border for Culture */
        }

        .culture-sub-frame {
          position: absolute;
          bottom: -40px;
          right: -20px;
          width: 55%;
          z-index: 3;
          border: 0 solid #fff;
        }

        .culture-badge {
          position: absolute;
          top: 30px;
          left: -30px;
          width: 60px;
          height: 60px;
          background: #d10068; /* Bright Magenta */
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          font-size: 1.5rem;
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
          animation: float 4s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }

        /* UI Elements */
        .heritage-divider {
          width: 70px;
          height: 5px;
          background: var(--accent-color);
        }

        .culture-magazine-btn {
          display: inline-flex;
          align-items: center;
          background: #6a0dad;
          color: #fff;
          padding: 1rem 2.5rem;
          text-decoration: none;
          font-weight: 700;
          border-radius: 5px;
          transition: 0.3s ease;
        }

        .culture-magazine-btn:hover {
          background: #d10068;
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(106, 13, 173, 0.2);
        }

        .slider-bg-accent {
          background: #fff;
          border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .mt-10 { margin-top: 10rem; }

        @media (max-width: 991px) {
          .mt-10 { margin-top: 5rem; }
          .culture-title { font-size: 2.5rem; }
          .culture-sub-frame { right: 0; bottom: -30px; width: 65%; }
        }
      `}</style>
    </section>
  )
}

export default CulturalList