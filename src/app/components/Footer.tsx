"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const Footer = ({ color = "#E57717" }) => {
  const navigationLinks = [
    { label: "Forts", href: "/forts" },
    { label: "Beaches", href: "/beaches" },
    { label: "Hill Stations", href: "/hills" },
    { label: "Wildlife", href: "/nature" },
    { label: "Religious", href: "/religious" },
    { label: "Culture", href: "/culture" },
  ];

  // Essential for AdSense Approval
  const legalLinks = [
    { label: "About Us", href: "/about" },
    { label: "Contact Us", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms" },
  ];

  const socialLinks = [
    { icon: "instagram", href: "#" },
    { icon: "youtube", href: "#" },
    { icon: "facebook-f", href: "#" },
    { icon: "x-twitter", href: "#" },
  ];

  return (
    <footer className="footer-root mt-0 p-0 overflow-hidden">
      {/* --- CALL TO ACTION STRIP --- */}
      <div className="container py-5">
        <div className="row align-items-center justify-content-center g-4">
          <div className="col-lg-12 text-center">
            <h2 className="display-5 fw-bold text-white my-0 tracking-tight">
              Begin your odyssey into the <br />
              <span style={{ color }}>Great Deccan Plateau.</span>
            </h2>
          </div>
        </div>
      </div>

      {/* --- THE VAULT --- */}
      <div
        className="footer-vault shadow-lg"
        style={{ background: "#0a0a0a", borderRadius: "60px 60px 0 0" }}
      >
        <div className="container py-5">
          <div className="row g-5">

            {/* BRAND BIOGRAPHY */}
            <div className="col-lg-4 col-md-12 text-start">
              <div className="mb-4 bg-white d-inline-block p-2 rounded-4 shadow-sm">
                <Image src="/assets/images/logo_icon.png" alt="Explore Maharashtra Logo" width={100} height={55} />
              </div>

              <p className="text-secondary small lh-lg mb-4 pe-lg-5">
                Explore Maharashtra is your premier digital gateway to the royal lineage, 
                maritime legacy, and the mist-covered peaks of the Sahyadris. Join us in 
                celebrating the vibrant soul of India's heartland.
              </p>

              <div className="social-row">
                {socialLinks.map((s) => (
                  <Link
                    key={s.icon}
                    href={s.href}
                    className="social-neon"
                    style={{ "--accent": color } as any}
                  >
                    <i className={`fab fa-${s.icon}`}></i>
                  </Link>
                ))}
              </div>
            </div>

            {/* DESTINATIONS NAVIGATION */}
            <div className="col-lg-4 col-md-6">
              <h6 className="nav-title">Discover More</h6>
              <div className="row">
                <div className="col-6">
                  <ul className="list-unstyled nav-list">
                    {navigationLinks.slice(0, 3).map((link) => (
                      <li key={link.label}>
                        <Link href={link.href} className="footer-link" style={{ "--accent": color } as any}>
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="col-6">
                  <ul className="list-unstyled nav-list">
                    {navigationLinks.slice(3).map((link) => (
                      <li key={link.label}>
                        <Link href={link.href} className="footer-link" style={{ "--accent": color } as any}>
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* LEGAL & SUPPORT (CRITICAL FOR ADSENSE) */}
            <div className="col-lg-4 col-md-6">
              <h6 className="nav-title">Support & Legal</h6>
              <ul className="list-unstyled nav-list">
                {legalLinks.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="footer-link" style={{ "--accent": color } as any}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                <p className="small text-secondary mb-1">Direct Correspondence:</p>
                <p className="small fw-bold text-white">info@goexploremaharashtra.in</p>
              </div>
            </div>
          </div>

          <hr className="my-5 border-secondary opacity-10" />

          {/* CREDITS */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 pb-3">
            <p className="mb-0 small text-secondary opacity-50 text-center">
              © {new Date().getFullYear()} **Explore Maharashtra**. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .ls-1 { letter-spacing: 1px; }
        .tracking-tight { letter-spacing: -1.5px; }

        .nav-title {
          color: rgba(255,255,255,0.3);
          text-transform: uppercase;
          letter-spacing: 3px;
          font-size: 0.75rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
        }

        .social-row { display: flex; gap: 14px; }
        .social-neon {
          width: 44px; height: 44px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.6);
          text-decoration: none;
          transition: all 0.35s ease;
        }
        .social-neon:hover {
          color: #fff;
          transform: translateY(-5px);
          background: var(--accent);
          box-shadow: 0 0 20px var(--accent);
          border-color: var(--accent);
        }

        .nav-list li { margin-bottom: 12px; }
        .footer-link {
          position: relative;
          display: inline-block;
          padding-left: 0;
          color: rgba(255,255,255,0.6);
          text-decoration: none;
          transition: all 0.3s ease;
          font-size: 0.9rem;
        }
        .footer-link:hover {
          color: var(--accent);
          transform: translateX(5px);
        }
      `}</style>
    </footer>
  );
};

export default Footer;