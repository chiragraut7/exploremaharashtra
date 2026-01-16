'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'

import BeachSlider from './beaches/BeachSlider'
import ParallaxBanner from './commonComponents/ParallaxBanner'
import Translator from './commonComponents/Translator'
import { useLanguage } from './context/LanguageContext'

interface Nature {
  id: string
  title: string
  subtitle?: string
  bannerImage?: string
  color?: string
}

const NatureList: React.FC = () => {
  const [items, setItems] = useState<Nature[]>([])
  const { language } = useLanguage()
  const { scrollYProgress } = useScroll()

  // Magazine-style Parallax Offsets
  const yImage = useTransform(scrollYProgress, [0, 1], [0, -110])
  const yText = useTransform(scrollYProgress, [0, 1], [0, 70])

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch('/api/nature')
        const json = await res.json()
        if (json.success) setItems(json.data.slice(0, 5))
      } catch (err) {
        console.error('Failed to fetch nature data', err)
      }
    }
    fetchItems()
  }, [])

  const generateSlug = (id?: string) =>
    (id || '').toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')

  return (
    <section className="nature-magazine-section">
      {/* 🌿 HERO BANNER */}
      <div className="banner-wrapper mb-5">
        <ParallaxBanner
          image="/assets/images/natureHomeBanner.jpg"
          title="Wildlife & Nature"
        />
        <div className="banner-bottom-fade"></div>
      </div>

      <div className="container py-5">
        <div className="row align-items-center g-5">
          
          {/* 🖼️ LEFT: WILDLIFE & FLORA STACK */}
          <div className="col-lg-6 position-relative mb-5 mb-lg-0">
            <motion.div style={{ y: yImage }} className="nature-main-frame shadow-lg">
              <Image
                src="/assets/images/natureHomeImg1.jpg"
                alt="Maharashtra Wilderness"
                width={800}
                height={1000}
                className="img-fluid heritage-img"
              />
              {/* Floating Nature Badge */}
              <div className="nature-badge">
                <i className="fas fa-leaf"></i>
              </div>
            </motion.div>
            
            <div className="nature-sub-frame shadow-2xl d-none d-md-block">
              <Image
                src="/assets/images/natureHomeImg.jpg"
                alt="National Park View"
                width={450}
                height={350}
                className="img-fluid rounded-3 shadow-sm"
              />
            </div>
          </div>

          {/* ✍️ RIGHT: EDITORIAL CONTENT */}
          <div className="col-lg-6 ps-lg-5">
            <motion.div style={{ y: yText }} className="content-editorial">
              <span className="top-category-label">
                <Translator text="Sanctuaries & Bio-Reserves" targetLang={language} />
              </span>
              
              <h2 className="display-4 fw-bold nature-title mb-4">
                Forests, <span className="text-wild">Waterfalls</span> <br />
                & Rare <span className="text-secondary-brand">Wildlife</span>
              </h2>
              
              <div className="heritage-divider mb-4"></div>
              
              <p className="lead text-dark fw-medium mb-4">
                <Translator
                  text="Maharashtra’s natural areas range from dense forests to protected wildlife sanctuaries and serene waterfalls — perfect for nature lovers."
                  targetLang={language}
                />
              </p>
              
              <p className="text-muted fs-5 mb-5">
                <Translator
                  text="Explore the tigers of Tadoba, the mangroves of the coast, and the lush trekking trails of the Sahyadri ranges that bloom with life every monsoon."
                  targetLang={language}
                />
              </p>

              <div className="cta-wrapper">
                <Link href="/nature" className="nature-magazine-btn">
                  <Translator text="Into The Wild" targetLang={language} />
                  <span className="ms-3">→</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* 🎢 THE SLIDER: Jungle Backdrop Accent */}
        <div className="mt-10 slider-block-heritage">
          <div className="d-flex justify-content-between align-items-end mb-5 px-2">
             <div>
                <h3 className="fw-bold h2 text-secondary-brand m-0">
                  <Translator text="Nature Trails" targetLang={language} />
                </h3>
                <p className="text-muted m-0">Breathe in the freshness of the wild</p>
             </div>
          </div>
          
          <div className="slider-bg-accent rounded-4 p-4 p-md-4 shadow-sm">
            {items.length > 0 ? (
              <BeachSlider
                beaches={items}
                category="nature"
                generateSlug={generateSlug}
              />
            ) : (
              <div className="text-center py-5 opacity-50">Exploring the Wilderness...</div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .nature-magazine-section {
          background-color: rgb(249, 240, 255);
          overflow: hidden;
          padding-bottom: 100px;
        }

        .text-wild { color: #2f5130; } /* Deep Forest Green */
        .text-secondary-brand { color: var(--secondary-color); }

        /* Typography */
        .top-category-label {
          color: #4a7c4c;
          font-weight: 800;
          letter-spacing: 3px;
          text-transform: uppercase;
          font-size: 0.85rem;
        }

        .nature-title {
          line-height: 1.1;
          color: #1a1a1a;
          letter-spacing: -1.5px;
        }

        /* Image Stack Styling */
        .nature-main-frame {
          position: relative;
          z-index: 2;
          border-left: 12px solid #2f5130; /* Forest Green for Nature */
        }

        .nature-sub-frame {
          position: absolute;
          bottom: -40px;
          right: -20px;
          width: 55%;
          z-index: 3;
          border: 0 solid #fff;
        }

        .nature-badge {
          position: absolute;
          top: 30px;
          left: -30px;
          width: 60px;
          height: 60px;
          background: #86a373; /* Sage Green for Contrast */
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          font-size: 1.5rem;
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
          animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-18px); }
        }

        /* UI Elements */
        .heritage-divider {
          width: 70px;
          height: 5px;
          background: var(--accent-color);
        }

        .nature-magazine-btn {
          display: inline-flex;
          align-items: center;
          background: #2f5130;
          color: #fff;
          padding: 1rem 2.5rem;
          text-decoration: none;
          font-weight: 700;
          border-radius: 5px;
          transition: 0.3s ease;
        }

        .nature-magazine-btn:hover {
          background: var(--primary-color);
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(47, 81, 48, 0.2);
        }

        .slider-bg-accent {
          background: #fff;
          border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .mt-10 { margin-top: 10rem; }

        @media (max-width: 991px) {
          .mt-10 { margin-top: 5rem; }
          .nature-title { font-size: 2.5rem; }
          .nature-sub-frame { right: 0; bottom: -30px; width: 65%; }
        }
      `}</style>
    </section>
  )
}

export default NatureList