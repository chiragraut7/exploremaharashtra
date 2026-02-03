'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Product {
  id: number
  name: string
  category: string
  price_range: string
  image_gallery: string[]
}

export default function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    fetch('/data/products.json')
      .then(res => res.json())
      .then((data: Product[]) => setProducts(data))
  }, [])

  return (
    <section className="product-list-container">
      <div className="container">
        {/* Page Title */}
        <h1 className="product-title">Hotel Products</h1>

        {/* Product Grid */}
        <div className="product-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="image-wrapper">
                <img
                  src={product.image_gallery?.[0] || '/images/noimage.jpg'}
                  alt={product.name}
                />
              </div>

              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="category">{product.category}</p>
                <p className="price">{product.price_range}</p>

                {/* View More Link below each card */}
                <Link
                  href={`/products/productList/${product.id}`}
                  className="view-more-link"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Back Link */}
        <div className="back-link-wrapper">
          <Link href="/" className="back-link">
            ← Back to Home
          </Link>
        </div>
      </div>
    </section>
  )
}
