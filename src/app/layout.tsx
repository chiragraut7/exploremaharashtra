import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "aos/dist/aos.css";
import "leaflet/dist/leaflet.css";
import "./globals.css";

import { ReactNode } from "react";
import { Quicksand } from "next/font/google";

import Header from "./components/Header";
import Footer from "./components/Footer";
import { LanguageProvider } from "./components/context/LanguageContext";
import BootstrapClient from "./BootstrapClient";
import SmoothScroll from "./components/SmoothScroll";

/* ----------------------------
   Google Font (Webpack Safe)
----------------------------- */
const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
});

/* ----------------------------
   Metadata
----------------------------- */
export const metadata = {
  title: "Explore Maharashtra",
  description:
    "Discover Beaches, Hill Stations, Forts, Nature, and Culture of Maharashtra.",
  icons: {
    icon: "/favicon.ico",
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

/* ----------------------------
   Root Layout
----------------------------- */
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={quicksand.className}>

            <SmoothScroll>
        {/* Bootstrap JS (client only) */}
        <BootstrapClient />

        <LanguageProvider>
          <Header />
          <main role="main">{children}</main>
          <Footer />
        </LanguageProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
