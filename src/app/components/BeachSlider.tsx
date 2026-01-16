'use client'

import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import BeachCard from './beaches/BeachCard'
import { Item } from '@/app/types'

interface BeachSliderProps {
  beaches: Item[]
  category: string
  generateSlug: (id: string) => string // ✅ accepts string
}


const categoryColors: Record<string, string> = {
  beaches: '#f45133',
  hills: '#4CAF50',
  forts: '#9C27B0',
  nature: '#3F51B5',
  religious: '#FF9800',
  cultural: '#00BCD4',
}

const categoryLabels: Record<string, string> = {
  beaches: 'View Beach',
  hills: 'View Hill Station',
  forts: 'View Fort',
  nature: 'View Nature Spot',
  religious: 'View Religious Place',
  cultural: 'View Cultural Spot',
}

const BeachSlider: React.FC<BeachSliderProps> = ({ beaches, category, generateSlug }) => {
  return (
    <div className="relative">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={3}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        breakpoints={{
          320: { slidesPerView: 1 },
          768: { slidesPerView: 1 },
          1024: { slidesPerView: 1 },
        }}
        className="py-6"
      >
        {beaches.map((beach) => (
          <SwiperSlide key={beach.id}>
            <BeachCard
              beach={beach}
              category={category}
              generateSlug={generateSlug}
              btnLabel={categoryLabels[category] || 'View More'}
              btnColor={beach.color || categoryColors[category] || '#00aaff'}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default BeachSlider
