// app/LenisProvider.tsx
"use client";
import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Build options object (cast to any to avoid TypeScript errors across Lenis versions)
    const lenisOptions: any = {
      duration: 1.05, // higher -> slower, lower -> snappier
      easing: (t: number) => 1 - Math.pow(1 - t, 3), // easeOutCubic
      // wheelMultiplier controls wheel/trackpad sensitivity
      wheelMultiplier: 1.2,
      // touchMultiplier controls touch flick strength (mobile)
      touchMultiplier: 1.0,
      // normalizeWheel makes different mice behave similarly
      normalizeWheel: true,
      // orientation settings (commonly supported)
      gestureOrientation: "vertical",
      orientation: "vertical",
    };

    // Use "as any" to prevent TS from complaining about unknown props
    // This lets the same code work across Lenis versions/forks
    const lenis: any = new Lenis(lenisOptions as any);

    // RAF loop
    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    // Respect prefers-reduced-motion
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleReduce = () => {
      if (mq.matches) {
        if (typeof lenis.stop === "function") lenis.stop();
      } else {
        if (typeof lenis.start === "function") lenis.start();
      }
    };
    mq.addEventListener?.("change", handleReduce);
    handleReduce();

    return () => {
      mq.removeEventListener?.("change", handleReduce);
      if (typeof lenis.destroy === "function") lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
