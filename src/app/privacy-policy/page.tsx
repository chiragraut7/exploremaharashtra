"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Translator from '../components/commonComponents/Translator';
import { useLanguage } from '../components/context/LanguageContext';

export default function PrivacyPolicy() {
  const { language } = useLanguage();

  return (
    <div className="bg-[#fcfcfc] min-vh-100">
      
      {/* --- CINEMATIC HERO SECTION --- */}
      <div className="position-relative w-100 overflow-hidden" style={{ height: '50vh' }}>
        <Image 
          src="/assets/images/bannerImages/terms_banner.jpg" 
          alt="Privacy Policy Banner"
          fill
          priority
          className="object-fit-cover"
        />
        <div 
          className="position-absolute inset-0 d-flex align-items-center justify-content-center"
          style={{ 
            background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.8))',
            width: '100%',
            height: '100%'
          }}
        >
          <div className="text-center text-white px-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="display-1 fw-bold tracking-tight mb-2">
                <Translator text="Privacy Policy" targetLang={language} />
              </h1>
              <div className="h-1 bg-info mx-auto rounded-pill mb-4" style={{ width: '100px', opacity: 0.8 }}></div>
              <p className="lead fs-4 opacity-75 italic font-serif">
                <Translator text="Last Updated: January 29, 2026" targetLang={language} />
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* --- CONTENT GRID --- */}
      <div className="container py-5" style={{ marginTop: '-60px' }}>
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-5 p-md-5 rounded-5 shadow-2xl border border-light position-relative z-2"
            >
              <div className="row">
                {/* Internal Navigation Sidebar */}
                <div className="col-lg-3 d-none d-lg-block border-end border-light">
                  <div className="sticky-top" style={{ top: '100px' }}>
                    <h6 className="text-uppercase ls-2 fw-bold text-muted small mb-4">On this page</h6>
                    <nav className="privacy-nav">
                      <ul className="list-unstyled">
                        <li className="mb-3"><a href="#intro" className="text-decoration-none text-slate-500 hover-primary small fw-bold">1. Introduction</a></li>
                        <li className="mb-3"><a href="#adsense" className="text-decoration-none text-slate-500 hover-primary small fw-bold">2. AdSense & Cookies</a></li>
                        <li className="mb-3"><a href="#data" className="text-decoration-none text-slate-500 hover-primary small fw-bold">3. Data Collection</a></li>
                        <li className="mb-3"><a href="#contact" className="text-decoration-none text-slate-500 hover-primary small fw-bold">4. Contact</a></li>
                      </ul>
                    </nav>
                  </div>
                </div>

                {/* Main Legal Content */}
                <div className="col-lg-9 ps-lg-5">
                  <article className="prose prose-lg">
                    
                    <section id="intro" className="mb-5">
                      <h3 className="fw-bold text-dark display-6 mb-4 mt-0">
                        <span className="text-info opacity-50 me-2">01.</span>
                        <Translator text="Introduction" targetLang={language} />
                      </h3>
                      <p className="text-slate-600 fs-5 lh-lg">
                        <Translator text="Welcome to GoExploreMaharashtra. We respect your privacy and are committed to protecting your personal data. This policy explains how we handle your information when you visit our website." targetLang={language} />
                      </p>
                    </section>

                    <section id="adsense" className="mb-5 p-5 bg-slate-50 rounded-4 border-start border-info border-5 shadow-sm">
                      <h3 className="fw-bold text-dark h4 mb-4">
                        <i className="fas fa-shield-alt text-info me-3"></i>
                        <Translator text="Google AdSense & Cookies" targetLang={language} />
                      </h3>
                      <p className="text-slate-600 mb-4">
                        <Translator text="We use Google AdSense to serve ads. Google, as a third-party vendor, uses cookies to serve ads on our site. Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our site or other sites on the Internet." targetLang={language} />
                      </p>
                      <div className="d-flex align-items-center p-3 bg-white rounded-3 border border-light">
                        <i className="fas fa-external-link-alt text-info me-3"></i>
                        <a href="https://www.google.com/settings/ads" target="_blank" className="fw-bold text-info text-decoration-none">
                          <Translator text="Manage your Google Ad Settings" targetLang={language} />
                        </a>
                      </div>
                    </section>

                    <section id="data" className="mb-5">
                      <h3 className="fw-bold text-dark display-6 mb-4">
                        <span className="text-info opacity-50 me-2">03.</span>
                        <Translator text="Information We Collect" targetLang={language} />
                      </h3>
                      <div className="row g-4">
                        <div className="col-md-6">
                          <div className="p-4 bg-light rounded-4 h-100">
                            <h5 className="fw-bold h6 text-uppercase ls-1">Log Data</h5>
                            <p className="small text-muted mb-0">IP address, browser type, and specific pages visited within our guide.</p>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="p-4 bg-light rounded-4 h-100">
                            <h5 className="fw-bold h6 text-uppercase ls-1">Contact Info</h5>
                            <p className="small text-muted mb-0">Name and email provided voluntarily through our communication channels.</p>
                          </div>
                        </div>
                      </div>
                    </section>

                    <section id="contact" className="mt-5 pt-5 border-top border-light">
                      <div className="d-flex align-items-center justify-content-between flex-wrap gap-4">
                        <div>
                          <h3 className="fw-bold text-dark mb-1">Have Questions?</h3>
                          <p className="text-muted">Our data protection team is here to help.</p>
                        </div>
                        <a href="mailto:info@goexploremaharashtra.in" className="btn btn-info btn-lg rounded-pill px-5 fw-bold text-white shadow-lg">
                          Email Support
                        </a>
                      </div>
                    </section>

                  </article>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .ls-2 { letter-spacing: 2px; }
        .ls-1 { letter-spacing: 1px; }
        .tracking-tight { letter-spacing: -4px; }
        .bg-slate-50 { background-color: #f8fafc; }
        .text-slate-500 { color: #64748b; }
        .text-slate-600 { color: #475569; }
        .hover-primary:hover { color: #0dcaf0 !important; }
        
        .shadow-2xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
        }

        @media (max-width: 768px) {
          .tracking-tight { letter-spacing: -2px; }
          .display-1 { font-size: 3.5rem; }
        }
      `}</style>
    </div>
  );
}