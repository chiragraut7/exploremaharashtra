'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'

import BeachSlider from './beaches/BeachSlider'
import ParallaxBanner from './commonComponents/ParallaxBanner'
import Translator from './commonComponents/Translator'
import { useLanguage } from './context/LanguageContext'

interface Fort {
  id: string
  title: string
  subtitle?: string
  bannerImage?: string
  color?: string
}

const FortList: React.FC = () => {
  const [forts, setForts] = useState<Fort[]>([])
  const { language } = useLanguage()
  const { scrollYProgress } = useScroll()

  // Parallax offsets for the "Stone & Valor" feel
  const yImage = useTransform(scrollYProgress, [0, 1], [0, -90])
  const yText = useTransform(scrollYProgress, [0, 1], [0, 60])

  useEffect(() => {
    const fetchForts = async () => {
      try {
        const res = await fetch('/api/forts')
        const json = await res.json()
        if (json.success) setForts(json.data.slice(0, 5))
      } catch (err) {
        console.error('Failed to fetch forts', err)
      }
    }
    fetchForts()
  }, [])

  const generateSlug = (id?: string) =>
    (id || '').toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')

  return (
    <section className="fort-magazine-section">
      {/* 🏰 HERO BANNER */}
      <div className="banner-wrapper mb-5">
        <ParallaxBanner
          image="/assets/images/fortsHomeBanner.jpg"
          title="Forts of Maharashtra"
        />
        <div className="banner-bottom-fade"></div>
      </div>

      <div className="container py-5">
        <div className="row align-items-center g-5">
          
          {/* 🖼️ LEFT: RUGGED ARCHITECTURAL STACK */}
          <div className="col-lg-6 position-relative mb-5 mb-lg-0">
            <motion.div style={{ y: yImage }} className="fort-main-frame shadow-lg">
              <Image
                src="/assets/images/fortsHomeImg1.jpg"
                alt="Maratha Fort Architecture"
                width={800}
                height={1000}
                className="img-fluid heritage-img"
              />
              {/* Floating Fort Badge */}
              <div className="fort-badge">
                <i className="fas fa-chess-rook"></i>
              </div>
            </motion.div>
            
            <div className="fort-sub-frame shadow-2xl d-none d-md-block">
              <Image
                src="/assets/images/fortsHomeImg.jpg"
                alt="Breathtaking View"
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
                <Translator text="The Maratha Empire Legacy" targetLang={language} />
              </span>
              
              <h2 className="display-4 fw-bold fort-title mb-4">
                Warriors, <span className="text-rustic">History</span> <br />
                & Impregnable <span className="text-secondary-brand">Pride</span>
              </h2>
              
              <div className="heritage-divider mb-4"></div>
              
              <p className="lead text-dark fw-medium mb-4">
                <Translator
                  text="Maharashtra is home to some of the most iconic forts in India, carrying the valor and legacy of Chhatrapati Shivaji Maharaj."
                  targetLang={language}
                />
              </p>
              
              <p className="text-muted fs-5 mb-5">
                <Translator
                  text="From impregnable sea forts like Janjira to high mountain citadels like Rajgad, every stone tells a story of unmatched strategy and courage."
                  targetLang={language}
                />
              </p>

              <div className="cta-wrapper">
                <Link href="/forts" className="fort-magazine-btn">
                  <Translator text="Explore The Citadels" targetLang={language} />
                  <span className="ms-3">→</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* 🎢 THE SLIDER: Stone Background Accent */}
        <div className="mt-10 slider-block-heritage">
          <div className="d-flex justify-content-between align-items-end mb-5 px-2">
             <div>
                <h3 className="fw-bold h2 text-secondary-brand m-0">
                  <Translator text="Historic Fortresses" targetLang={language} />
                </h3>
                <p className="text-muted m-0">Walk through the gates of time</p>
             </div>
          </div>
          
          <div className="slider-bg-accent rounded-4 p-4 p-md-4 shadow-sm">
            {forts.length > 0 ? (
              <BeachSlider
                beaches={forts}
                category="forts"
                generateSlug={generateSlug}
              />
            ) : (
              <div className="text-center py-5 opacity-50">Discovering Forts...</div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .fort-magazine-section {
          background-color: rgb(255, 247, 230);
          overflow: hidden;
          padding-bottom: 100px;
        }

        .text-rustic { color: #7b5a3e; } /* Earthy Fort Brown */
        .text-secondary-brand { color: var(--secondary-color); }

        /* Typography */
        .top-category-label {
          color: #7b5a3e;
          font-weight: 800;
          letter-spacing: 3px;
          text-transform: uppercase;
          font-size: 0.85rem;
        }

        .fort-title {
          line-height: 1.1;
          color: #1a1a1a;
          letter-spacing: -1.5px;
        }

        /* Image Stack Styling */
        .fort-main-frame {
          position: relative;
          z-index: 2;
          border-left: 12px solid #7b5a3e; /* Rustic Brown for Forts */
        }

        .fort-sub-frame {
          position: absolute;
          bottom: -40px;
          right: -20px;
          width: 55%;
          z-index: 3;
          border: 0 solid #fff;
        }

        .fort-badge {
          position: absolute;
          top: 30px;
          left: -30px;
          width: 60px;
          height: 60px;
          background: var(--accent-color); /* Mustard Yellow for Valor */
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
          background: var(--primary-color);
        }

        .fort-magazine-btn {
          display: inline-flex;
          align-items: center;
          background: #7b5a3e;
          color: #fff;
          padding: 1rem 2.5rem;
          text-decoration: none;
          font-weight: 700;
          border-radius: 5px;
          transition: 0.3s ease;
        }

        .fort-magazine-btn:hover {
          background: var(--secondary-color);
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(123, 90, 62, 0.2);
        }

        .slider-bg-accent {
          background: #fff;
          border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .mt-10 { margin-top: 10rem; }

        @media (max-width: 991px) {
          .mt-10 { margin-top: 5rem; }
          .fort-title { font-size: 2.5rem; }
          .fort-sub-frame { right: 0; bottom: -30px; width: 65%; }
        }
      `}</style>
    </section>
  )
}

export default FortList