'use client'

import React from 'react'
import HillCard from './HillCard'

interface Hill {
  id: number | string
  title: string
  subtitle?: string
  bannerImage: string
  color?: string
}

interface Props {
  hills: Hill[]
  category: string
  generateSlug: (id: string | number, title?: string) => string
}

const HillSlider: React.FC<Props> = ({ hills, category, generateSlug }) => {
  return (
    <div className="row g-4">
      {hills.map((hill) => (
        <div className="col-md-6 col-lg-4" key={hill.id}>
          <HillCard hill={hill} category={category} generateSlug={generateSlug} />
        </div>
      ))}
    </div>
  )
}

export default HillSlider
