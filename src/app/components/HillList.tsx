'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import BeachSlider from './beaches/BeachSlider'
import ParallaxBanner from './commonComponents/ParallaxBanner'
import Translator from './commonComponents/Translator'
import { useLanguage } from './context/LanguageContext'

interface Hill {
  id: string
  title: string
  subtitle?: string
  bannerImage?: string
  color?: string
}

const HillList: React.FC = () => {
  const [hills, setHills] = useState<Hill[]>([])
  const { language } = useLanguage()

  useEffect(() => {
    const fetchHills = async () => {
      try {
        const res = await fetch('/api/hills')
        const json = await res.json()
        if (json.success) setHills(json.data.slice(0, 5))
      } catch (err) {
        console.error('Failed to fetch hills', err)
      }
    }
    fetchHills()
  }, [])

  const generateSlug = (id?: string) =>
    (id || '').toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')

  return (
    <section className="hill-magazine-section">
      {/* ⛰️ HERO BANNER */}
      <div className="banner-wrapper mb-5">
        <ParallaxBanner
          image="/assets/images/hillsHomeBanner.jpg"
          title="Hill Stations"
        />
        <div className="banner-bottom-fade"></div>
      </div>

      <div className="container py-5">
        <div className="row align-items-center g-5">
          
          {/* 🖼️ LEFT: OVERLAPPING MOUNTAIN IMAGES */}
          <div className="col-lg-6 position-relative mb-5 mb-lg-0">
            <div className="hill-main-frame shadow-lg">
              <Image
                src="/assets/images/hillsHomeImg.jpg"
                alt="Hill Station Hero"
                width={800}
                height={1000}
                className="img-fluid heritage-img"
              />
              {/* Decorative Brand Badge */}
              <div className="hill-badge">
                <i className="fas fa-mountain-sun"></i>
              </div>
            </div>
            
            <div className="hill-sub-frame shadow-2xl d-none d-md-block">
              <Image
                src="/assets/images/hillsHomeImg1.jpg"
                alt="Misty Valleys"
                width={400}
                height={300}
                className="img-fluid rounded-3"
              />
            </div>
          </div>

          {/* ✍️ RIGHT: EDITORIAL CONTENT */}
          <div className="col-lg-6 ps-lg-5">
            <div className="content-editorial">
              <span className="top-category-label">
                <Translator text="Western Ghats Escapes" targetLang={language} />
              </span>
              
              <h2 className="display-4 fw-bold hill-title mb-4">
                Mists, Trails & <br />
                <span className="text-secondary-brand">Ancient Valleys</span>
              </h2>
              
              <div className="heritage-divider mb-4"></div>
              
              <p className="lead text-dark fw-medium mb-4">
                <Translator
                  text="Maharashtra's hill stations offer misty viewpoints, ancient temples, lush valleys and pleasant climates — perfect for weekend getaways."
                  targetLang={language}
                />
              </p>
              
              <p className="text-muted fs-5 mb-5">
                <Translator
                  text="From the world's only forest without roads in Matheran to the strawberry fields of Mahabaleshwar, explore the heart of the Sahyadris."
                  targetLang={language}
                />
              </p>

              <div className="cta-wrapper">
                <Link href="/hills" className="hill-magazine-btn">
                  <Translator text="Explore All Peaks" targetLang={language} />
                  <span className="ms-3">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 🎢 THE SLIDER: Minimalist Floating */}
        <div className="mt-10 slider-block-heritage">
          <div className="d-flex justify-content-between align-items-end mb-5">
             <div>
                <h3 className="fw-bold h2 text-secondary-brand m-0">
                  <Translator text="Misty Destinations" targetLang={language} />
                </h3>
                <p className="text-muted m-0">Handpicked retreats for your next trek</p>
             </div>
          </div>
          
          <div className="slider-bg-accent rounded-4 p-4 p-md-4 shadow-sm">
            {hills.length > 0 ? (
              <BeachSlider
                beaches={hills}
                category="hills"
                generateSlug={generateSlug}
              />
            ) : (
              <div className="shimmer-loader"></div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .hill-magazine-section {
          background-color: rgb(246, 255, 237);
          overflow: hidden;
          padding-bottom: 1rem;
        }

        .text-secondary-brand { color: var(--secondary-color); }

        /* Typography */
        .top-category-label {
          color: var(--primary-color);
          font-weight: 800;
          letter-spacing: 3px;
          text-transform: uppercase;
          font-size: 0.85rem;
        }

        .hill-title {
          line-height: 1.1;
          color: #1a1a1a;
          letter-spacing: -1.5px;
        text-align: left;
        }

        /* Image Stack Styling */
        .hill-main-frame {
          position: relative;
          z-index: 2;
          border-left: 12px solid var(--secondary-color);
        }

        .hill-sub-frame {
          position: absolute;
          bottom: -50px;
          right: -30px;
          width: 55%;
          z-index: 3;
          border: 0 solid #fff;
        }

        .hill-badge {
          position: absolute;
          top: 30px;
          left: -30px;
          width: 60px;
          height: 60px;
          background: var(--primary-color);
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
          50% { transform: translateY(-10px); }
        }

        /* UI Elements */
        .heritage-divider {
          width: 70px;
          height: 5px;
          background: var(--accent-color);
        }

        .hill-magazine-btn {
          display: inline-flex;
          align-items: center;
          background: var(--secondary-color);
          color: #fff;
          padding: 1rem 2.5rem;
          text-decoration: none;
          font-weight: 700;
          border-radius: 5px;
          transition: 0.3s ease;
        }

        .hill-magazine-btn:hover {
          background: var(--primary-color);
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(242, 81, 53, 0.2);
        }

        .slider-bg-accent {
          background: #fff;
          border: 1px solid rgba(47, 81, 48, 0.05);
        }

        .mt-10 { margin-top: 10rem; }

        @media (max-width: 991px) {
          .mt-10 { margin-top: 5rem; }
          .hill-sub-frame { right: 0; bottom: -30px; }
        }
      `}</style>
    </section>
  )
}

export default HillList