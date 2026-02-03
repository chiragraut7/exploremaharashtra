'use client'

import React, { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay, FreeMode, Pagination } from 'swiper/modules'

// Swiper Styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/free-mode'

import BeachCard from './BeachCard'
import { Item } from '@/app/types'

interface BeachSliderProps {
  beaches: Item[]
  category: string
  generateSlug: (id?: string) => string 
}

// Configuration for Colors, Icons, and Labels per category
const categoryMeta: Record<string, { color: string; icon: string; label: string }> = {
  beaches: { color: '#0077be', icon: 'fa-umbrella-beach', label: 'Discover Shore' },
  hills: { color: '#2d5a27', icon: 'fa-mountain-sun', label: 'Explore Peaks' },
  forts: { color: '#e2b23c', icon: 'fa-chess-rook', label: 'Visit Fortress' },
  nature: { color: '#86a373', icon: 'fa-leaf', label: 'Into the Wild' },
  religious: { color: '#f25135', icon: 'fa-om', label: 'Seek Blessings' },
  culture: { color: '#d10068', icon: 'fa-masks-theater', label: 'Experience Art' },
}

const BeachSlider: React.FC<BeachSliderProps> = ({ beaches, category, generateSlug }) => {
  // Default to 'beaches' style if category not found
  const currentMeta = categoryMeta[category] || categoryMeta.beaches;
  
  // State to hold navigation button DOM elements
  const [prevEl, setPrevEl] = useState<HTMLElement | null>(null);
  const [nextEl, setNextEl] = useState<HTMLElement | null>(null);

  // Unique class for this category's progress bar to prevent conflicts
  const paginationClass = `custom-progress-${category}`;

  return (
    <div className="relative premium-slider-wrapper">
      
      {/* --- HEADER SECTION --- */}
      <div className="d-flex align-items-center mb-4 slider-header px-2">
        <div 
          className="category-icon-box shadow-sm me-3" 
          style={{ backgroundColor: currentMeta.color }}
        >
          <i className={`fas ${currentMeta.icon} text-white`}></i>
        </div>
        <div>
          <h4 className="fw-bold m-0 text-dark text-uppercase tracking-widest fs-6">
            {category}
          </h4>
          <div 
            className="accent-line" 
            style={{ backgroundColor: currentMeta.color }}
          ></div>
        </div>
      </div>

      {/* --- SWIPER CAROUSEL --- */}
      <Swiper
        modules={[Navigation, Autoplay, FreeMode, Pagination]}
        spaceBetween={30}
        slidesPerView={3}
        freeMode={true}
        grabCursor={true}
        
        // Critical Props for Reliability
        observer={true} 
        observeParents={true}

        // Connect navigation directly to our state elements
        navigation={{ prevEl, nextEl }}
        
        // Scoped pagination class
        pagination={{
          type: 'progressbar',
          el: `.${paginationClass}`, 
        }}

        loop={beaches.length > 3}
        autoplay={{ 
          delay: 4500, 
          disableOnInteraction: false,
          pauseOnMouseEnter: true 
        }}
        breakpoints={{
          220: { slidesPerView: 1.1, spaceBetween: 15 },
          768: { slidesPerView: 2.2, spaceBetween: 25 },
          1024: { slidesPerView: 3, spaceBetween: 30 },
        }}
        className="pb-5"
      >
        {beaches.map((item, index) => (
          <SwiperSlide key={item.id || index}>
            <BeachCard
              beach={item}
              category={category}
              generateSlug={generateSlug}
              btnLabel={currentMeta.label}
              btnColor={currentMeta.color}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* --- PROGRESS BAR --- */}
      <div className="progress-wrapper mb-4">
        <div className={paginationClass}></div>
      </div>

      {/* --- NAVIGATION CONTROLS --- */}
      <div className="d-flex justify-content-between align-items-center mt-4 px-2">
        <div className="d-flex gap-3">
          {/* Ref callback sets the state immediately on render */}
          <button 
            ref={(node) => setPrevEl(node)} 
            className="swiper-nav-btn shadow-sm" 
            aria-label="Previous Slide"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          
          <button 
            ref={(node) => setNextEl(node)} 
            className="swiper-nav-btn shadow-sm" 
            aria-label="Next Slide"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
        
        <div className="d-flex align-items-center scroll-hint-container">
          <span className="scroll-hint">Swipe to Explore</span>
          <div className="hint-arrow ms-2">→</div>
        </div>
      </div>

      <style jsx>{`
        /* Icon Box Animation */
        .category-icon-box {
          width: 52px; height: 52px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.4rem; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .premium-slider-wrapper:hover .category-icon-box {
          transform: scale(1.1) rotate(-8deg);
          box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important;
        }

        /* Typography & Accents */
        .accent-line { width: 40px; height: 4px; margin-top: 4px; border-radius: 2px; }
        .tracking-widest { letter-spacing: 0.25em; }
        
        /* Progress Bar Container */
        .progress-wrapper {
          height: 2px; width: 100%; background: rgba(0,0,0,0.05);
          border-radius: 10px; overflow: hidden; position: relative;
        }
        
        /* Dynamic Color for Progress Bar Fill */
        :global(.${paginationClass} .swiper-pagination-progressbar-fill) {
          background: ${currentMeta.color} !important;
        }

        /* Nav Buttons */
        .swiper-nav-btn {
          width: 44px; height: 44px; background: #fff;
          border: 1px solid rgba(0,0,0,0.06); color: #444;
          border-radius: 50%; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.3s ease;
        }
        .swiper-nav-btn:hover {
          background: ${currentMeta.color}; color: #fff;
          border-color: ${currentMeta.color}; transform: translateY(-2px);
        }

        /* Scroll Hint Text */
        .scroll-hint { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: #888; }
        .hint-arrow { animation: nudge 2s infinite; color: ${currentMeta.color}; }
        
        @keyframes nudge {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(6px); }
        }

        @media (max-width: 768px) {
           .category-icon-box { width: 40px; height: 40px; font-size: 1.1rem; }
           .scroll-hint-container { display: none !important; }
        }
      `}</style>
    </div>
  )
}

export default BeachSlider;