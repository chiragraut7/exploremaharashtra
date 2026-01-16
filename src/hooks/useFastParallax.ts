// hooks/useFastParallax.ts
import { useEffect } from "react";

type Opts = {
  multiplier?: number;
  rootMargin?: string;
  disableBelow?: number;
  imageSelector?: string;
  sectionItemSelector?: string;
};

export default function useFastParallax({
  multiplier = 1.6,
  rootMargin = "0px 0px -10% 0px",
  disableBelow = 768,
  imageSelector = ".scrollsmooth, .scrollsmooth-parallax",
  sectionItemSelector = ".section-item",
}: Opts = {}) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const enableParallax = !(disableBelow && window.innerWidth < disableBelow);

    // image elements (only parallax when enabled)
    const imageItems = enableParallax
      ? Array.from(document.querySelectorAll<HTMLElement>(imageSelector))
      : [];

    // section-level items (text blocks, headings, also images when you add section-item)
    const sectionItems = Array.from(document.querySelectorAll<HTMLElement>(sectionItemSelector));

    // init vars for image items
    imageItems.forEach((el) => {
      el.style.setProperty("--parallax-translate", "0px");
      el.style.setProperty("--parallax-scale", "0.995");
      // section-translate default exists too in case the element is also section-item
      el.style.setProperty("--section-translate", "18px");
    });

    // init vars for section items (text)
    sectionItems.forEach((el) => {
      // only set if not already set by image init
      if (!el.style.getPropertyValue("--parallax-translate")) el.style.setProperty("--parallax-translate", "0px");
      if (!el.style.getPropertyValue("--parallax-scale")) el.style.setProperty("--parallax-scale", "0.995");
      el.style.setProperty("--section-translate", "18px");
    });

    // IntersectionObserver -> reveals both sets
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            el.classList.add("in-view");
            obs.unobserve(el); // one-time
          }
        });
      },
      { threshold: 0.12, rootMargin }
    );

    // Observe all revealable elements
    imageItems.forEach((it) => io.observe(it));
    sectionItems.forEach((it) => io.observe(it));

    // RAF loop for image parallax only (updates --parallax-translate)
    let rafId = 0;
    const loop = () => {
      const vh = window.innerHeight || 1;
      imageItems.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const elementCenter = rect.top + rect.height / 2;
        const viewportCenter = vh / 2;
        const prog = (elementCenter - viewportCenter) / (vh / 2); // -1..1
        const base = -prog * 22; // ±22px
        const translateY = base * multiplier;
        el.style.setProperty("--parallax-translate", `${translateY}px`);
      });

      rafId = requestAnimationFrame(loop);
    };

    if (imageItems.length) rafId = requestAnimationFrame(loop);

    return () => {
      io.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [multiplier, rootMargin, disableBelow, imageSelector, sectionItemSelector]);
}
