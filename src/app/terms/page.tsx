"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Translator from '../components/commonComponents/Translator';
import { useLanguage } from '../components/context/LanguageContext';

export default function TermsAndConditions() {
  const { language } = useLanguage();

  return (
    <div className="min-vh-100 bg-[#fcfcfc]">
      
      {/* --- PREMIUM HERO SECTION --- */}
      <div className="position-relative w-100 overflow-hidden" style={{ height: '60vh' }}>
        <Image 
          src="/assets/images/bannerImages/terms_banner.jpg" 
          alt="Maharashtra Heritage"
          fill
          priority
          className="object-fit-cover scale-110" // Slight zoom for depth
        />
        {/* Dynamic Gradient Overlay */}
        <div 
          className="position-absolute inset-0 d-flex align-items-center justify-content-center"
          style={{ 
            background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.2) 0%, rgba(15, 23, 42, 0.8) 100%)',
            width: '100%',
            height: '100%'
          }}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white px-3"
          >
            <h6 className="text-uppercase ls-4 fw-bold text-warning mb-3">
               <Translator text="Legal Framework" targetLang={language} />
            </h6>
            <h1 className="display-1 fw-bold tracking-tighter mb-0">
              <Translator text="Terms & Conditions" targetLang={language} />
            </h1>
            <div className="h-1 bg-warning mx-auto rounded-pill my-4" style={{ width: '120px' }}></div>
            <p className="lead fs-4 opacity-75 italic">
              <Translator text="Effective Date: January 29, 2026" targetLang={language} />
            </p>
          </motion.div>
        </div>
      </div>

      {/* --- FLOATING CONTENT SECTION --- */}
      <div className="container py-5" style={{ marginTop: '-100px' }}>
        <div className="row justify-content-center">
          <div className="col-lg-9 col-xl-8">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="bg-white p-5 p-md-5 rounded-5 shadow-2xl border border-light position-relative z-2"
            >
              <div className="prose prose-slate max-w-none text-slate-700">
                
                {/* Section Header with Accent */}
                <div className="d-flex align-items-center gap-3 mb-5 border-bottom pb-4">
                   <div className="bg-warning bg-opacity-10 p-2 rounded-3">
                      <i className="fas fa-gavel text-warning fs-4"></i>
                   </div>
                   <p className="mb-0 small text-muted text-uppercase fw-bold ls-1">
                      <Translator text="Website Usage Agreement" targetLang={language} />
                   </p>
                </div>

                <section className="mb-6">
                  <h3 className="section-title">
                    <span className="text-warning me-2">01.</span>
                    <Translator text="Acceptance of Terms" targetLang={language} />
                  </h3>
                  <p className="lh-lg fs-5 text-secondary">
                    <Translator text="By accessing goexploremaharashtra.in, you agree to be bound by these Terms and Conditions. This agreement governs your interaction with our interactive maps, heritage data, and travel guides." targetLang={language} />
                  </p>
                </section>

                <section className="mb-6">
                  <h3 className="section-title">
                    <span className="text-warning me-2">02.</span>
                    <Translator text="Intellectual Property Rights" targetLang={language} />
                  </h3>
                  <p className="lh-lg text-secondary">
                    <Translator text="Unless otherwise stated, GoExploreMaharashtra owns the intellectual property rights for all material on this website, including but not limited to UX designs, curated travel guides, and photography. All intellectual property rights are reserved." targetLang={language} />
                  </p>
                </section>

                <section className="mb-6">
                  <h3 className="section-title">
                    <span className="text-warning me-2">03.</span>
                    <Translator text="User Responsibilities" targetLang={language} />
                  </h3>
                  <p className="lh-lg text-secondary">
                    <Translator text="Users are prohibited from using the site to transmit harmful code, scrape data for commercial use, or misrepresent their identity. You must use the information provided (especially trekking and fort guides) at your own risk." targetLang={language} />
                  </p>
                </section>

                {/* ADSENSE FRIENDLY CALLOUT */}
                <section className="mb-6 p-5 bg-orange-50 border-start border-warning border-5 rounded-4 shadow-sm">
                  <h3 className="fw-bold text-dark h4 mb-3">
                    <i className="fas fa-exclamation-triangle me-2 text-warning"></i>
                    <Translator text="Disclaimer of Liability" targetLang={language} />
                  </h3>
                  <p className="mb-0 text-dark opacity-75 lh-base">
                    <Translator text="The travel information provided is for general guidance. GoExploreMaharashtra is not responsible for any accidents, weather-related issues, or changes in entry rules at monuments, forts, or beaches mentioned on the site." targetLang={language} />
                  </p>
                </section>

                <section>
                  <h3 className="section-title">
                    <span className="text-warning me-2">05.</span>
                    <Translator text="Governing Law" targetLang={language} />
                  </h3>
                  <p className="lh-lg text-secondary">
                    <Translator text="These terms are governed by and construed in accordance with the laws of India, and you irrevocably submit to the exclusive jurisdiction of the courts in Mumbai, Maharashtra." targetLang={language} />
                  </p>
                </section>

              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .ls-4 { letter-spacing: 4px; }
        .ls-1 { letter-spacing: 1px; }
        .tracking-tighter { letter-spacing: -4px; }
        .section-title { font-weight: 800; color: #1e293b; margin-bottom: 1.5rem; font-size: 1.75rem; }
        .bg-orange-50 { background-color: #fffaf5; }
        .mb-6 { margin-bottom: 4rem; }
        
        .shadow-2xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
        }

        @media (max-width: 768px) {
          .display-1 { font-size: 3.5rem; }
          .tracking-tighter { letter-spacing: -2px; }
          .section-title { font-size: 1.5rem; }
        }
      `}</style>
    </div>
  );
}