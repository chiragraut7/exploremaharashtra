'use client'

import React from 'react'
import { useLanguage } from './context/LanguageContext'
import Translator from './commonComponents/Translator'

export default function Footer() {
  const { language } = useLanguage()

  return (
    <footer className="text-center py-3 bg-dark text-white mt-0">
      <p className="text-sm md:text-base">
        &copy; 2025{' '}
        <span className="fw-semibold text-primary"><Translator
          text="Explore Maharashtra"
          targetLang={language}
        /> </span>.
        <Translator
          text="Discover its Beauty & Culture."
          targetLang={language}
        />
      </p>
    </footer>
  )
}
