'use client'

import React, { useEffect, useState } from 'react'
import HillSlider from './HillSlider'

interface Hill {
  id: number | string
  title: string
  subtitle?: string
  bannerImage: string
  color?: string
}

const HillList: React.FC = () => {
  const [hills, setHills] = useState<Hill[]>([])

  useEffect(() => {
    const fetchHills = async () => {
      try {
        const res = await fetch('/api/hills')
        const json = await res.json()
        if (json.success && Array.isArray(json.data)) {
          setHills(json.data.slice(0, 5))
        } else {
          console.error('Invalid hills data:', json)
        }
      } catch (err) {
        console.error('Error fetching hills:', err)
      }
    }
    fetchHills()
  }, [])

  const generateSlug = (id: string | number, title?: string) => {
    const safeTitle = title ? title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') : ''
    return `${id}-${safeTitle}`
  }

  return (
    <>
      {hills.length > 0 ? (
        <HillSlider hills={hills} category="hills" generateSlug={generateSlug} />
      ) : (
        <p className="text-center py-10 text-gray-600">Loading hills...</p>
      )}
    </>
  )
}

export default HillList
