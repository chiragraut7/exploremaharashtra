"use client";
import { ReactLenis } from 'lenis/react'; // Updated import
import 'lenis/dist/lenis.css'; // Optional: basic CSS for Lenis

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={{ 
      lerp: 0.1, 
      duration: 1.5, 
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    }}>
      {children}
    </ReactLenis>
  );
}
