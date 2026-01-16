'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '../context/LanguageContext'
import Translator from '../commonComponents/Translator'
import { Item } from '../../types'

interface BeachCardProps {
  beach: Item
  category: string
  // ✅ CHANGED: Changed to 'any' signature to prevent Vercel build mismatch
  generateSlug: any 
  btnLabel: string
  btnColor?: string 
}

const categoryIcons: Record<string, string> = {
  beaches: "fa-umbrella-beach",
  hillstations: "fa-mountain",
  hills: "fa-mountain",
  forts: "fa-chess-rook",
  wildlife: "fa-paw",
  nature: "fa-leaf",
  religious: "fa-om",
  cultural: "fa-masks-theater",
}

const DEFAULT_FALLBACK = '/assets/images/maharashtra-state-of-india.svg'

const BeachCard: React.FC<BeachCardProps> = ({
  beach,
  category,
  generateSlug,
  btnLabel,
  btnColor
}) => {
  const { language } = useLanguage()
  
  // Safe extraction of the image path
  const getImagePath = (img: any) => (typeof img === 'string' && img.trim() !== '') ? img : DEFAULT_FALLBACK;

  const [src, setSrc] = useState<string>(getImagePath(beach?.bannerImage))
  const currentIcon = categoryIcons[category] || 'fa-masks-theater'

  useEffect(() => {
    setSrc(getImagePath(beach?.bannerImage))
  }, [beach?.bannerImage])

  // ✅ SAFE LINK GENERATION: Checks if beach and id exist before running
  const safeId = beach?.id ? beach.id.toString() : 'destination';
  const cardLink = `/${category}/${generateSlug(safeId)}`;

  return (
    <div className="postcard-container">
      <Link href={cardLink} className="text-decoration-none">
        <div className="postcard-accent-bg"></div>

        <div className="postcard-main shadow-sm transition-all duration-500">
          <div className="postcard-media">
            <Image
              src={src}
              alt={beach?.title || 'Maharashtra Destination'}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover card-img-zoom transition-transform duration-1000"
              onError={() => setSrc(DEFAULT_FALLBACK)}
            />
            <div className="media-gradient"></div>
            
            <div 
              className="heritage-icon-badge" 
              style={{ backgroundColor: btnColor || '#FF6B00' }}
            >
              <i className={`fas ${currentIcon}`} aria-hidden="true"></i>
            </div>
          </div>

          <div className="postcard-content">
            <h3 className="postcard-title">
              <Translator text={beach?.title || ''} targetLang={language} />
            </h3>
            
            <div className="brand-line"></div>

            {beach?.subtitle && (
              <p className="postcard-desc">
                <Translator text={beach.subtitle || ''} targetLang={language} />
              </p>
            )}

            <div className="postcard-footer">
              <span className="cta-text">
                <Translator text={btnLabel || 'Explore'} targetLang={language} />
              </span>
              <div className="cta-arrow">
                <i className="fas fa-arrow-right"></i>
              </div>
            </div>
          </div>
        </div>
      </Link>

      <style jsx>{`
        .postcard-container { position: relative; padding: 15px; height: 100%; cursor: pointer; }
        
        .postcard-accent-bg {
          position: absolute; top: 0; left: 0; width: 70%; height: 60%;
          background-color: ${btnColor || '#FF6B00'}; opacity: 0.12;
          border-radius: 20px; z-index: 0; transition: 0.6s ease;
        }

        .postcard-container:hover .postcard-accent-bg { width: 100%; height: 100%; opacity: 0.2; }

        .postcard-main {
          position: relative; z-index: 1; background: #fff; border-radius: 15px;
          overflow: hidden; height: 100%; display: flex; flex-direction: column;
          border: 1px solid rgba(0, 0, 0, 0.05); transition: transform 0.3s ease;
        }

        .postcard-container:hover .postcard-main { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important; }

        .postcard-media { position: relative; height: 240px; width: 100%; overflow: hidden; }

        :global(.card-img-zoom) { transition: transform 0.8s ease !important; }
        .postcard-container:hover :global(.card-img-zoom) { transform: scale(1.1); }

        .media-gradient {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%);
        }

        .heritage-icon-badge {
          position: absolute; top: 20px; right: 20px; width: 45px; height: 45px;
          color: #fff; border-radius: 12px; display: flex; align-items: center;
          justify-content: center; font-size: 1.1rem; transition: 0.4s ease;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        .postcard-container:hover .heritage-icon-badge { transform: rotate(12deg) scale(1.1); }

        .postcard-content { padding: 1.5rem; flex-grow: 1; display: flex; flex-direction: column; }

        .postcard-title { 
          font-size: 1.25rem; font-weight: 800; 
          color: #1a1a1a; margin-bottom: 0.5rem; 
        }

        .brand-line { 
          width: 30px; height: 3px; 
          background: ${btnColor || '#FF6B00'}; 
          margin-bottom: 1rem; transition: 0.4s ease; 
        }

        .postcard-container:hover .brand-line { width: 50px; }

        .postcard-desc { 
          font-size: 0.9rem; color: #555; 
          line-height: 1.5; margin-bottom: 1.5rem; 
          display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
        }

        .postcard-footer { margin-top: auto; display: flex; align-items: center; justify-content: space-between; }

        .cta-text { 
          font-weight: 800; font-size: 0.7rem; 
          text-transform: uppercase; letter-spacing: 2px; 
          color: #1a1a1a; 
        }

        .cta-arrow { color: ${btnColor || '#FF6B00'}; transition: 0.3s ease; }

        .postcard-container:hover .cta-arrow { transform: translateX(5px); }
        
        @media (max-width: 768px) {
          .postcard-media { height: 200px; }
        }
      `}</style>
    </div>
  )
}

export default BeachCard
