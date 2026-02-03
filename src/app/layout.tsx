import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "aos/dist/aos.css";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import { Analytics } from '@vercel/analytics/react';

import { ReactNode } from "react";
import { Quicksand } from "next/font/google";
import Script from "next/script";

import Header from "./components/Header";
import Footer from "./components/Footer";
import { LanguageProvider } from "./components/context/LanguageContext";
import BootstrapClient from "./BootstrapClient";
import SmoothScroll from "./components/SmoothScroll";

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://goexploremaharashtra.in"),
  title: {
    default: "GoExploreMaharashtra | Premium Heritage & Travel Guide",
    template: "%s | GoExploreMaharashtra"
  },
  description: "Discover the hidden gems of Maharashtra: Pristine Beaches, Majestic Forts, and Misty Hill Stations.",
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "nWdKg1FTf44kQHUOT4ikINwbPxuW5EdyCCDDHJK35qw",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  // Pulling IDs from .env.local for high security and easy maintenance
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;

  return (
    <html lang="en">
      <head>
        {/* --- 1. Google Tag Manager (GTM) --- */}
        {gtmId && (
          <Script
            id="gtm-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${gtmId}');
              `,
            }}
          />
        )}

        {/* --- 2. Google Analytics (GA4) --- */}
        {gaId && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            />
            <Script
              id="ga4-config"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}

        {/* --- 3. Google AdSense --- */}
        {adsenseId && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive" 
          />
        )}

        {/* --- 4. Disable F12 & Inspect Element (Right-Click) --- */}
        <Script id="disable-inspect" strategy="afterInteractive">
          {`
            document.addEventListener('contextmenu', (e) => e.preventDefault());
            document.onkeydown = (e) => {
              // Disable F12
              if (e.keyCode === 123) return false;

              // Disable Ctrl+Shift+I (Inspect), Ctrl+Shift+J (Console), Ctrl+Shift+C (Elements)
              if (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) return false;

              // Disable Ctrl+U (View Source)
              if (e.ctrlKey && e.keyCode === 85) return false;
            };
          `}
        </Script>
      </head>
      <body className={quicksand.className}>
        {/* --- GTM Noscript Fallback --- */}
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}

        <SmoothScroll>
          <BootstrapClient />
          <LanguageProvider>
            <Header />
            <main role="main">{children}</main>
            <Footer />
          </LanguageProvider>
        </SmoothScroll>
        <Analytics />
      </body>
    </html>
  );
}