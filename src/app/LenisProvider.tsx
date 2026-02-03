"use client";
import { useEffect } from "react";
import Lenis from "lenis";
// Import basic Lenis CSS to prevent layout shifts
import 'lenis/dist/lenis.css';

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // 1. Configuration
    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => 1 - Math.pow(1 - t, 3), // easeOutCubic
      wheelMultiplier: 1.2,
      touchMultiplier: 1.0,
      infinite: false,
      // 🚀 NEW: handle requestAnimationFrame automatically
      autoRaf: true, 
    });

    // 2. Accessibility: Respect prefers-reduced-motion
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    
    const handleMotionPreference = () => {
      if (mq.matches) {
        lenis.destroy(); // Completely disable for users who need reduced motion
      }
    };

    mq.addEventListener("change", handleMotionPreference);
    handleMotionPreference();

    // 3. Cleanup
    return () => {
      mq.removeEventListener("change", handleMotionPreference);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}