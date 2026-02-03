"use client";

import React from 'react';
import Image from 'next/image';
import Translator from '../components/commonComponents/Translator';
import { useLanguage } from '../components/context/LanguageContext';

export default function ContactPage() {
  const { language } = useLanguage();

  const actions = [
    {
      title: "Direct Email",
      value: "info@goexploremaharashtra.in",
      icon: "fa-envelope",
      btnText: "Send an Email",
      href: "mailto:info@goexploremaharashtra.in",
      color: "#3b82f6"
    },
    {
      title: "WhatsApp",
      value: "Connect for Quick Inquiries",
      icon: "fa-whatsapp",
      btnText: "Open WhatsApp",
      href: "https://wa.me/your-number-here", // Add your number
      color: "#25D366"
    }
  ];

  return (
    <div className="bg-[#fcfcfc] min-vh-100 pb-5">
      
      {/* --- HERO SECTION --- */}
      <div className="position-relative w-100" style={{ height: '50vh' }}>
        <Image 
          src="/assets/images/bannerImages/terms_banner.jpg" 
          alt="Contact GoExploreMaharashtra"
          fill
          priority
          className="object-fit-cover"
        />
        <div 
          className="position-absolute inset-0 d-flex align-items-center justify-content-center"
          style={{ background: 'rgba(15, 23, 42, 0.6)' }}
        >
          <div className="text-center text-white px-3">
            <h1 className="display-2 fw-bold tracking-tight mb-3">
              <Translator text="Get in Touch" targetLang={language} />
            </h1>
            <p className="lead fs-5 opacity-75">
              <Translator text="Have a question or want to collaborate? Reach out directly." targetLang={language} />
            </p>
          </div>
        </div>
      </div>

      {/* --- ACTION CARDS --- */}
      <div className="container position-relative z-2" style={{ marginTop: '-100px' }}>
        <div className="row g-4 justify-content-center">
          {actions.map((action, idx) => (
            <div key={idx} className="col-lg-5 col-md-6">
              <div className="bg-white p-5 rounded-5 shadow-lg text-center border-0 h-100 transition-hover">
                <div 
                  className="icon-box mb-4 mx-auto d-flex align-items-center justify-content-center"
                  style={{ backgroundColor: `${action.color}15`, color: action.color }}
                >
                  <i className={`fab ${action.icon} fa-2x`}></i>
                </div>
                <h4 className="fw-bold text-dark mb-2">{action.title}</h4>
                <p className="text-muted mb-4">{action.value}</p>
                <a 
                  href={action.href}
                  className="btn btn-lg rounded-pill px-5 fw-bold w-100"
                  style={{ backgroundColor: action.color, color: '#fff', border: 'none' }}
                >
                  {action.btnText}
                </a>
              </div>
            </div>
          ))}

          {/* Location / Office Section */}
          {/* <div className="col-lg-10 mt-4">
            <div className="bg-dark p-5 rounded-5 text-white d-flex flex-column flex-md-row align-items-center justify-content-between shadow-xl">
              <div className="text-center text-md-start mb-4 mb-md-0">
                <h5 className="fw-bold mb-1 ls-1 text-uppercase text-primary">Headquarters</h5>
                <p className="h4 fw-light mb-0">Mumbai, Maharashtra, India</p>
              </div>
              <div className="vr d-none d-md-block mx-4 opacity-25" style={{ height: '60px' }}></div>
              <div className="text-center text-md-end">
                <h5 className="fw-bold mb-1 ls-1 text-uppercase text-primary">Working Hours</h5>
                <p className="h4 fw-light mb-0">Mon — Sat, 10am — 6pm</p>
              </div>
            </div>
          </div> */}
        </div>
      </div>

      <style jsx>{`
        .icon-box {
          width: 80px;
          height: 80px;
          border-radius: 24px;
        }
        .ls-1 { letter-spacing: 1px; }
        .tracking-tight { letter-spacing: -3px; }
        .transition-hover {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .transition-hover:hover {
          transform: translateY(-10px);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1) !important;
        }
      `}</style>
    </div>
  );
}