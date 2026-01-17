'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'

import BeachSlider from './beaches/BeachSlider'
import ParallaxBanner from './commonComponents/ParallaxBanner'
import Translator from './commonComponents/Translator'
import { useLanguage } from './context/LanguageContext'

interface Religious {
  id: string
  title: string
  subtitle?: string
  bannerImage?: string
  color?: string
}

const ReligiousList: React.FC = () => {
  const [items, setItems] = useState<Religious[]>([])
  const { language } = useLanguage()
  const { scrollYProgress } = useScroll()

  // Graceful parallax for spiritual depth
  const yImage = useTransform(scrollYProgress, [0, 1], [0, -100])
  const yText = useTransform(scrollYProgress, [0, 1], [0, 60])

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch('/api/religious')
        const json = await res.json()
        if (json.success) setItems(json.data.slice(0, 5))
      } catch (err) {
        console.error('Failed to fetch religious data', err)
      }
    }
    fetchItems()
  }, [])

  const generateSlug = (id?: string) =>
    (id || '').toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')

  return (
    <section className="spiritual-magazine-section">
      {/* 🕉️ HERO BANNER */}
      <div className="banner-wrapper mb-5">
        <ParallaxBanner
          image="/assets/images/religiousHomeBanner.jpg"
          title="Religious Places"
        />
        <div className="banner-bottom-fade"></div>
      </div>

      <div className="container py-5">
        <div className="row align-items-center g-5">
          
          {/* 🖼️ LEFT: SACRED ARCHITECTURE STACK */}
          <div className="col-lg-6 position-relative mb-5 mb-lg-0">
            <motion.div style={{ y: yImage }} className="spiritual-main-frame shadow-lg">
              <Image
                src="/assets/images/religiousHomeImg1.jpg"
                alt="Sacred Temple Architecture"
                width={800}
                height={1000}
                className="img-fluid heritage-img"
              />
              {/* Floating Spiritual Badge */}
              <div className="spiritual-badge">
                <i className="fas fa-om"></i>
              </div>
            </motion.div>
            
            <div className="spiritual-sub-frame shadow-2xl d-none d-md-block">
              <Image
                src="/assets/images/religiousHomeImg.jpg"
                alt="Devotees and Rituals"
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
                <Translator text="Temples, Pilgrimages & Peace" targetLang={language} />
              </span>
              
              <h2 className="display-4 fw-bold spiritual-title mb-4">
                Faith, <span className="text-saffron">Rituals</span> <br />
                & Divine <span className="text-secondary-brand">Serenity</span>
              </h2>
              
              <div className="heritage-divider mb-4"></div>
              
              <p className="lead text-dark fw-medium mb-4">
                <Translator
                  text="Maharashtra hosts a rich tapestry of sacred sites — ancient temples, pilgrimage towns, and holy ghats that attract millions of devotees."
                  targetLang={language}
                />
              </p>
              
              <p className="text-muted fs-5 mb-5">
                <Translator
                  text="From the Ashtavinayak circuit and the Jyotirlingas to the world-renowned Shirdi Sai Baba temple, explore the profound spiritual energy of the land."
                  targetLang={language}
                />
              </p>

              <div className="cta-wrapper">
                <Link href="/religious" className="spiritual-magazine-btn">
                  <Translator text="Begin Your Pilgrimage" targetLang={language} />
                  <span className="ms-3">→</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* 🎢 THE SLIDER: Divine Floating Container */}
        <div className="mt-10 slider-block-heritage">
          <div className="d-flex justify-content-between align-items-end mb-5 px-2">
             <div>
                <h3 className="fw-bold h2 text-secondary-brand m-0">
                  <Translator text="Sacred Destinations" targetLang={language} />
                </h3>
                <p className="text-muted m-0">Experience the timeless traditions of Maharashtra</p>
             </div>
          </div>
          
          <div className="slider-bg-accent rounded-4 p-4 p-md-4 shadow-sm">
            {items.length > 0 ? (
              <BeachSlider
                beaches={items}
                category="religious"
                generateSlug={generateSlug}
              />
            ) : (
              <div className="text-center py-5 opacity-50">Loading Spiritual Sites...</div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .spiritual-magazine-section {
          background-color: rgb(255, 241, 240);
          overflow: hidden;
          padding-bottom: 0;
        }

        .text-saffron { color: #f29100; } /* Marigold/Saffron accent */
        .text-secondary-brand { color: var(--secondary-color); }

        /* Typography */
        .top-category-label {
          color: #f29100;
          font-weight: 800;
          letter-spacing: 3px;
          text-transform: uppercase;
          font-size: 0.85rem;
        }

        .spiritual-title {
          line-height: 1.1;
          color: #1a1a1a;
          letter-spacing: -1.5px;
            text-align: left;
        }

        /* Image Stack Styling */
        .spiritual-main-frame {
          position: relative;
          z-index: 2;
          border-left: 12px solid #f29100; /* Saffron for Religious */
        }

        .spiritual-sub-frame {
          position: absolute;
          bottom: -40px;
          right: -20px;
          width: 55%;
          z-index: 3;
          border: 0 solid #fff;
        }

        .spiritual-badge {
          position: absolute;
          top: 30px;
          left: -30px;
          width: 60px;
          height: 60px;
          background: var(--primary-color); /* Burnt Orange for spiritual energy */
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          font-size: 1.5rem;
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
          animation: float 5s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }

        /* UI Elements */
        .heritage-divider {
          width: 70px;
          height: 5px;
          background: var(--secondary-color);
        }

        .spiritual-magazine-btn {
          display: inline-flex;
          align-items: center;
          background: #f29100;
          color: #fff;
          padding: 1rem 2.5rem;
          text-decoration: none;
          font-weight: 700;
          border-radius: 5px;
          transition: 0.3s ease;
        }

        .spiritual-magazine-btn:hover {
          background: var(--secondary-color);
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(242, 145, 0, 0.2);
        }

        .slider-bg-accent {
          background: #fff;
          border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .mt-10 { margin-top: 10rem; }

        @media (max-width: 991px) {
          .mt-10 { margin-top: 5rem; }
          .spiritual-title { font-size: 2.5rem; }
          .spiritual-sub-frame { right: 0; bottom: -30px; width: 65%; }
        }
      `}</style>
    </section>
  )
}

export default ReligiousList