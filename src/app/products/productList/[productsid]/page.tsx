'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface Product {
  id: number
  name: string
  category: string
  description: string
  features: string[]
  price_range: string
  material: string
  custom_logo: boolean
  image_gallery: string[]
}

export default function ProductDetailPage() {
  const { productsid } = useParams()
  const [product, setProduct] = useState<Product | null>(null)

  useEffect(() => {
    if (!productsid) return

    fetch('/data/products.json')
      .then(res => res.json())
      .then((data: Product[]) => {
        const found = data.find(p => p.id === Number(productsid))
        setProduct(found || null)
      })
  }, [productsid])

  if (!product) {
    return <div className="p-8 text-center text-gray-600">Loading product details...</div>
  }

  return (
    <section className="product-detail-container">
      {/* Title */}
      <div className="product-header">
        <h1>{product.name}</h1>
        <p>{product.category}</p>
      </div>

      {/* Grid Layout */}
      <div className="product-detail-grid">
        {/* Left: Gallery */}
        <div className="product-gallery">
          {product.image_gallery?.map((img, i) => (
            <img key={i} src={img} alt={product.name} />
          ))}
        </div>

        {/* Right: Details */}
        <div className="product-info">
          <p>{product.description}</p>

          <h3>Key Features</h3>
          <ul className="product-features">
            {product.features?.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>

          <p><strong>Material:</strong> {product.material}</p>
          <p>
            <strong>Custom Logo:</strong>{' '}
            {product.custom_logo ? (
              <span className="text-green-600">Available</span>
            ) : (
              <span className="text-red-500">Not Available</span>
            )}
          </p>

          <div className="price-box">{product.price_range}</div>

          <button className="enquiry-btn">Enquire Now</button>
        </div>
      </div>

      {/* Back to Products Link */}
      <div className="back-link-wrapper">
        <Link href="/products" className="back-link">
          ← Back to All Products
        </Link>
      </div>
    </section>
  )
}
