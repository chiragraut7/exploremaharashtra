"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const Footer = ({ color = "#E57717" }) => {
  const navigationLinks = [
    { label: "Historical Forts", href: "/forts" },
    { label: "Konkan Beaches", href: "/beaches" },
    { label: "Sahyadri Treks", href: "/adventure" },
    { label: "Spiritual Sites", href: "/spiritual" },
    { label: "Local Cuisine", href: "/food" },
    { label: "Hidden Gems", href: "/hidden-gems" },
  ];

  const socialLinks = [
    { icon: "instagram", href: "#" },
    { icon: "youtube", href: "#" },
    { icon: "facebook-f", href: "#" },
    { icon: "x-twitter", href: "#" },
  ];

  return (
    <footer className="footer-root mt-5">
      {/* --- CALL TO ACTION STRIP --- */}
      <div className="container py-5">
        <div className="row align-items-center g-4">
          <div className="col-lg-7">
            <h2 className="display-5 fw-bold text-dark mb-0 tracking-tight">
              Begin your odyssey into the <br />
              <span style={{ color }}>Great Deccan Plateau.</span>
            </h2>
          </div>
          <div className="col-lg-5 text-lg-end">
            <div className="d-inline-flex align-items-center gap-4 p-3 rounded-4 bg-white shadow-sm border">
              <div className="text-start">
                <p className="text-uppercase small text-muted fw-bold mb-0 ls-1">Verified Guide</p>
                <p className="fw-bold text-dark mb-0">Maharashtra Tourism</p>
              </div>
              <div className="vr opacity-25" style={{ height: "40px" }}></div>
              <Link href="/contact" className="btn btn-dark rounded-pill px-4 py-2 fw-bold">
                Get in Touch
              </Link>
            </div>
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
              <div className="mb-4 bg-white d-inline-block p-2 rounded-4 shadow-sm text-start">
                <Image src="/assets/images/logo_icon.png" alt="Logo" width={100} height={55} />
              </div>

              <p className="text-secondary small lh-lg mb-4 pe-lg-5 text-start">
                Explore Maharashtra is your premier digital gateway to the royal lineage, 
                maritime legacy, and the mist-covered peaks of the Sahyadris. Join us in 
                celebrating the vibrant soul of India's heartland.
              </p>

              <div className="social-row">
                {socialLinks.map((s) => (
  <Link
    key={s.icon}
    href={s.href}
    className="social-neon-btn"
    style={{ "--accent-color": color } as any} // Pass color to CSS variable
  >
    <i style={{ "color": color } as any} className={`fs-4 fab fa-${s.icon}`}></i>
  </Link>
))}
              </div>
            </div>

            {/* QUICK NAVIGATION */}
            <div className="col-lg-4 col-md-6">
              <h6 className="nav-title">Discover More</h6>
              <div className="row">
                <div className="col-6">
                  <ul className="list-unstyled nav-list">
                    {navigationLinks.slice(0, 3).map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="footer-link"
                          style={{ "color": color } as any}
                        >
                          <span style={{ "color": color } as any}>{link.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="col-6">
                  <ul className="list-unstyled nav-list">
                    {navigationLinks.slice(3).map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="footer-link"
                          style={{ "--accent": color } as any}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* NEWSLETTER */}
            <div className="col-lg-4 col-md-6">
              <h6 className="nav-title">Newsletter</h6>
              <p className="small text-secondary mb-4 opacity-75">
                Curated itineraries, heritage stories, and hidden gem alerts delivered to your inbox.
              </p>

              <div className="subscribe-pill p-1 d-flex bg-white bg-opacity-5 rounded-pill border border-white border-opacity-10">
                <input
                  type="email"
                  className="form-control border-0 bg-transparent text-white px-3 shadow-none"
                  placeholder="Your Email Address"
                />
                <button
                  className="btn rounded-pill px-4 fw-bold"
                  style={{ background: color, color: "#fff" }}
                >
                  Join
                </button>
              </div>
            </div>
          </div>

          <hr className="my-5 border-secondary opacity-10" />

          {/* CREDITS */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 pb-3">
            <p className="mb-0 small text-secondary opacity-50">
              © {new Date().getFullYear()} **Explore Maharashtra**. All rights reserved.
            </p>
            <div className="d-flex align-items-center gap-2">
              <span className="small text-secondary opacity-50">Proudly Made in India</span>
              <div
                className="px-3 py-1 rounded-pill bg-white bg-opacity-5 border border-white border-opacity-10 small fw-bold"
                style={{ color }}
              >
                Maharashtra Tourism Partner 🚩
              </div>
            </div>
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
          margin-bottom: 2rem;
        }

        /* SOCIAL ICONS */
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
          box-shadow: 0 0 20px var(--accent), 0 10px 20px rgba(0,0,0,0.4);
          border-color: var(--accent);
        }

        /* NAVIGATION LINKS */
        .nav-list li { margin-bottom: 15px; }
        .footer-link {
          position: relative;
          display: inline-block;
          padding-left: 15px;
          color: rgba(255,255,255,0.6);
          text-decoration: none;
          transition: all 0.3s ease;
          font-size: 0.95rem;
        }
        .footer-link::before {
          content: "";
          position: absolute;
          left: 0; top: 50%;
          width: 5px; height: 5px;
          background: var(--accent);
          border-radius: 50%;
          transform: translateY(-50%) scale(0);
          transition: all 0.3s ease;
        }
        .footer-link:hover {
          color: #fff;
          transform: translateX(8px);
        }
        .footer-link:hover::before {
          transform: translateY(-50%) scale(1);
        }

        /* NEWSLETTER */
        .subscribe-pill { backdrop-filter: blur(10px); }
        .subscribe-pill input::placeholder {
          color: rgba(255,255,255,0.3);
          font-size: 0.85rem;
        }
      `}</style>
    </footer>
  );
};

export default Footer;