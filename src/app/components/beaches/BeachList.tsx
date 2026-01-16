'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'

import BeachSlider from './BeachSlider'
import ParallaxBanner from '../commonComponents/ParallaxBanner'
import Translator from '../commonComponents/Translator'
import { useLanguage } from '../context/LanguageContext'

const BeachList: React.FC = () => {
  const [beaches, setBeaches] = useState<any[]>([])
  const { language } = useLanguage()
  const { scrollYProgress } = useScroll()

  // Refined parallax for a smoother magazine feel
  const yImage = useTransform(scrollYProgress, [0, 1], [0, -100])
  const yText = useTransform(scrollYProgress, [0, 1], [0, 50])

  useEffect(() => {
    const fetchBeaches = async () => {
      try {
        const res = await fetch('/api/beaches')
        const json = await res.json()
        if (json.success) setBeaches(json.data.slice(0, 5))
      } catch (err) {
        console.error('Failed to fetch beaches', err)
      }
    }
    fetchBeaches()
  }, [])

  const generateSlug = (id?: string) =>
    (id || '').toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')

  return (
    <section className="beach-magazine-section">
      {/* 🌊 HERO BANNER */}
      <div className="banner-wrapper mb-5">
        <ParallaxBanner
          image="/assets/images/beachHomeBanner.jpg"
          title="Konkan Coast"
        />
        <div className="banner-bottom-fade"></div>
      </div>

      <div className="container py-5">
        <div className="row align-items-center g-5">
          
          {/* 🖼️ LEFT: ASYMMETRIC COASTAL STACK */}
          <div className="col-lg-6 position-relative mb-5 mb-lg-0">
            <motion.div style={{ y: yImage }} className="beach-main-frame shadow-lg">
              <Image
                src="/assets/images/info3.jpg"
                alt="Konkan Coastline"
                width={800}
                height={1000}
                className="img-fluid heritage-img"
              />
              {/* Floating Heritage Icon Badge */}
              <div className="beach-badge">
                <i className="fas fa-umbrella-beach"></i>
              </div>
            </motion.div>
            
            <div className="beach-sub-frame shadow-2xl d-none d-md-block">
              <Image
                src="/assets/images/maharashtra-state-of-india.svg" // Or a secondary beach image
                alt="Coastal Map"
                width={400}
                height={300}
                className="img-fluid rounded-3 bg-white p-3"
              />
            </div>
          </div>

          {/* ✍️ RIGHT: EDITORIAL CONTENT */}
          <div className="col-lg-6 ps-lg-5">
            <motion.div style={{ y: yText }} className="content-editorial">
              <span className="top-category-label">
                <Translator text="720 KM of Pristine Shoreline" targetLang={language} />
              </span>
              
              <h2 className="display-4 fw-bold beach-title mb-4">
                Where The <span className="text-primary-brand">Ocean</span> <br />
                Meets <span className="text-secondary-brand">History</span>
              </h2>
              
              <div className="heritage-divider mb-4"></div>
              
              <p className="lead text-dark fw-medium mb-4">
                <Translator
                  text="Maharashtra’s coastline is a rhythmic blend of golden sands and black basalt rocks, creating a dramatic landscape found nowhere else in India."
                  targetLang={language}
                />
              </p>
              
              <p className="text-muted fs-5 mb-5">
                <Translator
                  text="From the shadow of Sindhudurg Fort to the serene sands of Ganpatipule, explore beaches that have witnessed centuries of seafaring glory."
                  targetLang={language}
                />
              </p>

              <div className="cta-wrapper">
                <Link href="/beaches" className="beach-magazine-btn">
                  <Translator text="View Coastal Collection" targetLang={language} />
                  <span className="ms-3">→</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* 🎢 THE SLIDER: Floating Container */}
        <div className="mt-10 slider-block-heritage">
          <div className="d-flex justify-content-between align-items-end mb-5 px-2">
             <div>
                <h3 className="fw-bold h2 text-secondary-brand m-0">
                  <Translator text="Popular Shores" targetLang={language} />
                </h3>
                <p className="text-muted m-0">Handpicked coastal retreats for your next escape</p>
             </div>
          </div>
          
          <div className="slider-bg-accent rounded-4 p-4 p-md-4 shadow-sm">
            {beaches.length > 0 ? (
              <BeachSlider
                beaches={beaches}
                category="beaches"
                generateSlug={generateSlug}
              />
            ) : (
              <div className="text-center py-5 opacity-50">Loading Coastal Gems...</div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .beach-magazine-section {
          background-color: rgb(230, 247, 255);
          overflow: hidden;
          padding-bottom: 1rem;
        }

        .text-primary-brand { color: var(--primary-color); }
        .text-secondary-brand { color: var(--secondary-color); }

        /* Typography */
        .top-category-label {
          color: var(--primary-color);
          font-weight: 800;
          letter-spacing: 3px;
          text-transform: uppercase;
          font-size: 0.85rem;
        }

        .beach-title {
          line-height: 1.1;
          color: #1a1a1a;
          letter-spacing: -1.5px;
        }

        /* Image Stack Styling */
        .beach-main-frame {
          position: relative;
          z-index: 2;
          border-left: 12px solid var(--primary-color); /* Burnt Orange for Beaches */
        }

        .beach-sub-frame {
          position: absolute;
          bottom: -50px;
          right: -30px;
          width: 50%;
          z-index: 3;
          border: 0 solid #fff;
        }

        .beach-badge {
          position: absolute;
          top: 30px;
          left: -30px;
          width: 60px;
          height: 60px;
          background: var(--secondary-color); /* Deep Green for Beach Badge Contrast */
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

        .beach-magazine-btn {
          display: inline-flex;
          align-items: center;
          background: var(--primary-color);
          color: #fff;
          padding: 1rem 2.5rem;
          text-decoration: none;
          font-weight: 700;
          border-radius: 5px;
          transition: 0.3s ease;
        }

        .beach-magazine-btn:hover {
          background: var(--secondary-color);
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(47, 81, 48, 0.2);
        }

        .slider-bg-accent {
          background: #fff;
          border: 1px solid rgba(47, 81, 48, 0.05);
          box-shadow: 0 20px 40px rgba(0,0,0,0.03);
        }

        .mt-10 { margin-top: 4rem; }

        @media (max-width: 991px) {
          .mt-10 { margin-top: 5rem; }
          .beach-title { font-size: 2.5rem; }
          .beach-sub-frame { right: 0; bottom: -30px; }
        }
      `}</style>
    </section>
  )
}

export default BeachList