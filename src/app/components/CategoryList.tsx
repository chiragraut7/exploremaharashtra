'use client'

import React, { useEffect, useState } from 'react'
import BeachSlider from './beaches/BeachSlider'
import { Item } from '@/app/types'

interface Props {
  category: string
}

const CategoryList: React.FC<Props> = ({ category }) => {
  const [items, setItems] = useState<Item[]>([])

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch(`/api/${category}`)
        const json = await res.json()

        if (Array.isArray(json)) {
          const formatted: Item[] = json.slice(0, 5).map((item: any) => ({
            id: String(item.id ?? item.title ?? Math.random().toString()),
            title: item.title,
            subtitle: item.subtitle,
            bannerImage: item.bannerImage,
            color: item.color,
          }))
          setItems(formatted)
        } else {
          console.error('Unexpected API response', json)
        }
      } catch (err) {
        console.error(`Failed to fetch ${category}`, err)
      }
    }

    fetchItems()
  }, [category])

  /**
   * ✅ FIX: Updated signature to accept optional string (id?: string)
   * This matches the prop type expected by BeachSlider.
   */
  const generateSlug = (id?: string): string => {
    if (!id) return 'details'; // Fallback if id is missing
    return id
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
  }

  return (
    <>
      {items.length > 0 ? (
        <BeachSlider 
          beaches={items} 
          category={category} 
          generateSlug={generateSlug} 
        />
      ) : (
        <div className="text-center py-10">
           {/* Consider adding a pulse loader here for better UX */}
           <p className="text-gray-600 animate-pulse">Loading {category}...</p>
        </div>
      )}
    </>
  )
}

export default CategoryList