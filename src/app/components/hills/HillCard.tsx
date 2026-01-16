'use client'

import React from 'react'
import Link from 'next/link'

interface Hill {
  id: number | string
  title: string
  subtitle?: string
  bannerImage: string
  color?: string
}

interface Props {
  hill: Hill
  category: string
  generateSlug: (id: string | number, title?: string) => string
}

const HillCard: React.FC<Props> = ({ hill, category, generateSlug }) => {
  return (
    <Link href={`/${category}/${generateSlug(hill.id, hill.title)}`}>
      <div
        className="card shadow-sm hover:shadow-lg transition-all duration-300 border-0 overflow-hidden rounded-3"
        style={{
          background: `linear-gradient(to top, rgba(0,0,0,0.7), transparent), url(${hill.bannerImage}) center/cover`,
          color: '#fff',
        }}
      >
        <div className="card-body text-center py-5">
          <h5 className="fw-bold">{hill.title}</h5>
          {hill.subtitle && <p className="small">{hill.subtitle}</p>}
        </div>
      </div>
    </Link>
  )
}

export default HillCard
