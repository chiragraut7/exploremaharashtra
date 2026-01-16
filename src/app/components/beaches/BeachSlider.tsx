'use client'

import React from 'react'
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
  category: string;
  // ✅ This signature matches the requirement for optional IDs
  generateSlug: (id?: string) => string 
}

const categoryMeta: Record<string, { color: string; icon: string; label: string }> = {
  beaches: { color: '#0077be', icon: 'fa-umbrella-beach', label: 'Discover Shore' },
  hills: { color: '#2d5a27', icon: 'fa-cloud-sun-rain', label: 'Explore Peaks' },
  forts: { color: '#7b5a3e', icon: 'fa-chess-rook', label: 'Visit Fortress' },
  nature: { color: '#1b4332', icon: 'fa-paw', label: 'Into the Wild' },
  religious: { color: '#f29100', icon: 'fa-om', label: 'Seek Blessings' },
  cultural: { color: '#6a0dad', icon: 'fa-masks-theater', label: 'Experience Art' },
}

const BeachSlider: React.FC<BeachSliderProps> = ({ beaches, category, generateSlug }) => {
  const currentMeta = categoryMeta[category] || categoryMeta.beaches;

  return (
    <div className="relative premium-slider-wrapper">
      
      {/* 🏷️ Magazine Style Header */}
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

      <Swiper
        modules={[Navigation, Autoplay, FreeMode, Pagination]}
        spaceBetween={30}
        slidesPerView={3}
        freeMode={true}
        grabCursor={true}
        navigation={{
          nextEl: '.swiper-next-custom',
          prevEl: '.swiper-prev-custom',
        }}
        pagination={{
          type: 'progressbar',
          el: '.custom-progress-bar',
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
        {beaches.map((item) => (
          <SwiperSlide key={item.id}>
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

      {/* 📊 Thematic Progress Bar */}
      <div className="progress-wrapper mb-4">
        <div className="custom-progress-bar"></div>
      </div>

      {/* 🏹 Navigation & Interaction Hints */}
      <div className="d-flex justify-content-between align-items-center mt-4 px-2">
        <div className="d-flex gap-3">
          <button className="swiper-prev-custom shadow-sm" aria-label="Previous">
            <i className="fas fa-chevron-left"></i>
          </button>
          <button className="swiper-next-custom shadow-sm" aria-label="Next">
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
        
        <div className="d-flex align-items-center scroll-hint-container">
          <span className="scroll-hint">Swipe to Explore</span>
          <div className="hint-arrow ms-2">→</div>
        </div>
      </div>

      <style jsx>{`
        .category-icon-box {
          width: 52px; height: 52px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.4rem; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .premium-slider-wrapper:hover .category-icon-box {
          transform: scale(1.1) rotate(-8deg);
          box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important;
        }
        .accent-line { width: 40px; height: 4px; margin-top: 4px; border-radius: 2px; }
        .tracking-widest { letter-spacing: 0.25em; }
        .progress-wrapper {
          height: 2px; width: 100%; background: rgba(0,0,0,0.05);
          border-radius: 10px; overflow: hidden; position: relative;
        }
        :global(.custom-progress-bar .swiper-pagination-progressbar-fill) {
          background: ${currentMeta.color} !important;
        }
        .swiper-prev-custom, .swiper-next-custom {
          width: 44px; height: 44px; background: #fff;
          border: 1px solid rgba(0,0,0,0.06); color: #444;
          border-radius: 50%; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.3s ease;
        }
        .swiper-prev-custom:hover, .swiper-next-custom:hover {
          background: ${currentMeta.color}; color: #fff;
          border-color: ${currentMeta.color}; transform: translateY(-2px);
        }
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
