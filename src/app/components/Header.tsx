'use client'

import React, { useState, useEffect } from 'react'
import { useLanguage } from './context/LanguageContext'
import Link from "next/link"
import Image from "next/image"
import { usePathname } from 'next/navigation'
import Translator from './commonComponents/Translator'

export default function Header() {
  const { language, setLanguage } = useLanguage()
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Configuration
  const themeOrange = "#FF6B00"; // Vibrant Maharashtra Orange

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const mainContent = document.querySelector('main');
    if (mainContent) {
      if (isMenuOpen) {
        mainContent.style.filter = 'blur(15px) brightness(0.7)';
        mainContent.style.transform = 'scale(0.98)';
        document.body.style.overflow = 'hidden';
      } else {
        mainContent.style.filter = 'none';
        mainContent.style.transform = 'scale(1)';
        document.body.style.overflow = 'unset';
      }
    }
  }, [isMenuOpen])

  const navItems = [
    { title: "Home", href: "/" },
    { title: "About Us", href: "/about" },
    { title: "Beaches", href: "/beaches" },
    { title: "Hill Stations", href: "/hills" },
    { title: "Forts", href: "/forts" },
    { title: "Wildlife", href: "/nature" },
    { title: "Religious", href: "/religious" },
    { title: "Culture", href: "/culture" },
  ]

  return (
    <>
      <header className={`header-main ${isScrolled || isMenuOpen ? 'scrolled' : ''}`}>
        <nav className="navbar container-fluid px-lg-5 px-4 py-3">
          <Link href="/" className="navbar-brand bg-white p-2 rounded-lg">
            <Image
              src="/assets/images/logo.png"
              alt="Logo"
              height={50}
              width={200}
              // This filter turns a black logo orange when the background is white
              className={`logo-img ${isScrolled || isMenuOpen ? 'logo-orange' : ''}`}
              priority
            />
          </Link>

          <button
            className={`luxury-burger ${isMenuOpen ? 'open' : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="burger-line"></span>
            <span className="burger-line"></span>
          </button>
        </nav>
      </header>

      {/* 🎭 FULL MENU OVERLAY */}
      <div className={`full-menu ${isMenuOpen ? 'active' : ''}`}>
        <div className="menu-bg-text">MAHARASHTRA</div>

        <div className="container h-100 d-flex align-items-center justify-content-center">
          <ul className="menu-nav-list">
            {navItems.map((item, idx) => (
              <li
                key={item.href}
                className="menu-nav-item"
                style={{ transitionDelay: `${idx * 0.08}s` }}
              >
                <Link
                  href={item.href}
                  className={`menu-nav-link ${pathname === item.href ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                  data-text={item.title.toUpperCase()}
                >
                  <span className="nav-index">0{idx + 1}</span>
                  <span className="nav-text">
                    <Translator text={item.title} targetLang={language} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="menu-sidebar d-none d-lg-flex">
          <button
            onClick={() => setLanguage(language === 'en' ? 'mr' : 'en')}
            className="vertical-lang-btn"
          >
            {language === 'en' ? 'मराठी' : 'ENGLISH'}
          </button>
        </div>
      </div>

      <style jsx>{`
        .header-main {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 5000;
          transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1);
        }

        /* ⚪ WHITE HEADER ON SCROLL */
        .header-main.scrolled {
          background: #ffffff;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          padding: 5px 0;
        }

        .logo-orange {
           filter: brightness(0) saturate(100%) invert(48%) sepia(88%) saturate(2421%) hue-rotate(1deg) brightness(103%) contrast(106%);
        }

        .luxury-burger {
          background: none; border: none;
          width: 40px; height: 40px;
          position: relative; cursor: pointer;
          z-index: 5001;
        }

        .burger-line {
          position: absolute; left: 0;
          width: 100%; height: 2px;
          /* Burger lines turn orange when background is white */
          background: ${isScrolled || isMenuOpen ? themeOrange : 'white'}; 
          transition: 0.4s cubic-bezier(0.7, 0, 0.3, 1);
        }
        .burger-line:first-child { top: 15px; }
        .burger-line:last-child { bottom: 15px; width: 60%; left: 40%; }
        
        .luxury-burger.open .burger-line { background: ${themeOrange} !important; }
        .luxury-burger.open .burger-line:first-child { transform: translateY(4px) rotate(45deg); width: 100%; }
        .luxury-burger.open .burger-line:last-child { transform: translateY(-4px) rotate(-45deg); width: 100%; left: 0; }

        /* 🎭 OVERLAY (White Background) */
        .full-menu {
          position: fixed;
          inset: 0; 
          background: #ffffff;
          z-index: 4999;
          transform: translateY(-100%);
          transition: transform 0.8s cubic-bezier(0.8, 0, 0.2, 1);
        }
        .full-menu.active { transform: translateY(0); }

        .menu-bg-text {
              color: var(--primary-color);
    letter-spacing: -5px;
    z-index: -1;
    font-size: 12vw;
    font-weight: 900;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: .1;
        }

        .menu-nav-list { list-style: none; padding: 0; margin: 0; }
        .menu-nav-item { 
          opacity: 0; transform: translateY(40px);
          transition: 0.6s ease-out;
          margin-bottom: 1.2rem;
        }
        .full-menu.active .menu-nav-item { opacity: 1; transform: translateY(0); }

        .menu-nav-link {
          position: relative;
          text-decoration: none;
          display: flex; align-items: center;
          color: #eeeeee; /* Light grey ghost text */
          font-size: clamp(2.5rem, 7vw, 5rem);
          font-weight: 900;
          text-transform: uppercase;
          transition: transform 0.4s ease;
        }

        .nav-index {
          font-size: 1rem; color: #333;
          font-weight: 400; margin-right: 20px;
          transform: translateY(-1.5rem);
        }

        /* 🍊 ORANGE WIPE-REVEAL */
        .menu-nav-link::after {
          content: attr(data-text);
          position: absolute; left: 0; top: 0;
          width: 0%; 
          color: ${themeOrange}; 
          overflow: hidden;
          transition: width 0.5s cubic-bezier(0.65, 0, 0.35, 1);
          white-space: nowrap;
          border-right: 3px solid ${themeOrange};
        }

        .menu-nav-link:hover { transform: translateX(30px); }
        .menu-nav-link:hover::after { width: 100%; }

        /* Active State */
        .menu-nav-link.active::after { width: 100%; border-right: none; }

        .menu-sidebar {
          position: absolute; right: 50px; top: 0; bottom: 0;
          justify-content: center; border-left: 1px solid rgba(0,0,0,0.05);
        }
        .vertical-lang-btn {
          background: none; border: none; 
          color: ${themeOrange};
          writing-mode: vertical-rl; text-orientation: mixed;
          letter-spacing: 5px; font-weight: 800; cursor: pointer;
          padding: 20px; transition: 0.3s;
        }
        .menu-nav-link span{
            text-decoration: none;
    font-weight: bold;
    color:  ${themeOrange};
        }
        @media (max-width: 768px) {
          .menu-nav-link { font-size: 2.2rem; }
          .menu-sidebar { display: none; }
        }
      `}</style>
    </>
  )
}